import Actions from "@/store/interfaces/Actions";
import Payload from "@/store/interfaces/Payload";

export default {
  changeSetting({ commit, state }: Actions, { key, value }: Payload) {
    if (!state[key]) {
      return Promise.reject(
        new TypeError(`${key} was provided while changing settings, but it is not a valid state property!`)
      );
    }

    commit("setSetting", { key, value });

    return Promise.resolve();
  },

  changeStyle({ commit, state }: Actions, { key, value }: Payload) {
    if (!state.styles[key]) {
      return Promise.reject(
        new TypeError(`${key} was provided while changing styles, but it is not a style property!`)
      );
    } else if (typeof value === "string") {
      return Promise.reject(
        new TypeError(`Value ${value} provided for ${key} while changing styles was not safe or is not a integer!`)
      );
    }

    commit("setStyle", { key, value });

    return Promise.resolve();
  }
};