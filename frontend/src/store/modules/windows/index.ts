import actions from "./actions"; // Commits changes, which then runs mutations on the state.
import mutations from "./mutations"; // Actually changes the value within the state.

/* Interfaces */
import State from "../../interfaces/State";

const state: State = {
  windows: new Map(),
  totalWindows: 1
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};