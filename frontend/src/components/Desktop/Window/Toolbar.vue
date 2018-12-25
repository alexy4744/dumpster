<template>
  <div class="window-toolbar">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Toolbar extends Vue {
  public currentlyOpenedListCategory: HTMLSpanElement | null = null;
  public currentlyOpenedList: HTMLDivElement | null = null;

  public mounted(): void {
    document.onclick = (event: any) => {
      // If the clicked element was the list category then just ignore it.
      if (this.currentlyOpenedListCategory && event.target === this.currentlyOpenedListCategory) return;
      // Else, if theres an opened list, and the clicked element isn't within the list, close the list.
      if (this.currentlyOpenedList && event.target !== this.currentlyOpenedList) this.closeList(this.currentlyOpenedList);
    };
  }

  public toggleList(event: any): void {
    const list: HTMLDivElement | null = event.target.nextSibling;
    if (!list) return;

    if (this.currentlyOpenedList === list) return this.closeList(this.currentlyOpenedList);
    else if (this.currentlyOpenedList) this.closeList(this.currentlyOpenedList);

    this.openList(event.target, list);
  }

  public openList(listCategory: any, list: HTMLDivElement): void {
    list.style.overflow = "visible";
    listCategory.classList.add("window-toolbar-category-title-active");

    this.currentlyOpenedListCategory = listCategory;
    this.currentlyOpenedList = list;
  }

  public closeList(list: HTMLDivElement): void {
    if (!this.currentlyOpenedListCategory) return;

    list.style.overflow = "hidden";

    this.currentlyOpenedListCategory.classList.remove("window-toolbar-category-title-active");
    this.currentlyOpenedListCategory = null;
    this.currentlyOpenedList = null;
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/window.scss";

.window-toolbar {
  display: flex;
  flex-direction: row;
  height: $toolbarHeight;
  margin: 0 15px;
}
</style>

