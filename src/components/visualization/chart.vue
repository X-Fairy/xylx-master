<template>
    <Echart  :options="options" style="height:500px;width:100%;" @mousedown="chartMd" :autoresize="true" />
</template>

<script>
export default {
    methods: {
        chartMd() {
            console.log(arguments)
            debugger
        }
    },

    data() {
        return {
            options: {
                color: ['#3398DB'],
    
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'直接访问',
                        type:'bar',
                        barWidth: '60%',
                        data:[10, 52, 200, 334, 390, 330, 220]
                    }
                ]

            }
        }
    }
}
</script>
