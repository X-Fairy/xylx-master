<template>
    <div class="goodDetail">
        <div class="top">
            <p>商品名称:<span class="item_name">{{item_name}}</span></p>
            <Button class="goBakc" title="点击返回商品列表" @click="$router.push({path:'commodity'})">商品列表</Button>
        </div>
        <div class="content">
            <div class="left">
                <p class="title" title="购物车列表">
                    <img src="@/assets/images/cars.png" alt="" class="title_image">
                    <span>购物车</span>
                </p>
                <Card class="table">
                    <Table border :columns="carsColumns" :height="carsHeight" :data="carsData"></Table>
                </Card>
            </div>
            <div class="right">
                <p class="title"  title="未完成订单列表">
                    <img src="@/assets/images/unfinished.png" alt="" class="title_image unfinish_image">
                    <span>未完成</span>
                </p>
                <Card class="table">
                    <Table border :columns="unfinishColumns" :height="unfinishHeight" :data="unfinishData"></Table>
                </Card>
            </div>
        </div>
    </div>
</template>

<script>

import {getNumBox} from "@/assets/js/tool.js"
import {getUrlParams} from  '@/assets/js/tool.js'

export default {
    data() {
        return {
            // 得到网址的参数对象
            urlParams: {},
            // 商品名称
            item_name: '',
            // 商品条码
            item_no: '',
            // 表格数据
            carsData: [],
            // 购物车表头
            carsColumns: [
                {
                    key: 'user_name',
                    align: 'center',
                    title: '店名',
                },
                {
                    key: 'num',
                    align: 'center',
                    title: '数量',
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','件数'),
                            h('span', {
                                style: {
                                    marginLeft: '15px',
                                    color: '#1d8c9f',
                                    fontSize: '14px',
                                    marginTop: '10px',
                                    display: 'inline-block'
                                },
                            },`(总计: ${this.carTotal}  件)`)
                        ])
                    },
                },
            ],
            // 购物车表格高度
            carsHeight: 900,
            // 未完成表格数据
            unfinishData: [],
            // 未完成表头
            unfinishColumns: [
                {
                    key: 'buyer',
                    align: 'center',
                    title: '店名',
                },
                {
                    key: 'sheet_no',
                    align: 'center',
                    title: '订单号',
                },
                {
                    key: 'order_qty',
                    align: 'center',
                    title: '订单数量',
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','件数'),
                            h('span', {
                                style: {
                                    marginLeft: '15px',
                                    color: '#1d8c9f',
                                    fontSize: '14px',
                                    marginTop: '10px',
                                    display: 'inline-block'
                                },
                            },`(总计: ${this.unfinishTotal}  件)`)
                        ])
                    },
                },
                
            ],
            // 未完成表格高度
            unfinishHeight: 900,
            // 购物车总计
            carTotal: '0',
            // 未完成总计
            unfinishTotal: '0',
        }
    },

    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.carsHeight = (windowHeight- 200);
            this.unfinishHeight = (windowHeight- 200);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.carsHeight = (windowHeight - 200);
            this.unfinishHeight = (windowHeight- 200);
        })
    },

    created() {
        // 得到网址的参数
        this.getUrlData();
        // 获取当前商品购物车及未完成的订单
        this.getGoodDetails();
    },

    methods: {
        /**
         * 得到网址的参数
         */
        getUrlData() {
            this.urlParams = getUrlParams();
            this.item_name = this.urlParams.item_name;
            this.item_no = this.urlParams.item_no;
        },
        /**
         * 获取当前商品购物车及未完成的订单
         */
        getGoodDetails() {
            this.$resetAjax({
                url: '/NewA/Shop/get_occupy',
                type: 'POST',
                data: {
                    code: this.item_no
                },
                success:(res) => {
                    this.carsData = res.data.carts;
                    this.carTotal = getNumBox(res.data.carts.map(ele => Number(ele.num)));
                    this.unfinishData = res.data.unfinished;
                    this.unfinishTotal = getNumBox(res.data.unfinished.map(ele => Number(ele.order_qty)));
                }
            })
        },
        
    }
}
</script>
