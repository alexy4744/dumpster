<template>
  <span class="clock" ref="clock"></span>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Clock extends Vue {
  public mounted(): void {
    this.setTime();
    setInterval(() => this.setTime(), 1000);
  }

  public prettyTime(date?: number): string {
    return new Date(date || Date.now()).toLocaleTimeString([], {
      hour12: this.$store.state.desktop.timeFormat,
      weekday: "short"
    });
  }

  private setTime(): void {
    const clock = this.$refs.clock;
    if (!clock) return;
    (clock as HTMLSpanElement).innerText = this.prettyTime();
  }
}
</script>

<style lang="scss" scoped>
.clock {
  color: white;
}
</style>
