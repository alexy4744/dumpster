<!-- CodeFlask but ported into a component with extra stuff -->
<!-- https://kazzkiq.github.io/CodeFlask/ -->

<template>
  <div class="codeflask" ref="codeflask">
    <div class="codeflask-line-numbers" ref="lineNumbers"></div>

    <!-- When the user stops typing, emit an autosave event with the current input -->
    <textarea
      autofocus
      spellcheck="false"
      autocapitalize="off"
      autocomplete="off"
      autocorrect="off"
      ref="textArea"
      @scroll="scroll"
      @input="typed"
      @paste="paste"
      @keyup="$emit('autosave', $event.target.value)"
      @keydown.enter="addLineNumber($event.target.value.split('\n').length + 1)"
      @keydown.delete="deleteLineNumber"
      @keydown.tab="insertTab"
    ></textarea>

    <pre ref="syntaxHighlighter"></pre>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

interface HTMLScrollEvent { target: HTMLElement & EventTarget; }
interface SelfClosingCharacters { [key: string]: string; }

@Component
export default class CodeFlask extends Vue {
  private readonly TAB_SIZE: number = 2;
  private readonly SELF_CLOSING_CHARACTERS: SelfClosingCharacters = {
    "[": "]",
    "{": "}",
    "(": ")",
    "<": ">",
    "'": "'",
    "\"": "\""
  };

  private get syntaxHighlighter(): HTMLPreElement {
    return this.$refs.syntaxHighlighter as HTMLPreElement;
  }

  private get textArea(): HTMLTextAreaElement {
    return this.$refs.textArea as HTMLTextAreaElement;
  }

  private get lineNumbers(): HTMLDivElement {
    return this.$refs.lineNumbers as HTMLDivElement;
  }

  /* Read the settings from the local storage and assign it to the editor. */
  public beforeCreate(): void {
    const theme: string | null = localStorage.getItem("editor-theme");
    const language: string | null = localStorage.getItem("editor-language");
    const lineNumbers: boolean = localStorage.getItem("editor-lineNumbers") === "true" ? true : false;

    if (theme) this.$store.dispatch("editor/changeTheme", theme);
    if (language) this.$store.dispatch("editor/changeLanguage", language);

    // By default, the state of line numbers is already true, so only reassign if it is false in local storage
    if (!lineNumbers) this.$store.dispatch("editor/toggleLineNumbers", lineNumbers);
  }

  public mounted(): void {
    /* If the language has been change, then re-highlight the code */
    this.$store.watch(state => state.editor.language, (): void => this.highlight());
    /* TODO
      this.$store.watch((state) => state.editor.lineNumbers, (newValue, oldValue) => this.toggleLineNumbers(newValue, oldValue));
     */

    this.addLineNumber(1);
  }

  private typed(input: any): void {
    this.addSelfCloseCharacter(input.data);
    this.highlight();
  }

  private paste(event: ClipboardEvent): void {
    if (!this.$store.state.editor.lineNumbers) return;

    setTimeout(
      (): void => {
        const currentLines: number = this.lineNumbers.children.length; // Get the current number of lines
        const totalLines: number = this.textArea.value.split("\n").length;

        for (let i: number = currentLines + 1; i < totalLines + 1; i++) this.addLineNumber(i);
      }
    );
  }

  private highlight(): void {
    const { language } = this.$store.state.editor;

    if (!language) this.syntaxHighlighter.innerHTML = hljs.highlightAuto(this.textArea.value).value;
    else this.syntaxHighlighter.innerHTML = hljs.highlight(language, this.textArea.value).value;
  }

  private insertText(text: string): void {
    const start = this.textArea.selectionStart;
    const end = this.textArea.selectionEnd;

    this.textArea.value = this.textArea.value.slice(0, start) + text + this.textArea.value.slice(end);
    this.textArea.selectionEnd = start + text.length;
  }

  private insertTab(event: KeyboardEvent): void {
    event.preventDefault();

    this.insertText(" ".repeat(this.TAB_SIZE));
    this.highlight();
  }

  private scroll(event: HTMLScrollEvent): void {
    this.syntaxHighlighter.style.transform = `translate(-${event.target.scrollLeft}px, -${event.target.scrollTop}px)`;
    this.lineNumbers.style.transform = this.syntaxHighlighter.style.transform;
  }

  private addSelfCloseCharacter(character: string): void {
    if (!this.SELF_CLOSING_CHARACTERS[character]) return;

    this.insertText(this.SELF_CLOSING_CHARACTERS[character]);
    this.highlight();
  }

  private addLineNumber(num: number): void {
    const line: HTMLSpanElement = document.createElement("span");

    line.className = "line-number";
    line.innerText = String(num);

    this.lineNumbers.appendChild(line);
  }

  private deleteLineNumber(): void {
    setTimeout(
      (): void => {
        const linesLeft: number = this.textArea.value.split("\n").length; // Get the number of lines it should have by splitting every new line and counting it

        // Keep deleting the last child (the last line number) until it meets the number of lines it should have after deletion
        while (this.lineNumbers.children.length > linesLeft) {
          this.lineNumbers.removeChild(this.lineNumbers.lastChild as Node);
        }
      }
    );
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/colors.scss";
@import "@/assets/css/window.scss";
@import "@/assets/css/codeflask.scss";

@font-face {
  font-family: "Fira Code";
  src: url("../../../../assets/fonts/FiraCode-Regular.otf");
}

.codeflask {
  --font-size: 16px;
  --line-spacing: 5px; // How much space between each line
  --line-numbers-width: 40px; // How wide the container for the line numbers should be

  position: relative;
  height: calc(100% - #{$windowExcludedHeight} - #{$statusBarHeight});
  background: inherit;
  color: white;
  margin: 0 25px;
  outline: none !important;
  resize: none;
  overflow: hidden;
  margin-bottom: $statusBarHeight;
}

.codeflask-line-numbers {
  display: flex;
  flex-direction: column;
  width: var(--line-numbers-width);
  height: 100%;
  position: absolute;
  font-size: var(--font-size);
  text-align: left;
  color: lighten($background, 50%);
}

.codeflask-line-numbers,
textarea,
pre {
  line-height: calc(var(--font-size) + var(--line-spacing));
}

textarea,
pre {
  width: calc(100% - var(--line-numbers-width));
  height: 100%;
  background: none;
  display: block;
  position: absolute;
  font-size: var(--font-size);
  font-family: "Fira Code", monospace;
  white-space: pre; // Preserve whitespace
  margin: 0 0 0 var(--line-numbers-width);
  padding: 0;
  resize: none;
  border: none;
  outline: none;
}

// Text area just serves a purpose to allow the user to type
textarea {
  color: transparent;
  caret-color: white;
  z-index: 1;
  overflow: auto;
}
</style>