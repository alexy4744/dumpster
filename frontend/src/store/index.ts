import Vue from "vue";
import Vuex from "vuex";

import windows from "./modules/windows";
import editor from "./modules/editor";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    windows,
    editor
  },
  strict: process.env.NODE_ENV !== "production"
});