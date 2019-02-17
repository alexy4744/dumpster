<template>
  <div class="modal-container">

  </div>
</template>

<script lang="ts">
import ModalGenerator from "@/utils/ModalGenerator";

import { Component, Vue } from "vue-property-decorator";
import superagent, { Response } from "superagent";

@Component
export default class Resolve extends Vue {
  public $refs!: {
    modalContainer: HTMLDivElement;
  }

  private readonly modalGenerator: ModalGenerator = new ModalGenerator(this);

  public async mounted(): Promise<void> {
    const url: string = `${this.$data.BACKEND_URL}/resolve/${this.$route.params.id}` 
    const res: Response = await superagent.get(url)
  console.log(res.body)
    // if (!res.body && res.ok) {
    //   window.location.href = url;
    // }
    // console.log(data);
  }
}
</script>

<style lang="scss" scoped>
</style>
