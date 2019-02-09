import Vue, { CreateElement, VNode } from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store/index";

import "@/registerServiceWorker";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h: CreateElement): VNode => h(App),
}).$mount("#app");
