<template>
    <div class="personnel">
        <div class="top">
        </div>
        <!-- 列表 -->
        <div class="table">
            <Table border  :columns="columns" :height="tableHeight" :data="tableData"></Table>
        </div>
        <div class="footer">
            <!-- 分页 -->
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                // 表格高度
                tableHeight:'900',
                // 表头
                columns:[
                    {
                        title: '序号',
                        key: 'item_clsno'
                    },
                    {
                        title: '性别',
                        key: 'item_no'
                    },
                    {
                        title: '学历',
                        key: 'item_name'
                    },
                    {
                        title: '职务',
                        key: 'base_price'
                    },
                    {
                        title: '所属门店代码',
                        key: 'sum'
                    },
                    {
                        title: '所属门店名称',
                        key: 'subtotal'
                    },
                    {
                        title: '入职日期',
                        key: 'oper_date'
                    },
                    {
                        title: '离职日期',
                        key: 'oper_date'
                    },
                    {
                        title: '身份证号码',
                        key: 'oper_date'
                    },
                    {
                        title: '手机号码',
                        key: 'oper_date'
                    },
                    {
                        title: '生日（公历）',
                        key: 'oper_date'
                    },
                    {
                        title: '籍贯详细地址',
                        key: 'oper_date'
                    },
                    {
                        title: '现居住地址',
                        key: 'oper_date'
                    },
                    {
                        title: '合同签订日期',
                        key: 'oper_date'
                    },
                    {
                        title: '银行卡号',
                        key: 'oper_date'
                    },
                    {
                        title: '银行卡姓名',
                        key: 'oper_date'
                    },
                    {
                        title: '银行卡身份证号码',
                        key: 'oper_date'
                    },
                    {
                        title: '紧急联系人姓名',
                        key: 'oper_date'
                    },
                    {
                        title: '紧急联系人电话',
                        key: 'oper_date'
                    },
                    {
                        title: '关系',
                        key: 'oper_date'
                    },
                ],
                // 表格数据
                tableData:[],
                // 数据总数
                total:0,
                // 当前页数
                currentPage:1,
                // 每页显示几条数据
                pageSize:20
            }
        },
        created(){
            this.getpersonnel();
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
            /* 分类请求 */
            getpersonnel(){
                // this.$resetAjax({
                //     url:'/NewA/Public/getCate',
                //     type:'get',
                //     success:(res)=>{
                //        this.cateList=JSON.parse(res).data;
                //     }
                // })
            },
            // 改变页数
            changePage(index){
                this.currentPage=index;
                this.chaxun();
            }
        }
    }
</script>