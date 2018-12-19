import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./registerServiceWorker";
import "./assets/css/layout.scss";

Vue.config.productionTip = false;

// Check whether it is a valid vue route, if it isn't redirect to the 404 page.
router.beforeEach((to, _, next) => {
  if (!to.name || !to.matched.length) return next("/404");
  return next();
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
