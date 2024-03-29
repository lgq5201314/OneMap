import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import store from "./store"
import 'element-ui/lib/theme-chalk/index.css';
import { loadScript, loadCss } from 'esri-loader'
// 添加gis的样式和api
loadCss("https://js.arcgis.com/4.22/esri/themes/light/main.css");
loadScript({
	dojoConfig: {
	  async: true
	},
	url: 'https://js.arcgis.com/4.22/init.js'
});

Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  store,
  beforeCreate(){
    this.__proto__.$bus = this
  }
}).$mount('#app')
