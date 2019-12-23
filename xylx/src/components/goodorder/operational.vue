<template>
    <div class="operation">
        <div class="top">
            <p>取消订单尾数操作记录如下表格</p>
            <Button class="go_back" @click="$router.push({path: 'goodorder'})">返回订单尾数列表</Button>
        </div>
        <div class="table">
            <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
         <!-- 分页 -->
        <div class="footer">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 表格高度
            tableHeight: 1500,
            // 内容数据
            tableData: [],
            // 表头数据
            columns: [
                {
                    title: '订单号',
                    key: 'order_number',
                },
                {
                    title: '商品条码',
                    key: 'item_no'
                },
                {
                    title: '单号',
                    key: 'cancel_number'
                },
                {
                    title: '尾数',
                    key: 'weishu',
                },
                {
                    title: '取消理由',
                    key: 'reason',
                },
                {
                    title: '取消时间',
                    key: 'oper_date',
                },
                {
                    title: '操作人',
                    key: 'oper_user',
                },
            ],
            // 当前页码
            currentPage: 1,
            // 页面总数
            total: 0,
            // 页面条数
            pageSize: 20,
        }
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

    created() {
        // 得到操作记录
        this.getOperational();
    },

    methods: {
        /**
         * 得到操作记录
         */ 
        getOperational() {
             this.$resetAjax({
                type: 'GET',
                url: '/NewA/CancelOrder/get_cancel_list',
                data: {
                    p: this.currentPage,
                },
                success: (res) => {
                    this.tableData = res.data.list;
                    this.total = Number(res.data.count);
                }
            }) 
        },
        /**
         * 分页显示
         */
        changePage(index) {
            this.currentPage = index;
            this.getOperational();
        }
    },
}
</script>
