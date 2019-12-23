<template>
    <div class="storeData">
        <div class="titles">
            <h2>门店销售数据统计表</h2>
        </div>
        <div class="search">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="日期" prop="date">
                    <DatePicker type="daterange" @on-change="changeTime" :options="options" v-model="formValidate.date" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem class="check">
                    <Button type="ghost" @click="judgeFull(formValidate)">查询</Button>
                </FormItem>
            </Form>
        </div>
        <div class="content" v-if="spinShow==false">
            <div class="left">
                <ul class="left-content">
                    <li style="padding: 10px; box-sizing: border-box;">
                        <div class="left_zero">
                            <ul>
                                <li v-for="(item, index) in pieceData" :key="index">
                                    <p><img :src="require('@/assets/images/view/' + item.imgUrl)" /></p>
                                    <div class="info">
                                        <h2 class="item_title">{{item.title}}</h2>
                                        <p class="shine"></p>
                                        <span :style="{color: item.color}" @click="getReturnList(item)">{{item.num}}</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </li>
                    <li class="one">
                        <p class="part" style="top: 15px;margin-left: -45px;">大宗交易占比</p>
                        <div class="transaction" style="width: 100%;height: 100%;">
                            <p v-if="big_order === ''" class="hasno">大宗交易暂无数据 ...</p>
                            <!-- 大宗交易占比 -->
                            <Echart v-else style="width:100%;height:100%" :options="transactionOptions" :autoResize="true"/> 
                        </div>
                    </li>
                    <li class="two">
                        <p class="part" style="top: 15px;margin-left: -40px;">滞销Top10</p>
                    </li>
                </ul>
            </div>
             <div class="center">
                <div class="total" @click="lookSalesRank" style="cursor: pointer;">
                    <div>
                        <p style="color: #9bdef0;font-size: 16px;">总销售额</p>
                        <h2 style="color: #00f1ff;margin-top: 10px;">{{sale}}</h2>
                    </div>
                </div>
                <div class="echart-one">
                    <p style="margin-left: -35px;" class="part">畅销Top10</p>
                    <span class="more_icon" @click="searchGoodsList"><img src="@/assets/images/view/more_icon.png" alt=""></span>
                    <p v-if="bestSellerSlides.length === 0" class="hasno">畅销 TOP10 暂无数据 ...</p>
                    <div v-else class="best_seller"  @mouseenter="bestSellerSwiperEnter" @mouseleave="bestSellerSwiperLeave"   >
                        <swiper class="bestSeller-swiper" ref="bestSellerSwiper" :options="bestSellerOption" @slideChange="bestSlideChange">
                            <swiper-slide v-for="(item, index) in bestSellerSlides" :key="index">
                                <div  class="select_list">
                                    <Select v-model="bestSwiperActiveIndex" style="width:100px" @on-change="changBestName">
                                        <Option v-for="(item,index) in bestSellerNames" :value="item.value" :key="index">{{ item.text }}</Option>
                                    </Select>
                                </div>
                                <div style="width:100%;height:90%;" @click="bestSellerClick">
                                    <Echart style="width:100%;height:100%" :options="item.options" :autoResize="true" /> 
                                </div>
                            </swiper-slide>
                        </swiper>
                    </div>
                </div>
                <div class="echart-one">
                    <p class="part">库存Top10</p>
                    <span class="more_icon" @click="getStockList"><img src="@/assets/images/view/more_icon.png" alt=""></span>
                    <Spin size="large" v-if="isShowStock">加载中...</Spin>
                    <div class="stock" @mouseenter="stockSwiperEnter" @mouseleave="stockSwiperLeave" >
                        <swiper :options="stockOption" class="stock-swiper" ref="stockSwiper" @slideChange="stockSlideChange">
                            <swiper-slide v-for="(item, index) in stockSlides" :key="index">
                                <div class="select_list">
                                    <Select v-model="stockSwiperActiveIndex" style="width:100px" @on-change="changStockName">
                                        <Option v-for="(item,index) in stockNames" :value="item.value" :key="index">{{ item.text }}</Option>
                                    </Select>
                                </div>
                                <div style="width:100%;height:95%;">
                                    <Echart style="width:100%;height:100%" :options="item.options" :autoResize="true" /> 
                                </div>
                            </swiper-slide>
                        </swiper>
                    </div>
                </div>
            </div>
            <div class="right">
                <ul class="right-content">
                    <li>
                        <p class="part">品类结构</p>
                        <div class="category">
                            <p v-if="clsList.length === 0" class="hasno">品类结构大类占比暂无数据 ...</p>
                            <Echart  v-else style="width:100%;height:100%" :options="categoryOptions" :autoResize="true"  @click="subgroupClick"/> 
                        </div>
                    </li>
                    <li>
                        <p class="part" style="margin-left: -60px;">商品价位段占比</p>
                        <div class="priceRatio">
                            <p v-if="priceList.length === 0" class="hasno">商品价位段占比暂无数据 ...</p>
                            <Echart v-else style="width:100%;height:100%" :options="priceRatioOptions" :autoResize="true" /> 
                        </div>
                    </li>
                    
                </ul>
            </div>
        </div>
        <!-- 最外部加载提示 -->
        <div class="demo-spin-col" span="8" v-if="spinShow">
            <Spin fix>
                <Icon type="load-c" size=120 class="demo-spin-icon-load"></Icon>
                <div style="font-size:22px;">Loading...</div>
            </Spin>
        </div>
        <!-- 提示框 -->
        <!-- <div class="tip" v-show="isShowTip">
            {{tipContent}}
        </div> -->
        <!-- 弹窗 -->
        <div class="more_detail" v-if="isShowMore" @click="closeSalePop">
            <div class="loading_pop" v-show="isLoadingPop">
                <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571638198436&di=6668ed954daacea3eee32bb340980b0f&imgtype=0&src=http%3A%2F%2Fimg.ui.cn%2Fdata%2Ffile%2F4%2F2%2F3%2F1814324.gif" alt="">
            </div>
            <!-- 品类结构中类和小类弹窗 -->
            <div class="popType" v-if="isShowTypePop" :style="popDistance">
                <div class="pop_left" :style="leftStyle">
                    <h3 class="pop_top">
                        <p>品类结构中类占比</p>
                        <img @click="isShowTypePop=false;isShowMore=false;" src="@/assets/images/view/pop_close.png" class="close_icon" alt="">
                    </h3>
                    <p class="pop_title" :style="{color:middleTitleColor}">{{middleTitle}}</p>
                    <Echart style="width:100%;height:90%" :options="middleOptions" :autoResize="true" @click="subgroupClick" /> 
                </div>
                <div class="pop_right" v-if="isShowPopTwo">
                    <h3 @click="isShowPopTwo=false;"> 
                        <p>品类结构小类占比</p>
                        <img src="@/assets/images/view/pop_close.png" class="close_icon" alt="">
                    </h3>
                    <p class="pop_title" :style="{color:subgroupTitleColor}">{{subgroupTitle}}</p>
                    <Echart style="width:100%;height:90%" :options="subgroupOptions" :autoResize="true" /> 
                </div>
            </div>
            <!-- 总销售额的走势弹窗 -->
            <div class="total_trend" v-if="isTotalTrend">
                <h3 class="pop_top">
                    <p>总销售额走势</p>
                    <img @click="isShowMore=false;isTotalTrend=false;" src="@/assets/images/view/pop_close.png" class="close_icon" alt="">
                </h3>
                <div class="saleTrend">
                    <Echart style="width:100%;height:100%" :options="salesTrendOptions" :autoResize="true" v-if="isShowSales"/> 
                    <Echart style="width:100%;height:100%" :options="goodsTrendOptions" :autoResize="true" v-else /> 
                </div>
            </div>
             <!-- 商品销售详情弹窗 -->
            <div class="goods_detail" v-if="isShowGoods">
                <h3 class="pop_top">
                    <p>商品销售列表</p>
                    <img @click="isShowMore=false;isShowGoods=false;keyword='';currentPage=1;" src="@/assets/images/view/pop_close.png" class="close_icon" alt="">
                </h3>
                <div class="saleTrend">
                    <div class="list_top">
                        <Input v-model="keyword" placeholder="请输入查询关键词..." style="width: 180px" />
                        <span class="checkKey" @click="inputKeyword"><Icon type="ios-search" size="18"></Icon></span>
                    </div>
                    <Table :columns="tableColumns" :data="tableData" :height="tableHeight"></Table>
                    <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
                </div>
            </div>
            <!-- 商品库存列表弹窗 -->
            <div class="stock_list" v-show="isStockList">
                <div>
                    <h3 class="pop_top">
                        <p>商品库存列表</p>
                        <img @click="isShowMore=false;isStockList=false;minqty=1;stockKeyword='';stockSelect='01';kucuncurrentPage=1" src="@/assets/images/view/pop_close.png" class="close_icon" alt="">
                    </h3>
                    <div class="saleTrend">
                        <div class="list_top">
                            <div class="item">
                                <span class="title">名称或编码</span>
                                <Input v-model="stockKeyword" style="width: 180px" />
                            </div>
                            <div class="item">
                                <span class="title">最小库存</span>
                                <InputNumber :min="1" v-model="minqty" placeholder="请输入最小库存..." style="width: 180px"></InputNumber>
                            </div>
                            <div class="item">
                                <span class="title">类别</span>
                                <Select v-model="stockSelect" style="width:200px" class="select_list">
                                    <Option v-for="item in typeList" :value="item.cls" :key="item.cls" placeholder="请选择商品类别...">{{ item.name }}</Option>
                                </Select>
                            </div>
                            <span class="checkKey" @click="getStockList">查询</span>
                        </div>
                        <Table :columns="stockColumns" :data="stockPopData" :height="stockHeight"></Table>
                        <Page :total="kucuntotal" :page-size="pageSize" @on-change="kucunchangePage" :current="kucuncurrentPage" show-elevator show-total></Page>
                    </div>
                </div>
            </div>
            <!-- 退货率弹窗 -->
            <!-- <div class="return_list" v-if="isReturnList">
                <h3 class="pop_top">
                    <p>商品退货列表</p>
                    <img @click="isShowMore=false;isReturnList=false;" src="@/assets/images/view/pop_close.png" class="close_icon" alt="">
                </h3>
                <div class="return_table">
                    <Table :columns="returnColumns" :data="returnData" :height="returnHeight"></Table>
                </div>
            </div> -->
        </div>
    </div>
</template>
<script>
import 
{
    bestOptions, 
    centerOptions,                                               // 销售排名
    transactionOptions,                                          // 大宗交易占比
    stockOptions,                                                // 库存
    movableOptions,                                              // 动销率
    jointOptions,                                                // 连带率
    categoryOptions,                                             // 品类结构大类占比
    middleOptions,                                               // 品类结构中类占比
    subgroupOptions,                                             // 品类结构小类占比
    priceRatioOptions,                                           // 价位段占比  
    salesTrendOptions,                                           // 总销售额走势
    goodsTrendOptions,                                           // 畅销TOP 10单个商品销售额走势和总销售额走势

} from './chart-config'; 
import {getNowFormatDate} from  '@/assets/js/tool.js'             // 获取 当前日期 年  月  日
import {GetPercent} from  '@/assets/js/tool.js'                   // 获取一个数的占总数的百分比
import {datedifference} from  '@/assets/js/tool.js'               // 选择的时间一共多少天 
import {changeday} from  '@/assets/js/tool.js'                    // 转化时间为2019-10-09这样的格式  
import {sortData} from  '@/assets/js/tool.js'

import 'swiper/dist/css/swiper.css'                               // 引入轮播样式
import { swiper, swiperSlide } from 'vue-awesome-swiper'          // 引入轮播
import "@/assets/style/animate.less";                             // 引入动画样式
import '@/assets/js/tool';

let isFrist = true;
    export default{
        data(){
            return{
                // categories:[
                //     {value:'01',name:'家居百货'},
                //     {value:'02',name:'健康美容'},
                //     {value:'03',name:'饰品系列'},
                //     {value:'04',name:'文体礼品'},
                //     {value:'05',name:'季节产品'},
                //     {value:'06',name:'精品包饰'},
                //     {value:'07',name:'儿童玩具'},
                //     {value:'08',name:'毛绒公仔'},
                //     {value:'09',name:'数码配件'},
                //     {value:'01',name:'休闲'}
                // ],
                // 时间区间
                dayList:[],
                formValidate:{
                    date:[],
                    beginTime: new Date(new Date().format('yyyy-MM') + '-01'),
                    endTime: new Date(new Date().getTime()),
                    
                },
                stime: '',                                           // 开始日期
                etime: '',                                           // 结束日期
                // 表单认证
                ruleValidate:{
                    beginTime: [
                        { required: true, message: '起始时间不能为空。', trigger: 'blur', pattern: /.+/ }
                    ],
                    endTime: [
                        { required: true, message: '结束时间不能为空。', trigger: 'blur', pattern: /.+/ }
                    ],
                    date:[
                        {
                            type: 'array', 
                            required: true, 
                            fields: {
                                0: {required: true, message: '时间不能为空', trigger: 'change', pattern: /.+/},
                                1: {required: true, message: '时间不能为空', trigger: 'change', pattern: /.+/},
                            } 
                        },
                    ],
                   
                },
                // 时间限制
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now() - 86400000;
                    }
                },
                // 是否显示提示框
                isShowTip: false,
                // 提示语
                tipContent: '',
                // 数据加载提示
                spinShow: true,
                // 总销售额
                sale:'',
                bestId: '',                                          // 选中哪个商品id
                stockId:'',
                isShowStock: true,                                    // 是否显示库存加载中提示
                bestSellerSlides: [],                                // 各个分类销售top 10 轮播数据
                bestSellerNames: [],                                // 畅销TOP 10类名数据
                value1:0,
                bestSwiperActiveIndex: 1,                             // 畅销TOP 10轮播默认第一个slide
                stockSwiperActiveIndex: 0,                            // 库存TOP 10轮播默认第一个slide
                bestSellerOption: {                                  // 销售top 10
                    loop: true,
                    autoplay:true,                                   // 设置为true启动自动切换
                    speed: 2800,                                     // 切换速度，即slider自动滑动开始到结束的时间（单位ms）
                    grabCursor : true,                               // 设置为true时，鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状。
                    effect : 'cube',
                    cubeEffect: {
                        slideShadows: false,                         // 关闭slide阴影
                        shadow: false,
                    },
                    mousewheel: true,
                },
                categoryOptions: {},                                 // 品类结构大类占比
                priceRatioOptions: {},                               // 价位段占比
                pieceData: [],                                       // 有关客单价、件单价、退货率、复购率的数据
                    stockOption: {                                       // 库存TOP 10
                    loop: true,
                    autoplay:true,                                   // 设置为true启动自动切换
                    speed: 2800,                                     // 切换速度，即slider自动滑动开始到结束的时间（单位ms）
                    grabCursor : true,                               // 设置为true时，鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状。
                    effect : 'coverflow',
                    mousewheel: true,
                },
                stockSlides: [],                                     // 库存TOP 10 轮播数据
                stockOptions: {},                                    // 库存
                stockData: [],                                       // 库存数据
                stockNames: [],                                      // 库存TOP 10类名数据
                transactionOptions: {},                              // 大宗交易占比
                big_order: '',                                       // 大宗交易占比数据
                isShowMore: false,                                   // 是否显示销售额走势弹窗
                salesTrendOptions: {},                               // 总销售额走势
                goodsTrendOptions,                                   // 畅销TOP 10单个商品销售额走势和总销售额走势
                isShowSales: true,                                   // 是否显示总销售额走势
                isShowkucun:false,                                    //是否显示库存走势
                isTotalTrend: false,                                 // 是否显示总销售额走势
                isShowGoods: false,                                  // 是否显示商品销售详情弹窗
                isReturnList: false,                                 // 是否显示退货率详情
                isStockList: false,                                  // 是否显示商品库存列表弹窗
                isLoadingPop: false,                                 // 是否显示商品库存列表弹窗加载提示中
                currentPage: 1,                                      // 商品销售当前页码
                tableColumns: [                                      // 商品销售列表表头(弹窗)
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
                        title: '销售额',
                        align: 'center',
                        key: 'realamt'
                    },
                ],  
                stockKeyword: '',                                    // 商品库存列表关键词(弹窗)
                minqty: 1,                                           // 最小库存
                stockSelect: '01',                                     // 商品大类别
                stockColumns: [                                      // 商品库存列表表头(弹窗)
                    {
                        title: '名称',
                        align: 'center',
                        key: 'NAME'
                    },
                    {
                        title: '编码',
                        align: 'center',
                        key: 'ITEM_NO'
                    },
                    {
                        title: '库存',
                        align: 'center',
                        key: 'QTY'
                    },
                    {
                        title: '单价',
                        align: 'center',
                        key: 'RTLPRC'
                    },
                    {
                        title: '总价',
                        align: 'center',
                        key: 'TOTALPRC'
                    },
                ],
                stockPopData: [],                                    // 商品库存列表数据(弹窗)
                tableData: [],                                       // 商品销售商品列表数据
                total: 0,                                            // 商品销售页面总娄 
                kucuntotal: 0,                                            // 商品库存销售页面总娄 
                pageSize: 20,                                        // 商品销售每页条数
                tableHeight: 300,                                    // 商品销售表格高度
                stockHeight: 300,                                    // 商品库存表格高度
                returnHeight: 300,                                   // 商品退货率表格高度
                keyword: '',                                         // 商品销售列表查询关键字
                kucuncurrentPage: 1,                                 // 商品库存销售当前页码
                priceList: [],                                       // 价位段占比数据
                result:[],
                isShowTypePop: false,                                // 是否显示品类弹窗
                seriesName: '',                                      // 当前点击的品类结构是哪个名称
                categoryOptions: {},                                 // 品类结构大类占比
                middleOptions: {},                                   // 品类结构中类占比
                subgroupOptions: {},                                 // 品类结构小类占比
                clsList: [],                                         // 品类结构大类占比数据
                middleList: [],                                      // 品类结构中类占比数据
                middleTitle: '',                                     // 品类结构中类占比商品标题名称
                middleTitleColor: '',                                // 品类结构中类占比商品标题名称对应的颜色
                subgroupList: [],                                    // 品类结构小类占比数据
                subgroupTitle: '',                                   // 品类结构小类占比商品标题名称
                subgroupTitleColor: '',                              // 品类结构小类占比商品标题名称对应的颜色
                clsId: '',                                           // 品类结构id
                popDistance: {                                       // 弹窗样式
                    width: '500px',
                    'justify-content': 'center',
                },
                leftStyle: {                                         // 品类结构中类样式
                    width: '100%',
                },
                isShowPopTwo: false,                                 // 是否显示品类结构小类占比
                typeList: [
                    {
                        cls: '00',
                        name: '全部'
                    },
                    {
                        cls: '01',
                        name: '家居百货'
                    },
                    {
                        cls: '02',
                        name: '健康美容'
                    },
                    {
                        cls: '03',
                        name: '饰品系列'
                    },
                    {
                        cls: '04',
                        name: '文体礼品'
                    },
                    {
                        cls: '05',
                        name: '季节产品'
                    },
                    {
                        cls: '06',
                        name: '精品包饰'
                    },
                    {
                        cls: '07',
                        name: '儿童玩具'
                    },
                    {
                        cls: '08',
                        name: '毛绒公仔'
                    },
                    {
                        cls: '09',
                        name: '数码配件'
                    },
                    {
                        cls: '10',
                        name: '休闲食品'
                    },
                ],
            }
        },
        mounted() {
            setTimeout(()=> {
                // 得到浏览器内容高度
                let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight- 160);
            },100)
            // 调整浏览器的时候
            $(window).on('resize', () => {
                let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight - 160);
            })
        },
        created(){
            // 获取当前默认选择时间及时间参数
            this.getDefaultDate();
            this.getStoreData();
            this.getKucunStart();
        },
        watch: {
            isShowPopTwo(newVal, val) {
                if(newVal) {
                    this.popDistance = {
                        width: '900px',
                        'justify-content': 'space-between',
                    };
                    this.leftStyle = {
                        width: '47%',
                    };
                } else {
                    this.popDistance = {
                        width: '500px',
                        'justify-content': 'center',
                    };
                    this.leftStyle = {
                        width: '100%',
                    };
                }
            },
            // 'formValidate.dateValue'(newVal, val) {
            //     newVal.forEach(ele => {
            //         if(ele === '') {
            //             this.isShow = false;
            //         }
            //     })
            // },
            isShowMore(newVal, val) {
            }
        },
        methods:{
            /**
             * 时间选择判断
            */
            changeTime(date) {
                let startStr = date[0].slice(0,7);
                let endStr = date[1].slice(0,7);
                if(startStr !== endStr) {
                    this.isShowTip  = true;
                    this.tipContent = '预警，不能跨月选择时间';
                    setTimeout(() => {
                        this.isShowTip = false;
                        this.formValidate.date = [];
                    }, 1500);
                    return false;
                }
            },
            /**
            *  获取当前默认选择时间及时间参数
            */
            getDefaultDate() {
                let yesteday = this.formValidate.endTime;
                let startDate = this.formValidate.beginTime;
                this.formValidate.date= [startDate,yesteday];
            },
            /**
             *  根据时间查询
            */
            judgeFull(formValidate) {
                this.spinShow=true;
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        this.getStoreData();
                        this.getKucunStart();
                    } else {}
                })
            },
            // 获取门店数据
            getStoreData(){
                this.stime = changeday(this.formValidate.date[0]);
                this.etime = changeday(this.formValidate.date[1]);
                this.$resetAjax({
                    type: 'POST',
                    url: '/public/index.php?s=home/Manage/data',
                    // root: '',
                    root: 'http://bi.xmvogue.com/',
                    data: {
                        stime: this.stime ,          // 开始时间
                        etime: this.etime,          // 结束时间
                    },
                    success:(res) => {
                        let result=JSON.parse(res);
                        this.spinShow=false;
                        let msg = result.error;
                        switch(msg) {
                            case 1: 
                                this.big_order = '';                                              // 大宗交易占比
                                this.sale = '0';                                              // 总销售
                                this.totalSale = '';                                              // 总销售
                                this.pieceData = [  
                                    {
                                        num:'——' ,
                                        title: '客单价(元)',
                                        imgUrl: 'kdj.png',
                                        color:'#efda4d'
                                    },
                                    {
                                        num: '——',
                                        title: '件单价(元)',
                                        imgUrl: 'jdj.png',
                                        color:'#1ea3e3'
                                    },
                                    {
                                        num: '——',
                                        title: '退货率',
                                        imgUrl: 'th.png',
                                        color:'#22d4a6'
                                    },
                                    {
                                        num: '——' ,
                                        title: '连带率',
                                        imgUrl: 'ldl.png',
                                        color:'#f858ac'
                                    },
                                ];
                                this.clsList =  [];                                              // 品类结构大类占比数据
                                // this.unsalableNames = [];
                                this.bestSellerSlides = [];
                                this.clsList = [];
                                this.priceList = [];
                                break;
                            case 0:
                                this.sale=result.sale;
                                this.clsList = result.cls_list;
                                // this.totalSale = result.sale;
                                // this.goalTransform(this.totalSale);                                // 总销售金额数据处理
                                this.toptenTransform(result.topten);                               // 畅销商品数据处理
                               
                                // this.unsalableTransform(result.unsalable);                         // 滞销商品数据处理
                                this.categoryTransform(this.clsList);                              // 品类结构占比数据处理
                                this.priceTransform(result.price_list);                            // 价位段占比数据处理
                               
                                this.pieceTransform(result);                                       // 有关客单价、件单价、退货率、复购率的数据处理
                                this.jointOptions = jointOptions(result.apr);                      // 连带率
                                this.movable = result.dongxiao;
                                // this.movableOptions = movableOptions(this.movable);                // 动销率
                                this.big_order = result.big_order;
                                this.transactionOptions = transactionOptions(this.big_order);      // 大宗交易占比
                                break;

                        }
                    }
                })
            },
            /**
             * 得到门店前五个商品品类当前库存
            */
            getKucunStart() {
                this.isShowStock = true;
                this.$resetAjax({
                    type: 'POST',
                    url: '/public/index.php?s=home/Manage/kucuns',
                    // async: false,
                    // root: '',
                    root: 'http://bi.xmvogue.com/',
                    success:(res) => {
                        let result = JSON.parse(res);
                        this.stockData = result.kucun;
                        this.$resetAjax({
                            type: 'POST',
                            url: '/public/index.php?s=home/Manage/kucunss',
                            // async: false,
                            // root: '',
                            root: 'http://bi.xmvogue.com/',
                            success:(res) => {
                                this.$nextTick(() => {
                                    this.isShowStock = false;
                                })
                                let result = JSON.parse(res);
                                result.kucun.forEach(ele => {
                                    this.stockData.push(ele)
                                })
                                this.stockTransform(this.stockData);
                            }
                        })
                    }
                })
            },
            /**
             *  各分类销售额畅销商品
             */
            toptenTransform(data) {
                if(data.length !== 0) {
                    this.bestSellerSlides = data;   // 畅销商品
                    this.bestSellerNames = data.map((ele,index) => ({text:ele.name, value: index + 1}));
                    data.forEach(item => {
                        item.options = bestOptions(item.goods);
                        
                    });
                } else{
                    return false;
                }
            },
            /**
             * 库存商品数据处理
            */
            stockTransform(data) {
                if(data.length !== 0) {
                    this.stockSlides = data;
                    this.stockNames = data.map((ele,index) => ({text:ele.name, value: index}))
                    data.forEach(item => {
                        item.options = stockOptions(item.goods);
                    });
                } else{
                    return false;
                }
            },
            /**
             *  对畅销商品进行滑动
            */
            bestSlideChange() {
                var activeIndex = this.bestSellerSwiper().activeIndex,
                    len = this.bestSellerNames.length;
                // 当滑到第一个时，再往前滑动，则要变成最后一个
                if (activeIndex === 0) {
                    activeIndex = len;
                } 
                // 当滑到最后一个时，再往后滑动，则庶变成第一个
                else if (activeIndex > len) {
                    activeIndex = 1;
                }
                this.bestSwiperActiveIndex = activeIndex;     
            },
            /**
             *  对库存商品进行滑动
            */
            stockSlideChange() {
                var activeIndex = this.stockSwiper().activeIndex,
                    len = this.stockNames.length;
                // 当滑到第一个时，再往前滑动，则要变成最后一个
                if (activeIndex === 0) {
                    activeIndex = len;
                } 
                // 当滑到最后一个时，再往后滑动，则庶变成第一个
                else if (activeIndex > len) {
                    activeIndex = 1;
                }
                this.stockSwiperActiveIndex = activeIndex;     
            },
            /**
             * 点击畅销商品查看走商品走势图
            */
            bestSellerClick() {
                this.isLoadingPop = true;
                let str = event.path[2].textContent;
                let strname = str.split(':');
                this.bestSellerSlides.forEach((ele,index) => {
                    ele.goods.forEach((item,index) => {
                        if(item.item_name === strname[0]) {
                            this.bestId = item.item_no;
                        }
                    })
                });
                this.getGoodsTrend(); // 得到畅销单个商品和总销售的之间的折线图
            },
            
            /**
             * 得到畅销单个商品和总销售的之间的折线图
            */
            getGoodsTrend(){
                this.isShowMore = true;
                this.isTotalTrend = true;
                this.isShowSales = false;
                this.isShowkucun=false;
                this.$resetAjax({
                    type: 'POST',
                    url: '/public/index.php?s=home/Manage/goods_sale_trend',
                    // root: '',
                    root: 'http://bi.xmvogue.com/',
                    data: {
                        stime: this.stime,
                        etime: this.etime,
                        goods: this.bestId,
                    },
                    success:(res) => {
                        this.isLoadingPop = false;
                        let result = JSON.parse(res);
                        this.goodsTrendOptions = goodsTrendOptions(result);
                        
                    }
                })
            },
             /**
             *  品类结构占比数据处理
            */
            categoryTransform(data) {
                if(data.length !== 0) {
                    var clsList = []; 
                    data.forEach(ele => {
                        ele.value = ele.proportion;
                        clsList.push({
                            value: ele.realamt,
                            name: ele.name
                        });
                    });
                    this.categoryOptions = categoryOptions(clsList);  
                } else{
                    return false;
                }
            },
            /**
             *  价位段占比数据处理
             */
            priceTransform(data) {
                if(data.length !== 0) {
                    this.priceList = [];
                    data.forEach((ele,i) => {
                        switch(ele.price_range) {
                            case '1':
                                ele.name = '0~1元';
                                break;
                            case '10':
                                ele.name = '1~10元';
                                break;
                            case '30':
                                ele.name = '10~30元';
                                break;
                            case '60':
                                ele.name = '30~60元';
                                break;
                            case '80':
                                ele.name = '60~80元';
                                break;
                            case '100':
                                ele.name = '80~100元';
                                break;
                            case '100+':
                                ele.name = '100元以上';
                                break;
                        }
                        this.priceList.push({
                            value: ele.number,
                            name: ele.name
                        })
                    })
                    this.priceRatioOptions = priceRatioOptions(this.priceList);  
                } else{
                    return false;
                }
            },
             /**
             * 有关客单价、件单价、退货率、复购率的数据处理
            */
            pieceTransform(data) {
                this.pieceData = [  
                    {
                        num: data.pct === '' ?   '——' : data.pct,
                        title: '客单价(元)',
                        imgUrl: 'kdj.png',
                        color:'#efda4d'
                    },
                    {
                        num: data.Unit_price === '' ?   '——' : data.Unit_price,
                        title: '件单价(元)',
                        imgUrl: 'jdj.png',
                        color:'#1ea3e3'
                    },
                    {
                        num: data.returned === '' ?   '——' : data.returned,
                        title: '退货率',
                        imgUrl: 'th.png',
                        color:'#22d4a6'
                    },
                    {
                        num: data.apr === '' ?   '——' : `${data.apr}%` ,
                        title: '连带率',
                        imgUrl: 'ldl.png',
                        color:'#f858ac'
                    },
                ];
            },
            /**
             * 切换畅销商品标题选择
            */
            changBestName(value) {
                this.isTotalTrend =false;
                this.bestSellerSwiper().slideTo(value);
            },
            changStockName(value) {
                this.stockSwiper().slideTo(value);
            },
            /**
             *  鼠标移入滞销轮播禁止轮播
            */
            mySwiperEnter() {
                this.mySwiper().autoplay.stop();
            },
            /**
             *  鼠标移出滞销轮播继续轮播
            */
            mySwiperLeave() {
                this.mySwiper().autoplay.start();
            },
            /**
             *  鼠标移入畅销轮播禁止轮播
            */
            bestSellerSwiperEnter() {
                this.bestSellerSwiper().autoplay.stop();
            },
            /**
             *  鼠标移出畅销轮播继续轮播
            */
            bestSellerSwiperLeave() {
                this.bestSellerSwiper().autoplay.start();
            },
            /**
             *  鼠标移入库存轮播禁止轮播
            */
            stockSwiperEnter() {
                this.stockSwiper().autoplay.stop();
            },
            /**
             *  鼠标移出库存轮播继续轮播
            */
            stockSwiperLeave() {
                this.stockSwiper().autoplay.start();
            },
            stockSwiper() {
                return this.$refs.stockSwiper.swiper
            },
            mySwiper() {
                // mySwiper 是要绑定到标签中的ref属性
                return this.$refs.mySwiper.swiper
            },
            bestSellerSwiper() {
                return this.$refs.bestSellerSwiper.swiper
            },
            /**
            *  查看总销售额走势
            */
            lookSalesRank() {
                this.isShowTypePop = false;
                this.isShowMore = true;
                this.isShowkucun=false;
                this.getSaleTrend();
                // 说明是总销售额
                // this.$router.push({path: 'salesTrend/sales',query:{stime: this.stime, etime: this.etime,store: this.formValidate.store }}); // 到销售走势页面
            
            },
            /**
            * 查询总销售额走势
            */
            getSaleTrend() {
                this.salesTrendOptions = {};
                let data = {
                    stime: this.stime,
                    etime: this.etime,
                };
                this.$resetAjax({
                    type: 'POST',
                    url: '/public/index.php?s=home/Manage/get_sale_date',
                    // root: '',
                    root: 'http://bi.xmvogue.com/',
                    data,
                    success:(res) => {
                        this.isTotalTrend = true;
                        this.isShowSales = true;
                        this.result = JSON.parse(res);
                        this.getdays();
                       
                    }
                })
            },
            // 获取节假日
            getdays(){
                let data = {
                    stime: this.stime,
                    etime: this.etime,
                };
                this.$resetAjax({
                    type: 'POST',
                    url: '/public/index.php?s=home/Index/holiday',
                    // root: '',
                    root: 'http://bi.xmvogue.com/',
                    data,
                    success:(res) => {
                        JSON.parse(res).forEach(ele=>{
                            this.dayList.push(ele);
                        })
                        this.dayList.forEach(ele=>{
                            ele.fildate=ele.time
                        })
                        this.salesTrendOptions = salesTrendOptions(this.result,this.dayList);
                       
                       

                    }
                })
            },
            /**
            * 点击销售走势弹窗外面一层蒙层关闭当前弹窗
            */
            closeSalePop($event) {
                let className = $event.target.className;
                if(className === 'more_detail') {
                    this.isShowMore = false;
                    this.isShowGoods = false;
                    this.isTotalTrend = false;
                    this.isStockList = false;
                    this.isReturnList = false;
                    this.isShowkucun=false;
                }
            },
            /**
             * 得到商品销售列表准备工作
             */
            searchGoodsList() {
                this.isLoadingPop = true;
                
                this.currentPage = 1;
                this.keyword = '';
                this.getGoodsList();
            },
            /**
             * 对商品销售列表进行字段输入查询对应商品
            */
            inputKeyword() {
                this.currentPage = 1;
                this.getGoodsList();
            },
            /**
             * 得到商品销售列表
            */
            getGoodsList() {
                this.isShowGoods = true;
                this.isShowMore = true;
                this.$resetAjax({
                    type: 'POST',
                    url: '/public/index.php?s=home/Manage/get_goods_list',
                    // root: '',
                    root: 'http://bi.xmvogue.com/',
                    data: {
                        stime: this.stime,
                        etime: this.etime,
                        p: this.currentPage,
                        goods: this.keyword,
                    },
                    success:(res) => {
                        this.isLoadingPop = false;
                        let result = JSON.parse(res);
                        this.tableData = result.list;
                        this.total = Number(result.count);
                    }
                })
            },
            /**
             * 切换商品销售列表里的页码
            */
            changePage(index) {
                this.currentPage = index;
                this.keyword = '';
                this.getGoodsList();
            },
            
             /**
             * 点击商品大分类里查看结构占比
            */
            subgroupClick(event, instance, echarts) {
                this.seriesName = event.seriesName;
                var clsName = event.data.name;
                switch(this.seriesName) {
                    case '品类结构大类占比':
                        this.middleTitle = clsName;
                        this.middleTitleColor = event.color;
                        this.clsList.forEach((ele,i) => {
                            if(ele.name === clsName) {
                                this.clsId = ele.cls
                            }
                        })
                        break;
                    case '品类结构中类占比':
                        this.middleList.forEach(ele => {
                            this.subgroupTitle = clsName;
                            this.subgroupTitleColor = event.color;
                            if(ele.name === clsName) {
                                this.clsId = ele.cls;
                            }
                        })
                        break;
                };
                this.getGoodsType();
            },
            /**
             * 得到商品分类结构占比
            */
            getGoodsType() {
                var type = null;
                switch(this.seriesName) {
                    case '品类结构大类占比':
                        type = 2;
                        break;
                    case '品类结构中类占比':
                        type = 1;
                        break;
                }
                // this.stime = changeday(this.formValidate.dateValue[0]);          // 开始时间
                // this.etime = changeday(this.formValidate.dateValue[1]);          // 结束时间
                this.$resetAjax({
                    type: 'POST',
                    url: '/public/index.php?s=home/Manage/get_cls',
                    // root: '',
                    root: 'http://bi.xmvogue.com/',
                    data: {
                        stime: this.stime,          // 开始时间
                        etime: this.etime,          // 结束时间
                        type,
                        cls: this.clsId,
                    },
                    success:(res) => {
                        this.isShowMore = true;
                        this.isShowTypePop = true;
                        let result = JSON.parse(res);
                        var clsList = [];     
                        switch(this.seriesName) {
                            case '品类结构大类占比':
                                this.isShowPopTwo = false;
                                this.middleList = result;
                                var clsList = []; // 品类结构
                                result.forEach(ele => {
                                    ele.value = ele.proportion;
                                    clsList.push({
                                        value: ele.realamt,
                                        name: ele.name
                                    });
                                });
                                this.middleOptions = middleOptions(clsList); 
                                break;
                            case '品类结构中类占比':
                                this.subgroupList = result;
                                result.forEach(ele => {
                                    ele.value = ele.proportion;
                                    clsList.push({
                                        value: ele.realamt,
                                        name: ele.name
                                    });
                                });
                                this.isShowPopTwo = true;
                                this.subgroupOptions = subgroupOptions(clsList); 
                                break; 
                        }                             
                    }
                })
            },
            /**
             * 切换商品库存列表里的页码
            */
            kucunchangePage(index) {
                this.kucuncurrentPage = index;
                this.stockKeyword = '';
                this.getStockList();
            },
            /**
             * 得到所有商品库存列表
            */
            getStockList() {
                this.isShowMore = true;
                this.isLoadingPop = true;
                this.isStockList = false;
                let data = {
                    goods: this.stockKeyword,
                    clsno: this.stockSelect,
                    minqty: this.minqty,
                    p:this.kucuncurrentPage
                }
                // 选择全部时让它的值为空
                if(this.stockSelect === '00') {
                    this.stockSelect = '';
                    data = {
                        goods: this.stockKeyword,
                        clsno: this.stockSelect,
                        minqty: this.minqty,
                        p:this.kucuncurrentPage
                    }
                }
                // 如果最小库存没填，则不传参
                if(this.minqty === null) {
                    data = {
                        goods: this.stockKeyword,
                        clsno: this.stockSelect,
                        p:this.kucuncurrentPage
                    }
                }
                this.$resetAjax({
                    type: 'POST',
                    url: '/public/index.php?s=home/manage/get_kucun_list',
                    // root: '',
                    root: 'http://bi.xmvogue.com/',
                    data,
                    success:(res) => {
                        this.isLoadingPop = false;
                        this.isStockList = true;
                        let result = JSON.parse(res);
                        this.stockPopData = result.kucun;
                        this.kucuntotal=result.count;
                    }
                })
            },
        }
    }
</script>