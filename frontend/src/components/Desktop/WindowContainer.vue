<template>
  <div id="desktop-windows" ref="windows">
    <slot name="windows"></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Window from "./Window.vue";

@Component
export default class WindowContainer extends Vue {
  private windows: HTMLDivElement | null = null;

  public mounted() {
    const windows = this.$refs.windows;
    if (!windows) return;

    this.windows = windows as HTMLDivElement;
    this.newWindow();
  }

  public newWindow() {
    if (!this.windows) return;

    const window = new Window().$mount();
    this.windows.appendChild(window.$el);
  }

  public closeAllWindows() {}
}
</script>

<style lang="scss" scoped>

</style>

