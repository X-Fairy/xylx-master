<template>
    <div class="visualization">
        <!-- 头部 -->
        <div class="visualization_top">
            <div class="visualization_title">{{shopName}}</div>
            <div class="visualization_search">
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                    <FormItem label="日期" prop="dateValue">
                        <DatePicker type="daterange" :options="options3" v-model="formValidate.dateValue" @on-change="changeTime" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
                    </FormItem>
                    <FormItem label="编码" prop="store">
                        <Input v-model="formValidate.store" placeholder="门店编码..." style="width: 80px" @on-blur="getStoreArea" />
                    </FormItem>
                    <FormItem label="面积" prop="area">
                        <Input v-model="formValidate.area" :disabled="isDisabled" placeholder="门店面积..." style="width: 80px"/>
                    </FormItem>
                    <FormItem label="城市" prop="city" class="cityClass">
                        <Cascader :data="cityData" v-model="city" change-on-select @on-change="handleChange" trigger="hover"  placeholder="请选择城市"></Cascader>
                    </FormItem>
                    <FormItem label="租金" prop="rent">
                        <Input v-model="formValidate.rent" placeholder="门店租金..." style="width: 80px"/>
                    </FormItem>
                     <FormItem label="人数" prop="human">
                        <Input v-model="formValidate.human" placeholder="门店人数..." style="width: 80px"/>
                    </FormItem>
                    <FormItem label="销售额" prop="goalSale">
                        <Input v-model="formValidate.goalSale" placeholder="目标销售额..." style="width: 80px"/>
                    </FormItem>
                    <FormItem class="check">
                        <p  @click="judgeFull(formValidate)">查询</p>
                    </FormItem>
                </Form>
            </div>
        </div>
        <!-- 最外部加载提示 -->
        <div class="demo-spin-col" span="8" v-if="spinShow">
            <Spin fix>
                <Icon type="load-c" size=120 class="demo-spin-icon-load"></Icon>
                <div style="font-size:22px;">Loading...</div>
            </Spin>
        </div>
        <!-- 内容 -->
        <div class="visualization_content"  v-if="isShow">
            <!-- 左边 -->
            <div class="visualization_left">
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
                <div class="left_second">
                    <!-- 库存 -->
                    <h2 class="index_title">
                        <p>
                            <span><img src="@/assets/images/view/Unsalable.png" alt=""></span>
                            滞销 TOP10
                        </p>
                        <span class="more_icon"><img src="@/assets/images/view/more_icon.png" alt=""></span>
                    </h2>
                    <p v-if="unsalableNames.length === 0" class="hasno">滞销 TOP10 暂无数据 ...</p>
                    <div v-else class="swiper_container" @mouseenter="mySwiperEnter" @mouseleave="mySwiperLeave">
                        <!-- 滞销商品进行轮播图呈现 -->
                        <swiper class="my-swiper" ref="mySwiper" :options="unsalableOption" @slideChange="mySwiperSlideChange">
                            <swiper-slide v-for="(item, index) in unsalableSlides" :key="index" >
                                <div  class="select_list">
                                    <Select v-model="mySwiperActiveIndex" style="width:100px" @on-change="changUnableName">
                                        <Option v-for="(item,index) in unsalableNames" :value="item.value" :key="index">{{ item.text }}</Option>
                                    </Select>
                                </div>
                                <ul class="slider_list">
                                    <li v-for="(ele,i) in item.list" :key="i">
                                        <!-- <span>{{i+1}}</span> -->
                                        <h3> {{ele.NAME}}</h3>
                                        <p>
                                            （库存 : {{ele.QCQTY}}）
                                            <span class="code">{{ele.CODE2}}</span>
                                        </p>
                                    </li>
                                </ul>
                            </swiper-slide>
                            <!-- <div class="swiper-pagination" slot="pagination"></div> -->
                        </swiper>
                    </div>
                </div>
                <div class="left_third">
                    <div class="third_left">
                        <h2 class="index_title">
                            <p>
                                <span><img src="@/assets/images/view/move.png" alt=""></span>
                                动销率
                            </p>
                            <span class="more_icon"><img src="@/assets/images/view/more_icon.png" alt=""></span>
                        </h2>
                        <div class="movable_pin">
                            <p v-if="movable === ''" class="hasno">动销率暂无数据 ...</p>
                            <Echart v-else style="width:100%;height:100%" :options="movableOptions" :autoResize="true"/> 
                        </div>
                    </div>
                    <div class="third_right">
                        <h2 class="index_title">
                            <p>
                                <span><img src="@/assets/images/view/bulk.png" alt=""></span>
                                大宗交易占比
                            </p>
                            <span class="more_icon"><img src="@/assets/images/view/more_icon.png" alt=""></span>
                        </h2>
                        <div class="transaction">
                            <p v-if="big_order === ''" class="hasno">大宗交易暂无数据 ...</p>
                            <!-- 大宗交易占比 -->
                            <Echart v-else style="width:100%;height:100%" :options="transactionOptions" :autoResize="true"/> 
                        </div>
                    </div>
                </div>
            </div>
            <!-- 中间 -->
            <div class="visualization_middle">
                <div class="middle_zero">
                    <!-- 总销售额 -->
                    <ul class="goal">
                        <li v-for="(item, index) in goalData" :key="index" @click="lookSalesRank(item)">
                            <h3>{{item.title}}</h3>
                            <p>{{item.value}}</p>123
                        </li>
                    </ul>
                </div>
                <!-- 前十大销售排名 -->
                <div class="middle_second">
                    <h2 class="index_title">
                        <p>
                            <span><img src="@/assets/images/view/Sale.png" alt=""></span>
                            畅销 TOP10
                        </p>
                        <span class="more_icon" @click="searchGoodsList"><img src="@/assets/images/view/more_icon.png" alt=""></span>
                    </h2>
                    <p v-if="bestSellerSlides.length === 0" class="hasno">畅销 TOP10 暂无数据 ...</p>
                    <div v-else  class="best_seller"  @mouseenter="bestSellerSwiperEnter" @mouseleave="bestSellerSwiperLeave"   >
                        <swiper class="bestSeller-swiper" ref="bestSellerSwiper" :options="bestSellerOption" @slideChange="bestSlideChange">
                            <swiper-slide v-for="(item, index) in bestSellerSlides" :key="index">
                                <div  class="select_list">
                                    <Select v-model="bestSwiperActiveIndex" style="width:100px" @on-change="changBestName">
                                        <Option v-for="(item,index) in bestSellerNames" :value="item.value" :key="index">{{ item.text }}</Option>
                                    </Select>
                                </div>
                                <div style="width:100%;height:95%;" @click="bestSellerClick">
                                    <Echart style="width:100%;height:100%" :options="item.options" :autoResize="true" /> 
                                </div>
                            </swiper-slide>
                        </swiper>
                    </div>
                </div>
                <!-- 库存 TOP10 -->
                <div class="middle_third">
                    <h2 class="index_title">
                        <p>
                            <span><img src="@/assets/images/view/Stock.png" alt=""></span>
                            库存 TOP10
                        </p>
                        <span class="more_icon" @click="getStockList"><img src="@/assets/images/view/more_icon.png" alt=""></span>
                    </h2>
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
                            <!-- <div class="swiper-pagination" slot="pagination"></div> -->
                        </swiper>
                    </div>
                </div>
            </div>
            <!-- 右边 -->
            <div class="visualization_right">
                <div class="right_zero">
                    <h2 class="index_title">
                        <p>
                            <span><img src="@/assets/images/view/goods_style.png" alt=""></span>
                            品类结构大类占比
                        </p>
                        <span class="more_icon"><img src="@/assets/images/view/more_icon.png" alt=""></span>
                    </h2>
                    <div class="category">
                        <p v-if="clsList.length === 0" class="hasno">品类结构大类占比暂无数据 ...</p>
                        <Echart v-else style="width:100%;height:100%" :options="categoryOptions" :autoResize="true" @click="subgroupClick" /> 
                    </div>
                </div>
                <div class="right_second">
                    <h2 class="index_title">
                        <p>
                            <span><img src="@/assets/images/view/price_piece.png" alt=""></span>
                            商品价位段占比
                        </p>
                        <span class="more_icon"><img src="@/assets/images/view/more_icon.png" alt=""></span>
                    </h2>
                    <div class="priceRatio">
                        <p v-if="priceList.length === 0" class="hasno">商品价位段占比暂无数据 ...</p>
                        <Echart v-else style="width:100%;height:100%" :options="priceRatioOptions" :autoResize="true" /> 
                    </div>
                </div>
                <div class="right_third">
                    <ul>
                        <li v-for="(item, index) in storeInfoData" :key="index">
                            <p class="img_icon"><img :src="require('@/assets/images/view/' + item.imgUrl)" /></p>
                            <div class="info">
                                <h2 class="item_title">{{item.title}}</h2>
                                <p class="shine"></p>
                                <p class="num" :style="{color: item.color}">{{item.num}}</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 提示框 -->
        <div class="tip" v-show="isShowTip">
            {{tipContent}}
        </div>
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
                    <Echart style="width:100%;height:100%" :options="vsalesTrendOptions" :autoResize="true" v-if="isShowSales"/> 
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
                        <img @click="isShowMore=false;isStockList=false;minqty=1;stockKeyword='';stockSelect='01'" src="@/assets/images/view/pop_close.png" class="close_icon" alt="">
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
                    </div>
                </div>
            </div>
            <!-- 退货率弹窗 -->
            <div class="return_list" v-if="isReturnList">
                <h3 class="pop_top">
                    <p>商品退货列表</p>
                    <img @click="isShowMore=false;isReturnList=false;" src="@/assets/images/view/pop_close.png" class="close_icon" alt="">
                </h3>
                <div class="return_table">
                    <Table :columns="returnColumns" :data="returnData" :height="returnHeight"></Table>
                </div>
            </div>
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
    vsalesTrendOptions,                                           // 总销售额走势
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
import {getUrlParams} from  '@/assets/js/tool.js'
let isFrist = true;
export default {
    name: 'carrousel',
    data() {
        return {
            // 得到网址的参数对象
            urlParams: {},
            shopName: '门店看板',                                           // 店名
            options3: {
                disabledDate(date) {
                    return date && date.valueOf() > Date.now() - 86400000;
                }
            },
            formValidate: {
                dateRange: [],                                       // 选择得到的时间
                goalSale: '',                                        // 销售额目标
                human: '',                                           // 门店人效
                rent: '',                                            // 门店租金
                area: '',                                            // 门店面积
                beginTime: new Date(new Date().format('yyyy-MM') + '-01'),
                endTime: new Date(new Date().getTime()),
                dateValue: [],                                       // 当前选择的时间数组
                
            },
            city:[],                                   //城市
            ruleValidate: {
                beginTime: [
                    { required: true, message: '起始时间不能为空。', trigger: 'blur', pattern: /.+/ }
                ],
                endTime: [
                    { required: true, message: '结束时间不能为空。', trigger: 'blur', pattern: /.+/ }
                ],
                store: [
                    { required: true, message: '门店编码不能为空。', trigger: 'blur' }
                ],
                area: [
                    { required: true, message: '门店面积不能为空。', trigger: 'blur' }
                ],
                rent: [
                    { required: true, message: '门店租金不能为空。', trigger: 'blur' }
                ],
                human: [
                    { required: true, message: '门店人数不能为空。', trigger: 'blur' }
                ],
                goalSale: [
                    { required: true, message: '目标销售额不能为空。', trigger: 'blur' }
                ],
                dateValue: [
                    {
                        type: 'array', 
                        required: true, 
                        fields: {
                            0: {required: true, message: '时间不能为空', trigger: 'change', pattern: /.+/},
                            1: {required: true, message: '时间不能为空', trigger: 'change', pattern: /.+/},
                        } 
                    },
                ]
            },
            isShowStock: true,                                    // 是否显示库存加载中提示
            mySwiperActiveIndex: 1,                               // 滞销TOP 10轮播默认第一个slide
            bestSwiperActiveIndex: 1,                             // 畅销TOP 10轮播默认第一个slide
            stockSwiperActiveIndex: 1,                            // 库存TOP 10轮播默认第一个slide
            unsalableOption: {                                 
                loop: true,                                       // 滞销商品开启轮播模式
                autoplay:true,                                    // 设置为true启动自动切换
                speed: 3000,                                      // 切换速度，即slider自动滑动开始到结束的时间（单位ms）
                grabCursor : true,                                // 设置为true时，鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状。
                // pagination: {
                //     el: '.swiper-pagination',
                //     dynamicBullets: true,                      // 动态分页器
                //     dynamicMainBullets: 2,                     // 动态分页器的主指示点的数量
                //     clickable: true,
                //     clickableClass : 'swiper-pagination',
                // },
                effect : 'coverflow',                            // slide的切换效果
                longSwipesRatio : 0.1,
            },
            unsalableSlides: [],                                 // 滞销商品轮播数据
            unsalableNames: [],                                  // 滞销商品类名数据
            bestSellerNames: [],                                 // 畅销TOP 10类名数据
            stockNames: [],                                      // 库存TOP 10类名数据
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
            bestSellerSlides: [],                                // 销售top 10 轮播数据
            bestId: '',                                          // 选中哪个商品id
            stockOption: {                                       // 库存TOP 10
                loop: true,
                autoplay:true,                                   // 设置为true启动自动切换
                speed: 2800,                                     // 切换速度，即slider自动滑动开始到结束的时间（单位ms）
                grabCursor : true,                               // 设置为true时，鼠标覆盖Swiper时指针会变成手掌形状，拖动时指针会变成抓手形状。
                effect : 'coverflow',
                mousewheel: true,
            },
            stockSlides: [],                                     // 库存TOP 10 轮播数据
            store: '',                                           // 门店id
            spinShow: false,                                     // 数据加载提示
            isShow: false,                                       // 是否显示指标内容
            stime: '',                                           // 开始日期
            etime: '',                                           // 结束日期
            isShowTip: false,                                    // 是否显示提示框
            tipContent: '',                                      // 提示语
            pieceData: [],                                       // 有关客单价、件单价、退货率、复购率的数据
            storeInfoData: [],                                   // 有关租金倍率、利润坪效、销售人效的数据
            goalData: [],                                        // 总销售金额
            isDisabled: false,
            stockOptions: {},                                    // 库存
            stockData: [],                                       // 库存数据
            movable:'',
            movableOptions: {},                                  // 动销率
            jointOptions: {},                                    // 连带率
            transactionOptions: {},                              // 大宗交易占比
            big_order: '',                                       // 大宗交易占比数据
            isShowMore: false,                                   // 是否显示销售额走势弹窗
            isTotalTrend: false,                                 // 是否显示总销售额走势
            isShowGoods: false,                                  // 是否显示商品销售详情弹窗
            returnColumns: [                                     // 退货列表表头
                {
                    title: '名称',
                    align: 'center',
                    key: 'item_name'
                },
                {
                    title: '编码',
                    align: 'center',
                    key: 'item_no'
                },
                {
                    title: '售价',
                    align: 'center',
                    key: 'sale_price'
                },
                {
                    title: '日期',
                    align: 'center',
                    key: 'rvctime'
                },
            ],
            returnData: [],                                      // 退货列表数据
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
            pageSize: 20,                                        // 商品销售每页条数
            tableHeight: 300,                                    // 商品销售表格高度
            stockHeight: 300,                                    // 商品库存表格高度
            returnHeight: 300,                                   // 商品退货率表格高度
            keyword: '',                                         // 商品销售列表查询关键字
            currentPage: 1,                                      // 商品销售当前页码
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
            priceRatioOptions: {},                               // 价位段占比
            priceList: [],                                       // 价位段占比数据
            vsalesTrendOptions: {},                               // 总销售额走势
            isShowSales: true,                                   // 是否显示总销售额走势
            goodsTrendOptions,                                   // 畅销TOP 10单个商品销售额走势和总销售额走势
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
            // 时间区间
            dayList:[],
            result:[],
            weather:[],
            cityid:'',
            // 城市数据
            cityData:[
                {
                    value:'',
                    label:'',
                    children:[
                        {
                            value:'',
                            label:'',
                            children:[
                                {
                                    value:'',
                                    label:''
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 278);
            this.returnHeight =  (windowHeight- 350);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 278);
            this.returnHeight =  (windowHeight- 350);
        })
    },
    created() {
        this.getUrlData();
        this.getCheckLogin();
        // 获取当前默认选择时间及时间参数
        this.getDefaultDate();
        this.beginStr = (changeday(this.formValidate.beginTime)).slice(0, 7);
        this.endStr = (changeday(this.formValidate.endTime)).slice(0, 7);
        this.beginNum = (new Date(this.formValidate.beginTime)).getTime();
        this.endNum = (new Date(this.formValidate.endTime)).getTime();
        this.getCity();
        
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
        'formValidate.store'(newVal, val) {
            if(!newVal) {
                this.isShow = false;
                this.formValidate.area = '';
                this.formValidate.goalSale = '';
                this.formValidate.human = '';
                this.formValidate.rent = '';
            } 
        },
        'formValidate.goalSale'(newVal, val) {
            if(!newVal) {
                this.isShow = false;
            }
        },
        'formValidate.human'(newVal, val) {
            if(!newVal) {
                this.isShow = false;
            }
        },
        'formValidate.rent'(newVal, val) {
            if(!newVal) {
                this.isShow = false;
            }
        },
        'formValidate.area'(newVal, val) {
            this.isShow = false;
        },
        'formValidate.dateValue'(newVal, val) {
            newVal.forEach(ele => {
                if(ele === '') {
                    this.isShow = false;
                }
            })
        },
        isShowMore(newVal, val) {
        }
    },
    methods: {
        /**
        * 转化ztree数据；数据递归处理
        * @param {Array} data 需要转换的数据
        */
        dgZtree(data) {
            
            data.forEach(item => {
                // title转化
                item.label = item.city;
                item.value = item.cityid
                // // 当前节点是否要展开
                // item.value = item.dept_id;
                // 是否选中当前节点
                // item.selected = false;
                // 如果当前节点有子节点，再次把子节点进行递归处理；数据判断，子节点数据是数组，防止报错
                if (item.children instanceof Array && item.children.length) {
                    this.dgZtree(item.children);
                }
            })
            return data;
        },
        /* 获取城市 */
        getCity(){
            this.$resetAjax({
                url:'/NewA/Storelist/getcity',
                type:'POST',
                // data,
                success:(res)=>{
                    let result = JSON.parse(res);
                    this.cityData = this.dgZtree([JSON.parse(res)][0]);
                }
            })
        },
        /**
         * 得到网址的参数
         */
         getUrlData:function(){
            this.urlParams = getUrlParams();
            if(typeof(this.urlParams.store)!=='undefined'){
                this.store = this.urlParams.store;
                this.getStoreMsg();
            }
        },
        /* 获取门店信息 */
        getStoreMsg(){
            this.$resetAjax({
                type: 'POST',
                url: '/public/index.php?s=home/Index/getStoreInfo',
                // root: '',
                root: 'http://bi.xmvogue.com/',
                data: {
                    store:this.store          // 门店编码
                },
                success:(res) => {
                    let result=JSON.parse(res)[0];
                    if(result.cityid!==null){
                        this.city=[result.city];
                        this.cityid=result.cityid;
                    }
                    this.shopName=result.store_name;
                    this.formValidate.store=result.store_code.toString();
                    this.formValidate.area=result.area;
                    this.formValidate.goalSale=result.target;
                    this.formValidate.rent=result.rent;
                    this.formValidate.human=result.clerk.toString();
                                 
                    
                }
            })
        },
        barChartClick() {
            console.log(arguments)
            debugger
        },
        getCheckLogin() {
            this.$resetAjax({
                type: 'GET',
                url: '/public/index.php?s=home/index/check_login',
                // root: '',                              // BI本地时放开
                root: 'http://bi.xmvogue.com/',     // BI上传时放开
                success:(res)=>{
                    let result = JSON.parse(res);
                    if(result.error === 1) {
                        this.$Modal.warning({
                            title: '自动跳转',
                            content: '抱歉，您没有权限',
                            onOk:()=>{
                                setTimeout(()=>{
                                    window.open('http://oa.xmvogue.com/index.php/NewA/Index/index/cs/Index','_self')
                                },2000)
                            }
                        });
                    } else {
                        return false;
                    }
                }
            })
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
        *  得到门店编码
        */
        getStoreArea() {
            this.isDisabled = false;
            this.$resetAjax({
                type: 'POST',
                url: '/public/index.php?s=home/index/area',
                // root: '',
                root: 'http://bi.xmvogue.com/',
                data: {
                    store: this.formValidate.store,          // 门店编码
                },
                success:(res) => {
                    let result = JSON.parse(res);
                    if(result.cityid!==null){
                        this.cityid=result.cityid;
                        this.city=[result.city];
                    }
                    let msg = result.msg;
                    switch(msg) {
                        case 'success':
                            this.formValidate.area = result.xarea;
                            this.shopName = result.name;
                            this.isDisabled = true;
                            break;
                        case '门店不存在':
                            this.isShowTip = true;
                            this.formValidate.area = '';
                            this.tipContent = `预警，${this.formValidate.store}门店不存在！`
                            this.shopName = '门店看板';
                            setTimeout(() => {
                                this.isShowTip = false;
                                this.formValidate.store = '';
                            }, 1500);
                            break;
                        case '不是直营门店':
                            this.isShowTip = true;
                            this.formValidate.area = '';
                            this.tipContent = `预警，${this.formValidate.store}不是直营门店！`
                            this.shopName = '门店看板';
                            setTimeout(() => {
                                this.isShowTip = false;
                                this.formValidate.store = '';
                            }, 1500);
                            break;
                    }
                    if(this.formValidate.area === '0') {
                        this.formValidate.area = '';
                        this.isDisabled = false;
                    }
                }
            })
        },
        /**
         *  对滞销商品进行滑动
        */
        mySwiperSlideChange() {
            var activeIndex = this.mySwiper().activeIndex,
                len = this.unsalableNames.length;
            // 当滑到第一个时，再往前滑动，则要变成最后一个
            if (activeIndex === 0) {
                activeIndex = len;
            } 
            // 当滑到最后一个时，再往后滑动，则庶变成第一个
            else if (activeIndex > len) {
                activeIndex = 1;
            }
            this.mySwiperActiveIndex = activeIndex;   
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
        /**
         *  获取当前默认选择时间及时间参数
         */
        getDefaultDate() {
            // var date = getNowFormatDate(); // 当前的今天日期
            // var nowdate = new Date();
            // let yesteday = changeday(Date.now() - 86400000);
            // nowdate.setMonth(nowdate.getMonth()-1);
            // var y = nowdate.getFullYear();
            // var m = (nowdate.getMonth() + 1 < 10 ? '0' + (nowdate.getMonth() + 1) : nowdate.getMonth() + 1);
            // var d = (nowdate.getDate() < 10 ? '0' + (nowdate.getDate()) : nowdate.getDate()) + " " ;
            // var formatwdate = y + '-' + m + '-' + d;  // 今天的前一个月的今天日期
            // this.dateValue = [formatwdate,yesteday];
            // this.stime = formatwdate ; // 默认开始时间为当前日期的前一个月
            // this.etime = yesteday;  // 默认结束时间为当前今天 

            let yesteday = this.formValidate.endTime;
            let startDate = this.formValidate.beginTime;
            this.formValidate.dateValue = [startDate,yesteday];

        },
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
                    this.formValidate.dateValue = [];
                }, 1500);
                return false;
            }
        },
        handleChange(value, selectedData){
            console.log(value);
            // this.formValidate.city=value[value.length-1];
        },
        /**
         *  查询前判断租金、目标销售金额、店铺人数是否都已填好
        */
        judgeFull(formValidate) {
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    this.isShow = false;
                    this.getStoreData();
                    this.getKucunStart();
                } else {}
            })
        },
        /**
         * 得到门店指标数据
         */
        getStoreData() {
            this.spinShow = true;
            this.stime = changeday(this.formValidate.dateValue[0]);
            this.etime = changeday(this.formValidate.dateValue[1]);
            this.$resetAjax({
                type: 'POST',
                url: '/public/index.php?s=home/index/index',
                // root: '',
                root: 'http://bi.xmvogue.com/',
                data: {
                    stime: this.stime ,          // 开始时间
                    etime: this.etime,          // 结束时间
                    store: this.formValidate.store,          // 门店编码
                },
                success:(res) => {
                    this.spinShow = false;
                    this.isShow = true;
                    let result = JSON.parse(res);
                    let msg = result.error;
                    switch(msg) {
                        case 1: 
                            this.big_order = '';                                              // 大宗交易占比
                            this.movable = '';                                                // 动销率
                            this.totalSale = '';                                              // 总销售
                            this.goalData = [                                               
                                {
                                    title: '总销售额',
                                    value: '———',
                                    id: 1,
                                },
                                {
                                    title: '目标完成率',
                                    value: `———` ,
                                    id: 2,
                                },
                            ];
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
                            this.storeInfoData = [                                            // 有关租金倍率、销售坪效、销售人效的数据
                                {
                                    num: '——',
                                    title: '租金倍率(元)',
                                    imgUrl: 'rent.png',
                                    color:'#efda4d'
                                },
                                {
                                    num: '——',  // 销售坪效
                                    title: '销售坪效(元)',
                                    imgUrl: 'profit.png',
                                    color:'#06cb99'
                                },
                                {
                                    num: '——',
                                    title: '销售人效(元)',
                                    imgUrl: 'effect.png',
                                    color:'#f758a9'
                                },
                            ];
                            this.clsList =  [];                                              // 品类结构大类占比数据
                            this.unsalableNames = [];
                            this.bestSellerSlides = [];
                            this.clsList = [];
                            this.priceList = [];
                            break;
                        case 0: 
                            this.clsList = result.cls_list;
                            this.totalSale = result.sale;
                            this.goalTransform(this.totalSale);                                // 总销售金额数据处理
                            this.toptenTransform(result.topten);                               // 畅销商品数据处理
                            // this.stockTransform(result.kucun);                              // 库存商品数据处理
                            this.unsalableTransform(result.unsalable);                         // 滞销商品数据处理
                            this.categoryTransform(this.clsList);                              // 品类结构占比数据处理
                            this.priceTransform(result.price_list);                            // 价位段占比数据处理
                            this.sotreInfoTransform(result);                                   // 有关租金倍率、销售坪效、销售人效的数据处理
                            this.pieceTransform(result);                                       // 有关客单价、件单价、退货率、复购率的数据处理
                            this.jointOptions = jointOptions(result.apr);                      // 连带率
                            this.movable = result.dongxiao;
                            this.movableOptions = movableOptions(this.movable);                // 动销率
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
                url: '/public/index.php?s=home/index/kucuns',
                // async: false,
                // root: '',
                root: 'http://bi.xmvogue.com/',
                data: {
                    store: this.formValidate.store,          // 门店编码
                },
                success:(res) => {
                    let result = JSON.parse(res);
                    this.stockData = result.kucun;
                    this.$resetAjax({
                        type: 'POST',
                        url: '/public/index.php?s=home/index/kucunss',
                        // async: false,
                        // root: '',
                        root: 'http://bi.xmvogue.com/',
                        data: {
                            store: this.formValidate.store,          // 门店编码
                        },
                        success:(res) => {
                             this.$nextTick(() => {
                                this.isShowStock = false;
                            })
                            let result = JSON.parse(res);
                            result.kucun.forEach(ele => {
                                this.stockData.push(ele)
                            })
                            this.stockTransform(this.stockData);

                            // this.stockData = this.stockData.concat(result.kucun);
                            // this.$nextTick(() => {
                            //     this.isShowStock = true;
                            // })
                        }
                    })
                }
            })
            

        },
        /**
         *  总销售金额数据处理
        */
        goalTransform(data) {
            this.goalData = [                                               
                {
                    title: '总销售额',
                    value: data,
                    id: 1,
                },
                {
                    title: '目标完成率',
                    value: this.formValidate.goalSale === '' ? '———' : `${GetPercent(Number(data), Number(this.formValidate.goalSale))}` ,
                    id: 2,
                },
            ];
        },
        /**
         *  畅销商品
         */
        toptenTransform(data) {
            if(data.length !== 0) {
                this.bestSellerSlides = data;   // 畅销商品
                this.bestSellerNames = data.map((ele,index) => ({text:ele.name, value: index + 1}))
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
                this.stockNames = data.map((ele,index) => ({text:ele.name, value: index + 1}))
                data.forEach(item => {
                    item.options = stockOptions(item.goods);
                });
            } else{
                return false;
            }
        },
        /**
         *  滞销商品数据处理
        */
        unsalableTransform(data) {
            if(data.length !== 0) {
                this.unsalableSlides = data; // 滞销商品
                this.unsalableNames = data.map((ele,index) => ({text:ele.name, value: index + 1}))
            } else{
                return false;
            }
        },
        /**
         * 切换滞销商品标题选择
         */
        changUnableName(value) {
            this.mySwiper().slideTo(value);
        },
        /**
         * 切换畅销商品标题选择
        */
        changBestName(value) {
            this.bestSellerSwiper().slideTo(value);
        },
        changStockName(value) {
            this.stockSwiper().slideTo(value);
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
         *  有关租金倍率、销售坪效、销售人效的数据处理
        */
        sotreInfoTransform(data) {
            var daysNum = datedifference(this.formValidate.beginTime, this.formValidate.endTime); // 选择的时间一共多少天
            let rental  = (data.sale / Number(this.formValidate.rent) / Number(daysNum)).toFixed(2);
            let salesman = (data.sale / Number(this.formValidate.human) / Number(daysNum)).toFixed(2);
            let areaEffect = this.formValidate.area === '0' ? '0' :  (data.sale / Number(this.formValidate.area) / Number(daysNum)).toFixed(2);
            this.storeInfoData = [  // 有关租金倍率、销售坪效、销售人效的数据
                {
                    num: rental,
                    title: '租金倍率(元)',
                    imgUrl: 'rent.png',
                    color:'#efda4d'
                },
                {
                    num: areaEffect,  // 销售坪效
                    title: '销售坪效(元)',
                    imgUrl: 'profit.png',
                    color:'#06cb99'
                },
                {
                    num: salesman,
                    title: '销售人效(元)',
                    imgUrl: 'effect.png',
                    color:'#f758a9'
                },
            ];
        },
        /**
         *  查看总销售额走势
         */
        lookSalesRank(item) {
            if(this.city.length==0){
                this.isShowTip = true;
                this.tipContent = '选择门店所在城市，可以查看天气情况';
                setTimeout(() => {
                    this.isShowTip = false;
                }, 1500);
            }else{
                this.cityid=this.city[this.city.length-1];
                this.isShowTypePop = false;
                if(item.id === 1) {
                    this.isShowMore = true;
                    this.getSaleTrend();
                    // 说明是总销售额
                    // this.$router.push({path: 'salesTrend/sales',query:{stime: this.stime, etime: this.etime,store: this.formValidate.store }}); // 到销售走势页面
                }  
            }
        },
        /**
         * 查询总销售额走势
         */
        getSaleTrend() {
            this.vsalesTrendOptions = {};
            let data = {
                stime: this.stime,
                etime: this.etime,
                store: this.formValidatestore,
            };
            this.$resetAjax({
                type: 'POST',
                url: '/public/index.php?s=home/index/get_sale_date',
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
                        ele.fildate=ele.time;
                    })
                    this.getwether();
                }
            })
        },
        getwether(){
            let data = {
                stime: this.stime,
                etime: this.etime,
                cityid: this.cityid
            };
            this.$resetAjax({
                type: 'POST',
                url: '/public/index.php?s=home/Index/weather',
                // root: '',
                root: 'http://bi.xmvogue.com/',
                data,
                success:(res) => {;
                    let list=JSON.parse(res).list;
                    list.forEach(ele=>{
                        this.weather.push(ele);
                    })
                    this.weather.forEach(ele=>{
                        ele.fildate=ele.time;
                        switch(ele.weather){
                            case '晴':
                                ele.weather=1
                                break;
                            case '多云':
                                ele.weather=2
                                break;
                            case '阴':
                                ele.weather=3
                                break;
                            case '小雨':
                                ele.weather=4
                                break;
                            case '阵雨':
                                ele.weather=5
                                break;
                            case '大雨':
                                ele.weather=6
                                break;
                            case '小雪':
                                ele.weather=7
                                break;
                        }
                    })
                    this.vsalesTrendOptions = vsalesTrendOptions(this.result,this.dayList,this.weather);
                }
            })
        },
        /**
         * 点击畅销商品查看走商品走势图
        */
        bestSellerClick() {
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
        getGoodsTrend() {
            this.isShowMore = true;
            this.isTotalTrend = true;
            this.isShowSales = false;
            this.$resetAjax({
                type: 'POST',
                url: '/public/index.php?s=home/index/goods_sale_trend',
                // root: '',
                root: 'http://bi.xmvogue.com/',
                data: {
                    stime: this.stime,
                    etime: this.etime,
                    store: this.formValidate.store,
                    goods: this.bestId,
                },
                success:(res) => {
                    let result = JSON.parse(res);
                    this.goodsTrendOptions = goodsTrendOptions(result);
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
            }
        },
        /**
         * 得到商品销售列表准备工作
         */
        searchGoodsList() {
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
         * 得到所有商品库存列表
        */
        getStockList() {
            this.isShowMore = true;
            this.isLoadingPop = true;
            this.isStockList = false;
            let data = {
                store: this.formValidate.store,
                goods: this.stockKeyword,
                clsno: this.stockSelect,
                minqty: this.minqty
            }
            // 选择全部时让它的值为空
            if(this.stockSelect === '00') {
                this.stockSelect = '';
                data = {
                    store: '',
                    goods: this.stockKeyword,
                    clsno: this.stockSelect,
                    minqty: this.minqty
                }
            }
            // 如果最小库存没填，则不传参
            if(this.minqty === null) {
                data = {
                    store: this.formValidate.store,
                    goods: this.stockKeyword,
                    clsno: this.stockSelect,
                }
            }
            this.$resetAjax({
                type: 'POST',
                url: '/public/index.php?s=home/index/get_kucun_list',
                // root: '',
                root: 'http://bi.xmvogue.com/',
                data,
                success:(res) => {
                    this.isLoadingPop = false;
                    this.isStockList = true;
                    let result = JSON.parse(res);
                    this.stockPopData = result.kucun;
                }
            })
        },
        /**
         * 得到商品销售列表
        */
        getGoodsList() {
            this.isShowGoods = true;
            this.isShowMore = true;
            this.$resetAjax({
                type: 'POST',
                url: '/public/index.php?s=home/index/get_goods_list',
                // root: '',
                root: 'http://bi.xmvogue.com/',
                data: {
                    stime: this.stime,
                    etime: this.etime,
                    store: this.formValidate.store,
                    p: this.currentPage,
                    goods: this.keyword,
                },
                success:(res) => {
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
            this.stime = changeday(this.formValidate.dateValue[0]);          // 开始时间
            this.etime = changeday(this.formValidate.dateValue[1]);          // 结束时间
            this.$resetAjax({
                type: 'POST',
                url: '/public/index.php?s=home/index/get_cls',
                // root: '',
                root: 'http://bi.xmvogue.com/',
                data: {
                    stime: this.stime,          // 开始时间
                    etime: this.etime,          // 结束时间
                    store: this.formValidate.store,
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
         * 得到退货率详情
         */
        getReturnList(item) {
            if(item.title === '退货率') {
                this.$resetAjax({
                    type: 'POST',
                    url: '/public/index.php?s=home/index/returned_list',
                    // root: '',
                    root: 'http://bi.xmvogue.com/',
                    data: {
                        stime: this.stime,          // 开始时间
                        etime: this.etime,          // 结束时间
                        store: this.formValidate.store,
                    },
                    success:(res) => {
                        this.isShowMore = true;
                        this.isReturnList = true;
                        this.isLoadingPop = false;
                        let result = JSON.parse(res);
                        this.returnData = result.returned;
                                                    
                    }
                })
            } else {
                return false;
            }
        }
    }
}
</script>