<template>
    <div class="searchgoods">
        <div class="top">
            <div class="part">
                <span class="item">商品类别：</span>
                <Select v-model="cls_no"  style="width:300px" multiple @on-change="getcls_no" placeholder="请选择商品类别" label-in-value>
                    <Option value="all" key="55">全选</Option>
                    <Option value="none" key="100">全不选</Option>
                    <Option v-for="item in cateList" :value="item.cls_no" :key="item.cls_no" :label="item.cls_name">{{ item.cls_name }}</Option>
                </Select>
            </div>
            <div class="search">
                <span class="num">门店编码：</span>
                <div>
                    <Input v-model="code" placeholder="请输入5位数的门店编码" @on-enter="searchgood"/>
                    <Button slot="append" icon="ios-search" @click="searchgood"></Button>
                </div>
                <p class="money" v-show="show">总金额：{{totalMoney}}元</p>
            </div>
            <div class="load">
                <Button type="primary" @click="loadCustomer" class="loadlist" v-show="isShow">导出列表</Button>
            </div>
        </div>
        <!-- 列表 -->
        <div class="table">
            <Table border  :columns="columns" :height="tableHeight" :data="tableData"></Table>
        </div>
        <div class="footer">
            <!-- 分页 -->
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 加载进度 -->
        <spin v-if="spinShow"></spin>
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
            return {
                // 输入的商品类别
                cls_no:'',
                // 商品类别列表
                cateList:[],
                // 是否显示导出lieb
                isShow:true,
                // 输入的商品ID
                code:'',
                // 表格高度
                tableHeight:'900',
                // 表头
                columns:[
                    {
                        title: '类别编码',
                        key: 'item_clsno'
                    },
                    {
                        title: '商品条码',
                        key: 'item_no'
                    },
                    {
                        title: '商品名称',
                        key: 'item_name'
                    },
                    {
                        title: '单价（元）',
                        key: 'base_price'
                    },
                    {
                        title: '数量',
                        key: 'sum'
                    },
                    {
                        title: '小计（元）',
                        key: 'subtotal'
                    },
                    {
                        title: '时间',
                        key: 'oper_date'
                    },

                ],
                // 表格数据
                tableData:[],
                // 总金额
                totalMoney:'',
                // 是否显示总金额
                show:false,
                // 是否显示正在加载中
                spinShow:false,
                // 数据总数
                total:0,
                // 当前页数
                currentPage:1,
                // 每页显示几条数据
                pageSize:20
            }
        },
        created(){
            this.getCate();
        },
        // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
        mounted() {
            setTimeout(()=> {
                // 得到浏览器内容高度
                let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight- 220);
            },100)
            // 调整浏览器的时候
            $(window).on('resize', () => {
                let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight - 220);
            })
        },
        methods:{
            /* 选择分类 */
            getcls_no(){
                this.currentPage=1;
                if(this.cls_no.includes('all')){
                    this.cls_no.splice(0,1);
                    this.cateList.forEach(ele=>{
                        this.cls_no.push(ele.cls_no);
                    })
                }
                if(this.cls_no.includes("none")){
                    this.cls_no=[];
                }
                // console.log(this.code);
                if(this.code){
                    this.chaxun();
                }
                
            },
            /* 查询 */
            searchgood(){
                this.currentPage=1;
                this.chaxun();
            },
            /* 发送查询请求 */
            chaxun(){
                this.spinShow=true;
                this.$resetAjax({
                    url:'/NewA/Batch/chaxun',
                    type:'get',
                    data:{
                        store:this.code,
                        cls_no:this.cls_no,
                        p:this.currentPage
                    },
                    success:(res)=>{
                        this.show=true;
                        this.tableData=JSON.parse(res).data;
                        this.total=parseInt(JSON.parse(res).count);
                        this.totalMoney=JSON.parse(res).total;
                        if(!this.totalMoney){
                            this.totalMoney=0; 
                        }
                        if(JSON.parse(res).errorcode==3){
                            this.$Modal.warning({
                                title:'提示',
                                content:'门店id不能为空，请重新输入！'
                            })
                        }
                        // if(this.tableData.length>0){
                        //     this.isShow=true;
                        // }else{
                        //     this.isShow=false;
                        // }
                        this.spinShow=false;
                    }
                })
            },
            /* 分类请求 */
            getCate(){
                this.$resetAjax({
                    url:'/NewA/Public/getCate',
                    type:'get',
                    success:(res)=>{
                       this.cateList=JSON.parse(res).data;
                    }
                })
            },
            /**
             * 导出客户
             */
            loadCustomer() {
                if(this.tableData.length>0){
                    location.href = `http://oa.xmvogue.com/index.php/NewA/Batch/exporttxt?store=${this.code}&cls_no=${this.cls_no}`
                }else{
                    this.$Modal.warning({
                        title:'提示',
                        content:'暂无数据可以导出！'
                    })                    
                }
                
            },
            // 改变页数
            changePage(index){
                this.currentPage=index;
                this.chaxun();
            }
        }
    }
</script>