<template>
  <div>
    <Toolbar>
      <Category title="File">
        <Item name="New Paste"/>
        <Item name="New Upload"/>

        <br>

        <Item name="Save" @click="uploadPaste"/>
      </Category>

      <Category title="Edit">
        <Item name="Language"/>
        <Item name="Theme"/>
      </Category>

      <Category title="Help">
        <Item name="Changelog"/>
        <Item name="About"/>
      </Category>
    </Toolbar>

    <div ref="dropZone" id="dropZone">
      <CodeFlask ref="codeflask" @save="uploadPaste"/>
    </div>
  </div>
</template>

<script lang="ts">
import CodeFlask from "@/components/CodeFlask.vue";
import Toolbar from "@/components/Toolbar.vue";
import Category from "@/components/Toolbar/Category.vue";
import Item from "@/components/Toolbar/Category/Item.vue";

import { Component, Vue } from "vue-property-decorator";
import superagent, { Response } from "superagent";

@Component({
  components: {
    CodeFlask,
    Toolbar,
    Category,
    Item
  }
})
export default class Home extends Vue {
  public $refs!: {
    codeflask: CodeFlask;
    dropZone: HTMLDivElement;
  };

  public mounted(): void {
    this.$refs.dropZone.ondragover = (event: DragEvent): void => event.preventDefault();
    this.$refs.dropZone.ondrop = (event: DragEvent): void => {
      event.preventDefault();

      this.displayUploadModal();
      this.dropHandler(event);
    };
  }

  private uploadPaste(): void {
    const paste = this.$refs.codeflask.$refs.input.value;

    // If no text or the welcome message is still shown, don't upload
    if (paste.length < 1 || this.$refs.codeflask.welcomeIsDisplayed) return;

    superagent
      .post(`http://localhost:80/upload/paste`)
      .send({ paste })
      .then((res: Response) => console.log(res))
      .catch(console.error);
  }

  private uploadFiles(formData: FormData): void {
    superagent
      .post(`http://localhost:80/upload/file`)
      .send(formData)
      .then(console.log)
      .catch(console.error);
  }

  private dropHandler(event: DragEvent): void {
    const { files } = event.dataTransfer;

    if (files.length > 1) {
      return console.log("too much files");
    }

    // https://stackoverflow.com/questions/25016442/how-to-distinguish-if-a-file-or-folder-is-being-dragged-prior-to-it-being-droppe
    if (!(files[0].size % 4096)) {
      return console.log("cant upload folders");
    }

    if (files[0].size > this.$data.MAX_FILE_SIZE * 1024 * 1024) {
      return console.log("too big");
    }

    const formData = new FormData();

    formData.append("file", files[0]);
    /*                ^^
      Field name must match the one specified in multer */

    this.uploadFiles(formData);
  }

  private displayUploadModal(): void {}
}
</script>

<style lang="scss" scoped>
</style>

