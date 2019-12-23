<template>
    <div class="fullList">
        <div class="top">
            <h3 style="color: #1596ad">全款合同列表 &gt;&gt;</h3>
            <div class="right">
                <div class="part">
                    <span class="item">门店编码：</span>
                    <Input v-model="store" placeholder="请输入门店编码" clearable style="width:120px;"></Input>
                </div>
                <div class="part">
                    <span class="item">姓名：</span>
                    <Input v-model="username" placeholder="请输入客户姓名" clearable style="width:150px;"></Input>
                </div>
                <div  class="part">
                    <span class="item">联系方式：</span>
                    <Input v-model="phone" placeholder="请输入联系方式" style="width:150px;" clearable></Input>
                </div>
                <!-- <div class="part">
                    <span class="item">时间筛选：</span>
                    <DatePicker :value="datevalue" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 260px" @on-change="getTime"></DatePicker>
                </div> -->
                <div class="part">
                    <Button @click="search" class="searchclass" >查询</Button>
                </div>
            </div>
        </div>
         <!-- 内容区 -->
        <div class="table">
            <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
        <div class="footer">
            <!-- 分页 -->
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
            
        </div>
    </div>
</template>
<script>
import {changeday} from "@/assets/js/tool.js"//时间戳
export default{
    components:{
        changeday
    },
    data(){
        return{
            username:'',
            phone:'',
            store:'',
            datevalue:[],
            //表格的高度
            tableHeight:900,
            //表格头部
            columns:[
                // {
                //     title: '交易编号',
                //     key: 'dealcode',
                //     align: 'center',
                // },
                
                {
                    title: "姓名",
                    key: 'username',
                    align: 'center',
                },
                {
                    title: "电话号码",
                    key: 'phone',
                    align: 'center',
                },
                {
                    title: "开店地址",
                    key: 'address',
                    align: 'center',
                },
                {
                    title: "签单时间",
                    key: 'sign_time',
                    align: 'center',
                },
                
                {
                    title: '签单分类',
                    key: 'contract_cate',
                    align: 'center',
                },
                {
                    title: "本月收款",
                    key: 'curmonth',
                    align: 'center',
                },
                {
                    title: "总收款",
                    key: 'totalmoney',
                    align: 'center',
                },
                {
                    title: "备注",
                    key: 'remark',
                    align: 'center',
                },
                // {
                //     title: "标签",
                //     key: 'intention',
                //     align: 'center',
                // },
                // {
                //     title: '操作',
                //     key: 'action',
                //     width: 200,
                //     align: 'center',
                //     render: (h, params) => {
                //         return h('div', [
                //             h('a', {
                //                 class: 'handle',
                //                 style: {
                //                     marginRight: '10px',
                //                     cursor: 'pointer',
                //                     color:'#1d8c9f'
                //                 },
                //                 on: {
                //                     click: () => {
                //                     }
                //                 }
                //             }, '开新店'),
                //             h('a', {
                //                 class: 'handle',
                //                 style: {
                //                     marginRight: '10px',
                //                     cursor: 'pointer',
                //                     color:'#1d8c9f'
                //                 },
                //                 on: {
                //                     click: () => {
                //                         let routeData = this.$router.resolve({ name: 'refund', query: {isShow:1,id:params.row.id}});
                //                         window.open(routeData.href, '_blank');
                //                     }
                //                 }
                //             }, '退款'),
                //         ]);
                //     }
                // },
                
            ],
            //表格数据
            tableData:[],
            // 对时间进行限制,选择不到大于今天的时间
            options: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            //输入的时间范围
            dateRange:[],
            pageSize:20,
            currentPage:1,
            total:0,
        }
    },
    created(){
       this.getconlist();
    },
    
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 240);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 240);
        })
    
    },
    methods:{
        getTime(time){
            this.datevalue=time;
        },
        search(){
            this.getconlist();
        },
        getconlist(){
            this.$resetAjax({
                url: '/NewA/Customer/conlist',
                type: 'GET',
                data:{
                    p:this.currentPage,
                    type:'2',
                    // time:this.datevalue,
                    username:this.username,
                    phone:this.phone,
                    store:this.store
                },
                success:(res) => {
                    this.tableData = JSON.parse(res).data;
                    this.total = Number(JSON.parse(res).count);
                    this.tableData.forEach(ele=>{
                        ele.sign_time=changeday(ele.sign_time*1000)
                    })
                }
            })
        },
        // 分页
        changePage(index){
            this.currentPage=index;
            this.getconlist();
        }
    }
}
</script>