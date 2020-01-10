import Vue from 'vue'
import Router from 'vue-router'
import home from '@/components/home';
import xmcp from '@/components/xmcp';

import enter from '@/components/apply/enter'
import write from '@/components/apply/write'

// 鼎付通 dingfutong
import apply from '@/components/dingfutong/apply'
import applytable from '@/components/dingfutong/applytable'


// 门店管理 store
import store from '@/components/store/store'
import storeVisit from '@/components/store/storeVisit'
import storevisitwrite from '@/components/store/storevisitwrite'
import capital from '@/components/store/capital' 
import initialization from '@/components/store/initialization' 


// 直营门店

import directlyStores from '@/components/directlyStores/directlyStores'
import storeStatement from '@/components/storeStatement/storeStatement' 
import directShop from '@/components/directlyStores/directShop' 
import shopManage from '@/components/directlyStores/shopManage'
import personnel from '@/components/directlyStores/personnel' 


// 店长查账
import audit from '@/components/audit/audit'  
// 储存卡查账
import StoredValueCard from '@/components/audit/StoredValueCard'
// 门店汇总
import gather from '@/components/audit/gather'
// 物流公司管理 
import logistics from '@/components/logistics/logistics'    
import logisticsAbout from '@/components/logistics/logisticsAbout'    


// 物流装车 
import shipment from '@/components/shipment/shipment'     // 备份
import shipmentTwo from '@/components/shipment/shipmentTwo'   // 新写
import printPage from '@/components/shipment/printPage'    


// 物流排单表
import platoon from '@/components/platoon/platoon'  


// 后台人员管理 backstage
import backstage from '@/components/backstage/backstage'
import daily from '@/components/backstage/daily'   // 日报 




// CRM管理系统 customer
import customer from '@/components/customer/customer'
import customeradd from '@/components/customer/customeradd'
import customerstore from '@/components/customer/customerstore'
import customerstorelist from '@/components/customer/customerstorelist'
import customervisit from '@/components/customer/customervisit'
import customervisitWrite from '@/components/customer/customervisitWrite'
import channel from '@/components/customer/channel'
import comeVisit from '@/components/customer/comeVisit'
import comevisitWrite from '@/components/customer/comevisitWrite'
import crmuserlist from '@/components/customer/crmuserlist'
import contract from '@/components/customer/contract'
import fullList from '@/components/customer/fullList'
import refundList from '@/components/customer/refundList'
import signing from '@/components/customer/signing'
import refund from '@/components/customer/refund'
import businessReport from '@/components/customer/businessReport'

// 商品管理 commodity
import commodity from '@/components/commodity/commodity' 
import analysis from '@/components/commodity/analysis'
import rank from '@/components/commodity/rank'
import rankList from '@/components/commodity/rankList'  
import goodDetail from '@/components/commodity/goodDetail'

// 工单管理 workorder
import work from '@/components/workorder/work'
import editor from '@/components/workorder/editor'
import workOrder from '@/components/workorder/workOrder'
import workDetail from '@/components/workorder/workDetail'


// 秒杀管理 seckill
import seckill from '@/components/seckill/seckill'
import uncommitted from '@/components/seckill/uncommitted'

// 报表类 reportforms
import storeMoney from '@/components/reportforms/storeMoney' 
import replenishment from '@/components/reportforms/replenishment' 
import afterSales from '@/components/reportforms/afterSales' 
import Stockout from '@/components/reportforms/Stockout'
import information from '@/components/reportforms/information'
import unsalable from '@/components/reportforms/unsalable'
//数据查询表格
import people from '@/components/reportforms/information/people'
import channels from '@/components/reportforms/information/channels'
import channelPeople from '@/components/reportforms/information/channelPeople'
import peopleDate from '@/components/reportforms/information/peopleDate'
import channelDate from '@/components/reportforms/information/channelDate'

// 线上聊天室 chat
import chat from '@/components/chat/chat'
import chatexc from '@/components/chat/chatexc'


// 取消尾数 goodorder
import goodorder from '@/components/goodorder/goodorder' 
import operational from '@/components/goodorder/operational' 


// 购物车
import shopCar from '@/components/shopCar/shopCar' 


// 首批查询
import search from '@/components/search/search'

// 门店数据可视化
import visualization from '@/components/visualization/visualization'  // 数据可视化主页
import salesTrend from '@/components/visualization/salesTrend'   // 总销售额走势图表 volume sales
import sales from '@/components/visualization/sales'   // 总销售额走势图表 volume 
import volume from '@/components/visualization/volume'   // 总销售额走势图表 
// 区域数据可视化
import domain from '@/components/visualization/domain'    // 区域数据可视化主页
// 大区门店数据
import areaData from '@/components/visualization/areaData'
import storeData from '@/components/visualization/storeData'
// 门店部门业绩
import achievement from '@/components/visualization/achievement'
import data from '@/components/data'
//库存管理
import inventory from '@/components/inventory/inventory'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: home,
      children: [
        {
          path: 'inventory',
          name: 'inventory',
          component: inventory  
        },
        {
          path: 'enter',
          name: 'enter',
          component: enter  
        },
        // http://localhost:8080/#/apply
        {
          path: 'apply',
          name: 'apply',
          component: apply
        },
        // http://localhost:8080/#/applytable
        {
          path: 'applytable',//  /applytable是访问路径
          name: 'applytable',
          component: applytable  // 这个是路径要访问的哪个组件
        },
        {
          path: 'backstage',
          name: 'backstage',
          component: backstage,
          meta: {
            keepAlive: true // 需要缓存
          }
        },
        {
          path: 'daily',
          name: 'daily',
          component: daily  
        },
        {
          path: 'customer',
          name: 'customer',
          component: customer,
          meta: {
            keepAlive: true // 需要缓存
          }
        },
        {
          path: 'customeradd',
          name: 'customeradd',
          component: customeradd  
        },
        {
          path: 'customerstore',
          name: 'customerstore',
          component: customerstore  
        },
        {
          path: 'customerstorelist',
          name: 'customerstorelist',
          component: customerstorelist  
        },
        {
          path: 'customervisit',
          name: 'customervisit',
          component: customervisit  
        },
        {
          path: 'customervisitWrite',
          name: 'customervisitWrite',
          component: customervisitWrite  
        },
        {
          path: 'channel',
          name: 'channel',
          component: channel  
        },
        {
          path: 'comeVisit',
          name: 'comeVisit',
          component: comeVisit  
        },
        {
          path: 'comevisitWrite',
          name: 'comevisitWrite',
          component: comevisitWrite  
        },
        {
          path: 'crmuserlist',
          name: 'crmuserlist',
          component: crmuserlist 
        },
        {
          path: 'contract',
          name: 'contract',
          component: contract 
        },
        {
          path: 'refundList',
          name: 'refundList',
          component: refundList 
        },
        {
          path: 'signing',
          name: 'signing',
          component: signing 
        },
        {
          path: 'refund',
          name: 'refund',
          component: refund 
        },
        {
          path: 'businessReport',
          name: 'businessReport',
          component: businessReport 
        },
        {
          path: 'fullList',
          name: 'fullList',
          component: fullList
        },  
        {
          path: 'commodity',
          name: 'commodity',
          component: commodity,
          meta: {
            keepAlive: true // 需要缓存
          }
        },
        {
          path: 'analysis',
          name: 'analysis',
          component: analysis  
        }, 
        {
          path: 'goodDetail',
          name: 'goodDetail',
          component: goodDetail  
        }, 
        {
          path: 'rank',
          name: 'rank',
          component: rank  
        },
        {
          path: 'rankList',
          name: 'rankList',
          component: rankList,
          meta: {
            keepAlive: true // 需要缓存
          }
        },
        {
          path: 'store',
          name: 'store',
          component: store,
        },
        {
          path: 'initialization',
          name: 'initialization',
          component: initialization,
        },
        {
          path: 'storeVisit',
          name: 'storeVisit',
          component: storeVisit  
        },
        {
          path: 'storevisitwrite',
          name: 'storevisitwrite',
          component: storevisitwrite  
        },
        {
          path: 'capital',
          name: 'capital',
          component: capital,
        },
        {
          path: 'chat',
          name: 'chat',
          component: chat  
        },
        {
          path: 'chatexc',
          name: 'chatexc',
          component: chatexc  
        },
        {
          path:'seckill',
          name:'seckill',
          component:seckill,
          meta: {
            keepAlive: true // 需要缓存
          }
        },
        {
          path:'uncommitted',
          name:'uncommitted',
          component:uncommitted
        },
        {
          path:'work',
          name:'work',
          component:work
        },
        {
            path:'editor',
            name:'editor',
            component:editor
          },
        {
          path:'workOrder',
          name:'workOrder',
          component:workOrder
        },
        {
          path:'workDetail',
          name:'workDetail',
          component:workDetail
        },
        {
          path:'storeMoney',
          name:'storeMoney',
          component:storeMoney
        },
        {
          path:'replenishment',
          name:'replenishment',
          component:replenishment 
        },
        {
          path:'goodorder',
          name:'goodorder',
          component:goodorder 
        },
        {
          path:'operational',
          name:'operational',
          component:operational 
        },
        {
          path:'afterSales',
          name:'afterSales',
          component:afterSales 
        },
        {
          path:'Stockout',
          name:'Stockout',
          component:Stockout   
        },
        {
          path:'directlyStores',
          name:'directlyStores',
          component:directlyStores,
          meta: {
            keepAlive: true // 需要缓存
          }
        }, 
        {
            path:'directShop',
            name:'directShop',
            component:directShop,
            meta: {
              keepAlive: true // 需要缓存
            }
        }, 
        {
            path:'shopManage',
            name:'shopManage',
            component:shopManage,
            meta: {
              keepAlive: true // 需要缓存
            }
        },
        {
          path:'personnel',
          name:'personnel',
          component:personnel,
          meta: {
            keepAlive: true // 需要缓存
          }
        }, 
        {
          path:'audit',
          name:'audit',
          component:audit   
        },
        {
          path:'information',
          name:'information',
          component:information,
          meta: {
            keepAlive: true // 需要缓存
          }
        },
        {
          path:'people',
          name:'people',
          component:people,
          meta: {
            keepAlive: true // 需要缓存
          }
        },
        {
          path:'channels',
          name:'channels',
          component:channels,
          meta: {
            keepAlive: true // 需要缓存
          }
        },
        {
          path:'channelPeople',
          name:'channelPeople',
          component:channelPeople,
          meta: {
            keepAlive: true // 需要缓存
          }
        },
        {
          path:'peopleDate',
          name:'peopleDate',
          component:peopleDate,
          meta: {
            keepAlive: true // 需要缓存
          }
        }, 
        {
          path:'channelDate',
          name:'channelDate',
          component:channelDate,
          meta: {
            keepAlive: true // 需要缓存
          }
        },
        {
          path:'logistics',
          name:'logistics',
          component:logistics,   
        },
        {
          path:'logisticsAbout',
          name:'logisticsAbout',
          component:logisticsAbout,   
        },
        {
          path:'shipment',
          name:'shipment',
          component:shipment,   
        }, 
        {
          path:'shipmentTwo',
          name:'shipmentTwo',
          component:shipmentTwo,  
        }, 
        {
          path:'platoon',
          name:'platoon',
          component:platoon,   
        }, 
        
        {
          path:'shopCar',
          name:'shopCar',
          component:shopCar,   
        }, 
        {
          path:'search',
          name:'search',
          component:search,   
        },
        {
          path:'unsalable',
          name:'unsalable',
          component:unsalable,   
        }, 
        {
          path:'StoredValueCard',
          name:'StoredValueCard',
          component:StoredValueCard,   
        }, 
        {
          path:'gather',
          name:'gather',
          component:gather,   
        }, 
        {
          path:'storeStatement',
          name:'storeStatement',
          component:storeStatement,
          meta: {
            keepAlive: true // 需要缓存
          }
        },
      ]
    },
    {
      path: '/write',
      name: 'write',
      component: write  
    },
    {
      path:'/printPage',
      name:'printPage',
      component:printPage,   
    }, 
    {
      path:'/xmcp',
      name:'xmcp',
      component:xmcp,   
    }, 
    {
      path:'/data',
      name:data,
      component:data,   
    },
    {
        path:'/visualization',
        name:'visualization',
        component:visualization,    // 门店可视化数据主页
        meta: {
            keepAlive: true // 需要缓存
        }
    },
    {
      path:'/areaData',
      name:'areaData',
      component:areaData,    // 门店可视化数据主页
      meta: {
          keepAlive: true // 需要缓存
      }
    },
    {
      path:'/storeData',
      name:'storeData',
      component:storeData,    // 门店可视化数据主页
      meta: {
          keepAlive: true // 需要缓存
      }
    },
    {
      path:'/achievement',
      name:'achievement',
      component:achievement,    // 部门业绩
      meta: {
          keepAlive: true // 需要缓存
      }
    },
    {
        path:'/domain',
        name:'domain',
        component:domain,    // 区域可视化数据主页
        meta: {
            keepAlive: true // 需要缓存
        }
    },
    {
        path:'/salesTrend',
        name:'salesTrend',
        component:salesTrend,    // 总销售额走势图
        children: [
            {
                path:'sales',
                name:'sales',
                component:sales,    // 总销售额走势图
            },
            {
                path:'volume',
                name:'volume',
                component:volume,    // 总销售额走势图
            },
        ]
    }, 
  ]
})
