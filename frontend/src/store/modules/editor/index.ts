import actions from "./actions"; // Commits changes, which then runs mutations on the state.
import mutations from "./mutations"; // Actually changes the value within the state.

/* Interfaces */
import EditorState from "../../interfaces/EditorState";

const state: EditorState = {
  theme: null,
  language: null,
  lineNumbers: true
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};