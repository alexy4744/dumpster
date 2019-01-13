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
@import "assets/css/colors";

body {
	background: linear-gradient(300deg, #1e272e, #0F1419);
	background-size: 100vw 100vh;
  overflow: auto;
}

#app {
  font-family: Helvetica, Arial, sans-serif;
  color: white;
}
</style>
