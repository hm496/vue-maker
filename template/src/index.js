import Vue from 'vue'
import App from './App.vue'
import './index.less'
// import router from './router'
// import store from './store'
import AlloyFinger from 'alloyfinger'
import AlloyFingerPlugin from 'alloyfinger/vue/alloy_finger.vue'

Vue.prototype.$t = val => val;
Vue.use(AlloyFingerPlugin, {
  AlloyFinger
})
Vue.config.productionTip = false;

new Vue({
  el: "#root",
  // router: router,
  // store: store,
  render: h => h(App)
});

