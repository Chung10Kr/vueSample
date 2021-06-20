import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueSidebarMenu from 'vue-sidebar-menu'
import store from './store'
import syscode from './api/syscode'
import naver from 'vue-naver-maps';
import "@/utils/fontAwesomeIcon.js";


 



Vue.config.productionTip = false
Vue.prototype.$syscode = syscode
Vue.use(naver, {
  clientID: 'r81ospvs00',
  useGovAPI: false, //공공 클라우드 API 사용 (선택)
  subModules:'' // 서브모듈 (선택)
});
Vue.use(VueSidebarMenu)
function init() {
  // const savedToken = Cookies.get('accessToken')
  const savedToken = sessionStorage.getItem('accessToken')
  if (savedToken) {
      return store.dispatch('loginByToken', savedToken)
  } else {
      return Promise.resolve()
  }
}

init().then(() => {
  window.vm = new Vue({
      router,
      store,
      render: h => h(App)
  }).$mount('#app')
})
