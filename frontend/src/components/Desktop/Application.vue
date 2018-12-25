<template></template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Desktop from "../Desktop.vue";
import WindowContainer from "./WindowContainer.vue";

@Component
export default class Application extends Vue {
  /* Applications are ran within window containers,
    so the parent of an application is a window container,
    and the parent of the window container is the desktop */
  public readonly desktop: Desktop = (this.$parent as WindowContainer).$parent as Desktop;
}
</script>

<style lang="scss" scoped>

</style>

