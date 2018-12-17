<template>
  <div class="home flex flex-col justify-center items-center">
    <Uploader/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Uploader from "@/components/Home/Uploader.vue";

@Component({
  components: {
    Uploader
  }
})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
</style>

