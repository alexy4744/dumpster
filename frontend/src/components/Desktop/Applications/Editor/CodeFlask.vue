<!-- CodeFlask but ported into a component with extra stuff -->
<!-- https://kazzkiq.github.io/CodeFlask/ -->

<template>
  <div class="code-editor-container" ref="codeEditor">
    <!-- When the user stops typing, emit an autosave event with the current input -->
    <textarea autofocus 
      spellcheck="false"
      autocapitalize="off"
      autocomplete="off"
      autocorrect="off"
      ref="input"
      @scroll="scroll"
      @input="highlight"
      @keyup="$emit('autosave', $event.target.value)">
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
  public beforeCreate() {
    const theme = localStorage.getItem("editor-theme");
    const language = localStorage.getItem("editor-language");
    const lineNumbers = localStorage.getItem("editor-lineNumbers") === "true" ? true : false;

    if (theme) this.$store.dispatch("editor/changeTheme", theme);
    if (language) this.$store.dispatch("editor/changeLanguage", language);

    // By default, the state of line numbers is already true, so only reassign if it is false in local storage
    if (!lineNumbers) this.$store.dispatch("editor/toggleLineNumbers", lineNumbers);
  }

  public mounted() {
    console.log(this.$store.state.editor)
  }

  private highlight(): void {
    const code: HTMLTextAreaElement = this.$refs.input as HTMLTextAreaElement;
    const syntaxHighlighter: HTMLPreElement = this.$refs.syntaxHighlighter as HTMLPreElement;
    if (!code || !syntaxHighlighter) throw new Error("Code or syntax highlighter element not found!");

    syntaxHighlighter.innerHTML = hljs.highlightAuto(code.value).value;
  }

  private scroll(event: HTMLScrollEvent): void {
    (this.$refs.syntaxHighlighter as HTMLPreElement).style.transform = `translate(-${event.target.scrollLeft}px, -${event.target.scrollTop}px)`;
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/colors.scss";
@import "@/assets/css/window.scss";

@font-face {
  font-family: "Fira Code";
  src: url("../../../../assets/fonts/FiraCode-Regular.otf");
}

.code-editor-container {
  position: relative;
  height: calc(100% - #{$windowExcludedHeight} - 30px);
  background: inherit;
  color: white;
  margin: 0 25px;
  outline: none !important;
  resize: none;
  overflow: hidden;
  margin-bottom: 30px;
}

textarea,
pre {
  --font-size: 16px;

  width: 100%;
  height: 100%;
  background: none;
  display: block;
  position: absolute;
  font-size: var(--font-size);
  font-family: "Fira Code", monospace;
  white-space: pre; // Preserve whitespace
  margin: 0;
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