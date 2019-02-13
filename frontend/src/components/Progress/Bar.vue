<template>
  <div
    class="progress__bar"
    :style="{
      width: this.currentProgress,
      backgroundColor: this.$props.background,
      borderRadius: this.$props.borderRadius
    }"
  >
    <slot/>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class ProgressBar extends Vue {
  @Prop({
    type: String,
    default: "0%"
  })
  private readonly progress?: string;

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

  private currentProgress: string = "0%";

  public mounted() {
    this.currentProgress = this.$props.progress;
  }

  public setProgress(percent: number): void {
    this.currentProgress = `${percent}%`;
  }
}
</script>

<style lang="scss" scoped>
.progress__bar {
  height: 100%;
}
</style>

