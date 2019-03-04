<template>
  <div>
    <div style="position: absolute;">
      <Toolbar>
        <Category title="File">
          <Item name="New Upload" @click="$refs.modalContainer.displayModal('Upload')"/>

          <Item name="Save" @click="uploadPaste"/>
        </Category>

        <Category title="Edit">
          <Item name="Language" @click="displayLanguageModal"/>
        </Category>

        <Category title="Help">
          <Item name="ShareX" @click="$refs.modalContainer.displayModal('ShareX')"/>
          <Item name="About" @click="$refs.modalContainer.displayModal('About')"/>
        </Category>
      </Toolbar>

      <div ref="dropZone" id="dropZone">
        <CodeFlask ref="codeflask" @save="uploadPaste"/>
      </div>
    </div>

    <ModalContainer ref="modalContainer"/>
  </div>
</template>

<script lang="ts">
import Toolbar from "@/components/Toolbar.vue";
import Category from "@/components/Toolbar/Category.vue";
import Item from "@/components/Toolbar/Category/Item.vue";
import CodeFlask from "@/components/CodeFlask.vue";
import ModalContainer from "@/components/ModalContainer.vue";
import Modal from "@/components/Modal.vue";

import Language from "@/components/Modals/Language.vue";
import Upload from "@/components/Modals/Upload.vue";
import UploadProgress from "@/components/Modals/UploadProgress.vue";
import UploadResult from "@/components/Modals/UploadResult.vue";

import UploadHandler from "@/utils/UploadHandler";

import { VNode } from "vue";
import { Component, Vue } from "vue-property-decorator";
import superagent, { Response } from "superagent";

@Component({
  components: {
    Toolbar,
    Category,
    Item,
    CodeFlask,
    ModalContainer,
    Modal
  }
})
export default class Home extends Vue {
  public readonly $refs!: {
    codeflask: CodeFlask;
    dropZone: HTMLDivElement;
    modalContainer: ModalContainer;
  };

  private readonly uploadHandler: UploadHandler = new UploadHandler();

  public mounted(): void {
    const fileId: string = this.$route.params.id;
    if (fileId) this.displayFile(fileId);

    this.$refs.dropZone.ondragover = (event: DragEvent): void => {
      event.preventDefault();
    };

    this.$refs.dropZone.ondrop = (event: DragEvent): void => {
      event.preventDefault();
      this.dropHandler(event);
    };
  }

  private uploadPaste(): void {
    const currentText: string = this.$refs.codeflask.$refs.input.value;

    // If no text or the welcome message is still shown, don't upload
    if (!currentText.length || this.$refs.codeflask.welcomeIsDisplayed) {
      this.$refs.modalContainer.displayError(new Error("There is no paste to be uploaded!"));
      return;
    }

    const paste: Blob = new Blob([currentText], { type: "text/plain" });
    const formData: FormData = new FormData();

    formData.append("", paste, `${new Date().toLocaleTimeString()}.txt`);

    this.uploadFiles(formData);
  }

  private uploadFiles(formData: FormData): void {
    const uploadProgress: UploadProgress = new UploadProgress({ parent: this.$refs.modalContainer });

    uploadProgress.$on("cancel", this.cancelUpload);

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

  private cancelUpload(): void {
    this.uploadHandler.abortCurrentUpload().catch(this.$refs.modalContainer.displayError);
  }

  private dropHandler(event: DragEvent): void {
    const files: FileList | null = event.dataTransfer ? event.dataTransfer.files : null;

    if (!files) {
      this.$refs.modalContainer.displayError(new Error(`No files were found during the drag and drop!`));
      return;
    }

    if (!this.validateFiles(files)) return;

    const formData: FormData = new FormData();

    // tslint:disable-next-line:prefer-for-of
    for (let i: number = 0; i < files.length; i++) {
      formData.append("", files[i]);
    }

    this.uploadFiles(formData);
  }

  private validateFiles(files: FileList): boolean {
    if (files.length > this.$data.MAX_FIELDS) {
      this.$refs.modalContainer.displayError(new Error(`You cannot upload more than ${this.$data.MAX_FIELDS} files!`));
      return false;
    }

    // tslint:disable-next-line:prefer-for-of
    for (let i: number = 0; i < files.length; i++) {
      // tslint:disable-next-line:max-line-length
      // https://stackoverflow.com/questions/25016442/how-to-distinguish-if-a-file-or-folder-is-being-dragged-prior-to-it-being-droppe
      if (!files[i].type && !(files[i].size % 4096)) {
        this.$refs.modalContainer.displayError(new Error("You can't upload folders!"));
        return false;
      }

      if (files[i].size > this.$data.MAX_FILE_SIZE * 1024 * 1024) {
        this.$refs.modalContainer.displayError(new Error(`${files[i].name} is too big!`));
        return false;
      }
    }

    return true;
  }

  private displayFile(id: string): void {
    const url: string = `${this.$data.BACKEND_URL}/download/${id}`;

    superagent
      .get(url)
      .then(
        (res: Response): void => {
          if (res.type === "text/plain") {
            setTimeout(
              (): void => {
                this.$refs.codeflask.hideWelcome();
                this.$refs.codeflask.insertText(res.text);
                this.$refs.codeflask.recalculateLineNumbers();
                this.$refs.codeflask.highlight();
              }
            );
          } else {
            window.location.href = url;
          }
        }
      )
      .catch(this.$refs.modalContainer.displayError);
  }

  private displayLanguageModal(): void {
    this.$refs.modalContainer
      .displayModal("Language")
      .then(
        (modal: Vue): void => {
          modal.$on(
            "languageUpdated",
            async (): Promise<void> => {
              if (this.$refs.codeflask.welcomeIsDisplayed) {
                this.$refs.codeflask.hideWelcome();
                await this.$refs.codeflask.displayWelcome();
              }

              this.$refs.codeflask.highlight();
            }
          );
        }
      )
      .catch(
        (): void => {
          /* noop */
        }
      );
  }
}
</script>