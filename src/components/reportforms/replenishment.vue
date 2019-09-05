<template>
    <div class="replenishment">
        <div class="top">
            <div class="left">
                <div class="part search_code">
                    <span class="item">商品条码</span>
                    <div>
                        <Input v-model="code2" placeholder="请输入要搜索的条码" @on-enter="getCode"/>
                        <Button slot="append" icon="ios-search" @click="getCode"></Button>
                    </div>
                </div>
                <div class="part search_code">
                    <span class="item">商品类别</span>
                    <div>
                        <Input v-model="sort" placeholder="请输入要搜索的类别" @on-enter="getSort"/>
                        <Button slot="append" icon="ios-search" @click="getSort"></Button>
                    </div>
                </div>
                <div class="part search_code">
                    <span class="item">出货单号</span>
                    <div>
                        <Input v-model="num" placeholder="请输入要搜索的出货单号" @on-enter="getNum"/>
                        <Button slot="append" icon="ios-search" @click="getNum"></Button>
                    </div>
                </div>
                <div class="part">
                    <span class="item">日期</span>
                    <DatePicker type="datetimerange" :options="options4" v-model="dateRange" format="yyyy-MM-dd" style="width:200px" placeholder="请选择日期" @on-change="getDateRange"></DatePicker>
                </div>
            </div>
            <div class="right">
                <Button class="go_search" @click="getReplenishment">出货明细查询</Button>
            </div>
        </div>
         <!-- 内容区 -->
        <div class="table">
            <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
        <div class="footer" >
            <!-- 分页 -->
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 加载进度 -->
        <div class="demo-spin-col" v-if="spinShow">
            <Spin fix>
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div style="font-size:16px;color:#1d8c9f;">数据正在加载中,请稍等...</div>
            </Spin>
        </div>
    </div>
</template>


<script>

export default {
    data() {
        return {
            // 出货单号
            num: '',
            // 商品条码
            code2: '',
            // 类别搜索
            sort: '',
            // 对时间进行限制,选择不到大于今天的时间
            options4: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            // 得到时间范围
            dateRange: [],
            // 转化后的时间格式
            timelist: [],
            // 内容数据
            tableData: [],
            // 表格高度
            tableHeight: 900,
            // 是否显示加载进度条
            spinShow: false,
            columns: [
                {
                    title: '商品条码',
                    key: 'CODE2'
                },
                {
                    title: '商品名称',
                    key: 'NAME'
                },
                {
                    title: '出货单号',
                    key: 'NUM'
                },
                {
                    title: '采购价',
                    key: 'PRICE'
                },
                {
                    title: '数量',
                    key: 'QTYSTR'
                },
                {
                    title: '总价',
                    key: 'TOTAL'
                },
            ],
            // 当前页码
            currentPage: 1,
            // 页面总数
            total: 0,
            // 每页条数
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



    methods:{
        /**
         * 输入商品条码
         */
        getCode() {
            this.currentPage = 1;
            this.getReplenishment();
        },
        /**
         * 输入出货单号
         */
        getNum() {
            this.currentPage = 1;
            this.getReplenishment();
        },
        /**
         * 输入商品类别
         */
        getSort() {
            this.currentPage = 1;
            this.getReplenishment();
        },
        /**
         * 得到出货明细
         */
        getReplenishment() {
            this.spinShow = true;
            if (this.dateRange[0] == '') {
                this.timelist = [];
            }
            this.$resetAjax({
                type: 'POST',
                url: '/NewA/Statement/stkout',
                data: {
                    // 出货单号
                    num: this.num,
                    // 时间区间
                    timelist: this.timelist,
                    // 类别数字
                    sort: this.sort,
                    // 条码
                    code2: this.code2,
                    // 分类
                    p: this.currentPage,
                },
                success: (res) => {
                    this.spinShow = false;
                    this.tableData = res.data.data;
                    this.total = Number(res.data.count);
                }
            }) 
        },
        /**
         * 得到时间范围
         */
        getDateRange(date) {
            this.currentPage = 1;
            if (date[0].length !== 0) {
                this.dateRange = date;
                let a = this.dateRange[0].replace('-', '');
                this.timelist[0]= a.replace('-', '')
                let b = this.dateRange[1].replace('-', '');
                this.timelist[1]= b.replace('-', '');
            } else {
                this.timelist = [];
            }
            this.spinShow = true;
            this.getReplenishment();
        },
        /**
         * 切换页面
         */
        changePage(index) {
            this.currentPage = index;
            this.spinShow = true;
            this.getReplenishment();
        },
    }
}
</script>



