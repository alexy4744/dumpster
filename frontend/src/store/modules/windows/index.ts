import actions from "./actions"; // Commits changes, which then runs mutations on the state.
import mutations from "./mutations"; // Actually changes the value within the state.

/* Interfaces */
import WindowsState from "../../interfaces/WindowsState";

const state: WindowsState = {
  windows: new Map(),
  totalWindows: 0
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};