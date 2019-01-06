/* An Event Bus basically allows components to import this file
  and emit a event or listen to a event through this Vue instance

  https://alligator.io/vuejs/global-event-bus/
*/

import Vue from "vue";

const EventBus: Vue = new Vue();

export default EventBus;