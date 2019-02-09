import State from "@/store/interfaces/State";
import Payload from "@/store/interfaces/Payload";

export default {
  setSetting(state: State, { key, value }: Payload) {
    state[key] = value;
  },

  setStyle(state: State, { key, value }: Payload) {
    if (typeof value === "string") return;
    state.styles[key] = value;
  }
};