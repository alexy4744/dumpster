import EditorState from "../../interfaces/EditorState";

export default {
  setTheme(state: EditorState, theme: string): void {
    state.theme = theme;
  },

  setLanguage(state: EditorState, language: string): void {
    state.language = language;
  },

  enableLineNumbers(state: EditorState): void {
    state.lineNumbers = true;
  },

  disableLineNumbers(state: EditorState): void {
    state.lineNumbers = false;
  }
};
