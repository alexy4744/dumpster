<template>
  <div id="desktop">
    <MenuBar/>

    <WindowContainer></WindowContainer>

    <Dock/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Dock from "./Dock.vue";
import MenuBar from "./MenuBar.vue";
import WindowContainer from "./WindowContainer.vue";

@Component({
  components: {
    Dock,
    MenuBar,
    WindowContainer
  }
})
export default class Desktop extends Vue {
  public dock: HTMLDivElement | null = null;

  public mounted() {
    this.dock = document.getElementById("desktop-dock") as HTMLDivElement;
  }

  public dockZIndex(zIndex: number) {
    if (!this.dock) return;
    this.dock.style.zIndex = String(zIndex);
  }
}
</script>

<style lang="scss" scoped>

</style>

