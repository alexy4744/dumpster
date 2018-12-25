<template>
  <div id="desktop">
    <MenuBar/>
    <WindowContainer></WindowContainer>
    <Dock/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MenuBar from "./Desktop/MenuBar.vue";
import Editor from "./Desktop/Applications/Editor.vue";
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
    this.runApplication("editor");
  }

  /* Getters must be in the same order as displayed in the template */
  get menuBar(): MenuBar {
    return this.$children[0] as MenuBar;
  }

  get windowContainer(): WindowContainer {
    return this.$children[1] as WindowContainer;
  }

  get dock(): Dock {
    return this.$children[2] as Dock;
  }

  public async runApplication(applicationName: string) {
    try {
      // Always make sure the first letter of the app name argument is capitalize for naming convention...
      let app = await import(`./Desktop/Applications/${applicationName.charAt(0).toUpperCase() + applicationName.slice(1)}.vue`).then((module) => module.default);

      app = new app({
        /* Must past parent when manually mounting to retrive parent and store
          https://forum.vuejs.org/t/this-store-undefined-in-manually-mounted-vue-component/8756 */
        parent: this.windowContainer
      });

      this.windowContainer.newWindow(app);
    } catch (error) {
      this.throwException(error);
    }
  }

  public throwException(error: Error) {
    console.error(error);
  }
}
</script>

<style lang="scss" scoped>

</style>

