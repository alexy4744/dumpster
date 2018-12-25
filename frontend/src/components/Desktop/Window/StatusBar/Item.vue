<template>
  <div class="window-status-bar-item">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Item extends Vue {
  @Prop(String) public name!: string;
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/colors.scss";

.window-status-bar-item {}
</style>

