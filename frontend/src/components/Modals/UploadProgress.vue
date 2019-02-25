<template>
  <Modal
    ref="uploadProgressModal"
    class="upload-progress-modal"
    title="Uploading..."
    :buttons="['Cancel']"
    @Cancel-clicked="cancel"
  >
    <Progress class="upload-progress" height="24px">
      <ProgressBar ref="uploadProgressBar" class="upload-progress-bar" progress="0%"/>
    </Progress>
  </Modal>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ProgressEvent } from "superagent";

import Modal from "@/components/Modal.vue";
import Progress from "@/components/Progress.vue";
import ProgressBar from "@/components/Progress/Bar.vue";

@Component({
  components: {
    Modal,
    Progress,
    ProgressBar
  }
})
export default class UploadProgress extends Vue {
  public readonly $refs!: {
    uploadProgressModal: Modal;
    uploadProgressBar: ProgressBar;
  };

  public updateProgress(event: ProgressEvent): void {
    if (!event.percent) return;
    if (!this.$refs.uploadProgressModal || !this.$refs.uploadProgressBar) return;

    this.$refs.uploadProgressBar.setProgress(event.percent);
  }

  public close(): void {
    this.$refs.uploadProgressModal.close();
  }

  private cancel(): void {
    this.$emit("cancel");
    this.close();
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

.upload-progress {
  background-color: color("background");
}

.upload-progress-bar {
  background-color: color("blue");
}
</style>

