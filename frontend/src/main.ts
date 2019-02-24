import Vue, { CreateElement, VNode } from "vue";

import App from "@/App.vue";
import router from "@/router";

import Configuration from "@/../../config.json";

import "@/registerServiceWorker";
import "normalize.css";

Vue.config.productionTip = false;

Vue.mixin({
  data: () => Configuration
});

new Vue({
  router,
  render: (h: CreateElement): VNode => h(App),
}).$mount("#app");
