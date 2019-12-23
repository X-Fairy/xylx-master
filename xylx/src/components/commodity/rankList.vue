<template>
    <div class="rank_list" id="rank_list">
        <div class="header_left">
            <div class="left">
                <Row>
                    <i-col span="8">
                        <span style="color:#1d8c9f;">商品分类：</span>
                        <Select v-model="goodsType" style="width:180px" @on-change="getType(goodsType)">
                            <Option value="" key="">全部</Option>
                            <Option v-for="item in goodsTypeList" :value="item.cls_no" :key="item.cls_no">{{ item.cls_name }}</Option>
                        </Select>
                    </i-col>
                    <i-Col span="8">
                        <span style="color:#1d8c9f;">时间周期：</span>
                        <Select v-model="timeModel" style="width:160px" @on-change="getTimeModel(timeModel)">
                            <Option v-for="item in timeModelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </i-Col>
                    <i-Col span="8">
                        <span style="color:#1d8c9f;">选择时间：</span>
                        <DatePicker :value="selectTime" :options="options4" @on-change="getSelectTime" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
                    </i-Col>
                </Row>
            </div>
            <Button type="info" class="back" @click="$router.push({path: 'commodity'})">返回商品管理</Button>
        </div>
        <div class="contanier">
            <!-- 商品信息 -->
            <div class="table" v-show="isTable">
                <Table border :height="tableHeight"  :columns="columns" :data="rankData"></Table>  
            </div>
        </div>
        <!-- 加载进度 -->
        <spin v-if="spinShow"></spin>
    </div>
</template>


<script>
import spin from '../spin.vue'
import tipModal from '../tip.vue'

export default {
     components: {
        // 加载进度
        spin,
        tipModal,
    }, 

    data() {
        return {
            // 是否显示表格
            isTable: false,
            // 是否显示加载进度条
            spinShow: true,
            // 得到所选时间
            selectTime: '',
            // 得到时间周期
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
            // 商品分类
            goodsType: '',
            // 商品分类数据
            goodsTypeList: [],
            // 表头数据
            columns: [
                {
                    title: '商品排名',
                    key: '',
                    width: 100,
                    render: (h, params) => {
                        // 鼠标经过有提示
                        return h('div', [
                            h('span', {
                            }, params.row._index + 1 )
                        ])
                    }
                },
                {
                    title: '商品条码',
                    key: 'CODE2'
                },
                {
                    title: '商品名称',
                    key: 'NAME'
                },
                {
                    title: '出库数量',
                    key: 'QTY'
                },
            ],
            // 排行榜数据
            rankData: [],
             // 表格高度
            tableHeight: 900,
            // 对时间进行限制,选择不到大于今天的时间
            options4: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
        }
    },
    // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 260);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 260);
        })
    },
    
    created() {
        // 获取商品分类
        this.getGoodsType();
        // 得到排行数据
        this.getGoodSList();
    },

    methods:{
        /**
         * 获取商品分类
         */
        getGoodsType() {
             this.$resetAjax({
                url: '/NewA/Public/getCate',
                type: 'GET',
                success:(res) => {
                    this.goodsTypeList = JSON.parse(res).data;
                }
            })
        },
        /**
         * 得到排行数据
         */
        getGoodSList() {
            this.$resetAjax({
                url: '/NewA/Goods/get_table2',
                type: 'POST',
                data: {
                    timelist: this.selectTime,
                    time_no: this.timeModel,
                    cls_no: this.goodsType
                },
                success:(res) => {
                    this.isTable = true;
                    this.rankData = res.data;
                    this.spinShow = false;
                }
            })
        },
        /**
         * 得到商品分类
         */
        getType(goodsType) {
            this.goodsType = goodsType;
            this.isTable = false;
            this.spinShow = true;
            this.getGoodSList();
        },
        /**
         * 得到时间周期
         */
        getTimeModel(timeModel) {
            this.timeModel = timeModel;
            this.isTable = false;
            this.spinShow = true;
            this.getGoodSList();
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
                this.$root.tip.isShow = true;
                this.$root.tip.content = '抱歉！选择的时间区间不能超过1个月!';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 2000);
            }  else {
                this.isTable = false;
                this.spinShow = true;
                this.getGoodSList();
            }
            
        },
    }
}
</script>

