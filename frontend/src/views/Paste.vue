<template>
  <div id="paste">
    <Window/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Window from "@/components/Desktop/Window.vue";
import hljs from "highlight.js";

@Component({
  components: {
    Window
  }
})
export default class Paste extends Vue {}
</script>

<style scoped lang="scss">
@import "@/assets/css/colors.scss";

#paste {
  padding: 50px;
  height: 100%;
}
</style>
