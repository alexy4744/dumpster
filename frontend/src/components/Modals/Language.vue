<template>
  <Modal
    ref="languageModal"
    title="Language"
    :buttons="['Save', 'Cancel']"
    @Save-clicked="save"
    @Cancel-clicked="cancel"
  >
    <select ref="languageMenu">
      <template v-for="(value, key) in languages">
        <template v-if="currentLanguage === key">
          <option :key="key" :value="key" selected>{{ value }}</option>
        </template>

        <template v-else>
          <option :key="key" :value="key">{{ value }}</option>
        </template>
      </template>
    </select>
  </Modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { FRIENDLY_LANGUAGES } from "@/assets/languages";

import Modal from "@/components/Modal.vue";

@Component({
  components: {
    Modal
  },

  computed: {
    currentLanguage() {
      const language: string | null = localStorage.getItem("LANGUAGE");
      if (!language || !language.length) return "markdown";
      else return language;
    }
  }
})
export default class Language extends Vue {
  public readonly $refs!: {
    languageModal: Modal;
    languageMenu: HTMLSelectElement;
  };

  private readonly languages = FRIENDLY_LANGUAGES;

  private save(): void {
    localStorage.setItem("LANGUAGE", this.$refs.languageMenu.value);
    this.$refs.languageModal.close();
  }

  private cancel(): void {
    this.$refs.languageModal.close();
  }
}
</script>