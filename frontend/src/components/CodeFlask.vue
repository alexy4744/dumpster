<template>
  <div class="codeflask">
    <pre ref="prism" class="codeflask__prism"/>

    <textarea
      ref="input"
      class="codeflask__text-input"
      spellcheck="false"
      autocapitalize="off"
      autocomplete="off"
      autocorrect="off"
      @click="hideWelcome"
      @input="highlight"
      @scroll="scroll"
      @keydown.enter="addLineNumber"
      @keydown.delete="deleteLineNumber"
      @keydown.tab="insertTab"
      @keydown.ctrl.83="emitSave"
      @keydown.ctrl.90="recalculateLineNumbers"
      @paste="recalculateLineNumbers"
    />

    <ul ref="lineNumbers" class="codeflask__line-numbers"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapState } from "vuex";
import { FRIENDLY_LANGUAGES } from "@/assets/languages";
import prism from "prismjs";

interface ScrollEvent extends MouseEvent {
  target: HTMLUListElement | HTMLPreElement;
}

@Component({
  computed: {
    ...mapState("editor", ["LANGUAGE", "LINE_NUMBERS", "TAB_SIZE", "styles"])
  }
})
export default class CodeFlask extends Vue {
  public $refs!: {
    [key: string]: any;

    prism: HTMLPreElement;
    input: HTMLTextAreaElement;
    lineNumbers: HTMLUListElement;
  };

  public welcomeIsDisplayed: boolean = true;

  private readonly LANGUAGE!: string;
  private readonly LINE_NUMBERS!: boolean;
  private readonly TAB_SIZE!: number;
  private readonly styles!: { [key: string]: any };

  public async mounted(): Promise<void> {
    await this.displayWelcome();

    this.applyStyles();
    this.recalculateLineNumbers();
    this.highlight();
  }

  public highlight(): void {
    const languageDefinition = prism.languages[this.LANGUAGE];
    this.$refs.prism.innerHTML = prism.highlight(
      this.$refs.input.value,
      languageDefinition,
      languageDefinition
    );
  }

  public insertText(text: string): void {
    const start: number = this.$refs.input.selectionStart;
    const end: number = this.$refs.input.selectionEnd;

    this.$refs.input.value =
      this.$refs.input.value.slice(0, start) +
      text +
      this.$refs.input.value.slice(end);
    this.$refs.input.selectionEnd = start + text.length;
  }

  private scroll(event: ScrollEvent): void {
    this.$refs.lineNumbers.style.transform = `translateY(-${
      event.target.scrollTop
    }px)`;
    this.$refs.prism.style.transform = `translate(-${
      event.target.scrollLeft
    }px, -${event.target.scrollTop}px)`;
  }

  private addLineNumber(): void {
    const li: HTMLLIElement = document.createElement("li");

    li.style.backgroundColor = "inherit";
    li.innerText = String(this.$refs.lineNumbers.childElementCount + 1);

    this.$refs.lineNumbers.appendChild(li);
  }

  private deleteLineNumber(): void {
    setTimeout(
      (): void => {
        // Get the number of lines it should have by splitting every new line and counting it
        const linesLeft: number = this.$refs.input.value.split("\n").length;

        /* Keep deleting the last child (the last line number) until it meets the number
          of lines it should have after deletion */
        while (this.$refs.lineNumbers.children.length > linesLeft) {
          const lastChild: Node | null = this.$refs.lineNumbers.lastChild;
          if (lastChild) this.$refs.lineNumbers.removeChild(lastChild);
        }
      }
    );
  }

  private recalculateLineNumbers(): void {
    setTimeout(
      (): void => {
        const currentLines: number = this.$refs.lineNumbers.childElementCount; // Get the current number of lines
        const totalLines: number = this.$refs.input.value.split("\n").length;

        for (let i: number = currentLines + 1; i < totalLines + 1; i++)
          this.addLineNumber();
      }
    );
  }

  private insertTab(event: KeyboardEvent): void {
    event.preventDefault();

    this.insertText(" ".repeat(this.TAB_SIZE));
    this.highlight();
  }

  private emitSave(event: KeyboardEvent): void {
    event.preventDefault();

    this.$emit("save", event);
  }

  private applyStyles(): void {
    for (const reference in this.styles) {
      if (this.styles.hasOwnProperty(reference)) {
        for (const styleName in this.styles[reference]) {
          if (reference === "all") {
            for (const ref in this.$refs) {
              if (this.$refs.hasOwnProperty(ref)) {
                this.$refs[ref].style[styleName] = this.styles[reference][
                  styleName
                ];
              }
            }
          } else if (this.$refs[reference]) {
            this.$refs[reference].style[styleName] = this.styles[reference][
              styleName
            ];
          }
        }
      }
    }
  }

  public async displayWelcome(): Promise<void> {
    let message: string = "";

    try {
      const desiredWelcome: any = await import(`@/assets/welcome/${
        this.LANGUAGE
      }`);
      message += desiredWelcome.default.trim();
    } catch (error) {
      // If example doesn't exist for that language, construct a markdown as placeholder
      try {
        message += await this.createWelcomeFallback();
        this.$store.dispatch("editor/changeSetting", {
          key: "LANGUAGE",
          value: "markdown"
        });
      } catch (err) {
        console.error(err);
      }
    }

    message.trim();
    message += "\n\n";
    message += `\`The current language is set to ${
      FRIENDLY_LANGUAGES[this.LANGUAGE]
    }!\``;

    this.$refs.input.value = message;
  }

  public hideWelcome(): void {
    if (!this.welcomeIsDisplayed) return;

    this.$refs.input.value = "";

    while (this.$refs.prism.firstChild) {
      this.$refs.prism.removeChild(this.$refs.prism.firstChild);
      this.deleteLineNumber();
    }

    this.welcomeIsDisplayed = false;
  }

  private async createWelcomeFallback(): Promise<string> {
    try {
      const fileName: string = "BASE"; // Workaround for IDE error not able to find module...
      const BASE: {
        introduction: string;
        paste: string;
        upload: string;
      } = await import(`@/assets/welcome/${fileName}`);

      const introduction: string = `# INTRODUCTION\n\n${BASE.introduction}`;
      const paste: string = `# HOW TO UPLOAD PASTES\n\n${BASE.paste}`;
      const upload: string = `# HOW TO UPLOAD FILES\n\n${BASE.upload}`;

      return Promise.resolve([introduction, paste, upload].join("\n\n"));
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

$margin-size: 25px; // How much space around the whole component

.codeflask {
  width: calc(100vw - #{$margin-size * 2});
  height: calc(100vh - #{$margin-size * 3});
  position: relative; // Anchor element for absolute positioning
  font-family: "Fira Code", monospace;
  margin: 0 $margin-size;
  overflow: hidden;
}

.codeflask__line-numbers,
.codeflask__prism,
.codeflask__text-input {
  margin: 0;
  height: inherit;
  font-size: inherit;
  font-family: inherit;
}

.codeflask__prism,
.codeflask__text-input {
  width: calc(100vw - 40px - #{$margin-size * 2});
  position: absolute;
}

.codeflask__line-numbers {
  position: absolute;
  background-color: color("background");
  color: lighten(color("background"), 50%);
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.codeflask__text-input {
  background: none;
  color: transparent;
  caret-color: white;
  padding: 0;
  white-space: pre; // Preserve whitespace
  overflow: auto;
  outline: none;
  border: none;
  resize: none;
}

.codeflask__prism {
  color: lighten(color("background"), 75%);
}
</style>