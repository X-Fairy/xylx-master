<!-- echartscom.vue -->
<template>
    <div>
    </div>
</template>

<script>
    import echarts from 'echarts'
 export default{
    name:'echarts',
    props: ['options', 'index'],
    data() {
        return {
        };
    },
    methods: {
        initOption() {
            var arr1 = [] // x轴刻度
            var arr2 = [] // y轴数据值
            var arr3=[]
            var txt='';
            // 取出需要的数据
            var title=["全部分类", "家居百货", "健康美容", "饰品系列","文体礼品","季节产品","精品包饰","儿童玩具","毛绒公仔","数码配件"];
            arr2=this.options.map(ele=>ele.QTY);
            arr1=this.options.map(ele=>ele.NAME);
            arr3=this.options.map(ele=>ele.TOTAL);
            // for(let i=1;i<=this.options.length;i++){
            //     arr1.push(i);
            // }
            var myChart = echarts.init(document.getElementById('charts' + this.index));
            // 指定图表的配置项和数据
            var option = {
               
                color: ['#4dc7c9', '#f4bc8e'],
                // legend: {
                //     x: 'center',
                //     data: ['销售数量','金额']
                // },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              grid: {
                left: '10%',
                right: '10%',
                bottom: '3%',
                containLabel: true,
              },
              xAxis: [
                {
                    axisLabel: {
                            // 标签旋转角度，默认为0，不旋转，正值为逆时针，负值为顺时针，可选为：-90 ~ 90
                            rotate: 15,
                            // 	坐标轴文本标签是否可点击
                            clickable: true,
                            // 坐标轴文本标签与坐标轴的间距，默认为8，单位px
                            margin:12,
                            textStyle: {
                                color: '#333'
                            }
                        },
                  type: 'category',
                  name:'商品名称',
                  nameTextStyle: {
                        color: '#1596ad'
                    },
                  data: arr1, // X轴的刻度
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              yAxis: [
                // y轴的刻度值自动调整
                {
                  type: 'value',
                  name: '数量/金额',
                  nameTextStyle: {
                        color: '#1596ad'
                    },
                },
                
              ],
              series: [
                {
                    name: '销售数量',
                    type: 'bar',
                    // barWidth: '60%',
                    data: arr2 // 具体选择数值
                },
                {
                    name: '金额',
                    type: 'bar',
                    // barWidth: '60%',
                    data: arr3 // 具体选择数值
                }
              ]
            }
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option)
        }
    },
    computed: {
    },
    mounted() {
        this.initOption();
    },
    components: {}
};
</script>
