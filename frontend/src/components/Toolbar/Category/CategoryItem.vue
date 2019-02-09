<template>
  <div class="list_action">
    <span class="action__name">{{ name }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CategoryItem extends Vue {
  @Prop({
    type: String,
    default: ""
  })
  private name!: string;
}
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

.list_action {
  background-color: color("background");
  cursor: pointer;

  &:hover {
    background-color: darken(color("background"), 3%);
  }
}
</style>

