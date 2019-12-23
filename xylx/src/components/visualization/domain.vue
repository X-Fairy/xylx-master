<template>
    <div class="doamin">
        <div class="top">
            <div class="item">
                <p>店名/编码: </p>
                <Input v-model="keyword" placeholder="请输入店名或店编码..." style="width:180px;" />
                <span><Icon type="ios-search-strong"></Icon></span>
            </div>
        </div>
        <div class="table">
            <p>新增</p>
            <Table :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            currentPage: '1',         // 当前页码
            keyword: '',             // 关键字查询
            tableData: [],           // 表格列表数据
            tableHeight: 900,        // 表格高度
            columns: [               // 表头
                 {
                    align: 'center',
                    key: 'store_name',
                    title: '店名'
                },
                {
                    align: 'center',
                    key: 'store_code',
                    title: '编码'
                },
                {
                    align: 'center',
                    key: 'manager',
                    title: '店长'
                },
                {
                    align: 'center',
                    key: 'department',
                    title: '部门'
                },
                {
                    align: 'center',
                    key: 'status',
                    title: '状态'
                },
                {
                    align: 'center',
                    key: 'area',
                    title: '面积'
                },
                {
                    align: 'center',
                    key: 'rent',
                    title: '租金'
                },
                {
                    align: 'center',
                    key: 'clerk',
                    title: '人数'
                },
                
                {
                    align: 'center',
                    key: 'district',
                    title: '区域'
                },
                {
                    align: 'center',
                    key: 'longitude',     
                    title: '经度'
                },
                {
                    align: 'center',
                    key: 'latitude',
                    title: '纬度'
                },
            ],     
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
        // 得到所有直营门店数据
        this.getShopList();
    },

    methods: {
        /**
         * 得到所有直营门店数据
         */
        getShopList() {
            let p = this.$md5(this.currentPage),
                token = this.keyword === '' ? this.$md5(p) : this.$md5(p + (this.$md5(keyword)));
            this.$resetAjax({
                url:'/NewA/Storelist/get_list',
                type:'GET',
                data:{
                    p: this.currentPage,
                    token,
                },
                success:(res)=>{
                    let result = JSON.parse(res);
                    this.tableData = result.list;
                }
            })
        }
    }
}
</script>
