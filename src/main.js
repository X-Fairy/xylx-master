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
import VueAwesomeSwiper from 'vue-awesome-swiper' // 引入轮播
import 'swiper/dist/css/swiper.css'
Vue.use(VueAwesomeSwiper, /* { default global options } */)

import './assets/icon/iconfont.css'            // 引入阿里巴巴矢量图样式
import VueQuillEditor from 'vue-quill-editor'  // 富文本编辑器
import 'quill/dist/quill.core.css'   // 富文本编辑器
import 'quill/dist/quill.snow.css'   // 富文本编辑器
import 'quill/dist/quill.bubble.css'   // 富文本编辑器
Vue.use(VueQuillEditor)    // 富文本编辑器
import md5 from 'js-md5';  
Vue.prototype.$md5 = md5;  // 将md5转换成vue原型

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
Vue.component('charts', {
  template: '#charts',      
  // 传入对应的数值与动态index
  props: ['options', 'index'],
  methods: {
    initOption() {
      var that = this
      var arr1 = [] // x轴刻度
      var arr2 = [] // y轴数据值

       // 取出需要的数据
      this.options.forEach(element => {
        arr1.push(element.selectedTopic)
        arr2.push(element.peopleNum)
      })

      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(
        document.getElementById('charts' + this.index)
      )

      // 指定图表的配置项和数据
      var option = {
        color: ['#3582F8'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: arr1, // X轴的刻度
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          // y轴的刻度值自动调整
          {
            type: 'value'
          }
        ],
        series: {
          name: 'y轴数值',
          type: 'bar',
          barWidth: '60%',
          data: arr2 // 具体选择数值
        }
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  },
  mounted() {
    this.initOption()
  },
  created() {}
})
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
