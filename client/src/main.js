import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import { sync } from 'vuex-router-sync'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as VueGoogleMaps from 'vue2-google-maps'
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'
import Notifications from 'vue-notification'
import { VueEditor , Quill} from "vue2-editor"
import 'moment'
import axios from "axios";

axios.get(`/api/projects/1/apiKey`)
  .then(apikey => {
    sync(store, router);
    Vue.use(Notifications)
    Vue.use(VueEditor);
    Vue.use(VueGoogleMaps, {
      load: {
        key: apikey.data,
        libraries: 'places,drawing,visualization',
      },
      installComponents: true
    });
    
    Vue.config.productionTip = false;
    Vue.config.devtools = true
    
    new Vue({
      vuetify,
      store,
      router,
      render: h => h(App)
    }).$mount('#app')
  });
