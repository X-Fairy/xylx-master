<template>
    <div class="sales">
        <div class="top">
            <div class="top_inner">
                <div class="inner_left">
                    {{helloDate}} 
                </div>
                <div class="inner_right">
                    <DatePicker class="date" :value="dateValue" :options="options4" type="daterange" @on-change="getDateRange" confirm placement="bottom-end" placeholder="时间区间" style="width: 180px"></DatePicker>
                    <p class="area"><Input v-model="store" placeholder="请输入门店编码..." style="width: 180px" /></p>
                    <p><Input v-model="keyword" placeholder="请输入查询关键词..." style="width: 180px" /></p>
                    <p class="check" @click="judgeFull"><img src="@/assets/images/view/search_icon.jpg" alt=""><span>查询</span></p>
                </div>
            </div>
        </div>
        <div class="divide-wrap" style="position: relative;height: 1px;z-index: 1;">
            <div class="colorbar-before"></div>
            <div class="colorbar-after"></div>
            <div class="colorbar"></div>
        </div>
        <div class="sales_contanier" v-if="isShow">
            <div class="contanier_inner">
                <Echart style="width:49%;height:100%" :options="salesOptions" :autoresize="true" /> 
                <div class="table">
                    <Table :columns="tableColumns" :data="tableData" :height="tableHeight"></Table>
                    <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
                </div>
            </div>
        </div>
        <!-- 提示框 -->
        <div class="tip" v-show="isShowTip">
            {{tipContent}}
        </div>
    </div>
</template>

<script>
import {getUrlParams} from  '@/assets/js/tool.js'                              // 得到网址参数

export default {
    data() {
        return {
            options4: {                                                        // 时间选择限制
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            isShow: true,                                                      // 是否显示销售图表
            isShowTip: false,                                                  // 是否显示提示框
            tipContent: '',                                                    // 提示语
            dateValue: [],                                                     // 选择时间范围
            websiteObj: {},                                                    // 网址参数
            helloWord: '',                                                     // 问候语
            stime: '',                                                         // 开始日期
            etime: '',                                                         // 结束日期
            store: '',                                                         // 门店编码
            keyword: '',                                                       // 查询关键词
            salesOptions: {                                                    // 销售额配置
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                calculable : true,
                legend: {
                data:['销售额'],
                textStyle:{//图例文字的样式
                    color:'#fff',
                    fontSize: 22,
                },
                    x:"center",
                    y:"top",
                },
                toolbox: {
                    show : true,
                    feature : {
                        dataView : {show: true, readOnly: false},
                        magicType : {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                grid: {
                    left: 80,
                    top:80,
                    bottom:120,
                    right: 50,
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data : [],
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#87a0dc',  //更改坐标轴文字颜色
                                fontSize: 10    //更改坐标轴文字大小
                            },
                            interval: 0,
                            rotate:30,   
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#6076ad' //更改坐标轴颜色
                            },
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        splitLine: {
                            lineStyle: {
                                // 使用深浅的间隔色
                                color: ['#1a2a42']
                            }
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                            color: '#87a0dc',  //更改坐标轴文字颜色
                            fontSize : 12,      //更改坐标轴文字大小
                            }
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#fff' //更改坐标轴颜色
                            }
                        }
                    }
                ],
                series : [
                    {
                        name:'销售额',
                        type:'line',
                        stack: '总量',
                        symbolSize:8,   //拐点圆的大小
                        color:['#efda4d'],  //折线条的颜色
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                color: '#d4237a'
                            }
                        },
                        //折线平滑
                        smooth : true,
                        symbol : 'circle',
                        symbolSize : 6,
                        //线条样式
                        lineStyle : {
                            color : {
                                type : 'linear',
                                x : 0,
                                y : 0,
                                x2 : 0,
                                y2 : 1,
                                colorStops : [ {
                                    offset : 0,
                                    // 0% 处的颜色
                                    color : '#fff'
                                }, {
                                    offset : 1,
                                    // 100% 处的颜色
                                    color : '#efda4d'
                                } ],
                                globalCoord : false
                            },
                            width : 2,
                            type : 'solid',
                        },
                        //折线连接点样式
                        itemStyle : {
                            color : '#249cf9',
                        },
                        //折线堆积区域样式
                        areaStyle : {
                            color : '#004c5E'
                        },
                        data: [],
                    }
                ]
            },
            currentPage: 1,                                                    // 当前页码
            tableColumns: [                                                    // 商品列表表头
                {
                    title: '商品编码',
                    align: 'center',
                    key: 'item_no'
                },
                {
                    title: '商品名称',
                    align: 'center',
                    key: 'item_name'
                },
                {
                    title: '商品名称',
                    align: 'center',
                    key: 'item_name'
                },
            ],  
            tableData: [],                                                     // 商品列表数据
            total: 0,                                                          // 页面总娄  
            pageSize: 20,                                                      // 每页条数
            tableHeight: 900,                                                  // 表格高度
            currentPage: 1,                                                    // 当前页码
        }
    },
    created() {
        // 得到时间问候语
        this.getHello();
        // 得到网址参数
        this.getUrlParams();

        
    },
    // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 278);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 278);
        })
    },
    watch: {
        store(newVal,val) {
            if(!newVal) {
                this.isShow = false;
                this.isShowTip = true;
                this.tipContent = '预警，请输入门店编码！'
                setTimeout(() => {
                    this.isShowTip = false;
                }, 1500);
            }
        },
        stime(newVal, val) {
            if(!newVal) {
                this.isShow = false;
                this.isShowTip = true;
                this.tipContent = '预警，请选择时间区间！'
                setTimeout(() => {
                    this.isShowTip = false;
                }, 1500);
            }
        },
        etime(newVal, val) {
            if(!newVal) {
                this.isShow = false;
                this.isShowTip = true;
                this.tipContent = '预警，请选择时间区间！'
                setTimeout(() => {
                    this.isShowTip = false;
                }, 1500);
            }
        },
    },
    methods: {
        /**
         * 得到网址参数
         */
        getUrlParams() {
            this.websiteObj = getUrlParams();
            this.stime = this.websiteObj.stime;
            this.etime = this.websiteObj.etime;
            this.dateValue = [this.stime, this.etime];
            this.store = this.websiteObj.store;
            // 去请求当前销售额图表
            this.getStoreData();
            // 得到商品销售列表
            this.getGoodsList();
        },
        /**
         * 得到时间问候语
         */
        getHello() {
            var now = new Date();
            var hour = now.getHours(); 
            if(hour < 6){
                this.helloDate = "凌晨好～";
            }  else if (hour < 9){
                this.helloDate = "早上好～";
            }  else if (hour < 12){
                this.helloDate = "上午好～";
            }  else if (hour < 14){
                this.helloDate = "中午好～";
            }  else if (hour < 17){
                this.helloDate = "下午好～";
            } else if (hour < 19){
                this.helloDate = "傍晚好～";
            }  else if (hour < 22){
                this.helloDate = "晚上好～";
            } else {
                this.helloDate = "夜里好～";
            } 
        },
        /**
         * 时间选择
         */
        getDateRange(date) {
            this.stime = date[0];
            this.etime = date[1];
        },
        /**
         *  对查询前进行门店编码进行判断
         */
        judgeFull() {
            if(this.store && this.stime && this.etime) {
                this.getStoreData();
                this.getGoodsList();
            } else if(this.store === '') {
                this.isShow = false;
                this.isShowTip = true;
                this.tipContent = '预警，请输入门店编码！'
                setTimeout(() => {
                    this.isShowTip = false;
                }, 1500);
            }
            if(this.stime.length === 0 || this.etime.length === 0) {
                this.isShow = false;
                this.isShowTip = true;
                this.tipContent = '预警，请选择时间区间！'
                setTimeout(() => {
                    this.isShowTip = false;
                }, 1500);
            }
        },
        /**
         * 得到门店指标数据
         */
        getStoreData() {
            this.$resetAjax({
                type: 'POST',
                url: '/public/index.php?s=home/index/get_sale_date',
                // root: '',
                root: 'http://bi.xmvogue.com/',
                data: {
                    stime: this.stime,
                    etime: this.etime,
                    store: this.store,
                },
                success:(res) => {
                    this.isShow = true;
                    let result = JSON.parse(res);
                    if(result.length === 0) {
                        this.isShowTip = true;
                        this.isShow = false;
                        this.tipContent = '预警，暂无相关数据！'
                        setTimeout(() => {
                            this.isShowTip = false;
                        }, 1500);
                    } else {
                        this.salesOptions.xAxis[0].data = result.map(ele => ele.fildate);
                        this.salesOptions.series[0].data = result.map(ele => ele.realamt)
                    }
                }
            })
        },
        /**
         * 得到商品销售列表
         */
        getGoodsList() {
            this.$resetAjax({
                type: 'POST',
                url: '/public/index.php?s=home/index/get_goods_list',
                // root: '',
                root: 'http://bi.xmvogue.com/',
                data: {
                    stime: this.stime,
                    etime: this.etime,
                    store: this.store,
                    p: this.currentPage,
                    goods: this.keyword,
                },
                success:(res) => {
                    this.isShow = true;
                    let result = JSON.parse(res);
                    if(result.list.length === 0) {
                        this.isShowTip = true;
                        this.isShow = false;
                        this.tipContent = '预警，暂无相关数据！'
                        setTimeout(() => {
                            this.isShowTip = false;
                        }, 1500);
                    } else {
                        this.tableData = result.list;
                        this.total = Number(result.page);
                    }
                }
            })
        },
        /**
         *  切换页面
         */
        changePage(index) {
            this.currentPage = index;
            this.getGoodsList();
        },
    }
}
</script>
