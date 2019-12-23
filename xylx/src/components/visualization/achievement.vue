<template>
    <div class="achievement">
        <div class="titles">
            <h2>部门销售业绩统计面板</h2>
        </div>
        <!-- <div class="search">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="日期" prop="date">
                    <DatePicker type="daterange" :options="options" v-model="formValidate.date" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem class="check">
                    <Button type="ghost" @click="judgeFull(formValidate)">查询</Button>
                </FormItem>
            </Form>
        </div> -->
        <div class="content" v-if="isLoadingPop==false">
            
            <div class="floor1"  @click="lookemployment">
                <!-- <div class="part_one">
                    <div class="wave-echart" id='waveEchart' ref='waveEchart' ></div>
                </div> -->
                <div class="part_two">
                    <Echart style="width:100%;height:100%;margin-top: -5px;" :options="val1dataOptions" :autoResize="true"/>
                </div>
            </div>
            <div class="floor2">
                    <Echart style="width:100%;height:100%" :options="employmentOptions" />
            </div>
        </div>
        <!-- 弹窗 -->
        <div class="more_detail" v-if="isShowMore">
            <div class="loading_pop" v-show="isLoadingPop">
                <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571638198436&di=6668ed954daacea3eee32bb340980b0f&imgtype=0&src=http%3A%2F%2Fimg.ui.cn%2Fdata%2Ffile%2F4%2F2%2F3%2F1814324.gif" alt="">
            </div>
            <!-- 总销售额的走势弹窗 -->
            <div class="total_trend">
                <h3 class="pop_top">
                    <p>客服部员工业绩统计图</p>
                    <img @click="isShowMore=false" src="@/assets/images/view/pop_close.png" class="close_icon" alt="">
                </h3>
                <div class="saleTrend">
                    <!-- <Echart style="width:100%;height:100%" :options="employmentOptions" /> -->
                </div>
            </div>
        </div>
        <!-- 提示框 -->
        <div class="tip" v-show="isShowTip">
            {{tipContent}}
        </div>
        <div class="loading_pop" v-show="isLoadingPop">
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571638198436&di=6668ed954daacea3eee32bb340980b0f&imgtype=0&src=http%3A%2F%2Fimg.ui.cn%2Fdata%2Ffile%2F4%2F2%2F3%2F1814324.gif" alt="">
        </div>
    </div>
</template>
<script>
    import {liquidFillOptions} from './chart-config';
    import echartsLiquidfill from 'echarts-liquidfill'
    import echarts from 'echarts'
    import{ val1dataOptions,employmentOptions} from './chart-config'; 
    export default{
        data(){
            return{
                // 正在加载中
                isLoadingPop:false,
                // 提示文字
                isShowTip:false,
                tipContent:'',
                // 查询表单
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
                // 水球图
                val1data : [ ],
                arr:[],
                val1dataOptions:{},
                // 是否显示柱状图
                isShowMore:false,
                dataAxis:[],
                data:[],
                dataShadow:[],
                employmentOptions:{},
            }
        },
        created(){
            //页面刚进入时开启长连接
            this.wss();
            this.getinfo();
            
        },
        methods:{
            // 连接wss
            wss(){
                let that=this;
                var websocket = new WebSocket('wss://sw.xmvogue.com');
                var content='{"user_id":"kf1111"}';
                //连接发生错误的回调方法
                websocket.onerror = function () {
                    console.log('连接失败');
                };        
                //连接成功建立的回调方法                
                websocket.onopen = function () {
                    console.log('连接成功');
                    websocket.send(JSON.stringify({
                        class:'Newoa',
                        action:'connect',
                        content:content
                    }));
                };
                // websocket.onmessage = function (data) {
                //     that.socketMsg(data)
                // }
                setInterval(function () {
                    websocket.send(JSON.stringify({
                        class:'Newoa',
                        action:'keep',
                        content:""
                    }));
                }, 50000); 
            },
            // socketMsg (data) {
            //     console.log(JSON.parse(data))
            // },
            /**
             *  根据时间查询
            */
            judgeFull(formValidate) {
                this.spinShow=true;
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        
                    } else {}
                })
            },
            // 水位图
            initWave (ref) {
                var myChart = echarts.init(document.getElementById('waveEchart'));
                var option = {
                    title: {// 标题
                        text: '补贴资金剩余',
                        textStyle: {// 标题的样式
                        color: '#888', // 字体颜色
                        fontFamily: 'Microsoft YaHei', // 字体
                        fontSize: 14,
                        fontWeight: '400',
                        align: 'center', // 文字的水平方式
                        baseline: 'middle',
                        position: 'inside',
                        verticalAlign: 'middle'// 文字的垂直方式
                        },
                        left: 'center', // 定位
                        top: '20%'
                    },
                    series: [{
                        type: 'liquidFill',
                        radius: '95%',
                        waveAnimation: true,
                        data: [{
                        value: 0.5,
                        direction: 'left',
                        itemStyle: {
                            normal: {
                            color: '#1890ff'
                            }
                        }
                        }],
                        outline: {
                        // show: true , //是否显示轮廓 布尔值
                        borderDistance: 1, // 外部轮廓与图表的距离 数字
                        itemStyle: {
                            borderColor: '#1890ff', // 边框的颜色
                            borderWidth: 3 // 边框的宽度
                            // shadowBlur: 5 , //外部轮廓的阴影范围 一旦设置了内外都有阴影
                            // shadowColor: '#000' //外部轮廓的阴影颜色
                        }
                        },
                        itemStyle: {
                        opacity: 0.9, // 波浪的透明度
                        shadowBlur: 0 // 波浪的阴影范围
                        },
                        backgroundStyle: {
                        color: '#fff' // 图表的背景颜色
                        },
                        label: { // 数据展示样式
                        show: true,
                        color: '#000',
                        insideColor: '#fff',
                        fontSize: 20,
                        fontWeight: 400,
                        align: 'center',
                        baseline: 'middle',
                        position: 'inside'
                        }
                    }]
                }
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(option)
                
            },
            // 获取客户部员工业绩
            getinfo(){
                $.ajax({
                    type: 'post',
                    url: 'http://oa.xmvogue.com/index.php/Home/Api/kf_1111',
                    success:(res) => {
                        let data=JSON.parse(res).bumenyeji;
                        for(let i in data){
                            this.val1data.push({value:data[i],name:'客户'+i+'部'})
                        }
                        this.arr=['middleLost', JSON.parse(res).zongyeji, this.val1data, '完成进度']
                        this.val1dataOptions = val1dataOptions(this.val1data,this.arr);
                        let list=JSON.parse(res).ulist;
                        var objectArraySort = function (keyName) {
                            return function (objectN, objectM) {
                                var valueN = objectN[keyName]
                                var valueM = objectM[keyName]
                                if (valueN < valueM) return 1
                                else if (valueN > valueM) return -1
                                else return 0
                            }
                        }
                        list.sort(objectArraySort('yeji'))
                       
                        list.forEach(ele=>{
                            this.dataAxis.push(ele.name);
                            this.data.push(ele.yeji)
                        })
                        this.employmentOptions = employmentOptions(this.dataAxis,this.data);
                    }
                })
            },
            
            //查看员工业绩
            lookemployment(){
                this.isShowMore=true;
                
            } 
        }
    }
</script>