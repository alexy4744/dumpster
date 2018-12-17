<template>
  <div class="flex flex-row items-center justify-center" id="uploader">
    <DragDrop class/>
    <h1 class="or">OR</h1>
    <Paste class/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DragDrop from "./DragDrop.vue";
import Paste from "./Paste.vue";

@Component({
  components: {
    DragDrop,
    Paste
  }
})
export default class Uploader extends Vue {}
</script>

<style scoped lang="scss">
@import "@/assets/css/colors.scss";

#uploader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@media screen and (max-width: 1375px) {
  #uploader {
    position: static;
    transform: unset;
    flex-direction: column !important;
  }
}

.or {
  color: lighten($background, 25%);
  margin: 50px 100px;
  font-size: 5rem;
}
</style>
