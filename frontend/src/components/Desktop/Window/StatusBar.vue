<template>
  <div class="window-status-bar">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class StatusBar extends Vue {

}
</script>

<style lang="scss" scoped>
@import "@/assets/css/colors.scss";
@import "@/assets/css/window.scss";

.window-status-bar {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  height: $statusBarHeight;
  background-color: $background;
  padding: 0 10px;
}
</style>

