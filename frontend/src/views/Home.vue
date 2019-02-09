<template>
  <div>
    <Toolbar>
      <Category title="File">
        <CategoryItem name="New Paste"/>
        <CategoryItem name="New Upload"/>

        <br>

        <CategoryItem name="Save"/>
      </Category>

      <Category title="Edit">
        <CategoryItem name="Language"/>
        <CategoryItem name="Theme"/>
      </Category>

      <Category title="Help">
        <CategoryItem name="Changelog"/>
        <CategoryItem name="About"/>
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
import CategoryItem from "@/components/Toolbar/Category/CategoryItem.vue";

@Component({
  components: {
    CodeFlask,
    Toolbar,
    Category,
    CategoryItem
  }
})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
</style>

