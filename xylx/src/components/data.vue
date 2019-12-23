<template>
    <div class="data">
        <div class="top">
            <div class="left">
                <span class="item">选择时间</span>
                <DatePicker :value="dateRange" type="dateRange" :options="options"   placeholder="请选择时间" style="width: 200px"></DatePicker>
            </div>
            <div class="right">
                <div class="part">
                    <span class="item">销售人效</span>
                    <Input v-model="num" type="number" style="width: 100px"></Input>
                </div>
                <div class="part">
                    <span class="item">店铺面积</span>
                    <Input v-model="area" type="number" style="width: 100px"></Input>
                </div>
            </div>
        </div>
        <div class="container">
            <div class="left">
                <img src="@/assets/images/leftBorder.png" alt="">
            </div>
            <div class="center"></div>
            <div class="right"></div>
        </div>
    </div>
</template>


<script>


export default {
    data() { 
        return {
        }
    },

    mounted() {
       
    },

    created() {
       
    },


    methods: {
       
    }
}

</script>






