<template>
  <div id="desktop-dock">
    
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Dock extends Vue {

}
</script>

<style lang="scss" scoped>
@import "@/assets/css/colors.scss";

#desktop-dock {
  width: 80vw;
  height: 10vh;
  position: fixed;
  background-color: lighten($background, 25%);
  opacity: 0.25;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -100%);
  overflow: auto;
  z-index: 10000;
}
</style>

