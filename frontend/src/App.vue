<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Home extends Vue {}
</script>

<style lang="scss">
@import "assets/css/colors";

body {
  background-color: $background;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  max-width: 1600px;
  margin: 0 auto;
  padding: 25px 20px;
}
</style>
