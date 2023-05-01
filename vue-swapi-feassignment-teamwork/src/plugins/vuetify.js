import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles/main.sass";
import "vuetify/styles";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as labs from "vuetify/labs/components";
export default createVuetify({
  components: {
    ...labs,
    /* explicit stating of imports */
    VInput: components.VInput,
    VResponsive: components.VResponsive,
    VTextField: components.VTextField,
    VPagination: components.VPagination,
    VImg: components.VImg,
    VTable: components.VTable,
    VApp: components.VApp,
    VRow: components.VRow,
    VProgressCircular: components.VProgressCircular,
    VContainer: components.VContainer,
    VAutocomplete: components.VAutocomplete,
  },
  directives,
  theme: {
    themes: {
      light: {
        primary: "#1976D2",
        secondary: "#424242",
        accent: "#82B1FF",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107",
      },
    },
  },
});
