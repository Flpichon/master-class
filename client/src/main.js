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

sync(store, router);
Vue.use(Notifications)
console.log('coucou');
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCnoAK5hcneQxgYY0LJRgyb6t6PGXhMpSQ',
    libraries: 'places,drawing,visualization', // This is required if you use the Autocomplete plugin
    // OR: libraries: 'places,drawing'
    // OR: libraries: 'places,drawing,visualization'
    // (as you require)

    //// If you want to set the version, you can do so:
    // v: '3.26',
  },

  //// If you intend to programmatically custom event listener code
  //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
  //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
  //// you might need to turn this on.
  // autobindAllEvents: false,

  //// If you want to manually install components, e.g.
  //// import {GmapMarker} from 'vue2-google-maps/src/components/marker'
  //// Vue.component('GmapMarker', GmapMarker)
  //// then set installComponents to 'false'.
  //// If you want to automatically install all the components this property must be set to 'true':
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
