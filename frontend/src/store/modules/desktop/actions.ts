import Actions from "../../interfaces/Actions";
import Bus from "@/bus";

/* First param is "context", but destructued, so context.commit, context.state => commit, state.
  By putting these methods in the store, it allows it to be called "globally" across components. */

export default {
  async runApplication({ dispatch }: Actions, applicationName: string) {
    try {
      // Always make sure the first letter of the app name argument is capitalize for naming convention...
      const appName = applicationName.charAt(0).toUpperCase() + applicationName.slice(1);
      const requestedApp = await import(`@/components/Desktop/Applications/${appName}.vue`).then((module) => module.default);

      Bus.$emit("newWindow", requestedApp, appName);
    } catch (error) {
      dispatch("throwException", error);
    }
  },

  throwException({ commit }: Actions, error: Error) {
    Bus.$emit("desktopException", error);
  }
};