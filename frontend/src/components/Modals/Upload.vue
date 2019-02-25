<template>
  <div>
    <Modal
      ref="uploadModal"
      title="Upload"
      :buttons="['Upload', 'Cancel']"
      @Upload-clicked="upload"
      @Cancel-clicked="cancel"
    >
      <input ref="filePicker" class="file-picker" type="file" multiple @change="readFiles">

      <div ref="selectedFiles" class="files">
        <template v-for="file of selectedFiles">
          <div :key="file.name" class="file">
            <span class="file__name">{{ file.name }}</span>
            <span class="file__size">{{ file.size }} bytes</span>
          </div>
        </template>
      </div>
    </Modal>

    <ModalContainer ref="modalContainer"/>
  </div>
</template>

<script lang="ts">
import { VNode } from "vue";
import { Component, Prop, Vue } from "vue-property-decorator";
import { Response } from "superagent";

import Modal from "@/components/Modal.vue";
import ModalContainer from "@/components/ModalContainer.vue";

import UploadProgress from "@/components/Modals/UploadProgress.vue";
import UploadResult from "@/components/Modals/UploadResult.vue";

import UploadHandler from "@/utils/UploadHandler";

@Component({
  components: {
    Modal,
    ModalContainer
  }
})
export default class Upload extends Vue {
  public readonly $refs!: {
    uploadModal: Modal;
    filePicker: HTMLInputElement;
    selectedFiles: HTMLDivElement;
    modalContainer: ModalContainer;
  };

  private readonly uploadHandler: UploadHandler = new UploadHandler();
  private selectedFiles: File[] = [];

  private readFiles() {
    const files: FileList | null = this.$refs.filePicker.files;
    if (!files) return;

    this.selectedFiles = Array.from(files);
  }

  private upload(): void {
    if (!this.selectedFiles.length) return;

    const formData: FormData = new FormData();

    // tslint:disable-next-line:prefer-for-of
    for (let i: number = 0; i < this.selectedFiles.length; i++) {
      formData.append("", this.selectedFiles[i]);
    }

    this.displayModals(formData);
  }

  private displayModals(formData: FormData): void {
    const uploadProgress: UploadProgress = new UploadProgress({ parent: this.$refs.modalContainer });

    uploadProgress.$on("cancel", () => {
      this.uploadHandler.abortCurrentUpload().catch(this.$refs.modalContainer.displayError);
    });

    this.$refs.modalContainer.displayModal(uploadProgress);

    this.uploadHandler
      .on("progress", uploadProgress.updateProgress)
      .upload(formData)
      .then(
        (res: Response): void => {
          if (!res.body.data) return;

          uploadProgress.close();

          this.$refs.modalContainer.displayModal(
            new UploadResult({
              parent: this.$refs.modalContainer,
              propsData: {
                files: res.body.data.items
              }
            })
          );
        }
      )
      .catch(
        (error: Error): void => {
          uploadProgress.close();
          this.$refs.modalContainer.displayError(error);
        }
      );
  }

  private cancel(): void {
    this.$refs.uploadModal.close();
  }
}
</script>

<style lang="scss" scoped>
.file-picker {
  width: inherit;
}

.files {
  max-height: 50vh;
  overflow: auto;
  padding-right: 15px;
}

.file {
  margin: 15px 0;
}

.file__name {
  font-weight: 800;
  word-wrap: break-word;
}

.file__size {
  float: right;
  // display: inline-block;
}
</style>
