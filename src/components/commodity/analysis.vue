<template>
    <div class="analysis" id="analysis">
        <div class="header_left">
            <div class="left">
            <Row>
                <i-Col span="12">
                    <span class="item">时间周期：</span>
                    <Select v-model="timeModel" style="width:160px" @on-change="getTimeModel(timeModel)">
                        <Option v-for="item in timeModelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </i-Col>
                <i-Col span="12">
                    <span class="item">选择时间：</span>
                    <DatePicker :value="selectTime" :options="options4" @on-change="getSelectTime" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
                </i-Col>
            </Row>
            </div>
            <Button type="info" class="back" @click="$router.push({path: 'commodity'})">返回商品管理</Button>
        </div>
        <!-- 内容区 -->
        <div class="contanier">
            <div class="contanier_top">
                <p class="item_name">商品名称：<span>{{item_name}}【{{item_no}}】</span></p>
            </div>
           <Echart :options="options" v-if="isTable"/>
        </div>
        <!-- 加载进度 -->
        <spin v-if="spinShow"></spin>
    </div>
</template>


<script>
import {getUrlParams} from  '@/assets/js/tool.js'
import tipModal from '../tip.vue'
import spin from '../spin.vue'


export default {
    components: {
        // 引入提示框组件
        tipModal,
        // 加载进度
        spin,
    }, 

    data() {
        return {
            // 是否显示表格
            isTable: false,
            // 是否显示加载进度条
            spinShow: true,
            // 得到网址的参数对象
            urlParams: {},
            // 选中的时间
            selectTime: [],
            // 时间周期
            timeModel: '',
            // 时间周期数据
            timeModelList: [
                {
                    label: '最近1周',
                    value: 1
                },
                {
                    label: '最近15天',
                    value: 2
                },
                {
                    label: '最近一个月',
                    value: 3
                }
            ],
            // 商品名称
            item_name: '',
            // 商品条码
            item_no: '',
            // 图形数据
            options:{
                // 全图默认背景,要打引号
                // backgroundColor: 'lightblue',
                // 标题，每个图表最多仅有一个标题控件
                title: {
                    text: '',
                },
                //  提示框，鼠标悬浮交互时的信息提示
                tooltip: {
                    trigger: 'axis',
                },
                // 数值系列的颜色列表
                color: ['#4dc7c9', '#f4bc8e', '#d87a80'],
                // legend	图例（详见legend），每个图表最多仅有一个图例，混搭图表共享
                legend: {
                    x: 'right',
                    data: ['出库量', '库存量', '零售量']
                },
                // 网页一打开数据是否采用动画效果显示出来，默认为true，这里animation可以不写
                animation: true,
                grid: {
                    x: 170,
                    y: 60,
                },
                // 工具箱，每个图表最多仅有一个工具箱
                toolbox: {
                    show: true,
                    x: 'center',
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['bar', 'line'] },
                        restore: { show: true },
                        saveAsImage: { show: true }
                    },
                },
                xAxis: [
                    {
                        type: 'category',
                        data: [],
                        // 类目起始和结束两端空白策略，见下图，默认为true留空，false则顶头
                        boundaryGap: true,
                        // 坐标轴名称，默认为空
                        name: '时间',
                        nameTextStyle: {
                            color: '#008acd'
                        },
                        // 坐标轴名称位置
                        nameLocation: 'end',
                        // 分隔线，默认显示 不显示为true
                        splitLine: false,
                        // 坐标轴文本标签选项
                        axisLabel: {
                            // 标签旋转角度，默认为0，不旋转，正值为逆时针，负值为顺时针，可选为：-90 ~ 90
                            rotate: 30,
                            // 	坐标轴文本标签是否可点击
                            clickable: true,
                            // 坐标轴文本标签与坐标轴的间距，默认为8，单位px
                            margin:12,
                            textStyle: {
                                color: '#333'
                            }
                        },
                        // 坐标轴小标记，数值轴和时间轴默认不显示，类目轴默认显示
                        axisTick: {
                            show: true,
                            // 小标记是否显示为间隔，默认等于boundaryGap
                            onGap: true,
                            // 小标记是否显示为在grid内部，默认在外部
                            inside: false,
                            // 小标记属性length控制线长
                            length: 5
                        },
                    },
                ],
                yAxis: [
                    {
                        type: 'value',
                        // 分隔线，默认显示 不显示为true
                        splitLine: false,
                        name: '数量',
                        nameTextStyle: {
                            color: '#008acd'
                        },
                    }
                ],
                series: [
                    {
                        type: 'line',
                        name: '出库量',
                        // 类目间柱形距离，默认为类目间距的20%，可设固定值
                        barCategoryGap: '10%',
                        // barGap 柱间距离，默认为柱形宽度的30%，可设固定值
                        barGap: '6',
                        data: [],
                        // 平滑曲线显示
                        smooth: 'true',
                        // 图形样式，可设置图表内图形的默认样式和强调样式（悬浮时样式）：
                        itemStyle: {
                            // 默认样式,要和最外面的// 数值系列的颜色列表color: ['red', 'blue', 'black'],设置相同
                            // normal: {
                            //     color: 'red'
                            // },
                            // 强调样式（悬浮时样式）：
                            emphasis: {
                                color: 'orange'
                            }
                        },
                        // 标注
                        markPoint : {
                            // 标注图形数据
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        },
                        // 系列中的数据标线内容
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        },
                    },
                    {
                        type: 'line',
                        name: '库存量',
                        // 平滑曲线显示
                        smooth: 'true',
                        // 类目间柱形距离，默认为类目间距的20%，可设固定值
                        barCategoryGap: '10%',
                        // barGap 柱间距离，默认为柱形宽度的30%，可设固定值
                        barGap: '6',
                        data: [],
                        // 标注
                        markPoint : {
                            // 标注图形数据
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        },
                        // 系列中的数据标线内容
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        },
                    },
                    {
                        type: 'line',
                        name: '零售量',
                        // 平滑曲线显示
                        smooth: 'true',
                        // 类目间柱形距离，默认为类目间距的20%，可设固定值
                        barCategoryGap: '10%',
                        // barGap 柱间距离，默认为柱形宽度的30%，可设固定值
                        barGap: '6',
                        data: [],
                        // 标注
                        markPoint : {
                            // 标注图形数据
                            data : [
                                {type : 'max', name: '最大值'},
                                {type : 'min', name: '最小值'}
                            ]
                        },
                        // 系列中的数据标线内容
                        markLine : {
                            data : [
                                {type : 'average', name: '平均值'}
                            ]
                        },
                    },
                ],
            },
            // 对时间进行限制,选择不到大于今天的时间
            options4: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
        }
    },

    created() {
        // 得到网址的参数
        this.getUrlData();
        // 得到图形数据
        this.getOptions();
    },

    methods: {
        /**
         * 得到网址的参数
         */
        getUrlData:function(){
            this.urlParams = getUrlParams();
            this.item_name = this.urlParams.item_name;
            this.item_no = this.urlParams.item_no;
        },
        /**
         * 得到图形数据
         */
        getOptions() {
            this.$resetAjax({
                url: '/NewA/Goods/get_table',
                type: 'POST',
                data: {
                    item_no: this.item_no,
                    selectTime: this.selectTime,
                    time_no: this.timeModel,
                },
                success:(res) => {
                    this.isTable = true;
                    this.options.xAxis[0].data = res.data.time;
                    this.options.series[0].data = res.data.chuku_num;
                    this.options.series[1].data = res.data.kucun_num;
                    this.options.series[2].data = res.data.lingshou_num;
                    this.spinShow = false;
                }
            })
        },
        /**
         * 得到所选时间
         */
        getSelectTime(date) {
            this.selectTime = date;
            let timeStart = Date.parse(new Date(this.selectTime[0]));
            let timeEnd = Date.parse(new Date(this.selectTime[1]));
            let nowTime = Date.parse(new Date())
            let nowdate = new Date(this.selectTime[1]);
            //获取系统前一个月的时间
            let lastMonth = nowdate.setMonth(nowdate.getMonth()-1);
            if (timeStart < lastMonth) {
                this.$root.tip.isShow = true;
                this.$root.tip.content = '抱歉！选择的时间区间不能超过1个月!';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 2000);
            } else {
                this.getOptions();
            }
        },
        /**
         * 得到时间周期
         */
        getTimeModel(timeModel) {
            this.timeModel = timeModel;
            this.getOptions();
        }
    }
}




</script>
