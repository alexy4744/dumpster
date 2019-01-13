<template>
  <div id="desktop">
    <MenuBar ref="menuBar"/>
    <WindowContainer ref="windowContainer"></WindowContainer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Bus from "@/bus";

import MenuBar from "./Desktop/MenuBar.vue";
import WindowContainer from "./Desktop/WindowContainer.vue";
import Application from "./Desktop/Application.vue";

@Component({
  components: {
    MenuBar,
    WindowContainer
  }
})
export default class Desktop extends Vue {
  public mounted() {
    Bus.$on("desktopException", (error: Error) => {
      console.error(error);
    });

    this.$store.dispatch("desktop/runApplication", "editor");
  }
}
</script>

<style lang="scss" scoped>

</style>

