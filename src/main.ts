import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import ImagePainter from 'vue-image-painter'

Vue.config.productionTip = false;
import VueSocialSharing from "vue-social-sharing";
Vue.use(ImagePainter)
import { WebCam } from "vue-web-cam";
import Vuex from 'vuex'

Vue.use(WebCam);
Vue.use(VueSocialSharing);

Vue.use(Vuex)

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
