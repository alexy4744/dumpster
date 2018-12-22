<template>
  <div id="paste">
    <Desktop/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Desktop from "@/components/Desktop/Desktop.vue";
import hljs from "highlight.js";

@Component({
  components: {
    Desktop
  }
})
export default class Paste extends Vue {
  private bodyElement: HTMLBodyElement | null = null;

  // Disable scrolling vertically for overflow upon entering rendering
  public mounted() {
    this.bodyElement = document.getElementsByTagName("body")[0];
    this.bodyElement.setAttribute("style", "overflow-x: auto !important; overflow-y: hidden !important;");
  }

  // Restore body overflow to default when leaving
  public beforeDestroy() {
    if (!this.bodyElement) return;
    this.bodyElement.removeAttribute("style");
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/css/colors.scss";

#paste {
  padding: 50px;
  height: 100%;
}
</style>
