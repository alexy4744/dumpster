// A CodeFlask knockoff customized for the editor

<template>
  <div class="code-editor-container" ref="codeEditor">
    <textarea autofocus spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" ref="codeInput" @keydown="highlight" @keyup="highlight"></textarea>
    <pre ref="syntaxHighlighter"></pre>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";

@Component
export default class CodeEditor extends Vue {
  private highlight(): void {
    const code: HTMLTextAreaElement = this.$refs.codeInput as HTMLTextAreaElement;
    const syntaxHighlighter: HTMLPreElement = this.$refs.syntaxHighlighter as HTMLPreElement;
    if (!code || !syntaxHighlighter) return;

    syntaxHighlighter.innerHTML = hljs.highlightAuto(code.value, ["javascript"]).value;
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
  height: calc(100% - #{$windowExcludedHeight});
  background: inherit;
  color: white;
  padding: 0 25px;
  outline: none !important;
  resize: none;
}

textarea,
pre {
  display: block;
  width: 100%;
  height: 100%;
  resize: none;
  background: none;
  border: none;
  margin: 15px 0;
  padding: 0;
  outline: none;
  position: absolute;
  white-space: pre; // Preserve whitespace
  font-size: 14px;
  font-family: "Fira Code", monospace;
}

// Text area just serves a purpose to allow the user to type
textarea {
  color: transparent;
  z-index: 3;
  caret-color: white;
}

// Pre element acts as a syntax highlighter
pre {
  z-index: 2;
}
</style>