<template>
  <div class="code-editor-container" ref="codeEditor">
    <textarea autofocus spellcheck="false" autocapitalize="off" autocomplete="off" autocorrect="off" ref="codeInput" @scroll="scroll" @input="highlight"></textarea>
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
export default class CodeEditor extends Vue {
  private highlight(): void {
    const code: HTMLTextAreaElement = this.$refs.codeInput as HTMLTextAreaElement;
    const syntaxHighlighter: HTMLPreElement = this.$refs.syntaxHighlighter as HTMLPreElement;
    if (!code || !syntaxHighlighter) throw new Error("Code or syntax highlighter element not found!");

    syntaxHighlighter.innerHTML = hljs.highlightAuto(code.value).value;
  }

  private scroll(event: HTMLScrollEvent) {
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

  display: block;
  resize: none;
  background: none;
  border: none;
  padding: 0;
  outline: none;
  position: absolute;
  white-space: pre; // Preserve whitespace
  font-size: var(--font-size);
  font-family: "Fira Code", monospace;
  width: 100%;
  height: 100%;
}

// Text area just serves a purpose to allow the user to type
textarea {
  color: transparent;
  caret-color: white;
  z-index: 1;
  overflow: auto;
}

pre {
  margin: 0;
  margin-bottom: 15px;
}
</style>