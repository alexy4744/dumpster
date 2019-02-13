import Vue, { CreateElement, VNode } from "vue";

import App from "@/App.vue";
import router from "@/router";
import store from "@/store/index";

import Configuration from "@/../../config.json";

import "@/registerServiceWorker";

Vue.config.productionTip = false;

Vue.mixin({
  data: () => Configuration
});

new Vue({
  router,
  store,
  render: (h: CreateElement): VNode => h(App),
}).$mount("#app");
