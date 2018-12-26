<template>
  <div id="desktop-menu-bar">
    <div class="desktop-menu-bar-left"></div>

    <div class="desktop-menu-bar-right">
      <Clock class="mr-5"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Clock from "./MenuBar/Clock.vue";

@Component({
  components: {
    Clock
  }
})
export default class MenuBar extends Vue {

}
</script>

<style lang="scss" scoped>
@import "@/assets/css/colors.scss";
@import "@/assets/css/menubar.scss";

#desktop-menu-bar {
  width: 100vw;
  height: $menubarHeight;
  position: fixed;
  background-color: lighten($background, 25%);
  bottom: 100%;
  left: 50%;
  transform: translate(-50%, 100%);
  overflow-x: auto;
  overflow-y: hidden;
}

.desktop-menu-bar-left,
.desktop-menu-bar-right {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  width: 50%;
  height: 100%;
}

.desktop-menu-bar-left { 
  right: 100%;
  transform: translateX(100%);
}

.desktop-menu-bar-right { 
  left: 100%; 
  transform: translateX(-100%);  
}
</style>

