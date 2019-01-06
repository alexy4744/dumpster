<template>
  <div id="desktop-windows" ref="windows">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Bus from "@/bus";

import Window from "./Window.vue";

@Component
export default class WindowContainer extends Vue {
  public mounted() {
    Bus.$on("newWindow", (app: any, appName: string) => {
      try {
        app = new app({
          /* Must past parent when manually mounting to retrive parent and store
            https://forum.vuejs.org/t/this-store-undefined-in-manually-mounted-vue-component/8756 */
          parent: this
        }).$mount();

        (this.$refs.windows as HTMLDivElement).appendChild(app.$el);

        this.$store.dispatch("windows/addWindow", app);
      } catch (error) {
        this.$store.dispatch("desktop/throwException", error);
      }
    });
  }
}
</script>

