<template>
  <div class="progress" :style="progressStyle">
    <slot/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  computed: {
    progressStyle() {
      return {
        width: this.$props.width,
        height: this.$props.height,
        backgroundColor: this.$props.background,
        borderRadius: this.$props.borderRadius
      };
    }
  }
})
export default class Progress extends Vue {
  @Prop({
    type: String,
    default: "100%"
  })
  private readonly width!: string;

  @Prop({
    type: String,
    default: "32px"
  })
  private readonly height!: string;

  @Prop({
    type: String,
    default: ""
  })
  private readonly background?: string;

  @Prop({
    type: String,
    default: ""
  })
  private readonly borderRadius?: string;
}
</script>

<style lang="scss" scoped>
</style>

