<template>
  <Modal ref="shareXModal" title="ShareX Custom Uploader" :buttons="['OK']" @OK-clicked="close">
    <p>
      Dumpster can also function as a ShareX custom uploader. It can be used for files, text and images.
      To get the configuration file, you can download it from
      <a
        href="https://github.com/ShareX/CustomUploaders/blob/master/dumpster.miyako.xyz.sxcu"
      >here</a>.
    </p>
  </Modal>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import Modal from "@/components/Modal.vue";

@Component({
  components: {
    Modal
  }
})
export default class ShareX extends Vue {
  public readonly $refs!: {
    shareXModal: Modal;
  };

  public close(): void {
    this.$refs.shareXModal.close();
  }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
}
</style>
