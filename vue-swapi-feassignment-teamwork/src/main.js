import { createApp } from "vue";
import App from "./App.vue";
import store from "./store/index";
import router from "./router/index";

import vuetify from "./plugins/vuetify";

import "../src/scss/style.scss";

createApp(App).use(store).use(vuetify).use(router).mount("#app");
