<!-- CodeFlask but ported into a component with extra stuff -->
<!-- https://kazzkiq.github.io/CodeFlask/ -->

<template>
  <div class="codeflask" ref="codeflask">
    <div class="codeflask-line-numbers" ref="lineNumbers"></div>

    <!-- When the user stops typing, emit an autosave event with the current input -->
    <textarea autofocus 
      spellcheck="false"
      autocapitalize="off"
      autocomplete="off"
      autocorrect="off"
      ref="input"
      @scroll="scroll"
      @input="highlight"
      @paste="paste"
      @keyup="$emit('autosave', $event.target.value)"
      @keydown.enter="addLineNumber($event.target.value.split('\n').length + 1)"
      @keydown.delete="deleteLineNumber">
    </textarea>

    <pre ref="syntaxHighlighter"></pre>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

interface HTMLScrollEvent {
  target: HTMLElement & EventTarget;
}

@Component
export default class CodeFlask extends Vue {
  private get syntaxHighlighter(): HTMLPreElement {
    return this.$refs.syntaxHighlighter as HTMLPreElement;
  }

  private get input(): HTMLTextAreaElement {
    return this.$refs.input as HTMLTextAreaElement;
  }

  /* Read the settings from the local storage and assign it to the editor. */
  public beforeCreate() {
    const theme: string | null = localStorage.getItem("editor-theme");
    const language: string | null = localStorage.getItem("editor-language");
    const lineNumbers: boolean = localStorage.getItem("editor-lineNumbers") === "true" ? true : false;

    if (theme) this.$store.dispatch("editor/changeTheme", theme);
    if (language) this.$store.dispatch("editor/changeLanguage", language);

    // By default, the state of line numbers is already true, so only reassign if it is false in local storage
    if (!lineNumbers) this.$store.dispatch("editor/toggleLineNumbers", lineNumbers);
  }

  public mounted() {
    /* If the language has been change, then re-highlight the code */
    this.$store.watch((state) => state.editor.language, (): void => this.highlight());
    /* TODO
      this.$store.watch((state) => state.editor.lineNumbers, (newValue, oldValue) => this.toggleLineNumbers(newValue, oldValue));
     */

    this.addLineNumber(1);
  }

  private paste(event: ClipboardEvent): void {
    if (!this.$store.state.editor.lineNumbers) return;

    setTimeout((): void => {
      const currentLine: number = (this.$refs.lineNumbers as HTMLDivElement).children.length; // Get the current number of lines
      const totalLines: number = this.input.value.split("\n").length;

      for (let i: number = currentLine + 1; i < totalLines + 1; i++) this.addLineNumber(i);
    });
  }

  private highlight(): void {
    const { language } = this.$store.state.editor;

    if (!language) this.syntaxHighlighter.innerHTML = hljs.highlightAuto(this.input.value).value;
    else this.syntaxHighlighter.innerHTML = hljs.highlight(language, this.input.value).value;
  }

  private scroll(event: HTMLScrollEvent): void {
    this.syntaxHighlighter.style.transform = `translate(-${event.target.scrollLeft}px, -${event.target.scrollTop}px)`;
    (this.$refs.lineNumbers as HTMLDivElement).style.transform = this.syntaxHighlighter.style.transform;
  }

  private addLineNumber(num: number): void {
    const line: HTMLSpanElement = document.createElement("span");
    line.className = "line-number";
    line.innerText = String(num);
    (this.$refs.lineNumbers as HTMLDivElement).appendChild(line);
  }

  private deleteLineNumber(): void {
    setTimeout((): void => {
      const lineNumbers: HTMLDivElement = this.$refs.lineNumbers as HTMLDivElement;
      const linesLeft: number = this.input.value.split("\n").length; // Get the number of lines it should have

      // Keep deleting the last child (the last line number) until it meets the number of lines it should have after deletion
      while (lineNumbers.children.length > linesLeft) {
        lineNumbers.removeChild(lineNumbers.lastChild as Node);
      }
    });
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
  text-align: center;

  /deep/ span { // TODO: Don't use /deep/, deprecated
    background-color: $background;
  }
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