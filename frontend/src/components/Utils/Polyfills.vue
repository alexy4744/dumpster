<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Polyfills extends Vue {
  // Polyfill for Event.path
  // https://stackoverflow.com/questions/39245488/event-path-undefined-with-firefox-and-vue-js
  public static composedPath(event: any) {
    const nativePath = event.path || (event.composedPath && event.composedPath());
    if (nativePath) return nativePath;

    let element = event.target;

    const path = [];

    while (element) {
      path.push(element);

      if (element.tagName === "HTML") {
        path.push(document);
        path.push(window);

        return path;
      }

      element = element.parentElement;
    }
  }
}
</script>
