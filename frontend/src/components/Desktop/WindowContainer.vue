<template>
  <div id="desktop-windows" ref="windows"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Window from "./Window.vue";

@Component
export default class WindowContainer extends Vue {
  public desktop = this.$parent;

  get totalWindows(): number {
    return this.$store.state.windows.totalWindows;
  }

  public mounted(): void {
    this.newWindow();
  }

  public newWindow(): void {
    const window: Window = new Window({
      /* Must past parent when manually mounting to retrive parent and store
        https://forum.vuejs.org/t/this-store-undefined-in-manually-mounted-vue-component/8756 */
      parent: this,
      propsData: {
        id: this.totalWindows
      }
    }).$mount();

    this.$store.dispatch("windows/newWindow", window);
    (this.$refs.windows as HTMLDivElement).appendChild(window.$el);
  }

  public closeAll(): void {
    const { windows } = this.$store.state.windows;

    for (const window of windows) {
      window[1].close();
    }

    this.$store.dispatch("windows/closeAll");
  }
}
</script>

<style lang="scss" scoped>

</style>

