<template>
  <div id="desktop-windows" ref="windows">
    <slot></slot>
  </div>
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

  public newWindow(window: Window): void {
    window.$mount();

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

