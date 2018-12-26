<template>
  <div class="window-toolbar-category-list-action">
    <span class="window-toolbar-category-list-action-name">{{ name }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Action extends Vue {
  @Prop(String) public name!: string;
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/colors.scss";

.window-toolbar-category-list-action {
  background-color: $background;
  cursor: pointer;

  &:hover {
    background-color: darken($background, 2%);
  }
}
</style>

