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
  height: 30px;
  background-color: $background;
  width: 100%;
  padding: 5px 10px;
}
</style>

