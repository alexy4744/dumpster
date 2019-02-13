<!-- Clone of https://github.com/euvl/vue-js-modal in style -->

<template>
  <div class="modal--background" v-if="!isClosed">
    <div class="modal">
      <div class="modal__wrapper">
        <div class="modal__header">
          <span class="header__title">{{ title }}</span>
        </div>

        <div class="modal__body">
          <slot/>
        </div>
      </div>

      <template v-if="buttons.length > 0">
        <div class="modal__buttons">
          <template v-for="button of buttons">
            <button
              :key="button"
              :style="{ width: `${100 / buttons.length}%`}"
              class="modal__button"
              @click="$emit(`${button}-clicked`)"
            >{{ button }}</button>
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Modal extends Vue {
  public isClosed: boolean = false;

  @Prop({
    type: String,
    default: ""
  })
  private readonly title?: string;

  @Prop({
    type: Array,
    default: []
  })
  private readonly buttons?: string[];

  public open(): void {
    this.isClosed = false;
  }

  public close(): void {
    this.isClosed = true;
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/colors.scss";

.modal--background {
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.45);
  position: absolute;
}

.modal {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  color: #6b7c93;
  font-family: Montserrat;
}

.modal__wrapper {
  padding: 25px;
}

.modal__header,
.modal__body {
  width: 100%;
  height: 100%;
  font-size: 16px;
  overflow: auto;
}

.header__title {
  display: block;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 16px;
}

.modal__buttons {
  position: relative;
  border: 0;
  border-top: 1px;
  border-style: solid;
  border-color: darken(#eee, 15%);
  width: 100%;

  > .modal__button:not(:first-child) {
    border-left-width: 1px;
  }

  > .modal__button:not(:first-child) and :not(:last-child) {
    border-right-width: 1px;
  }
}

.modal__button {
  appearance: none;
  background-color: transparent;
  color: inherit;
  border: 0;
  border-style: inherit;
  border-color: inherit;
  padding: 10px 15px;
  letter-spacing: 1px;
  font-size: 12px;
  outline: none;

  &:hover {
    background-color: darken(#eee, 1%);
    cursor: pointer;
  }
}
</style>