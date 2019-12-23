<template>
  <div class="storePage" id="storePage">
    <div class="top">
      <!-- 查询 -->
      <div class="search">
        <div>
          <Input v-model="keyword" placeholder="请输入要搜索的内容" />
          <Button slot="append" icon="ios-search" @click="searchStore"></Button>
        </div>
        <div class="select">
          <p>仓位</p>
          <Select v-model="service" style="width:105px" @on-change="getservice(service)">
            <Option value="1" key="">全部</Option>
            <Option v-for="item in dataAll" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </div>

      </div>
    </div>
    <div class="table">
      <Table border :columns="columnsAll" :data="dataAll" v-if="status==1"></Table>
      <Table border :height="tableHeight" :columns="columns" :data="tableData" v-if="status==2"></Table>
      <Table border :height="tableHeight" :columns="columnsIf" :data="tableData" v-if="status==3"></Table>
    </div>
    <div class="footer">
      <!-- 分页 -->
      <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator
        show-total></Page>
    </div>
    
    <!-- 加载进度 -->
    <spin v-if="spinShow"></spin>
  </div>
</template>



<script>
import { changeday } from "@/assets/js/tool.js";
import tipModal from "../tip.vue";
import spin from "../spin.vue";
export default {
  components: {
    // 加载进度
    spin,
    tipModal
  },

  data() {
    return {
      spinShow: false,
      columnsAll: [
        {
          title: "仓位",
          key: "name",
          render: (h, params) => {
            return h("div", [
              // h("Icon", {
              //   props: {
              //     type: "person"
              //   }
              // }),
              h("strong", params.row.name)
            ]);
          }
        },
        {
          title: "财务库存",
          key: "CWKC"
        },
        {
          title: "业务库存",
          key: "YWKC"
        },
        {
          title: "未提交订单",
          key: "WTJDD"
        },
        {
          title: "已配数",
          key: "WPH"
        }
      ],
      columnsIf: [
        {
          title: "商品编码",
          key: "CODE2"
        },
        {
          title: "已发货",
          key: "qty700"
        },
        {
          title: "运输中",
          key: "qty701"
        },
        {
          title: "已收货",
          key: "qty1000"
        },
        {
          title: "已预审",
          key: "qty1700"
        },
        {
          title: "已审核",
          key: "qty100"
        },
        // {
        //   title: "预审后作废",
        //   key: "qty1720"
        // },
        // {
        //   title: "审核后作废",
        //   key: "qty110"
        // }
      ],
      dataAll: [],
      //总库存视图显示
      status: 1,
      // 搜索关键词
      keyword: "",
      // 部门数据
      serviceList: [],
      // 默认选中哪个部门
      service: "",
      // 省份
      area: 1,
      // 省份列表
      provinceList: [],
      // 表格列表数据
      tableData: [],
      // 表格高度
      tableHeight: 900,
      //是否显示海外门店余额
      isShow: false,
      // 门店表头数据
      columns: [
        {
          title: "商品编码",
          key: "CODE2"
        },
        {
          title: "财务库存",
          key: "A.AMT+A.TAX"
        },
        {
          title: "业务库存",
          key: "B.QTY*A.INVPRC"
        },
        {
          title: "未提交订单",
          key: "NOSUM"
        },
        {
          title: "未配货",
          key: "wph"
        },
        {
          title: "待发货",
          key: "dfh"
        }
      ],
      // 总页数
      total: 0,
      // 每页条数
      pageSize: 20,
      // 当前是第几页
      currentPage: 1,
      // 是否显示店铺详情
      storeDetail: false,
      // 店铺详情数据
      storeDetailData: {},
      // 是否倒序选择到门店列表
      times: "",
      // 物流公司列表数据
      logisticsData: [],
      // 是否显示编辑物流公司弹窗
      isLogistics: false,
      // 默认选中哪个物流公司
      model2: "",
      // 当前行选择物流公司的门店编码
      rowCode: ""
    };
  },
  // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
  mounted() {
    setTimeout(() => {
      // 得到浏览器内容高度
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      this.tableHeight = windowHeight - 220;
    }, 100);
    // 调整浏览器的时候
    $(window).on("resize", () => {
      let windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight;
      this.tableHeight = windowHeight - 220;
    });
  },

  created() {
    // 获取库存数据
    this.getAllList();
  },
  methods: {
    /**
     *功能：获取子库存数据
     *时间：2019年12月12日 17:23:05
     */
    getStoreList() {
      this.spinShow = true;
      this.$resetAjax({
        type: "GET",
        url: "/NewA/Kucun/gstock",
        data: {
          p: this.currentPage,
          cang: this.service,
          code: this.keyword
        },
        success: res => {
          // console.log(res);
          if (this.keyword) {
            this.status = 3;
          } else {
            this.status = 2;
          }
          this.tableData = res.data;
          this.total = Number(res.count);
          this.spinShow = false;
        }
      });
    },
    /**
     *功能：获取总库存数据
     *时间：2019年12月13日 14:59:00
     */
    getAllList() {
      this.$resetAjax({
        type: "GET",
        url: "/NewA/Kucun/index",
        success: res => {
          // console.log(res);
          var list = [];
          for (var i in res.data) {
            let text;
            switch (i) {
              case "1000000":
                text = "国内";
                break;
              case "1000040":
                text = "海外";
                break;
              case "1000060":
                text = "Somego";
            }
            let content = {
              id: String(i),
              name: text,
              CWKC: res.data[i].CWKC,
              WPH: res.data[i].WPH,
              WTJDD: res.data[i].WTJDD,
              YWKC: res.data[i].YWKC
            };
            list.push(content);
          }
          this.dataAll = list;
          this.total = list.length;
        }
      });
    },
    /**
     *功能：查询功能
     *时间：2019年12月14日 14:54:09
     */
    searchStore() {
      if (this.service == "") {
        this.$Modal.warning({
          content: "请选择查询仓位"
        });
        return false;
      }
      this.currentPage = 1;
      this.getStoreList();
    },
    /**
     *功能：仓位功能
     *时间：2019年12月14日 15:06:02
     */
    getservice(service) {
      this.currentPage = 1;
      this.service = service;
      if (service == 1) {
        this.status = 1;
        this.total = this.dataAll.length;
      } else {
        this.getStoreList();
      }
    },
    /**
     * 切换页面
     */
    changePage(index) {
      this.currentPage = index;
      this.getStoreList();
    }
  }
};
</script>
