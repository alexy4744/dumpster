import Vue from "vue";
import Vuex from "vuex";

import windows from "./modules/windows/index";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    windows
  },
  strict: process.env.NODE_ENV !== "production"
});