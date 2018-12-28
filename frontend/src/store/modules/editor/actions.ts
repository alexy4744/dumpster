import Actions from "../../interfaces/Actions";
import hljs from "highlight.js";

const themes: string[] = [
  "default",
  "atom-one-dark",
  "atom-one-light"
];

/* First param is "context", but destructued, so context.commit, context.state => commit, state */
export default {
  changeTheme({ commit }: Actions, theme: string): void {
    if (!themes.includes(theme)) {
      console.error(`Unknown theme provided (${theme}). Must be one of ${themes.join(", ")}`);
      return;
    }

    commit("setTheme", theme);
  },

  changeLanguage({ commit }: Actions, language: string): void {
    if (!hljs.listLanguages().includes(language)) {
      console.error(`Unknown langauge provided (${language}). Must be one of ${hljs.listLanguages().join(", ")}`);
      return;
    }

    commit("setLanguage", language);
  },

  toggleLineNumbers({ commit }: Actions, shouldEnable: boolean): void {
    if (shouldEnable) commit("enableLineNumbers");
    else commit("disableLineNumbers");
  }
};