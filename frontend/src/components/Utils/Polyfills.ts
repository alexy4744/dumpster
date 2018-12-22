export default class Polyfills {
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
