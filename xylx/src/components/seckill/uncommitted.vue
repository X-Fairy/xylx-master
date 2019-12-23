<template>
    <div class="uncommitted">
        <div class="header">
            <button @click="$router.push({path: 'seckill'})" style="margin-right: 50px" class="back">返回秒杀统计</button>
        </div>
        <!-- 内容区 -->
        <div class="contanier">
            <!--未提交订单查询-->
            <div class="table">
                <Table border :columns="columns" :data="orders" :height="tableHeight"></Table>
            </div>            
            <!-- footer -->
            <div class="footer">
                <!-- 分页 -->
                <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
                //列表高度
                tableHeight: 900,
                //订单数据
                orders:[],
                //表头
                columns:[
                    {
                        title: '门店编码',
                        key: 'sissid'
                    },
                    {
                        title: '店名',
                        key: 'user_name'
                    }, 
                    {
                        title:'秒杀金额',
                        key:'sum(c.num*c.price)'
                    },
                ],
                //当前页
                currentPage:1,
                //当前页有几条数据
                pageSize:20,
                //总页数
                total:0
            }
        },
        created(){
            this.getGoodsType();
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
        methods:{
            /* 
            *  查询秒杀未分类提交的订单
             */
            getGoodsType() {
                this.$resetAjax({
                    url:'/NewA/Seckill/uncommitted',
                    type: 'GET',
                    data: {                        
                        p: this.currentPage
                    },                    
                    success:(res) => {
                        var res=JSON.parse(res);
                        this.orders=res.data;
                        this.total=Number(res.count); 
                    }
                })
            },
            /* 当前页查询 */
            changePage(index){
                this.currentPage=index;
                this.getGoodsType();
            }
        }
    }
</script>