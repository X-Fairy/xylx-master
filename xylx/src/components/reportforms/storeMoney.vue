<template>
    <div class="store_money">
        <!-- 条件选择 -->
       <div class="top">
           <div class="top-left">
                <div class="part">
                    <span class="item">门店类型</span>
                    <Select v-model="storeType"  style="width:200px"  @on-change="getstoreType(storeType)" placeholder='请选择门店类型'>
                        <Option v-for="item in storeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="part">
                    <span class="item">门店状态</span>
                    <Select v-model="storeStatus"  style="width:300px" multiple @on-change="getstoreStatus(storeStatus)" placeholder='请选择门店状态'>
                        <Option value="11" key="11">全选</Option>
                        <Option value="22" key="22">不选</Option>
                        <Option v-for="item in storeStatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="search_code">
                    <span class="item">门店编码</span>
                    <div>
                        <Input v-model="code" placeholder="请输入要搜索的门店编码" @on-enter="searchCode"/>
                    </div>
                </div>
            </div>
             <div class="top-right" style="margin-top: -15px;">
                <button class="search" @click="getStoreCheck">门店查询</button>
                <button class="search" @click="getAreaCheck">地区查询</button>
                <button class="load" @click="loadSm">报表导出</button>
            </div>
            <div class="top-left" style="margin-top:-15px;padding-top:0;">
                <div class="part">
                    <span class="item">日期选择</span>
                    <DatePicker type="datetimerange" :options="options4" v-model="dateRange" format="yyyy-MM-dd" style="width:200px" placeholder="请选择日期" @on-change="getDateRange"></DatePicker>
                </div>
                <div class="part area">
                    <span class="item">地区选择</span>
                        <Select v-model="area" style="width:300px" placeholder="请输入地区" filterable multiple @on-change="getprovincename(area)" >
                            <Option value="1" key="1">全选</Option>
                            <Option value="2" key="2">不选</Option>
                        <Option v-for="item in provinceList" :value="item.CODE" :key="item.CODE">{{ item.NAME }}</Option>
                    </Select>
                </div>
                <div class="part">
                    <span class="item">销售金额</span>
                    <Select v-model="saleType"  style="width:160px" @on-change="getSaleType(saleType)">
                        <Option v-for="item in saleList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
            </div>
       </div>
       <!-- 内容区 -->
       <div class="table">
            <Table border :height="tableHeight" :columns="columns" :data="tableData" v-if="countarea == ''"></Table>
            <Table border :height="tableHeight" :columns="columns2" :data="tableData2" v-else></Table>
        </div>
        <div class="footer">
            <!-- 分页 按门店查询显示 -->
            <Page  v-if="countarea == ''"  :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
            <!-- 按地区查询显示 -->
            <p v-else>共<span class="area-check">{{total2}}</span>条数据</p>
        </div>
        <!-- 加载进度 -->
        <div class="demo-spin-col" v-if="spinShow">
            <Spin fix>
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div style="font-size:16px;color:#1d8c9f;">数据正在加载中,请稍等...</div>
            </Spin>
        </div>
    </div>
    
</template>



<script>
// 时间转换
import {changeday} from  '@/assets/js/tool.js'
// 提示组件
import tipModal from '../tip.vue'

export default {
    components:{
        tipModal
    },

    data() {
        return {
            // 省份
            area: '',
            // 门店编码
            code: '',
            // 门店状态
            storeStatus: [0],
            // 门店状态数据
            storeStatusList: [
                {
                    value: 0,
                    label: '正常营业'
                },
                {
                    value: 1,
                    label: '关店'
                },
                {
                    value: 2,
                    label: '暂停营业'
                },
                {
                    value: 3,
                    label: '未开业'
                },
                {
                    value: 4,
                    label: '默认门店状态'
                },
                {
                    value: 5,
                    label: '停止营业'
                },
            ],
            // 省份列表
            provinceList: [],
            // 得到时间范围
            dateRange: [],
            // 是否是地区查询还是门店查询
            countarea: '',
            // 得到门店类型
            storeType: 3,
            // 门店类型数据
            storeList: [
                {
                    value: 1,
                    label: '全部'
                },
                {
                    value: 2,
                    label: '直营'
                },
                {
                    value: 3,
                    label: '加盟'
                },
            ],
            // 选择是否要显示销售金额
            saleType: 2,
            // 是否显示销售金额的数据
            saleList: [
                {
                    label: '显示销售金额',
                    value: 1
                },
                {
                    label: '不显示销售金额',
                    value: 2
                },
            ],
            // 内容数据
            tableData: [],
            // 表格高度
            tableHeight: 630,
            // 缴款总金额
            sumremit: '0',
            // 首批出货
            sumnew: '0',
            // 补货出货
            sumreplenishment: '0',
            // 销售金额
            sumsale: '0',
            // 缴款倒序
            remit: '',
            new: '',
            replenishment: '',
            sales: '',
            // 当前页码
            currentPage: 1,
            // 页面总数
            total: 0,
            // 每页条数
            pageSize: 20,
            // 是否显示加载进度条
            spinShow: false,
            // 对时间进行限制,选择不到大于今天的时间
            options4: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            // 地区查询得到的数据
            tableData2: [],
            // 地区查询得到的总数
            total2: 0,

        }
        
    },

    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 240);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 240);
        })
      
    },

    // 灵活性表头
    computed: {
        // 门店查询得到的表头
        columns() {
            let arr = [
                {
                    title: '门店编码',
                    key: 'CODE'
                },
                {
                    title: '门店名称',
                    key: 'NAME'
                },
                {
                    title: '区域',
                    key: 'ARNAME'
                },
                {
                    title: `缴款`,
                    key: 'REMIT',
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','缴款'),
                            h('Icon',{
                                props:{
                                    type: 'arrow-up-a'
                                },
                                style: {
                                    marginLeft: '5px',
                                },
                                domProps: {
                                    title: '升序'
                                },
                                on: {
                                    click:() => {
                                        // 向前找时间
                                        this.remit = 1;
                                        this.new = '';
                                        this.replenishment  = '';
                                        this.sales = '';
                                        if (this.dateRange.length !==0 && this.area.length !== 0) {
                                            this.getAllMoney();
                                        } 
                                        
                                    }
                                }
                            }),
                            h('Icon',{
                                props:{
                                    type: 'arrow-down-a'
                                },
                                style: {
                                    marginLeft: '5px',
                                },
                                domProps: {
                                    title: '倒序'
                                },
                                on: {
                                    click:() => {
                                        this.remit = 2;
                                        this.new = '';
                                        this.replenishment  = '';
                                        this.sales = '';
                                        if (this.dateRange.length !==0 && this.area.length !== 0) {
                                            this.getAllMoney();
                                        } 
                                    }
                                }
                            }),
                            h('span', {
                                style: {
                                    marginLeft: '15px',
                                },
                            },('(￥' + this.sumremit + ')'))
                        ])
                    }
                },
                {
                    title: `首批出货`,
                    key: 'NEW',
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','首批出货'),
                            h('Icon',{
                                props:{
                                    type: 'arrow-up-a'
                                },
                                style: {
                                    marginLeft: '5px',
                                },
                                domProps: {
                                    title: '升序'
                                },
                                on: {
                                    click:() => {
                                        // 向前找时间
                                        this.remit = '';
                                        this.new = 1;
                                        this.replenishment  = '';
                                        this.sales = '';
                                        if (this.dateRange.length !==0 && this.area.length !== 0) {
                                            this.getAllMoney();
                                        } 
                                    }
                                }
                            }),
                            h('Icon',{
                                props:{
                                    type: 'arrow-down-a'
                                },
                                style: {
                                    marginLeft: '5px',
                                },
                                domProps: {
                                    title: '倒序'
                                },
                                on: {
                                    click:() => {
                                        this.remit = '';
                                        this.new = 2;
                                        this.replenishment  = '';
                                        this.sales = '';
                                        if (this.dateRange.length !==0 && this.area.length !== 0) {
                                            this.getAllMoney();
                                        } 
                                    }
                                }
                            }),
                            h('span', {
                                style: {
                                    marginLeft: '15px',
                                },
                            },('(￥' + this.sumnew + ')'))
                        ])
                    }
                },
                {
                    title: `补货出货`,
                    key: 'REPLENISHMENT',
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','补货出货'),
                            h('Icon',{
                                props:{
                                    type: 'arrow-up-a'
                                },
                                style: {
                                    marginLeft: '5px',
                                },
                                domProps: {
                                    title: '升序'
                                },
                                on: {
                                    click:() => {
                                        // 向前找时间
                                        this.remit = '';
                                        this.new = '';
                                        this.replenishment  = 1;
                                        this.sales = '';
                                        if (this.dateRange.length !==0 && this.area.length !== 0) {
                                            this.getAllMoney();
                                        } 
                                    }
                                }
                            }),
                            h('Icon',{
                                props:{
                                    type: 'arrow-down-a'
                                },
                                style: {
                                    marginLeft: '5px',
                                },
                                domProps: {
                                    title: '倒序'
                                },
                                on: {
                                    click:() => {
                                        this.remit = '';
                                        this.new = '';
                                        this.replenishment  = 2;
                                        this.sales = '';
                                        if (this.dateRange.length !==0 && this.area.length !== 0) {
                                            this.getAllMoney();
                                        } 
                                    }
                                }
                            }),
                            h('span', {
                                style: {
                                    marginLeft: '15px',
                                },
                            },('(￥' + this.sumreplenishment + ')'))
                        ])
                    }
                },
                // {
                //     title: '操作',
                //     key: 'action',
                //     align: 'center',
                //     render: (h, params) => {
                //         return h('div',
                //             [h('span', {
                //                 class: 'replenishment',
                //                 domProps:{
                //                     title:'点击查看出货明细'
                //                 },
                //                 on: {
                //                     click:() => {
                //                         this.$router.push({path:'replenishment', query: {CODE: params.row.CODE, start_time: this.dateRange[0], end_time: this.dateRange[1]}});
                //                     }
                //                 }
                //             }, '出货明细'),
                //         ]);
                //     }
                // }
            ];
            // 根据是否要显示金额来动态的显示表头的销售金额这一列
            let item = {
                title: `销售金额`,
                key: 'SALE',
                renderHeader: (h,params)=>{
                    return h('div',[
                        h('strong','销售金额'),
                        h('Icon',{
                            props:{
                                type: 'arrow-up-a'
                            },
                            style: {
                                marginLeft: '5px',
                            },
                            domProps: {
                                title: '升序'
                            },
                            on: {
                                click:() => {
                                    // 向前找时间
                                    this.remit = '';
                                    this.new = '';
                                    this.replenishment  = '';
                                    this.sales = 1;
                                    if (this.dateRange.length !==0 && this.area.length !== 0) {
                                        this.getAllMoney();
                                    } 
                                }
                            }
                        }),
                        h('Icon',{
                            props:{
                                type: 'arrow-down-a'
                            },
                            style: {
                                marginLeft: '5px',
                            },
                            domProps: {
                                title: '倒序'
                            },
                            on: {
                                click:() => {
                                    this.remit = '';
                                    this.new = '';
                                    this.replenishment  = '';
                                    this.sales = 2;
                                    if (this.dateRange.length !==0 && this.area.length !== 0) {
                                        this.getAllMoney();
                                    } 
                                }
                            }
                        }),
                        h('span', {
                            style: {
                                marginLeft: '15px',
                            },
                        },('(￥' + this.sumsale + ')'))
                    ])
                }
            }
            this.saleType == 1 && arr.splice(6, 0, item);
            return arr;
        },
        // 地区查询得到的表头
        columns2() {
            let arr2 = [
                {
                    title: '区域',
                    key: 'ARNAME'
                },
                {
                    title: `缴款`,
                    key: 'REMIT',
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','缴款'),
                            h('Icon',{
                                props:{
                                    type: 'arrow-up-a'
                                },
                                style: {
                                    marginLeft: '5px',
                                },
                                domProps: {
                                    title: '升序'
                                },
                                on: {
                                    click:() => {
                                        this.countarea = 1;
                                        // 向前找时间
                                        this.remit = 1;
                                        this.new = '';
                                        this.replenishment  = '';
                                        this.sales = '';
                                        if (this.dateRange.length !==0 && this.area.length !== 0) {
                                            this.getAllMoney();
                                        } 
                                        
                                    }
                                }
                            }),
                            h('Icon',{
                                props:{
                                    type: 'arrow-down-a'
                                },
                                style: {
                                    marginLeft: '5px',
                                },
                                domProps: {
                                    title: '倒序'
                                },
                                on: {
                                    click:() => {
                                        this.countarea = 1;
                                        this.remit = 2;
                                        this.new = '';
                                        this.replenishment  = '';
                                        this.sales = '';
                                        if (this.dateRange.length !==0 && this.area.length !== 0) {
                                            this.getAllMoney();
                                        } 
                                    }
                                }
                            }),
                            h('span', {
                                style: {
                                    marginLeft: '15px',
                                },
                            },('(￥' + this.sumremit + ')'))
                        ])
                    }
                },
                {
                    title: `首批出货`,
                    key: 'NEW',
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','首批出货'),
                            h('Icon',{
                                props:{
                                    type: 'arrow-up-a'
                                },
                                style: {
                                    marginLeft: '5px',
                                },
                                domProps: {
                                    title: '升序'
                                },
                                on: {
                                    click:() => {
                                        this.countarea = 1;
                                        // 向前找时间
                                        this.remit = '';
                                        this.new = 1;
                                        this.replenishment  = '';
                                        this.sales = '';
                                        if (this.dateRange.length !==0 && this.area.length !== 0) {
                                            this.getAllMoney();
                                        } 
                                    }
                                }
                            }),
                            h('Icon',{
                                props:{
                                    type: 'arrow-down-a'
                                },
                                style: {
                                    marginLeft: '5px',
                                },
                                domProps: {
                                    title: '倒序'
                                },
                                on: {
                                    click:() => {
                                        this.countarea = 1;
                                        this.remit = '';
                                        this.new = 2;
                                        this.replenishment  = '';
                                        this.sales = '';
                                        if (this.dateRange.length !==0 && this.area.length !== 0) {
                                            this.getAllMoney();
                                        } 
                                    }
                                }
                            }),
                            h('span', {
                                style: {
                                    marginLeft: '15px',
                                },
                            },('(￥' + this.sumnew + ')'))
                        ])
                    }
                },
                {
                    title: `补货出货`,
                    key: 'REPLENISHMENT',
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','补货出货'),
                            h('Icon',{
                                props:{
                                    type: 'arrow-up-a'
                                },
                                style: {
                                    marginLeft: '5px',
                                },
                                domProps: {
                                    title: '升序'
                                },
                                on: {
                                    click:() => {
                                        this.countarea = 1;
                                        // 向前找时间
                                        this.remit = '';
                                        this.new = '';
                                        this.replenishment  = 1;
                                        this.sales = '';
                                        if (this.dateRange.length !==0 && this.area.length !== 0) {
                                            this.getAllMoney();
                                        } 
                                    }
                                }
                            }),
                            h('Icon',{
                                props:{
                                    type: 'arrow-down-a'
                                },
                                style: {
                                    marginLeft: '5px',
                                },
                                domProps: {
                                    title: '倒序'
                                },
                                on: {
                                    click:() => {
                                        this.countarea = 1;
                                        this.remit = '';
                                        this.new = '';
                                        this.replenishment  = 2;
                                        this.sales = '';
                                        if (this.dateRange.length !==0 && this.area.length !== 0) {
                                            this.getAllMoney();
                                        } 
                                    }
                                }
                            }),
                            h('span', {
                                style: {
                                    marginLeft: '15px',
                                },
                            },('(￥' + this.sumreplenishment + ')'))
                        ])
                    }
                },
            ];
            let item2 =  {
                title: `销售金额`,
                key: 'SALE',
                renderHeader: (h,params)=>{
                    return h('div',[
                        h('strong','销售金额'),
                        h('Icon',{
                            props:{
                                type: 'arrow-up-a'
                            },
                            style: {
                                marginLeft: '5px',
                            },
                            domProps: {
                                title: '升序'
                            },
                            on: {
                                click:() => {
                                    this.countarea = 1;
                                    // 向前找时间
                                    this.remit = '';
                                    this.new = '';
                                    this.replenishment  = '';
                                    this.sales = 1;
                                    if (this.dateRange.length !==0 && this.area.length !== 0) {
                                        this.getAllMoney();
                                    } 
                                }
                            }
                        }),
                        h('Icon',{
                            props:{
                                type: 'arrow-down-a'
                            },
                            style: {
                                marginLeft: '5px',
                            },
                            domProps: {
                                title: '倒序'
                            },
                            on: {
                                click:() => {
                                    this.countarea = 1;
                                    this.remit = '';
                                    this.new = '';
                                    this.replenishment  = '';
                                    this.sales = 2;
                                    if (this.dateRange.length !==0 && this.area.length !== 0) {
                                        this.getAllMoney();
                                    } 
                                }
                            }
                        }),
                        h('span', {
                            style: {
                                marginLeft: '15px',
                            },
                        },('(￥' + this.sumsale + ')'))
                    ])
                }
            }
            this.saleType == 1 && arr2.splice(5, 0, item2);
            return arr2;
        },
       
    },


    created() {
        
        // 得到省份列表
        this.getProvince();
    },


    methods: {
        /**
         * 根据门店查询
         */
        getStoreCheck() {
            this.countarea = '';
            this.getAllMoney()
        },
        /**
         * 得到门店状态
         */
        getstoreStatus(storeStatus) {
            if (storeStatus.includes('11')) {
                this.storeStatus = [0,1,2,3,4,5]; 
            } else if(storeStatus.includes('22')) {
                this.storeStatus = [];
                this.$root.tip.isShow = true;
                this.$root.tip.content = '抱歉亲亲, 门店状态不能为空';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 2000);
            } else {
                this.storeStatus = storeStatus;
            }
            this.currentPage = 1;
        },
        /**
         * 根据地区来查询
         */
        getAreaCheck() {
            // 把门店编码架空
            this.code = '';
            // 把p架空
            this.currentPage = 1;
            // 把门店类型架空
            this.storeType = '';
            this.countarea = 1;
            this.getAllMoney()
        },
        /**
         * 得到省份列表
         */
        getProvince() {
            this.$resetAjax({
                type: 'POST',
                url:  '/NewA/Public/getpv_sub',
                success: (res) => {
                    this.provinceList = JSON.parse(res).data;
                }
            })
        },
        /**
         * 选择城市
         */
        getprovincename(area) {
            // 是全选
            if (area.includes('1')) {
                let arr  = this.provinceList.map(item => item.CODE);
                this.area = area = arr;
            } else if (area.includes('2')){
                // 不选
                this.area = [];
            } else {
                this.area = area;
            }
            this.currentPage = 1;
        },
        /**
         * 得到时间范围
         */
        getDateRange(date) {
            this.currentPage = 1;
            this.dateRange = date;
        },
        /**
         * 得到门店编码
         */
        searchCode() {
            this.currentPage = 1;
            if (this.dateRange.length !==0 && this.area.length !== 0) {
                this.getAllMoney();
            } 
        },
        /**
         * 得到门店类型
         */
        getstoreType(storeType) {
            this.currentPage = 1;
            this.storeType = storeType;
            if (this.dateRange.length !==0 && this.area.length !== 0) {
                this.getAllMoney();
            } 
           
        },
        /**
         * 是否显示销售金额
         */
        getSaleType(saleType) {
            this.currentPage = 1;
            this.saleType = saleType;
            if (this.dateRange.length !==0 && this.area.length !== 0) {
                this.getAllMoney();
            } 
        },
         /**
         * 切换页面
         */
        changePage(index) {
            this.currentPage = index;
            this.getAllMoney();
        },
        /**
         * 得到所有销售金额数据
         */
        getAllMoney() {
            if (this.storeStatus.length == 0) {
                this.$root.tip.isShow = true;
                this.$root.tip.content = '抱歉亲亲, 查询前门店状态不能为空.';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 2000);
            } else {
                if (this.dateRange[0] == '' || this.dateRange[1] == '') {
                this.$root.tip.isShow = true;
                this.$root.tip.content = '抱歉亲亲, 查询前必须要先选择日期.';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 2000);
                } else {
                    if (this.area.length == 0) {
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = "抱歉亲亲, 查询前必须要先选择地区."
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                        }, 4000);
                        
                    } else {
                        if (typeof this.dateRange[0] == 'object') {
                            this.dateRange[0] = changeday(+new Date(String(this.dateRange[0])));
                            this.dateRange[1] = changeday(+new Date(String(this.dateRange[1])));
                        }
                        this.spinShow = true;
                        this.$resetAjax({
                            type: 'GET',
                            url: '/NewA/Statement/getStkout',
                            data: {
                                // 选择时间
                                timelist: this.dateRange,
                                // 选择地区
                                area: this.area,
                                // 页数
                                p: this.currentPage,
                                // 门店类型
                                shoptype: this.storeType,
                                // 是否显示销售金额
                                sale: this.saleType,
                                // 缴款倒序升序
                                remit: this.remit,
                                // 首货出货倒序升序
                                new: this.new,
                                // 补货出货倒序升序
                                replenishment: this.replenishment,
                                // 销售金额倒序升序
                                sales: this.sales,
                                // 门店编码
                                code: this.code,
                                // 是否按地区查询还是按门店查询
                                countarea: this.countarea,
                                // 门店状态多选 
                                stat: this.storeStatus
                            },
                            success: (res) => {
                                this.spinShow = false;
                                this.tableData2 = [];
                                // 说明是按地区查询的
                                if (this.countarea == 1) {
                                    for (let i in res.data.data) {
                                        this.tableData2.push(res.data.data[i]);
                                    }
                                    this.total2 = Number(res.data.count);
                                    this.sumnew = res.data.sumnew;
                                    this.sumremit = res.data.sumremit;
                                    this.sumreplenishment = res.data.sumreplenishment;
                                    this.sumsale = res.data.sumsale;
                                } else {
                                    // 说明是按门店查询的
                                    this.tableData = res.data.data;
                                    this.sumnew = res.data.sumnew;
                                    this.sumremit = res.data.sumremit;
                                    this.sumreplenishment = res.data.sumreplenishment;
                                    this.sumsale = res.data.sumsale;
                                    this.total = Number(res.data.count);
                                }
                            }
                        }) 
                    }
                }
            }
        },
        /**
         * 导出报表
         */
        loadSm() {
            if (this.dateRange[0] == '' || this.dateRange[1] == '') {
                this.$root.tip.isShow = true;
                this.$root.tip.content = "抱歉,  导出报表前必须要先选择日期."
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 2000);
            } else {
                if (this.area.length == 0) {
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = "抱歉, 导出报表前必须要先选择地区."
                    setTimeout(() => {
                        this.$root.tip.isShow = false;
                    }, 3000);
                } else {
                    location.href = `/NewA/Statement/daochu?sale=${this.saleType}&timelist=${this.dateRange}&area=${this.area}&shoptype=${this.storeType}&countarea=${this.countarea}&stat=${this.storeStatus}`
                }
            }
        }
            
            
            
            
    }
}
</script>
