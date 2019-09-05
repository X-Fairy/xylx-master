<template>
    <div class="shopCar">
        <div class="shopCar_left">
            <div class="search">
                <div class="input_search">
                    <Input v-model="keyword" placeholder="请输入联系人名称..." style="width: 200px" @on-enter="getShopData"/>
                    <Button slot="append" icon="ios-search"  @click="getShopData"></Button>
                </div>
                <Select v-model="area" style="width:206px;margin-top: 5px;box-shadow:none" placeholder="请选择地区..." @on-change="getProvincename(area)">
                    <Option value="1" key="1">全部</Option>
                    <Option v-for="item in provinceList" :value="item.CODE" :key="item.CODE">{{ item.NAME }}</Option>
                    <Option value="2" key="2">国外</Option>
                </Select>
            </div>
            <!-- 列表 -->
            <ul class="on_line">
                <li v-for="(item, index) in contactData" :key="item.fid" @click="getContactInfo(item, index)" :class="{selected: currendIndex== index}">
                    <span>{{item.user_name}}</span>
                </li>
            </ul>
        </div>
        <div class="shopCar_right" >
            <!-- 联系人信息 -->
            <div class="contact_info">
                <div class="info_top">
                    <p>姓名: <span>{{contact_info.info_name}} 【{{contact_info.info_code}}】</span></p>
                </div>
                <div class="info_table">
                    <Table border :height="carHeight" :columns="carColumns" :data="carData"></Table>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import {sortName} from  '@/assets/js/tool.js' 
import {getNumBox,changeTime} from  '@/assets/js/tool.js' 
export default {
    data() {
        return {
            // 搜索关键字
            keyword: '',
            // 省份
            area: 1,
            // 省份列表
            provinceList: [],
            // 联系人数据
            contactData: [],
            // 点击到哪个联系人
            currendIndex: 0,
            // 联系人具体信息
            contact_info: {
                // 联系人名字
                info_name: '',
                // 联系人id
                info_id: '',
            },
            // 联系人购物车数据
            carData: [],
            // 购物车列表高度
            carHeight: 740,
            // 购物车表头数据
            carColumns: [
                {
                    key: 'sphh',
                    title: '商品条码',
                    align: 'center'
                },
                {
                    key: 'item_name',
                    title: '商品名称',
                    align: 'center'
                },
                {
                    key: 'num',
                    title: '数量',
                    align: 'center',
                    renderHeader: (h,params)=>{
                        let text1 = getNumBox(this.carData.map(ele => Number(ele.num)));
                        return h('div',[
                            h('strong','数量'),
                            h('span', {
                                style: {
                                    marginLeft: '15px',
                                    color: '#1596ad',
                                    fontSize: '14px',
                                    display: 'inline-block'
                                },
                            },`(合计: ${text1})`)
                        ])
                    },
                },
                {
                    key: 'price',
                    title: '单价',
                    align: 'center'
                },
                {
                    key: 'cart_times',
                    title: '过期时间',
                    align: 'center'
                },
                {
                    key: 'cowtotal',
                    title: '',
                    align: 'center',
                    renderHeader: (h,params)=>{
                        let text = getNumBox(this.carData.map(ele => Number(ele.cowtotal))).toFixed(2);
                        return h('div',[
                            h('strong','小计'),
                            h('span', {
                                style: {
                                    marginLeft: '15px',
                                    color: '#1596ad',
                                    fontSize: '14px',
                                    display: 'inline-block'
                                },
                            },`(合计: ￥${text})`)
                        ])
                    },
                },
            ],
        }
    },
    created() {
        
        // 得到省份列表
        this.getProvince();
        // 得到所有购物车列表
        this.getShopData();
        
        
    },
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.carHeight = (windowHeight-228);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.carHeight = (windowHeight -228);
        })

    },

    methods: {
        /**
         * 得到省份列表
         */
        getProvince() {
            this.$resetAjax({
                type: 'POST',
                url:  '/NewA/Public/getprovince',
                success: (res) => {
                    this.provinceList = JSON.parse(res).data;
                }
            })
        },
        /**
         * 选择省份
         */
        getProvincename(area) {
            this.keyword = '';
            this.area = area;
            this.getShopData();
        },
        /**
         * 得到所有购物车列表
         * @param {String} username 搜索关键字
         * @param {Number} src 联系人来源
         * @param {String} page page类型
         */
        getShopData() {
            this.$resetAjax({
                type: 'GET',
                url: '/NewA/Carts/getlist',
                data: {
                    username: this.keyword,
                    area: this.area
                },
                success: (res) => {
                    if (JSON.parse(res).count !== '0') {
                        this.currendIndex = 0;
                        this.contactData = sortName(JSON.parse(res).data, 'user_name');
                        this.contact_info = {
                            info_name: this.contactData[0].user_name,       // 联系人名字
                            info_code: this.contactData[0].sissid,         // 门店id
                        }
                        // 得到该联系人的门店详情
                        this.getStoreDetail();
                    } else {
                        this.contact_info = {
                            info_name: '',       // 联系人名字
                            info_code: '',         // 门店id
                        };
                        this.carData = [];
                    }
                    
                }
            })
        },
        /**
         * 得到联系人信息
         */
        getContactInfo(item, index) {
            this.currendIndex = index;
            this.contact_info = {
                info_name: item.user_name,                 // 联系人名字
                info_code: item.sissid,                  // 门店id
            }
            // 得到该联系人的门店详情
            this.getStoreDetail();
        },
        /**
         * 得到该联系人的门店详情
         * @param {String}  code  门店id
         */
        getStoreDetail() {
            this.$resetAjax({
                type: 'POST',
                url: '/NewA/Carts/getinfo',
                data: {
                   code: this.contact_info.info_code
                },
                success: (res) => {
                    res.data.forEach(ele => {
                        ele.cowtotal = (Number(ele.price) * Number(ele.num)).toFixed(2)
                        ele.cart_times=parseInt(ele.addtime)+parseInt(ele.cart_times);
                        ele.cart_times=changeTime(ele.cart_times*1000);
                    });
                    this.carData = res.data;
                }
            })
        },
    }
}
</script>
