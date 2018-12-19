<template>
  <div class="window-toolbar-category">
    <span class="window-toolbar-category-title" @click="this.$parent.toggleList">{{ title }}</span>

    <div class="window-toolbar-category-list">
      <template v-for="action of actions">
        <span :key="action" class="window-toolbar-category-list-action">{{ action }}</span>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Category extends Vue {
  @Prop(String) public title!: string;
  @Prop(Array) public actions!: string[];
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/colors.scss";

.window-toolbar-category-title {
  color: lighten($background, 55%);
  padding: 10px;
  cursor: default;
  user-select: none;
  position: relative;
}

.window-toolbar-category-title:hover,
.window-toolbar-category-title-active {
  background-color: darken($background, 3%);
}

.window-toolbar-category-list {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  margin: 8px 0;
  max-height: 0;
  z-index: 9999;

  > * {
    padding: 10px;
    user-select: none;
    color: lighten($background, 35%);
  }

  > *:hover {
    background-color: $background;
  }
}

.window-toolbar.category-list:hover {
  .window-toolbar-category-title {
    background-color: white;
  }
}

.window-toolbar-category-list-action {
  background-color: $background;
  cursor: pointer;
}

.window-toolbar-category-list-action:hover {
  background-color: darken($background, 2%);
}
</style>

