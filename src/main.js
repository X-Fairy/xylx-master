// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import iView from 'iview';
import HeaderComponent from '@/components/header.vue';
import 'iview/dist/styles/iview.css';
import '@/assets/style/index.less';
import 'echarts';
import ECharts from 'vue-echarts';
import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'AW4NMrvKPWEKZbWnVFjz9d7QpjWtiTp3'
})
import VueQuillEditor from 'vue-quill-editor'  // 富文本编辑器
import 'quill/dist/quill.core.css'   // 富文本编辑器
import 'quill/dist/quill.snow.css'   // 富文本编辑器
import 'quill/dist/quill.bubble.css'   // 富文本编辑器
Vue.use(VueQuillEditor)    // 富文本编辑器

Vue.component('Echart', ECharts);
Vue.use(iView);
Vue.use(Vuex);
Vue.config.productionTip = false

// ajax封装
let resetAjax = (opt) => {
  let defaultOpt = {
    root: process.env.NODE_ENV === 'development' ? '/newoa' : '',
    xhrFields: {withCredentials: true},
    crossDomain: true,
  }
  opt = Object.assign({}, defaultOpt, opt);
  opt.url = opt.root + opt.url;

/*   opt.headers['Content-type'] = 'application/json';
  if (opt.data) {
    opt.data = JSON.stringify(opt.data);
  } */
  $.ajax(opt);
};

Vue.prototype.$resetAjax = resetAjax;

Vue.component('HeaderComponent', HeaderComponent);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
    // 用户信息数据
    userData: {
      name: '',
      iconUrl: ''
    },
    // 权限列表
    qxlist: [],
    tip: {
      isShow: false,
      content: ''
    },
    
  },
  router,
  components: { App },
  template: '<App/>'
})
