import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "@/plugins/vuetify";
import "material-design-icons-iconfont/dist/material-design-icons.css";
import "@mdi/font/css/materialdesignicons.css";
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import VCharts from "v-charts";
Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  Toast,
  VCharts,
  render: (h) => h(App),
}).$mount("#app");
