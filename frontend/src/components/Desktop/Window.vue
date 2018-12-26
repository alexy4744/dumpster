<template>
  <div class="window">
    <div class="window-top" @mousemove="mouseDownOnWindow">
      <div class="window-top-actions">
        <div class="window-top-actions-close" @click="close"></div>
        <div class="window-top-actions-minimize"></div>
        <div class="window-top-actions-maximize" @click="changeWindowSize"></div>
      </div>

      <span class="window-top-title">{{ title }}</span>
    </div>

    <!-- Window content below as child elements... -->
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import Desktop from "../Desktop.vue";
import Polyfills from "@/components/Utils/Polyfills.ts";
import Toolbar from "./Window/Toolbar.vue";
import Category from "./Window/Toolbar/Category.vue";
import Dock from "./Dock.vue";

@Component({
  components: {
    Toolbar,
    Category
  }
})
export default class Window extends Vue {
  @Prop({ default: "Blank Window" }) public title?: string;
  private id: number = this.$store.state.windows.totalWindows;

  /* The parent of the parent is the desktop, since window is a container, and the container is a children of desktop */
  private desktop: Desktop = this.$parent.$parent.$parent as Desktop;

  private x: number = 0;
  private y: number = 0;
  private finalX: number = 0;
  private finalY: number = 0;
  private targetWindow: HTMLDivElement | null = null;

  private isMaximized: boolean = false;

  public close(): void {
    this.$store.dispatch("windows/close", this.id); // Remove it from the store
    this.$el.remove(); // Then remove it from the DOM
    this.$destroy(); // Finally destroy the component
  }

  private changeWindowSize(event: MouseEvent): void {
    const window = Polyfills.composedPath(event)[3]; // Get the WHOLE window, not just the element that was targetted

    this.centerWindow(window);

    if (!this.isMaximized) {
      this.expandWindow(window);
      (this.desktop.$refs.dock as Dock).dockZIndex(-9999);
    } else {
      this.shrinkWindow(window);
      (this.desktop.$refs.dock as Dock).dockZIndex(9999);
    }
  }

  private expandWindow(window: HTMLDivElement): void {
    window.style.width = "100%";
    window.style.height = "100%";
    window.style.maxHeight = "100%";
    this.isMaximized = true;
  }

  private shrinkWindow(window: HTMLDivElement): void {
    window.style.width = "var(--min-width)";
    window.style.height = "var(--min-height)";
    window.style.maxHeight = "var(--max-height)"; // 10vh is dock height, 5vh is menubar height
    this.isMaximized = false;
  }

  private centerWindow(window: HTMLDivElement): void {
    window.style.top = "50%";
    window.style.left = "50%";
  }

  /* Handle window movement/dragging
   * https://www.w3schools.com/howto/howto_js_draggable.asp
   */
  private mouseDownOnWindow(event: any): void {
    this.targetWindow = Polyfills.composedPath(event)[1]; // Get the WHOLE window element
    event.target.onmousedown = this.dragWindow;
  }

  private dragWindow(event: MouseEvent): void {
    event.preventDefault();

    this.x = event.clientX;
    this.y = event.clientY;

    document.onmouseup = this.stopDragging;
    document.onmousemove = this.moveWindow;
  }

  private moveWindow(event: MouseEvent): void {
    event.preventDefault();

    if (!this.targetWindow) return;

    this.finalX = this.x - event.clientX;
    this.finalY = this.y - event.clientY;

    this.x = event.clientX;
    this.y = event.clientY;

    this.targetWindow.style.top = `${this.targetWindow.offsetTop - this.finalY}px`;
    this.targetWindow.style.left = `${this.targetWindow.offsetLeft - this.finalX}px`;
  }

  private stopDragging(): void {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
</script>

<style scoped lang="scss">
@import "@/assets/css/colors.scss";
@import "@/assets/css/dock.scss";
@import "@/assets/css/menubar.scss";
@import "@/assets/css/window.scss";

.window {
  --min-height: 200px;
  --min-width: 375px;
  --max-height: calc(100% - #{$dockHeight} - #{$menubarHeight});

  background: lighten($background, 5%);
  border: 1px solid white;
  border-radius: 10px;
  resize: both;
  overflow: hidden;
  min-height: 200px;
  max-height: var(--max-height);
  min-width: 375px;
  height: 50%; // Initial height
  width: 50%; // Initial width
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

.window-top,
.window-top-actions {
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

.window-top-actions-close {
  background-color: #ff525c;

  &:hover {
    background-color: darken(#ff525c, 5%);
  }
}

.window-top-actions-minimize {
  background-color: #ffb852;

  &:hover {
    background-color: darken(#ffb852, 15%);
  }
}

.window-top-actions-maximize {
  background-color: #00ca61;

  &:hover {
    background-color: darken(#00ca61, 7%);
  }
}
</style>
