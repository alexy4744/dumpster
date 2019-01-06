<template>
  <div id="desktop">
    <MenuBar ref="menuBar"/>
    <WindowContainer ref="windowContainer"></WindowContainer>
    <Dock ref="dock"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Bus from "@/bus";

import MenuBar from "./Desktop/MenuBar.vue";
import WindowContainer from "./Desktop/WindowContainer.vue";
import Dock from "./Desktop/Dock.vue";
import Application from "./Desktop/Application.vue";

@Component({
  components: {
    MenuBar,
    WindowContainer,
    Dock
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

