<template>
  <div class="window">
    <div class="window-top" @mousemove="mouseDownOnWindow">
      <div class="window-top-actions flex flex-row">
        <div class="window-top-actions-close" @click="closeWindow"></div>
        <div class="window-top-actions-minimize"></div>
        <div class="window-top-actions-maximize" @click="changeWindowSize"></div>
      </div>

      <span class="window-top-title">Untitled Document</span>
    </div>

    <Toolbar>
      <Category title="File" :actions="['Save', 'Share']"/>
      <Category title="View" :actions="['Language', 'Theme']"/>
      <Category title="Help" :actions="['Changelog', 'About']"/>
    </Toolbar>

    <textarea spellcheck="false" autofocus></textarea>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Desktop from "./Desktop.vue";
import Polyfills from "@/components/Utils/Polyfills.ts";
import Toolbar from "./Window/Toolbar.vue";
import Category from "./Window/Toolbar/Category.vue";

@Component({
  components: {
    Toolbar,
    Category
  }
})
export default class Window extends Vue {
  private desktop: Desktop = this.$parent as Desktop;

  private x: number = 0;
  private y: number = 0;
  private finalX: number = 0;
  private finalY: number = 0;
  private targetWindow: HTMLDivElement | null = null;

  private isMaximized: boolean = false;

  private closeWindow(event: MouseEvent) {
    Polyfills.composedPath(event)[3].remove();
  }

  private changeWindowSize(event: MouseEvent) {
    const window = Polyfills.composedPath(event)[3]; // Get the WHOLE window, not just the element that was targetted

    if (!this.isMaximized) {
      this.expandWindow(window);
      this.centerWindow(window);
      this.desktop.dockZIndex(-9999);
    } else {
      this.shrinkWindow(window);
      this.centerWindow(window);
      this.desktop.dockZIndex(9999);
    }
  }

  private expandWindow(window: HTMLDivElement) {
    window.style.width = "100%";
    window.style.height = "100%";
    window.style.maxHeight = "100%";
    this.isMaximized = true;
  }

  private shrinkWindow(window: HTMLDivElement) {
    window.style.width = "initial";
    window.style.height = "initial";
    window.style.maxHeight = "calc(100vh - 10vh)"; // 10vh is dock height
    this.isMaximized = false;
  }

  private centerWindow(window: HTMLDivElement) {
    window.style.top = "50%";
    window.style.left = "50%";
  }

  /* Handle window movement/dragging
   * https://www.w3schools.com/howto/howto_js_draggable.asp
   */
  private mouseDownOnWindow(event: any) {
    this.targetWindow = Polyfills.composedPath(event)[1]; // Get the WHOLE window element
    event.target.onmousedown = this.dragWindow;
  }

  private dragWindow(event: MouseEvent) {
    event.preventDefault();

    this.x = event.clientX;
    this.y = event.clientY;

    document.onmouseup = this.stopDragging;
    document.onmousemove = this.moveWindow;
  }

  private moveWindow(event: MouseEvent) {
    event.preventDefault();

    if (!this.targetWindow) return;

    this.finalX = this.x - event.clientX;
    this.finalY = this.y - event.clientY;

    this.x = event.clientX;
    this.y = event.clientY;

    this.targetWindow.style.top = `${this.targetWindow.offsetTop - this.finalY}px`;
    this.targetWindow.style.left = `${this.targetWindow.offsetLeft - this.finalX}px`;
  }

  private stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/css/colors.scss";

.window {
  background: lighten($background, 5%);
  border: 1px solid white;
  border-radius: 10px;
  resize: both;
  overflow: hidden;
  min-height: 200px;
  max-height: calc(100% - 10vh); // 12vh is dock height
  min-width: 375px;
  height: 80%;
  width: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.window > *:not(.window-top and .window-toolbar) {
  padding: 0 25px; // Add padding to anything other than the window top since it already has padding
}

.window-top {
  padding: 25px;
  cursor: move;
}

.window-top-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: lighten($background, 55%);
  margin: 0 auto;
  z-index: -1;
  user-select: none;
}

.window-top {
  display: flex;
  flex-direction: row;
}

.window-top-actions > * {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  cursor: default;

  :not(:first-child) {
    margin-left: 10px; // Skip left margin for close button
  }
}

.window-top-actions > *:not(:last-child) {
  margin-right: 10px;
}

.window-top-actions-close,
.window-top-actions-minimize,
.window-top-actions-maximize {
  transition: background-color 0.3s ease-in-out;
}

.window-top-actions-close { background-color: #ff525c; }
.window-top-actions-close:hover { background-color: darken(#ff525c, 5%); }

.window-top-actions-minimize { background-color: #ffb852; }
.window-top-actions-minimize:hover { background-color: darken(#ffb852, 15%); }

.window-top-actions-maximize { background-color: #00ca61; }
.window-top-actions-maximize:hover { background-color: darken(#00ca61, 7%); }

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
