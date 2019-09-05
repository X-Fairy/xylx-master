<template>
<div class="storePage" id="storePage">
    <div class="top">
        <!-- 查询 -->
        <div class="search">
            <div>
                <Input v-model="keyword" placeholder="请输入要搜索的内容" @on-enter="searchStore" @on-change="searchStore"/>
                <Button slot="append" icon="ios-search" @click="searchStore"></Button>
            </div>
            <div class="select">
                <p>客服</p>
                <Select v-model="service" style="width:105px" @on-change="getservice(service)">
                    <Option value="" key="">全部</Option>
                    <Option v-for="item in serviceList" :value="item.hdcode" :key="item.hdcode">{{ item.user_name }}</Option>
                </Select>
            </div>
            <div class="select">
                <p>地区</p>
                <Select v-model="area" style="width:105px" @on-change="getprovincename(area)">
                    <Option value="1" key="1">全部</Option>
                    <Option v-for="item in provinceList" :value="item.CODE" :key="item.CODE">{{ item.NAME }}</Option>
                    <Option value="2" key="2">国外</Option>
                </Select>
            </div>
        </div>
        <!-- 上传 -->
        <div class="upload">
            <a href="http://oa.xmvogue.com/index.php/NewA/Shop/daochu" class="uploadmodel" style="margin-right: 20px" v-show="isShow">下载海外门店余额</a>
            <a href="http://oa.xmvogue.com/uploads/visits/uploadFile.xls" class="uploadmodel">下载文件模板</a>
            <Icon type="ios-fastforward" style="margin:10px;"></Icon>
            <Upload action="/NewA//Shop/uploadvisit">
                <Button type="ghost" class="ghost" icon="ios-cloud-upload-outline">上传回访文件</Button> 
            </Upload>
        </div>
    </div>
    <div class="table">
        <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
    </div>
    <div class="footer">
        <!-- 分页 -->
        <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
    </div>
    <!-- 店铺详情 -->
    <div v-if="storeDetail" class="storeDetail">
        <div class="inner">
            <div class="inner_top">
                <div class="left">
                    <p>店名：<span>{{storeDetailData.NAME}}</span></p>
                </div>
                <Icon type="ios-close" @click="storeDetail=false" title="关闭弹窗"></Icon>
            </div>
            <Form class="store_form" ref="store">
                <FormItem label="门店编码：">
                    <Input v-model="storeDetailData.CODE" />
                </FormItem>
                <FormItem label="星级：">
                    <Input v-model="storeDetailData.CONTACTOR"/>
                </FormItem>
                <FormItem label="开业时间：">
                    <Input v-model="storeDetailData.ABC"/>
                </FormItem>
                <FormItem label="门店类型：">
                    <Input v-model="storeDetailData.PROPERTY" />
                </FormItem>
                <FormItem label="门店面积:">
                    <Input v-model="storeDetailData.XAREA"/>
                </FormItem>
                    
                <FormItem label="房租:">
                    <Input v-model="storeDetailData.RCHARGE"/>
                </FormItem>
                <FormItem label="货柜:">
                    <Input v-model="storeDetailData.COUNTER"/>
                </FormItem>
                    <FormItem label="装修保证金:">
                    <Input v-model="storeDetailData.PAMOUNT"/>
                </FormItem>
                    <FormItem label="首批货款:">
                    <Input v-model="storeDetailData.FPRODUCT"/>
                </FormItem>
                <FormItem label="合作物流:">
                    <Input v-model="storeDetailData.EXPRESS"/>
                </FormItem>
                    <FormItem label="所属督导:">
                    <Input v-model="storeDetailData.ENGINEER"/>
                </FormItem>
                <FormItem label="调换货:">
                    <Input v-model="storeDetailData.CHANGE"/>
                </FormItem>
                <FormItem label="所属客服:">
                    <Input v-model="storeDetailData.KEFU"/>
                </FormItem>
                <FormItem label="电话:">
                    <Input v-model="storeDetailData.PHONE"/>
                </FormItem>
                <FormItem label="地区：">
                    <Input v-model="storeDetailData.AREA"/>
                </FormItem>
                <FormItem label="门店地址：">
                    <Input type="textarea" v-model="storeDetailData.ADDRESS" />
                </FormItem>
                <FormItem label="备注:">
                    <Input type="textarea" v-model="storeDetailData.ANOTE"/>
                </FormItem>
            </Form>
            <div class="bottom">
                <Button type="error" class="cancel" @click="storeDetail=false">关闭</Button>
            </div>
        </div>
    </div>
    <!-- 编辑物流公司弹窗 -->
    <Modal v-model="isLogistics" title="选择物流公司" @on-ok="editLogistics" :mask-closable="false" @on-cancel="isLogistics=false" >
        <Select v-model="model2" filterable>
            <Option v-for="item in logisticsData" :value="item.id" :key="item.id">
                <span class="LogisticsName">名称</span> <span class="nameDetail">{{ item.name}}</span>
                <span class="LogisticTel">电话</span> <span class="telDetail">{{item.tel}}</span>
                <span class="LogisticAddress">地址</span> {{item.address}}
            </Option>
        </Select>
    </Modal>
</div>
</template>



<script>
import {changeday} from  '@/assets/js/tool.js'
import tipModal from '../tip.vue'

export default {
    components: {
        tipModal,
    },

    data() {
        return {
            // 搜索关键词
            keyword: '',
            // 部门数据
            serviceList: [],
            // 默认选中哪个部门
            service: '',
            // 省份
            area: 1,
            // 省份列表
            provinceList: [],
            // 表格列表数据
            tableData: [],
            // 表格高度
            tableHeight: 900,
            //是否显示海外门店余额
            isShow: false,
            // 门店表头数据
            columns: [
                {
                    title: '门店编码',
                    key: 'CODE'
                },
                {
                    title: '店名',
                    key: 'NAME',
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    color: '#495060',
                                    fontSize: '12px',
                                    cursor: 'pointer'
                                },
                                domProps: {
                                    title: '点击查看门店详情'
                                },
                                on: {
                                    click: () => {
                                        // 得到店铺详情
                                        this.storeDetail = true;
                                        this.getstoreDetail(params.row);
                                    }
                                }
                            }, params.row.NAME),
                        ])
                    }

                },
                {
                    title: '星级',
                    key: 'CONTACTOR'
                },
                {
                    title: '类型',
                    key: 'PROPERTY'
                }, 
                {
                    title: '地区',
                    width: 120,
                    key: 'ARNAME'
                },
                {
                    title: '物流公司',
                    key: 'logistics.name',
                    render: (h, {row}) => {
                        let texts = row.logistics == undefined ? ''  : '' || row.logistics.name ;
                        let tel = row.logistics == undefined ? ''  : '' || row.logistics.tel ;
                        let address = row.logistics == undefined ? ''  : '' || row.logistics.address ;
                        return h('div',
                            [h('Tooltip', {
                                props: {
                                    placement: 'top',
                                    transfer: true
                                }
                            }, [texts, h('span', {
                                slot: 'content',
                                style: {
                                    whiteSpace: 'normal',
                                    cursor: 'pointer'
                                }
                            }, `物流公司电话: ${tel};  物流公司地址: ${address}`)
                            ])
                        ])
                    }
                },
                {
                    title: '最近回访时间',
                    key: "time",
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','最近回访时间'),
                            h('Icon',{
                                props:{
                                    type: 'arrow-up-a'
                                },
                                style: {
                                    marginLeft: '5px'
                                },
                                on: {
                                    click:() => {
                                        // 向前找时间
                                        this.times = 1;
                                        this.getStoreList();
                                    }
                                }
                            }),
                            h('Icon',{
                                props:{
                                    type: 'arrow-down-a'
                                },
                                style: {
                                    marginLeft: '5px'
                                },
                                on: {
                                    click:() => {
                                        this.times = 2;
                                        this.getStoreList();
                                    }
                                }
                            })
                        ])
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 230,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                class: 'handle_one',
                                domProps:{
                                    title:'点击查看回访记录'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({path: 'storeVisit', query: {code: params.row.CODE, name: params.row.NAME}})
                                    }
                                }
                            }, '回访'),
                            h('a', {
                                class: 'handle_two',
                                domProps:{
                                    title:'点击查看资金流水'
                                },
                                on: {
                                    click: () => {
                                      this.$router.push({path: 'capital', query: {code: params.row.CODE, name: params.row.NAME}})
                                    }
                                }
                            }, '资金'),
                            h('a', {
                                class: 'handle_one',
                                domProps:{
                                    title:'点击选择物流公司'
                                },
                                on: {
                                    click: () => {
                                        this.isLogistics = true;
                                        this.rowCode = params.row.CODE;
                                        // this.model2 = params.row.logistics.id;
                                    }
                                }
                            }, '物流'),
                        ]);
                    }
                }
            ],
            // 总页数
            total: 0,
            // 每页条数
            pageSize: 20,
            // 当前是第几页
            currentPage: 1,
            // 是否显示店铺详情
            storeDetail: false,
            // 店铺详情数据
            storeDetailData: {},
            // 是否倒序选择到门店列表
            times: '',
            // 物流公司列表数据
            logisticsData: [],
            // 是否显示编辑物流公司弹窗
            isLogistics: false,
            // 默认选中哪个物流公司
            model2: '',
            // 当前行选择物流公司的门店编码
            rowCode: '',
        }
    },
    // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 220);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 220);
        })
    },

    created() {
        // 得到所有门店数据
        this.getStoreList();
        // 得到省份列表
        this.getProvince();
        // 得到所有物流公司列表 
        this.getlogistics();
    },

    methods: {
        /**
         *  得到所有门店数据
         */
        getStoreList() {
            this.$resetAjax({
                type: 'POST',
                url:  '/NewA/Shop/getlist',
                data: {
                    p: this.currentPage,
                    codename: this.keyword,
                    area: this.area,
                    hdcode: this.service,
                    times: this.times
                },
                success: (res) => {
                    this.total = Number(JSON.parse(res).data.count);
                    this.tableData = JSON.parse(res).data.data;
                    var ifshow=JSON.parse(res).ifshow;
                    if(ifshow == 1){
                        this.isShow=true;
                    }else{
                        this.isShow=false;
                    }
                    // console.log(this.isShow);
                    this.tableData.forEach(ele => {
                        if (ele.time) {
                            ele.time = changeday(Number(ele.time)*1000)
                        }
                    })
                }
            })
        },
         /**
         * 查询店铺
         */
        searchStore() {
            this.currentPage = 1;
            this.getStoreList();
        },
        /**
         * 得到默认选中客服的id
         */
        getservice(service){
            this.currentPage = 1;
            this.service = service;
            this.getStoreList();
        },
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
         *  得到所有物流公司数据
         */
        getlogistics() {
            this.$resetAjax({
                type: 'GET',
                url:  '/NewA/Public/getlogistics',
                success: (res) => {
                    this.logisticsData = JSON.parse(res);
                }
            })
        },
        /**
         * 选择省份
         */
        getprovincename(area) {
            this.keyword = '';
            this.currentPage = 1;
            this.area = area;
            this.getStoreList();
        },
        /*
        * 得到所有上级的数据
        */ 
        getuserlist() {
            this.$resetAjax({
                url: '/NewA/Public/getfid',
                type: 'GET',
                success: (res) => {
                    this.serviceList =JSON.parse(res).data;
                }
            })
        },
        /**
         * 切换页面
         */
        changePage(index) {
            this.currentPage = index;
            this.getStoreList();
        },
        /**
         * 得到店铺详情
         */
        getstoreDetail(data) {
            this.$resetAjax({
                url: '/NewA/Shop/getshopinfo',
                type: 'POST',
                 data: {
                        code: data.CODE,
                },
                success: (res) => {
                    this.storeDetailData = res.data[0];
                }
            })
        },
        /**
         * 选择物流公司请求
         */
        editLogistics() {
            this.$resetAjax({
                type: 'POST',
                url:  '/NewA/Shop/update_logistics',
                data: {
                    store: this.rowCode,   // 门店编码
                    logistics: this.model2  // 选中哪个的物流公司的id
                },
                success: (res) => {
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = `棒棒哒, 选择物流公司成功！`;
                    setTimeout(() => {
                        this.$root.tip.isShow = false;
                        this.getStoreList();
                    }, 2000);
                }
            })
        }
    }
}




</script>
