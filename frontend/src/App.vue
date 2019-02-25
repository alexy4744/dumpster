<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class App extends Vue {}
</script>

<style lang="scss">
@import "@/assets/colors.scss";

@font-face {
  font-family: "Fira Code";
  src: url("/FiraCode-Regular.otf");
  font-weight: 400;
  font-style: normal;
}

@font-face {
  font-family: "Montserrat";
  src: url("/Montserrat-Regular.ttf");
  font-style: normal;
}

html {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
}

body {
  background-color: color("background");
}
</style>
