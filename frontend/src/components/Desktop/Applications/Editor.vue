<template>
  <Window title="Untitled Document">
    <Toolbar>
      <Category title="File" :actions="['Save', 'Share']"/>
      <Category title="View" :actions="['Language', 'Theme']"/>
      <Category title="Help" :actions="['Changelog', 'About']"/>
    </Toolbar>

    <textarea spellcheck="false" autofocus></textarea>
  </Window>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import Application from "../Application.vue";
import Window from "@/components/Desktop/Window.vue";
import Toolbar from "@/components/Desktop/Window/Toolbar.vue";
import Category from "@/components/Desktop/Window/Toolbar/Category.vue";

@Component({
  components: {
    Window,
    Toolbar,
    Category
  }
})
export default class Editor extends Application {}
</script>

<style lang="scss" scoped>
@import "@/assets/css/colors.scss";
@import "@/assets/css/window.scss";

textarea {
  width: 100%;
  height: calc(100% - 25px - 66px); // Remove the top bar(66px) and toolbar(25px) from the height
  background: inherit;
  color: white;
  padding-top: 10px;
  padding-bottom: 25px;
  padding-left: 25px;
  padding-right: 25px;
  outline: none !important;
  resize: none;
}
</style>

