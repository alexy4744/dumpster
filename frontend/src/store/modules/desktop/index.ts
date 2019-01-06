import actions from "./actions"; // Commits changes, which then runs mutations on the state.
import mutations from "./mutations"; // Actually changes the value within the state.

/* Interfaces */
import DesktopState from "../../interfaces/DesktopState";

const state: DesktopState = {
  menuBar: null,
  windows: null,
  dock: null
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};