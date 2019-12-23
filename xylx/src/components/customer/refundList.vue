<template>
    <div class="contract">
        <div class="top">
            <h3 style="color: #1596ad">退款列表 &gt;&gt;</h3>
            <div class="right">
                <div class="part">
                    <span class="item">门店编码：</span>
                    <Input v-model="store" placeholder="请输入门店编码" clearable style="width:120px;"></Input>
                </div>
                <div class="part">
                    <span class="item">姓名：</span>
                    <Input v-model="username" placeholder="请输入客户姓名" clearable style="width:120px;"></Input>
                </div>
                <div  class="part">
                    <span class="item">联系方式：</span>
                    <Input v-model="phone" placeholder="请输入联系方式" clearable style="width:160px;"></Input>
                </div>
                <!-- <div  class="part">
                    <span class="item">是否还需退款金额：</span>
                    <Select v-model="isNeed" style="width:90px;" @on-change="getNeed" clearable>
                        <Option v-for="item in list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="part">
                    <span class="item">时间筛选：</span>
                    <DatePicker :value="date" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 260px" @on-change="getTime"></DatePicker>
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
                // 时间
                date:[],
                // 是否需要退款
                isNeed:'',
                username:'',
                phone:'',
                // 门店编码
                store:'',
                list:[
                    {value: '1',label: '是'},
                    {value: '2',label: '否'}
                ],
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
                        title: "订单状态",
                        key: 'contract_cate',
                        align: 'center',
                    },
                    // {
                    //     title: '签单分类',
                    //     key: 'contract_cate',
                    //     align: 'center',
                    // },
                    {
                        title: "签单时间",
                        key: 'sign_time',
                        align: 'center',
                    },                    
                    {
                        title: "总收款",
                        key: 'totalMoney',
                        align: 'center',
                    },
                    {
                        title: "应退款",
                        key: 'refund',
                        align: 'center',
                    },
                    {
                        title: "实退金额",
                        key: 'actural_refund',
                        align: 'center',
                    },
                    {
                        title: "还需退款金额",
                        key: 'residual_refund',
                        align: 'center',
                    },
                    
                    {
                        title: '操作',
                        key: 'action',
                        width: 200,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    class: 'handle',
                                    style: {
                                        marginRight: '10px',
                                        cursor: 'pointer',
                                        color:'#1d8c9f'
                                    },
                                    on: {
                                        click: () => {
                                            this.$router.push({ name: 'refund', query: {isShow:2,id:params.row.id} });
                                            // window.open(routeData.href, '_blank');
                                        }
                                    }
                                }, '详情'),
                            
                            ]);
                        }
                    },
                    
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
            // 时间筛选
            getTime(value){
                this.date=value;
            },
            getNeed(value){
                this.isNeed=value;
            },
            // 查询
            search(){
                this.getconlist();
            },
            getconlist(){
                this.$resetAjax({
                    url: '/NewA/Customer/conlist',
                    type: 'GET',
                    data:{
                        p:this.currentPage,
                        type:'3',
                        // time:this.date,
                        // isNeed:this.isNeed,
                        username:this.username,
                        phone:this.phone,
                        store:this.store
                    },
                    success:(res) => {
                        this.tableData = JSON.parse(res).data;
                        this.total = Number(JSON.parse(res).count);
                        // this.tableData.forEach(ele=>{
                        //    if(ele.residual_refund>0){
                        //        ele.residual_refund='是'
                        //    }else if(ele.residual_refund==0){
                        //        ele.residual_refund='否'
                        //    }
                        // })
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