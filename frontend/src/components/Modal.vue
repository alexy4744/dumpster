<template>
  <div class="modal--dimmer">
    <div class="modal">
      <div class="modal__header">
        <slot name="header"/>
      </div>

      <div class="modal__body">
        <slot name="body"/>
      </div>

      <div class="modal__footer">
        <div class="footer__btns">
          <button class="btns--ok" @click="ok">OK</button>

          <template v-if="isPrompt">
            <button class="btns--cancel" @click="cancel">Cancel</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class CategoryItem extends Vue {
  @Prop({
    type: Boolean,
    default: false
  })
  private isPrompt!: boolean;

  private ok(event: MouseEvent) {
    this.$emit("ok", event);
  }

  private cancel(event: MouseEvent) {
    this.$emit("cancel", event);
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

$headerFooterHeight: 60px;
$bodyHeight: calc(#{$headerFooterHeight} * 2);

.modal--dimmer {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
}

.modal {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: absolute;

  > div {
    font-size: responsive;
  }
}

.modal__header,
.modal__footer {
  height: $headerFooterHeight;
}

.modal__body {
  height: $bodyHeight;
}

.modal__footer,
.footer__btns {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
</style>
