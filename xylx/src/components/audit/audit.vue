<template>
    <div class="audit">
        <div class="top">
            <div class="left">
                <div style="margin-right: 50px;">
                    <span class="title">门店</span>
                    <Select v-model="store" style="width:300px" @on-change="changeStore(store)">
                        <Option v-for="item in storeList" :value="item.CODE" :key="item.CODE"><p class="item"><span class="itemStyle">店名</span> {{ item.NAME  }} </p><span class="itemStyle two">编码</span>{{item.CODE}}</Option>
                    </Select>
                </div>
                <div>
                    <span class="title">日期</span>
                    <DatePicker :value="dateRange" type="daterange" :options="options" @on-change="getSelectTime" placeholder="请选择时间区间..." style="width: 200px"></DatePicker>
                </div>
            </div>
            <div class="right">
                <Button @click="handleSubmit">导出列表</Button>
                <Button @click="allstore" style="background: #1596ad;color: #fff;" v-if="position !== '店长'">导出全部门店</Button>
            </div>
        </div>
        <div class="middle">
            <p title="点击填写金额" @click='showModal' style="cursor: pointer;background: #1596ad;color: #fff;height: 33px;line-height: 26px;">
                
                启用时期初未存金额
                <span class="cash" style="color:#fff;">￥{{unsave}}</span> 
            </p>
            <p title="应收现金总额" >
                <span class="icon-cash">
                    <svg t="1565318408334" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="851" width="18" height="18"><path d="M398.222222 222.151111a29.724444 29.724444 0 0 0 24.604445 12.8h161.564444a29.724444 29.724444 0 0 0 23.466667-11.235555l68.266666-87.893334a27.591111 27.591111 0 0 0 5.12-24.035555 28.444444 28.444444 0 0 0-16.071111-18.915556A396.515556 396.515556 0 0 0 501.902222 56.888889a337.635556 337.635556 0 0 0-154.453333 34.844444 28.444444 28.444444 0 0 0-14.222222 18.062223 28.444444 28.444444 0 0 0 4.124444 22.186666z m207.644445-91.022222l-36.408889 46.933333h-130.844445l-32.711111-48.924444a352.142222 352.142222 0 0 1 200.391111 1.991111z m21.191111 157.44l-5.973334-2.844445H388.693333l-5.973333 2.844445C367.36 295.822222 8.391111 475.022222 80.782222 752.497778c0.995556 8.817778 30.72 212.195556 409.315556 214.186666h24.035555c384 0 413.582222-205.368889 414.008889-210.915555 73.813333-280.462222-285.297778-459.662222-300.657778-467.2zM873.244444 745.955556c-0.995556 6.826667-29.297778 164.408889-355.555555 165.546666-352.568889 6.826667-379.733333-158.72-381.297778-168.96C79.075556 521.955556 358.684444 363.804444 402.488889 340.48h205.226667c43.946667 23.466667 323.697778 181.333333 265.528888 405.475556zM608.711111 445.297778l-103.68 100.551111-103.537778-100.551111a30.008889 30.008889 0 0 0-41.528889 0 28.444444 28.444444 0 0 0 0 40.248889l93.44 90.737777h-49.635555a28.444444 28.444444 0 1 0 0 56.888889h72.96v45.368889h-73.528889a30.72 30.72 0 1 0 0 61.44h73.528889v61.724445a29.44 29.44 0 0 0 58.737778 0V739.555556h72.96a30.72 30.72 0 1 0 0-61.44h-72.96v-44.942223h73.528889a28.444444 28.444444 0 1 0 0-56.888889h-52.337778l93.44-90.737777a28.444444 28.444444 0 0 0 0-40.248889 29.866667 29.866667 0 0 0-41.386667 0z" p-id="852" fill="#d81e06"></path></svg>
                </span>
                应存现金
                <span class="cash">￥{{total_pay}}</span> 
            </p>
            <p title=" 实存现金总额" >
                <span class="icon-cash">
                    <svg t="1565319518123" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1525" width="18" height="18"><path d="M 528.384 559.104 c -12.288 -4.096 -26.624 -4.096 -36.864 -10.24 s -20.48 -20.48 -22.528 -30.72 c -2.048 -8.192 10.24 -22.528 18.432 -26.624 c 12.288 -4.096 26.624 0 38.912 4.096 c 6.144 2.048 10.24 14.336 16.384 18.432 c 8.192 4.096 18.432 6.144 24.576 4.096 c 6.144 -4.096 10.24 -12.288 14.336 -18.432 c -2.048 -6.144 -2.048 -10.24 -4.096 -12.288 c -22.528 -22.528 -43.008 -45.056 -65.536 -65.536 c -4.096 -2.048 -14.336 -2.048 -20.48 2.048 c -18.432 16.384 -36.864 30.72 -53.248 49.152 c -30.72 36.864 -20.48 90.112 24.576 110.592 c 18.432 8.192 38.912 10.24 57.344 20.48 c 10.24 6.144 22.528 18.432 24.576 30.72 c 2.048 10.24 -6.144 24.576 -16.384 32.768 c -18.432 16.384 -45.056 6.144 -63.488 -16.384 c -8.192 -10.24 -22.528 -12.288 -34.816 -18.432 c -2.048 14.336 -8.192 32.768 -2.048 38.912 c 20.48 22.528 45.056 43.008 67.584 61.44 c 4.096 4.096 18.432 -2.048 24.576 -6.144 c 10.24 -6.144 16.384 -16.384 26.624 -22.528 c 32.768 -18.432 45.056 -47.104 40.96 -83.968 c -4.096 -34.816 -28.672 -53.248 -59.392 -61.44 Z" fill="#1296db" p-id="1526"></path><path d="M 501.76 0 C 225.28 0 0 225.28 0 501.76 S 225.28 1003.52 501.76 1003.52 S 1003.52 778.24 1003.52 501.76 S 778.24 0 501.76 0 Z m -100.352 200.704 c 32.768 -2.048 69.632 0 104.448 0 c 32.768 0 63.488 -2.048 96.256 0 c 34.816 2.048 43.008 16.384 24.576 45.056 c -6.144 10.24 -16.384 20.48 -20.48 32.768 c -12.288 24.576 -30.72 32.768 -57.344 30.72 c -18.432 -2.048 -38.912 -4.096 -57.344 0 c -59.392 12.288 -90.112 -20.48 -112.64 -67.584 c -12.288 -24.576 -6.144 -38.912 22.528 -40.96 Z m 352.256 610.304 c -86.016 2.048 -169.984 0 -253.952 0 H 258.048 c -61.44 0 -83.968 -22.528 -75.776 -81.92 c 20.48 -151.552 102.4 -268.288 217.088 -364.544 c 10.24 -8.192 26.624 -10.24 40.96 -10.24 c 34.816 -2.048 69.632 2.048 102.4 -2.048 c 34.816 -2.048 63.488 8.192 86.016 30.72 c 90.112 88.064 159.744 186.368 186.368 313.344 c 2.048 14.336 4.096 28.672 4.096 43.008 c 2.048 49.152 -16.384 69.632 -65.536 71.68 Z" fill="#1296db" p-id="1527"></path></svg>
                </span>
                实存现金
                <span class="cash">￥{{total_jk}}</span> 
            </p>
            <p title="  未存现金总额" >
                <span class="icon-cash">
                    <svg t="1565319638039" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1856" width="18" height="18"><path d="M513.15 641.988c168.465 0 327.328 73.28 435.855 201.055 17.151 20.15 14.863 49.97-5.208 67.902-8.204 7.333-19.016 11.374-30.437 11.374-14.296 0-27.943-6.08-37.444-16.681C784.2 798.782 651.521 737.444 511.991 737.444c-140.53 0-273.215 61.351-364.031 168.317-9.165 10.763-22.292 16.942-36.014 16.942-11.251 0-22.12-4.175-30.606-11.759-10.123-8.6-16.111-20.257-16.981-32.942-0.847-12.384 3.298-24.35 11.671-33.693 110.402-128.613 269.695-202.321 437.12-202.321z m273.223-246.564c-43.766 0-80.734-37.845-80.734-82.638V192.105c0-44.798 36.969-82.646 80.734-82.646 43.763 0 80.734 37.848 80.734 82.646v120.683c0 45.566-36.216 82.636-80.734 82.636z m-547.906 0c-43.761 0-80.731-37.845-80.731-82.638V192.105c0-44.798 36.97-82.646 80.731-82.646 43.771 0 80.746 37.848 80.746 82.646v120.683c0 44.791-36.975 82.636-80.746 82.636z" fill="#d4237a" p-id="1857"></path></svg>
                </span>
                 未存现金
                <span class="cash">￥{{cha}}</span>
            </p>
            <p style="background: #1596ad;color: #fff;height: 33px;line-height: 26px;">
                销售总额
                <span class="cash" style="color:#fff;">￥{{total_sale}}</span>
            </p>
            <Button style="background: #1596ad;color: #fff;" @click="open" v-show="daoruShow">导入数据</Button>
        </div>
        <div class="table">
            <Table  :columns="columns" :data="tableData" border :height="tableHeight"></Table>
        </div>
        <!-- 查看图片轮播图 -->
        <div class="carouselcontent" v-if="carouse">
            <Icon type="ios-close-outline" class="close_icon" title="关闭弹窗" @click="carouse=false;"></Icon>
            <Carousel v-model="value1">
                <CarouselItem v-for="(item,index) in lookImgs" :key="index">
                    <div class="demo-carousel"><img :src="item" alt="加载图片..."></div>
                    <div class="bottom">
                        <p>单据{{index+1}}</p>
                        <Button @click="carouse=false;">确定</Button>
                    </div>
                </CarouselItem>
            </Carousel>
        </div>
        <!-- 分页 -->
        <div class="footer">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 缴款清单组件 -->
        <audit-modal :hasShow="isShow" :formValidate="formValidate" @asyncOK="asyncOK" ref="auditModal" @updateHasShow="updateHasShow"></audit-modal>
        <!--输入金额  -->
        <Modal v-model="amountShow" :title="modalTitle" >
            <div>
                <span>金额：</span>
                <Input v-model="money" placeholder="输入金额" style="width: 300px;margin: auto;"  type="number" ></Input>
            </div>
            <div :class="modalTitle=='其他支出' ? '' : 'none'">
                <span>备注</span>
                <Input v-model="notes" type="textarea" placeholder="请输入支出备注..." />
            </div>
            <div slot="footer">
                <Button  @click="amountShow=false" style="display: inline-block">取消</Button>
                <Button type="primary" @click="amount" >确定</Button>
            </div>
        </Modal>
        <!-- 导入列表 --> 
        <Modal class="addModal" v-model="daoruModal" title="选择时间区间">
            <Form ref="formValidateDate" :model="formValidateDate" :rules="ruleValidateDate" :label-width="80">
                <FormItem label="开始时间" prop="sdate">
                    <DatePicker v-model='formValidateDate.sdate' format="yyyy-MM-dd" type="date" placeholder="请选择开始时间" :options="options"></DatePicker>
                </FormItem>
                <FormItem label="截至时间" prop="edate">
                    <DatePicker v-model='formValidateDate.edate' format="yyyy-MM-dd" type="date" placeholder="请选择截至时间" :options="options"></DatePicker>
                </FormItem>
                <FormItem >
                    <Button type="ghost" style="margin-right: 8px"  @click="closeDaoru">取消</Button>
                    <Button v-if="isLoadingPop" type="primary">正在导入</Button>
                    <Button type="primary" @click="daoruhandleSubmit('formValidateDate')" v-else>确定</Button>
                </FormItem>
            </Form>
        </Modal>
        
    </div>
</template>


<script>

import {changeTime} from  '@/assets/js/tool.js'
import {changeday} from  '@/assets/js/tool.js'
import tipModal from '../tip.vue'
import auditModal from '@/components/audit/audit-modal'   // 引入缴款清单模态框组件


export default {
    components:{
        tipModal,
        // 把组件引入进来
        auditModal
    },
    data() { 
        return {
            isLoadingPop:false,
            daoruShow:false,
            // 职位
            position: '',
            // 直营门店数据
            storeList: [],
            // 选中哪个直营门店
            store: '11373',
            // 时间范围选择
            dateRange: [],
            // 是否显示缴款弹窗   父组件定义模态框状态变量,默认为不显示
            isShow: false,
            // 对时间选择的限制
            options: {
                disabledDate (date) {
                    return date && date.valueOf() >= Date.now();
                }
            },
            // 表头信息
            columns: [
                {
                    title: '销售日期',
                    align: 'center',
                    key: 'sale_date',
                },
                {
                    title: ' 销售总额',
                    align: 'center',
                    key: 'sale_amt'
                },
                {
                    title: ' 销售成本',
                    align: 'center',
                    key: 'cost_amt'
                },
                {
                    title: ' 鼎付通收款',
                    align: 'center',
                    key: 'mob_pay' 
                },
                {
                    title: '现金收款',
                    align: 'center',
                    key: 'cash_pay'
                },
                {
                    title: '其他支出',
                    align: 'center',
                    key: 'other',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                class: 'contributions',
                                style:{
                                    cursor:'pointer'
                                },
                                domProps: {
                                    title: '点击编辑支出金额'
                                },
                                on: {
                                    click: () => {
                                        this.money=params.row.other;
                                        this.modalTitle='其他支出';
                                        this.row=params.row;
                                        this.amountShow=true;
                                    }
                                }
                            },params.row.other),
                        ]);
                    }
                },
                {
                    title: '储值卡消费',
                    align: 'center',
                    key: 'account_pay',
                    render: (h, params) => {
                        return h('div', [
                            h('span', {
                                class: 'contributions',
                                style:{
                                    cursor:'pointer'
                                },
                                domProps: {
                                    title: '点击编辑支出金额'
                                },
                                on: {
                                    click: () => {
                                        this.money=params.row.account_pay;
                                        this.modalTitle='储值卡消费';
                                        this.row=params.row;
                                        this.amountShow=true;
                                    }
                                }
                            },params.row.account_pay),
                        ]);
                    }
                },
                {
                    title: '应存现金',
                    align: 'center',
                    key: 'yingcun'
                },
                {
                    title: '实存现金',
                    align: 'center',
                    key: 'jiaokuan' ,
                    render: (h, {row}) => {
                        return h('div', [
                            h('span', {
                               style: {
                                   color: row.jiaokuan == row.cash_pay ? '#495060' : 'red'
                               }
                            }, row.jiaokuan),
                        ]);
                    }
                },
                {
                    title: '余额',
                    align: 'center',
                    key: 'balance'
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, {row}) => {
                        return h('div', [
                            h('span', {
                                class: 'contributions',
                                on: {
                                    click: () => {
                                        this.isShow = true;
                                        this.formValidate.monery = '';
                                        this.formValidate.bankModel = '';
                                        this.formValidate.dateTime = '';
                                        this.formValidate.imgs=[];
                                        this.formValidate.sale_date = row.sale_date; // 销售日期
                                    }
                                }
                            }, '缴款'),
                            h('span', {
                                class: 'contributions',
                                style:{
                                    marginLeft:'10px',
                                },
                                on: {
                                    click: () => {
                                        this.lookImgs=row.imgs;
                                        if(this.lookImgs){
                                            this.carouse=true;
                                        }else{
                                            this.carouse=false;
                                            this.$root.tip.isShow = true;
                                            this.$root.tip.content = '暂无图片!';
                                            setTimeout(() => {
                                                this.$root.tip.isShow = false;
                                            }, 1500);
                                        }
                                    }
                                }
                            }, '查看图片'),
                        ]);
                    }
                }
            ],
            // 表格数据
            tableData: [],
            // 表格高度
            tableHeight: 900,
            // 总条数
            total: 0,
            // 页面条数
            pageSize: 20,
            // 当前页码
            currentPage: 1,
            // 缴款数据
            formValidate: {
                // 缴款时间
                dateTime: '',
                // 选择哪个银行
                bankModel: '',
                // 缴款金额
                monery: '',
                // 销售日期
                sale_date: '',
                //上传单据
                imgs:[]
            },
            // 应收现金总额
            total_pay: '0',
            //  实存现金总额
            total_jk: '0',
            // 未存现金总额
            cha: '0',
            // 销售总额
            total_sale:'0',
            //  启用时期初未存金额
            unsave:'0',
            // 是否显示查看图片弹出框
            carouse:false,
            value1:'',
            // 是否显示输入金额弹出框
            amountShow:false,
            // 弹出框的标题
            modalTitle:'',
            // 输入金额
            money:'',
            // 输入备注
            notes:'',
            // 表格当前行
            row:[],
            // 时间弹出框
            daoruModal:false,
            // 表单数据
            formValidateDate:{
                sdate:'',
                edate:''
            },
            ruleValidateDate: {
                sdate: [
                    { required: true, type: 'date', message: '时间不能为空', trigger: 'blur' }
                ],
                edate: [
                    { required: true, type: 'date', message: '时间不能为空', trigger: 'blur' }
                ],
            },
            // 导出列表选择得时间
            dateArr:[],
        }
    },

    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 260);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 260);
        })
    },

    created() {
        // 得到门店数据
        this.getStoreList();
    },


    methods: {
        /**
         * 得到门店数据
         */
        getStoreList() {
            this.$resetAjax({
                type: 'GET',
                url: '/NewA/Audit/get_store',
                success:(res) => {
                    this.storeList = res;
                    this.store=res[0].CODE;
                    this.getAudit();
                }
            })
        },
        /**
         * 选中到哪个直营门店
         */
        changeStore(store) {   
            this.currentPage = 1;
            this.getAudit();
        },
        /**
         *  选择时间
         */
        getSelectTime(value) {
            this.currentPage = 1;
            if (value[0] == "" || value[1] == "") {
                this.dateRange = [];
            } else {
                this.dateRange = value;
            }
            this.getAudit();
        },
        /**
         *  获取账户列表数据
         * @param {String} p 页码
         * @param {Array} timelist  时间区间
         * @param {String} store 门店CODE
         */
        getAudit() {
            this.$resetAjax({
                type: 'GET',
                url: '/NewA/Audit/index',
                data: {
                    p: this.currentPage,
                    timelist: this.dateRange,
                    store: this.store
                },
                success:(res) => {
                    this.tableData = res.data;
                    this.total = Number(res.count);
                    // 如果是程序员，就显示导入数据
                    if(res.position == '程序员') {
                        this.daoruShow=true;
                    }
                    this.position = res.position;
                    this.total_pay = res.total_pay;
                    this.total_jk = res.total_jk;
                    this.cha = res.cha;
                    this.unsave=res.unsave;
                    this.total_sale=res.total_sale;
                }
            })
        },
        /**
         *  切换页码
         */
        changePage(index) {
            this.currentPage = index;
            this.getAudit();
        },
        /**
         * 缴款请求
         */
        asyncOK() {
            let flag = this.$refs['auditModal'].validateForm();
            if (flag) {
                this.$resetAjax({
                    type: 'POST',
                    url: '/NewA/Audit/addcz',
                    data: {
                        bk: this.formValidate.bankModel,              // 银行
                        sj: changeTime(this.formValidate.dateTime),   //时间
                        money: this.formValidate.monery,           //金额
                        sale_date: this.formValidate.sale_date,    // 销售时间
                        store: this.store,     // 门店CODE
                        imgs:this.formValidate.imgs //上传单据
                    },
                    success:(res) => {
                        this.$Message.warning(res.msg);
                        if(res.msg=='匹配成功'){
                            this.show=false;
                            this.getAudit();
                            // this.$root.tip.isShow = true;
                            // this.$root.tip.content = '信息不匹配!';
                            // setTimeout(() => {
                            //     this.$root.tip.isShow = false;
                            // }, 1500);
                        }
                        
                    }
                })
            }
            // console.log(this.formValidate);
        },
        /**
         *  关闭模态框
         */
        updateHasShow(hasShow) {
            this.isShow = hasShow;
        },
        /* */
        showModal(){
            this.modalTitle='启用时期初未存金额';
            this.amountShow=true;
            this.money=this.unsave;
        },
        /* 填写金额 */
        amount(){
            if(this.modalTitle==='启用时期初未存金额'){
                this.$resetAjax({
                    url:'/NewA/Audit/addunsave',
                    type:'post',
                    data:{
                        store: this.store,
                        money:this.money,
                        notes:this.notes
                    },
                    success:(res)=>{
                        if(res.errorcode==0){
                            this.amountShow=false;
                            this.$root.tip.isShow = true;
                            this.$root.tip.content = '填写成功!';
                            this.getAudit();
                            setTimeout(() => {
                                this.$root.tip.isShow = false;
                            }, 1500);
                        }
                    }
                })
            }else if(this.modalTitle=='其他支出'){
                this.$resetAjax({
                    url:'/NewA/Audit/addother',
                    type:'post',
                    data:{
                        id: this.row.id,
                        money:this.money
                    },
                    success:(res)=>{
                        if(res.errorcode==0){
                            this.amountShow=false;
                            this.$root.tip.isShow = true;
                            this.$root.tip.content = '填写成功!';
                            this.getAudit();
                            setTimeout(() => {
                                this.$root.tip.isShow = false;
                            }, 1500);
                        }
                    }
                })
            }else if(this.modalTitle=='储值卡消费'){
                this.$resetAjax({
                    url:'/NewA/Audit/savecard',
                    type:'post',
                    data:{
                        id: this.row.id,
                        money:this.money
                    },
                    success:(res)=>{
                        if(res.errorcode==0){
                            this.amountShow=false;
                            this.$root.tip.isShow = true;
                            this.$root.tip.content = '填写成功!';
                            this.getAudit();
                            setTimeout(() => {
                                this.$root.tip.isShow = false;
                            }, 1500);
                        }
                    }
                })
            }
        },
        //导出列表
        handleSubmit () {
            if(this.dateRange.length==0){
                this.$root.tip.isShow = true;
                this.$root.tip.content = '请填写时间';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 1500);
            }else{
                location.href = `http://oa.xmvogue.com/index.php/NewA/Audit/dcindex?store_code=${this.store}&timelist[0]=${this.dateRange[0]}&timelist[1]=${this.dateRange[1]}`;
            }
        },

        /* 导出所有门店 */
        allstore(){
            if(this.dateRange.length==0){
                this.$root.tip.isShow = true;
                this.$root.tip.content = '请填写时间';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 1500);
            }else{
                location.href = `http://oa.xmvogue.com/index.php/NewA/Audit/allstore?time[0]=${this.dateRange[0]}&time[1]=${this.dateRange[1]}`;
            }
        },
        newchangeday(num) {
            let date = new Date(num);
            let z = date.getFullYear() + '.',
                b = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1)  : date.getMonth() + 1) + '.',
                n = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) ;
            return z+b+n;
        },
        open(){
            this.daoruModal=true;
            this.formValidateDate={};
        },
        // 导入数据        
        daoruhandleSubmit(name){
            
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.formValidateDate.edate.getTime()>this.formValidateDate.sdate.getTime()){
                        this.isLoadingPop=true;
                        this.$resetAjax({
                            type: 'get',
                            url: '/Home/Sync/day_sale_bu',
                            // root: '',
                            root: 'http://dh.xmcpcn.com',
                            data: {
                                sdate:this.newchangeday(this.formValidateDate.sdate),
                                edate:this.newchangeday(this.formValidateDate.edate),
                                code: this.store,     // 门店CODE
                            },
                            success:(res) => {
                            this.$resetAjax({
                                    type: 'get',
                                    url:'/NewA/Public/savedata',
                                    data: {
                                        sdate:changeday(this.formValidateDate.sdate),
                                        edate:changeday(this.formValidateDate.edate),
                                        code: this.store,
                                    },
                                    success:(res) => {
                                        this.isLoadingPop=false;
                                        let result=JSON.parse(res);
                                        if(result.errorcode==0){
                                            this.$Message.success('导入成功！');
                                            this.daoruModal=false;
                                        }
                                    }
                                })
                            }
                        })
                    }else{
                        this.$Message.warning('开始时间不能大于截止时间！');
                    }
                } else {
                    
                }
            })
        },
        closeDaoru(){
            this.daoruModal=false;
            this.formValidateDate={};
        }
    }
}

</script>






