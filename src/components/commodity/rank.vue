<template>
    <div class="rank" id="rank">
        <div class="header_left">
            <div class="left">
                <Row>
                    <i-Col span="12">
                        <span style="color:#1d8c9f;">时间周期：</span>
                        <Select v-model="timeModel" style="width:160px" @on-change="getTimeModel(timeModel)">
                            <Option v-for="item in timeModelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </i-Col>
                    <i-Col span="12">
                        <span style="color:#1d8c9f;">选择时间：</span>
                        <DatePicker :value="selectTime" @on-change="getSelectTime" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
                    </i-Col>
                </Row>
            </div>
            <Button type="info" class="back" @click="$router.push({path: 'commodity'})">返回商品管理</Button>
        </div>
        <!-- 内容区 -->
        <div class="contanier">
           <Echart :options="options"/>
        </div>
         <!-- 提示框 -->
        <tip v-if="istip" :tipContent="tip"></tip> 
    </div>
</template>


<script>

import tip from '../tip.vue'


export default {
    components: {
        tip,
    }, 

    data() {
        return {
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
            // 图形数据
            options:{
                title : {
                    text: '',
                    // subtext: '数据来自网络'
                },
                tooltip : {
                    trigger: 'axis'
                },
                // legend: {
                //     data:['2016年']
                // },
                toolbox: {
                    'show':true, 
                    // orient : 'vertical',
                    x: 'center', 
                    y: 'top',
                    feature : {
                        mark : {show: true},
                        dataView : {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                        type : 'value',
                        boundaryGap : [0, 0.01],
                        // 坐标轴名称
                        name: '',
                        // 分隔线，默认显示 不显示为true
                        splitLine: false,
                    }
                ],
                yAxis : [
                    {
                        type : 'category',
                        data : [],
                         // 坐标轴文本标签选项
                        axisLabel: {
                            // 标签旋转角度，默认为0，不旋转，正值为逆时针，负值为顺时针，可选为：-90 ~ 90
                            rotate: 60,
                            // 	坐标轴文本标签是否可点击
                            clickable: true,
                            // 坐标轴文本标签与坐标轴的间距，默认为8，单位px
                            // marginLeft: 135,
                            // 横坐标文字的颜色
                            textStyle: {
                                color: '#000'
                            }
                        },
                    }
                ],
                series : [
                    {
                        name:'',
                        type:'bar',
                        data:[],
                        barWidth: '30px',
                        // 图形样式，可设置图表内图形的默认样式和强调样式（悬浮时样式）：
                        itemStyle: {
                            // 默认样式,要和最外面的// 数值系列的颜色列表color: ['red', 'blue', 'black'],设置相同
                            normal: {
                                color: '#428bca'
                            },
                            // 强调样式（悬浮时样式）：
                            emphasis: {
                                color: '#bfdaa7'
                            }
                        },
                    },
                ]
            },
            // 是否显示提示框
            istip: false,
            // 提示框文本
            tip: ''
        }
    },

    created() {
        // 得到图形数据
        this.getOptions();
    },

    methods: {
        /**
         * 得到图形数据
         */
        getOptions() {
            this.$resetAjax({
                url: '/NewA/Goods/get_table2',
                type: 'POST',
                success:(res) => {
                    this.options.yAxis[0].data = res.data.name;
                    this.options.series[0].data = res.data.num.reverse();
                    this.options.yAxis[0].name = '商品名称';
                    if (this.typeModel == 1) {
                        this.options.series[0].name = '出库量';
                        this.options.title.text = `商品出库量排行榜(${res.data.timelist[0]} 至 ${res.data.timelist[1]})`;
                        this.options.xAxis[0].name = '出库量';
                    } else if (this.typeModel == 2) {
                        this.options.xAxis[0].name = '零售量';
                        this.options.series[0].name = '零售量';
                        this.options.title.text = `商品零售量排行榜(${res.data.timelist[0]} 至 ${res.data.timelist[1]})`;
                    } else {
                        
                        this.options.xAxis[0].name = '库存量';
                        this.options.series[0].name = '库存量';
                        this.options.title.text = `商品库存量排行榜(${res.data.timelist[0]} 至 ${res.data.timelist[1]})`;
                    }
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
                this.istip = true;
                this.tip = '抱歉！选择的时间不能超过1个月！';
                setTimeout(() => {
                    this.istip = false;
                }, 2000);
            }  else if (timeEnd > nowTime) {
                this.istip = true;
                this.tip = '抱歉！选择的时间不能大于今天！';
                setTimeout(() => {
                    this.istip = false;
                }, 2000);
            }
            this.getOptions();
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
>
