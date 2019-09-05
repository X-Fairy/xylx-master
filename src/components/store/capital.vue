<template>
<div class="capitalflow">
    <!-- 头部 -->
    <div class="top">
        <div class="top_left">
            <h3 class="store_name" >店名: <span>【{{code}}】{{storeName}}</span></h3>
        </div>
        <div>
            <Button class="Initialization"  @click="Initialization">缴款列表</Button>
            <Button class="go_back" @click="gonameList">返回客户列表</Button>
        </div>
        
    </div>
    <div class="capital_area">
         <!-- 资金流水列表 -->
        <Table border  :columns="capital" :height="tableHeight" :data="capitalData" ></Table>
    </div>
    <div class="footer">
        <!-- 缴款分页 -->
        <Page  :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
    </div>
</div>
    
</template>


<script>
import {getUrlParams} from  '@/assets/js/tool.js'
import {changeday} from "@/assets/js/tool.js"//时间戳
// 提示组件
import tipModal from '../tip.vue'

export default {
    components:{
        tipModal
    },

    data() {
        return {
            // 得到网址的参数对象
            urlParams: {},
            // 客户名称
            storeName: '',
            // 该店的id
            code: '',
            // 资金流水的门店编码
            accounthdcode: '',
            // 资金流水表头
            capital: [
                {
                    title: '业务日期',
                    key: "TO_CHAR(G.OCRDATE,'YYYY-MM-DDHH24:MI')"
                },
                {
                    title: '业务类型',
                    render: (h, {row}) => {
                        let color;
                        switch (row.SRCCLS) {
                            case '统配出退': color = 'red';
                                break;
                            case '加盟金缴款': color = 'blue';
                                break;
                            default: color = 'rgb(73, 80, 96)';
                        }
                        return h('span', {
                            style: {
                                color
                            }
                        }, row.SRCCLS)  
                    }
                },
                {
                    title: '业务单号',
                    key: 'SRCNUM'
                },
                {
                    title: '发生金额',
                    key: 'MONEY'
                },
                {
                    title: '余额',
                    key: 'BALANCE'
                },
                {
                    title: '缴款',
                    key: 'TYPELCS'
                },
                {
                    title: '业务备注',
                    key: 'NAME'
                },
                {
                    title: '单据备注',
                    key: 'NOTE'
                },
            ], 
            // 资金流水数据
            capitalData: [],
            // 表格高度
            tableHeight: 900,
            // 总页数
            total: 0,
            // 页面条数
            pageSize: 20,
            // 当前页码
            currentPage: 1
        }
    },    
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 220);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 220);
        })
      
    },
    created() {
        // 得到网址的参数
        this.getUrlData();
        // 得到资金流水数据
        this.getcapitalList();
        
    },

    methods: {
        /**
         * 得到网址的参数
         */
        getUrlData:function(){
            this.urlParams = getUrlParams();
            this.storeName = this.urlParams.name;
            this.code = this.urlParams.code;
            
        },
        /**
         * 得到资金流水数据
         */
        getcapitalList(data) {
            this.$resetAjax({
                url: '/NewA/Shop/getaccount',
                type: 'POST',
                data: {
                    code: this.urlParams.code,
                },
                success: (res) => {
                    this.capitalData = res.data;
                    // switch(res.ifshow) {
                    //     case '3':
                    //         this.isShow = true;
                    //         this.isPaymentReady = false;
                    //         this.isPayInit=false;
                    //         break;
                    //     case '2':
                    //         this.isShow = false;
                    //         this.isPayInit=false;
                    //         this.isPaymentReady = true;
                    //         break;
                    //     case '1':
                    //         this.isShow = false;
                    //         this.isPayInit=true;
                    //         this.isPaymentReady = false;
                    //         break;
                    // }
                }
            })
        },
        /* 切换当前页 */
        changePage(index){
            this.currentPage=index;
            this.getcapitalList();
        },
        /**
         * 点击缴款列表
         */
        Initialization() {
            this.$router.push({path: 'initialization', query: {code: this.code, name: this.storeName}})
        },
        /**
         * 返回客户列表
         */ 
        gonameList() {
            this.$router.push({path: 'store'});
        },
    },
    
}
</script>
