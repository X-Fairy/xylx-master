<template>
    <div class="Stockout">
        <div class="top">
            <div class="search">
                <span class="num">类别编码</span>
                <div>
                    <Input v-model="code" placeholder="请输入要搜索的类别编码" @on-enter="searchCode"/>
                    <Button slot="append" icon="ios-search" @click="searchCode"></Button>
                </div>
            </div>
        </div>
        <!-- 列表 -->
        <div class="table">
            <Table border  :columns="columns" :height="tableHeight" :data="Data"></Table>
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
                // 是否显示加载进度条
                spinShow: false,
                //类别编码
                code:'',
                //表头
                columns:[
                    {
                        title: '类别编码',
                        key: "SCODE",
                    },
                    {
                        title: '类别名称',
                        key: "SNAME",
                    },
                    {
                        title: '出库数量（最近30天）',
                        key: "SUM(NVL(ORD.UNINQTY,0))",
                    },
                    {
                        title: '库存',
                        key: "SUM(BS.QTY)",
                    },
                    {
                        title: '未到货数量',
                        key: "SUM(NVL(ORD.UNINQTY,0))",
                    },
                    {
                        title: '预计可售天数',
                        key: "DAYS",
                        renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','预计可售天数'),
                            h('Icon',{
                                props:{
                                    type: 'arrow-up-a'
                                },
                                style: {
                                    marginLeft: '5px',
                                    cursor:'pointer',
                                    position:'absolute',
                                    top:'-2px'
                                },
                                domProps: {
                                    title: '升序'
                                },
                                on: {
                                    click:() => {
                                        this.order = 1;
                                        this.searchCode();
                                    }
                                }
                            }),
                            h('Icon',{
                                props:{
                                    type: 'arrow-down-a'
                                },
                                style: {
                                    marginLeft: '5px',
                                    cursor: 'pointer',
                                    position:'absolute',
                                    top:'9px'
                                },
                                domProps: {
                                    title: '降序'
                                },
                                on: {
                                    click:() => {
                                        this.order = 2;
                                        this.searchCode();
                                    }
                                }
                            })
                        ])
                    }
                    },
                    
                ],
                //表高度
                tableHeight:900,
                //列表数据
                Data:[],
                //数据总数
                total:0,
                //当前页：
                currentPage:1,
                //每页有多少条数据
                pageSize:20,
                //排序
                order:''
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
        created(){
            // this.login();
        },
        methods:{
            // login() {
            //     this.$resetAjax({
            //         url: '/NewA/Miandenglu/index',
            //         type: 'POST',
            //         success:(res)=>{
            //         },
            //     })
            // },
            //根据类别编码查询缺货列表数据
            searchCode(){
                this.spinShow=true;
                this.$resetAjax({
                    url:'/NewA/Stockout/index',
                    type:'GET',
                    data:{
                        cls_no:this.code,
                        order:this.order,
                        p:this.currentPage
                    },
                    success:(res)=>{
                        this.Data=res.data.list;
                        this.total=parseInt(res.data.count);
                        //可预售天数转换
                        for(let i in this.Data){
                            if(this.Data[i].DAYS!=0&&this.Data[i].DAYS<1){
                                this.Data[i].DAYS="0"+this.Data[i].DAYS
                            }
                        }
                        this.spinShow=false;
                    }
                })
            },
            //切换当前页
            changePage(index){
                this.currentPage=index;
                this.searchCode();
            },

        }
    }
</script>