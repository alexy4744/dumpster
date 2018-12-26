<template>
  <Window title="Untitled Document">
    <Toolbar>
      <!-- MUST use native click event listener -->
      <!-- https://vuejs.org/v2/guide/components-custom-events.html#Binding-Native-Events-to-Components -->
      <Category title="File">
        <Action name="Save" @click.native="save"/>
        <Action name="Share" @click.native="share"/>
      </Category>

      <Category title="View">
        <Action name="Language" @click.native="changeLanguage"/>
        <Action name="Theme" @click.native="changeTheme"/>
      </Category>

      <Category title="Help">
        <Action name="Changelog" @click.native="viewChangelog"/>
        <Action name="About" @click.native="viewAbout"/>
      </Category>
    </Toolbar>

    <CodeEditor/>

    <StatusBar>
      <Item>
        <SaveStatus ref="saveStatus"/>
      </Item>
    </StatusBar>
  </Window>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import superagent from "superagent";

import Application from "../Application.vue";
import Desktop from "../../Desktop.vue";
import WindowContainer from "../WindowContainer.vue";

/* Base window component */
import Window from "@/components/Desktop/Window.vue";

/* Editor features */
import CodeEditor from "./Editor/CodeEditor.vue";

/* Toolbar components */
import Toolbar from "@/components/Desktop/Window/Toolbar.vue";
import Category from "@/components/Desktop/Window/Toolbar/Category.vue";
import Action from "@/components/Desktop/Window/Toolbar/Action.vue";

/* Status bar components */
import StatusBar from "@/components/Desktop/Window/StatusBar.vue";
import Item from "@/components/Desktop/Window/StatusBar/Item.vue";
import SaveStatus from "./Editor/StatusBar/SaveStatus.vue";

@Component({
  components: {
    Window,
    Toolbar,
    Category,
    Action,
    StatusBar,
    Item,
    SaveStatus,
    CodeEditor
  }
})
export default class Editor extends Application {
  private readonly AUTOSAVE_INTERVAL = 1; // Auto save every second once stopped typing

  private readonly parentDesktop: Desktop = (this.$parent as WindowContainer).desktop as Desktop;
  private lastTyped: number | null = null;

  private autosave(): void {
    this.changeSaveStatus(1);
    if (this.lastTyped) clearTimeout(this.lastTyped);
    this.lastTyped = setTimeout(() => this.save(), this.AUTOSAVE_INTERVAL * 1000) as any;
  }

  private async save() {
    const code = this.$refs.code ? (this.$refs.code as HTMLPreElement) : null;
    if (!code) return;

    try {
      /* API post request here */
    } catch (error) {
      return this.parentDesktop.throwException(error);
    }

    this.changeSaveStatus(2);
  }

  private changeSaveStatus(status: number): void {
    if (!this.$refs.saveStatus) return;
    (this.$refs.saveStatus as SaveStatus).setStatus(status);
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/colors.scss";
@import "@/assets/css/window.scss";
</style>

