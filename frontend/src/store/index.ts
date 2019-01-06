import Vue from "vue";
import Vuex from "vuex";

import desktop from "./modules/desktop";
import editor from "./modules/editor";
import windows from "./modules/windows";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    desktop,
    editor,
    windows
  },
  strict: process.env.NODE_ENV !== "production"
});