<template>
  <div id="desktop">
    <MenuBar/>
    <WindowContainer/>
    <Dock/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MenuBar from "./Desktop/MenuBar.vue";
import WindowContainer from "./Desktop/WindowContainer.vue";
import Dock from "./Desktop/Dock.vue";

@Component({
  components: {
    MenuBar,
    WindowContainer,
    Dock
  }
})
export default class Desktop extends Vue {
  get menuBar(): Vue {
    return this.$children[0];
  }

  get windowContainer(): Vue {
    return this.$children[1];
  }

  get dock(): Vue {
    return this.$children[2];
  }
}
</script>

<style lang="scss" scoped>

</style>

