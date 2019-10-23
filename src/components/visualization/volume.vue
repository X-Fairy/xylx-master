<template>
    <div class="volume">
        <div class="top">
            <div class="top_inner">
                <div class="inner_left">
                    {{helloDate}} 
                </div>
                <div class="inner_right">
                    <DatePicker class="date" :options="options4" type="daterange" @on-change="getDateRange" confirm placement="bottom-end" placeholder="时间区间" style="width: 180px"></DatePicker>
                    <p class="area"><Input v-model="store" placeholder="请输入门店编码..." style="width: 180px" /></p>
                    <p class="check" @click="getStoreData"><img src="@/assets/images/view/search_icon.jpg" alt=""><span>查询</span></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            options4: {   // 时间选择限制
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            // 问候语
            helloDate: '',
            // 开始日期
            stime: '',
            // 结束日期
            etime: '',
            store: '', // 门店编码
        }
    },
    created() {
        // 得到时间问候语
        this.getHello();
    },

    methods: {
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
         * 得到门店指标数据
         */
        getStoreData() {}
    }
}
</script>

