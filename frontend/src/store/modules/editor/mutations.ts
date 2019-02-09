import State from "@/store/interfaces/State";
import Payload from "@/store/interfaces/Payload";
import StylePayload from "@/store/interfaces/StylePayload";

export default {
  setSetting(state: State, { key, value }: Payload) {
    state[key] = value;
  },

  setStyle(state: State, { reference, key, value }: StylePayload) {
    if (typeof value === "string") return;
    state.styles[reference][key] = value;
  }
};