<template>
  <div id="desktop-dock" ref="dock">
    <div class="desktop-dock-opened-apps"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Dock extends Vue {
  public dockZIndex(zIndex: number): void {
    if (!this.$refs.dock) return;
    (this.$refs.dock as HTMLDivElement).style.zIndex = String(zIndex);
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/colors.scss";
@import "@/assets/css/dock.scss";

#desktop-dock {
  width: 80vw;
  height: $dockHeight;
  position: fixed;
  background-color: lighten($background, 25%);
  padding: 15px;
  opacity: 0.25;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -100%);
  overflow: auto;
  z-index: 10000;
}

.desktop-dock-opened-apps {
  height: 100%;
}
</style>

