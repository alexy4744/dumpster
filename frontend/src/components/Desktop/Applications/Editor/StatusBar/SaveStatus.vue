<template>
  <span class="save-status" ref="statusText">Not Saved!</span>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

interface StatusCodes {
  [key: number]: string;
}

@Component
export default class SaveStatus extends Vue {
  public readonly STATUS_CODES: StatusCodes = {
    0: "Not Saved!",
    1: "Saving...",
    2: "Saved."
  };

  public setStatus(status: number): void {
    if (!this.$refs.statusText) return;
    (this.$refs.statusText as HTMLSpanElement).innerText = this.STATUS_CODES[status];
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/colors.scss";

.save-status {
  color: $primary;
}
</style>

