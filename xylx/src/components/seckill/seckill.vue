<template>
    <div class="seckill">
        <div class="header">
            <div class="time">
                <div class="choose">
                    <span style="color: #1596ad">时间周期：</span>
                    <DatePicker type="datetimerange" :options="options" v-model="dateRange" format="yyyy-MM-dd HH:mm:ss" style="width:300px" placeholder="请选择日期范围" @on-change="getDateRange"></DatePicker>
                </div>
                <!-- <Button slot="append" icon="ios-search" @click="search" style="height: 32px;padding: 0 7px;width: 41px;"></Button> -->
                <button class="total"  style="height: 32px;padding: 0 7px;margin-left: 30px;min-width: 170px;">秒杀总金额：
                    <span style="color: #1596ad;font-weight: 600;position: relative;">{{Total}}
                        <!-- 加载进度 -->
                        <Spin fix v-if="spinShow" style="left: 10px;">
                            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        </Spin>
                    </span>
                </button>
            </div>
            <div class="selectPart">                    
                <button @click="uncommitted" >查询未提交订单</button>
            </div>
        </div>
        <!-- 内容区 -->
        <div class="contanier">
            <!-- 商品信息 -->
            <div class="table">
                <Table border :height="tableHeight" :columns="columns" :data="goodsData" ></Table>                
            </div>
            <!-- footer -->
            <div class="footer">
                <!-- 分页 -->
                <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
            </div>
        </div>
        <!-- 数据加载进度 -->
        <spin v-if="show"></spin>
    </div>
</template>
<script>
    import spin from '../spin.vue'
    export default{
        components: {
            // 加载进度
            spin
        }, 
        data(){
            return{
                //总金额加载中是否显示
                spinShow:false,
                //数据列表加载中是否显示
                show:false,
                // 对时间进行限制,选择不到大于今天的时间
                options: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                // 得到时间范围
                dateRange: [],
                // 秒杀商品列表表头数据
                columns: [
                    {
                        title: '商品条码',
                        key: 'item_no'
                    },
                    {
                        title: '商品名称',
                        key: 'item_name'
                    },
                    {
                        title: '数量',
                        key: 'total_qty',
                        renderHeader: (h,params)=>{
                            return h('div',[
                                h('strong','数量'),
                                h('Icon',{
                                    props:{
                                        type: 'arrow-up-a'
                                    },
                                    style: {
                                        marginLeft: '5px',
                                        cursor:'pointer'
                                    },
                                    domProps: {
                                        title: '升序'
                                    },
                                    on: {
                                        click:() => {
                                            // 向前找时间
                                            this.order_num = 2;
                                            this.order_amt = '';
                                            this.currentPage=1;
                                            this.getGoodsData();
                                        }
                                    }
                                }),
                                h('Icon',{
                                    props:{
                                        type: 'arrow-down-a'
                                    },
                                    style: {
                                        marginLeft: '5px',
                                        cursor:'pointer'
                                    },
                                    domProps: {
                                        title: '倒叙'
                                    },
                                    on: {
                                        click:() => {
                                            this.order_num = 1;
                                            this.order_amt = '';
                                            this.currentPage=1;
                                            this.getGoodsData();
                                        }
                                    }
                                })
                            ])
                        }
                    },
                    {
                        title: '金额(￥)',
                        key: 'total_amt',
                        renderHeader: (h,params)=>{
                            return h('div',[
                                h('strong','金额'),
                                h('Icon',{
                                    props:{
                                        type: 'arrow-up-a'
                                    },
                                    style: {
                                        marginLeft: '5px',
                                        cursor:'pointer'
                                    },
                                    domProps: {
                                        title: '升序'
                                    },
                                    on: {
                                        click:() => {
                                            // 向前找时间
                                            this.order_num ='';
                                            this.order_amt = 2;
                                            this.currentPage=1;
                                            this.getGoodsData();
                                        }
                                    }
                                }),
                                h('Icon',{
                                    props:{
                                        type: 'arrow-down-a'
                                    },
                                    style: {
                                        marginLeft: '5px',
                                        cursor:'pointer'
                                    },
                                    domProps: {
                                        title: '倒叙'
                                    },
                                    on: {
                                        click:() => {
                                            this.order_num ='';
                                            this.order_amt = 1;
                                            this.currentPage=1;
                                            this.getGoodsData();
                                        }
                                    }
                                })
                            ])
                        }
                    }
                ],
                //数量排序
                order_num:'',
                //金额排序
                order_amt:'',
                // 商品列表数据
                goodsData: [],
                // 表格高度
                tableHeight: 900,
                total:0,
                // 当前页有几条数据
                pageSize: 20,
                //当前页码
                currentPage:1,
                //总金额
                Total:''
            }
        },

        // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
        mounted() {
            setTimeout(()=> {
                // 得到浏览器内容高度
                let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight- 260);
            },100)
            // 调整浏览器的时候
            $(window).on('resize', () => {
                let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight - 260);
            })
        },

        created (){
        },
        methods:{
            /*查询*/
            search(){
                this.show=true;
                this.currentPage=1;
                this.getGoodsData();
            },
            /*秒杀产品销售统计*/
            getGoodsData(){
                this.$resetAjax({
                    url: '/NewA/Seckill/statistics',
                    type: 'GET',
                    data:{   
                        stime:this.dateRange[0],
                        etime:this.dateRange[1],
                        order_amt:this.order_amt,
                        order_num:this.order_num,                     
                        p:this.currentPage
                    },
                    success:(res) => {
                        var res = JSON.parse(res);
                        this.goodsData= res.data; 
                        this.total=Number(res.count);
                        this.show=false;                   
                    }
                })
            },
            // /*
            // *  得到选择的时间
            // */
            // getStartTime(startDate) {
            //     this.startDate =startDate;
            // },
            // /* 得到结束时间 */ 
            // getEndTime(endDate) {
            //     this.endDate =endDate;
            // },
            /**
             * 得到时间范围
             */
            getDateRange(date) {
                this.Total="";
                this.dateRange = date;
                this.show=true;
                this.currentPage=1;
                this.getGoodsData();
                this.totalMoney();
            },
            /**
             * 改变页数得到商品列表
             */
             changePage(index){
                this.currentPage = index;
                this.getGoodsData();
            },
            /**
             * 秒杀产品总金额
             */
            totalMoney(){
                this.spinShow=true;
                this.$resetAjax({
                    url:'/NewA/Seckill/aggregate',
                    type:'POST',
                    data:{
                        stime:this.dateRange[0],
                        etime:this.dateRange[1],
                    },
                    success:(res)=>{
                        this.Total="￥"+JSON.parse(res).data[0].subamt;
                        if(JSON.parse(res).data[0].subamt==null){
                            this.Total=0;
                        }                        
                        this.spinShow=false;
                    }
                })
            },
            /* 跳转到未提交的秒杀订单页面 */
            uncommitted(){
                this.$router.push('/uncommitted')
            }
        }
    }
</script>
