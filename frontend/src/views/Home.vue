<template>
  <div>
    <Toolbar>
      <Category title="File">
        <Item name="New Paste"/>
        <Item name="New Upload"/>

        <br>

        <Item name="Save"/>
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

    <CodeFlask/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CodeFlask from "@/components/CodeFlask.vue";
import Toolbar from "@/components/Toolbar.vue";
import Category from "@/components/Toolbar/Category.vue";
import Item from "@/components/Toolbar/Category/Item.vue";

@Component({
  components: {
    CodeFlask,
    Toolbar,
    Category,
    Item
  }
})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
</style>

