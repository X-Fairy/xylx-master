<template>
    <div class="yh-liquidfill"></div>
</template>
<script>
function _update(chart, v) {
    var p = Math.max(0, Math.min(v, 1));
    var second = p > 0.1 ? p : p - 0.05;
    chart.setOption({
        series: [
        {
            name: "liquidFill",
            data: [p, second]
        }
        ]
    });
}

export default {
    name: "YhLiquidfille",
    data() {
        return {
        value: 0
        };
    },
    props: ["init", "color", "size"],
    watch: {
        value(v) {
        _update(this.$chart, v);
        }
    },
    methods: {},
    mounted() {
        var chart = echarts.init(this.$el);
        var wcolor = ["#663300", "#ffcc99"];
        var bdcolor = "#663300";
        var lcolor = "#663300";
        var bgcolor = "#e3e7ff";
        var c = this.color;
        if (c) {
        wcolor = c.wave || wcolor;
        bdcolor = c.border || bdcolor;
        lcolor = c.label || lcolor;
        bgcolor = c.background || bgcolor;
        }
        var option = {
        series: [
            {
            type: "liquidFill",
            name: "liquidFill",
            color: wcolor,
            outline: {
                show: true,
                borderDistance: 8,
                itemStyle: {
                color: "none",
                borderColor: bdcolor,
                borderWidth: 8,
                shadowBlur: 20,
                shadowColor: "rgba(0, 0, 0, 0.25)"
                }
            },
            backgroundStyle: {
                color: bgcolor
            },
            label: {
                color: lcolor
            },
            data: []
            }
        ]
        };
        chart.setOption(option);
        var v = this.init;
        if (this.init) {
        this.value = v;
        }
        this.$chart = chart;
    }
};
</script>