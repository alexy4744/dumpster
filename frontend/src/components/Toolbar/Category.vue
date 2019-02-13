<template>
  <div class="toolbar__category">
    <span
      :ref="title.toLowerCase()"
      class="category__title"
      @click="this.$parent.toggleList"
    >
      {{ title }}
    </span>

    <div ref="list" class="category__list">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Category extends Vue {
  @Prop({
    type: String,
    default: ""
  })
  private readonly title!: string;
}
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

.category__title {
  color: lighten(color("background"), 55%);
  position: relative;
  padding: 10px;
  user-select: none;
  cursor: default;
}

.category__title:hover,
.category__title-active {
  background-color: lighten(color("background"), 2%);
}

.category__list {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: absolute;
  margin: 8px 0;
  max-height: 0;
  z-index: 9999;

  > div {
    display: block;
    background-color: lighten(color("background"), 2%);
    color: lighten(color("background"), 40%);
    padding: 10px;
    user-select: none;

    &:hover {
      background-color: darken(color("background"), 2%);
    }
  }
}
</style>

