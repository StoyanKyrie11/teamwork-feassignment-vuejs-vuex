import { createApp } from "vue";
import App from "./App.vue";
import store from "./store/store";
import router from "./router/index";

import vuetify from "./plugins/vuetify";

import "../src/scss/style.scss";

createApp(App)
  .provide("store", store)
  .use(store)
  .use(vuetify)
  .use(router)
  .mount("#app");
