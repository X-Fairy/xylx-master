<template>
    <div class="initialzation">
        <div class="top">
            <div class="top_left">
                <h3 class="store_name" >店名: <span>【{{code}}】{{storeName}}</span></h3>
            </div>
            <div class="top_right">
                <Button class="payment" v-if="isPaymentReady" @click="paymentReady">新增账务</Button>
                <Button class="payInit" v-if="isPayInit" @click="payInit">缴款初始化</Button>
                <Button class="go_capital" @click="goCapital">返回资金流水</Button>
                <Button class="go_back" @click="gonameList">返回客户列表</Button>
            </div>  
        </div>
        <div class="table">
            <Table border  :columns="columns" :height="tableHeight" :data="payData"></Table>
        </div>
        <div class="footer">
            <!-- 分页 -->
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 缴款弹窗 -->
        <Modal :title="title" v-model="modal" class-name="vertical-center-modal" :mask-closable="false">
            <span class="fincls">财务类目</span>
            <Select v-model="fincls" style="width:150px;margin-top: -6px;"  @on-change="getfinclsData" :placeholder="placeholder">
                <Option v-for="item in finclsList" :value="item.finance_cls" :key="item.finance_cls" >{{item.finance_name}}</Option>
            </Select>
            <span class="finclsError error">类目不能为空</span>
           
            <div class="initialValue">
                <span class="fincls">缴款金额</span>
                <InputNumber :min="1" v-model="initialValue" @on-change="getmoney"></InputNumber>
                <span class="moneyError error">金额不能为空</span>
            </div>
            <div class="memo_area">
                <span class="memo">缴款备注</span>
                <Input v-model="memo" type="textarea" />
            </div>
            <div slot="footer">
                <Button type="primary" @click="addPayok" style="display: inline-block;">确定</Button>
            </div>
        </Modal>
        <!-- 提示是否删除 -->
        <div class="outside" v-if="isDelete">
            <div class="delete">
                <p>确认删除？</p>
                <div class="build">
                    <button type="close" @click="isDelete=false">取消</button>
                    <button type="checkmark" @click="deletePay">确定</button>
                </div>
            </div>
        </div>
        <!-- 提示是否删除 -->
        <div class="outside" v-if="isExamine">
            <div class="delete">
                <p>确认审核？</p>
                <div class="build">
                    <button type="close" @click="isExamine=false">取消</button>
                    <button type="checkmark" @click="examine">确定</button>
                </div>
            </div>
        </div> 
    </div>
</template>


<script>

// 提示组件
import tipModal from '../tip.vue'
import {getUrlParams} from  '@/assets/js/tool.js'
import {changeTime} from "@/assets/js/tool.js"//时间戳
export default {
    components:{
        tipModal
    },
    data() {
        return {
            //选择框默认显示
            placeholder:'请输入',
            // 得到网址的参数对象
            urlParams: {},
            // 门店编码
            code: '',
            // 门店名称
            storeName: '',
            // 表格高度
            tableHeight: 900,
            // 是否显示缴款弹窗
            modal: false,
            // 缴款弹窗标题
            title: '',
            // 选中哪个缴款类目
            fincls: 'B0101',
            // 缴款类目数据
            finclsList: [],
            // 缴款金额
            initialValue: "",
            // 是否显示缴款页面
            isPaymentReady: false,
            // 缴款表头
            columns: [
                {
                    title: '缴款类目',
                    key: "finance_name",
                },
                {
                    title: '缴款金额',
                    key: 'money'
                },
                {
                    title: '备注',
                    key: 'note'
                },
                {
                    title: '缴款人',
                    key: 'oper_name'
                },
                {
                    title: '缴款时间',
                    key: 'oper_time'
                },
                {
                    title: '审批人',
                    key: 'auditor'
                },
                {
                    title: '是否审批',
                    render:(h, {row}) => {
                        return h('div', [
                            // 设置气泡式提醒
                            h('div',[
                                    // 设置icon
                                    h('div', 
                                        [
                                            h('icon', {
                                                props: {
                                                type: row.auditor !== '' &&  row.auditor !== null ? 'checkmark-round' : 'information-circled',
                                            },
                                            style: {
                                                color: row.auditor !== '' &&  row.auditor !== null ? '#1d8c9f' : '#ed3f14',
                                                fontSize: '20px'
                                            },
                                            domProps: {
                                                title: row.auditor !== '' &&  row.auditor !== null ? '已审批' :'未审批'
                                            },
                                        })
                                    ])
                                ]
                            )
                        ])
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 230,
                    align: 'center',
                    render: (h, {row}) => {
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type: 'edit',
                                    size: 'small'
                                },
                                style: {
                                    display: row.auditor !== null &&  row.auditor !== '' ? 'none' : 'inline-block',
                                    marginRight: '20px',
                                    cursor: 'pointer',
                                    padding:'5px',
                                    fontSize:'15px'
                                },
                                domProps:{
                                    title:'编辑'
                                },
                                on: {
                                    click: () => {
                                        
                                        $('.moneyError').css('display','none');
                                        this.modal = true;
                                        this.title == '编辑缴款'
                                        // 得到缴款明细
                                        this.getPayDatail(row);
                                    }
                                }
                            }, '编辑'),
                            h('Icon', {
                                props: {
                                    type: 'ios-trash-outline',
                                    size: 'small'
                                },
                                style: {
                                    display: row.auditor !== null && row.auditor !== '' ? 'none' : 'inline-block',
                                    marginRight: '20px',
                                    cursor: 'pointer',
                                    padding:'5px',
                                    fontSize:'20px'
                                },
                                domProps:{
                                    title:'删除'
                                },
                                on: {
                                    click: () => {
                                       this.isDelete = true;
                                       this.payRemoveData = row;
                                    }
                                }
                            }, '删除'),
                           
                            h('span', {
                                class:'iconfont icon-shenhe1',
                                style: {
                                    display: row.auditor !== null && row.auditor !== '' ? 'none' : 'inline-block',
                                    marginRight: '20px',
                                    cursor: 'pointer',
                                    padding:'5px',
                                    
                                },
                                domProps:{
                                    title:'审核'
                                },
                                on: {
                                    click: () => {
                                       this.isExamine=true;
                                       this.row=row;
                                    }
                                }
                            }, ''),
                        ]);
                    }
                }
            ],
            // 缴款列表的数据
            payData: [],
            // 总页数
            total: 0,
            // 页面条数
            pageSize: 20,
            // 当前页码
            currentPage: 1,
            //缴款初始化按钮是否显示
            isPayInit:false,
            init:'',
            //是否删除
            isDelete:false,
            //是否审核
            isExamine:false,
            // 缴款备注
            memo: '',
            // 当前记录的id
            payId: '',
            //当前行
            row:[]

        }
    },

    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 220);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 220);
        })
    },

    created() {
        // 得到网址的参数
        this.getUrlData();
        // 获取财务类目
        this.getFincls();
        //后去资金流水数据
        this.getcapitalList();
        //缴款列表
        this.getPayList();
    },

    methods: {
        /* 类编编码不能为空 */
        getfinclsData(res){
            if(!res){
                $('.finclsError').css('display','inline');
            }else{
                $('.finclsError').css('display','none')
            }
        },
        /* 金额不能为空 */
        getmoney(res){
            if(!res){
                $('.moneyError').css('display','inline')
            }else{
                $('.moneyError').css('display','none')
            }
        },
        /**
         * 得到资金流水数据
         */
         getcapitalList(data) {
            this.$resetAjax({
                url: '/NewA/Shop/getaccount',
                type: 'POST',
                data: {
                    code: this.urlParams.code,
                },
                success: (res) => {
                    this.capitalData = res.data;
                    switch(res.ifshow) {
                        case '3':
                            this.isPaymentReady = false;
                            this.isPayInit=false;
                            break;
                        case '2':
                            this.isPayInit=false;
                            this.isPaymentReady = true;
                            break;
                        case '1':
                            this.isPayInit=true;
                            this.isPaymentReady = false;
                            break;
                    }
                }
            })
        },
         /**
         * 得到网址的参数
         */
        getUrlData:function(){
            this.urlParams = getUrlParams();
            this.storeName = this.urlParams.name;
            this.code = this.urlParams.code;
            if (this.urlParams.openMoadl == '1') {
                this.paymentReady()
            }
        },
        /**
         * 获取缴款列表数据
         */
         getPayList() {
            this.$resetAjax({
                url: '/NewA/Shop/paylist',
                type: 'GET',
                data: {
                    hdid: this.code,
                    p: this.currentPage
                },
                success: (res) => {
                    res.data.forEach(ele => {
                        // 对时间转换
                        ele.oper_time = changeTime(ele.oper_time*1000);
                    });
                    // 缴款列表数据
                    this.payData = res.data;
                    this.init = res.init;
                    if(this.init == 1) {
                        this.isPaymentReady=true
                    } else if(this.init == 2) {
                        this.isPayInit=true;
                    }
                    this.total = Number(res.count);
                }
            })
        },
        /* 
        * 缴款初始化列表数据
         */
        payInit() {
            this.isPayInit = false;
            this.isPaymentReady = true;
            this.$resetAjax({
                url:'/Home/Caiwu/gd_init',
                type:'GET',
                data:{
                    hdid: this.code,
                    p: this.currentPage
                },
                success: (res) => {
                    console.log(res)
                }
            })  
        },
        /**
         * 得到缴款明细
         */
        getPayDatail(data) {
            this.title = '修改缴款';
            this.placeholder=data.finance_name;
            this.fincls=data.finance_cls;
            this.initialValue = data.money;
            this.memo = data.note;
            this.payId = data.id;
        },
        /**
         *  新增缴款
         */
        addPayok() {
            if(!this.fincls){
                $('.finclsError').css('display','inline');
            }else if(!this.initialValue){
                $('.moneyError').css('display','inline')
            }else if(this.fincls && this.initialValue){
                if(this.title == '新增缴款') {
                    this.$resetAjax({
                        url: '/NewA/Shop/payment',
                        type: 'POST',
                        data: {
                            hdid: this.code,
                            fincls: this.fincls,
                            money: this.initialValue,
                            note: this.memo,
                        },
                        success: (res) => {
                            this.$Message.success('增加成功');
                            // this.$root.tip.isShow = true;
                            // this.$root.tip.content = '增加缴款成功!!!';
                            // setTimeout(() => {
                            //     this.$root.tip.isShow = false;
                            // }, 1500);
                            this.modal=false;
                            this.getPayList();
                            this.fincls = "B0101";
                            this.initialValue = '';
                            this.memo = '';
                            this.title = '';
                        }
                    })
                } else {
                    this.$resetAjax({
                        url: '/NewA/Shop/payedit',
                        type: 'POST',
                        data: {
                            hdid: this.code,
                            fincls: this.fincls,
                            money: this.initialValue,
                            note: this.memo,
                            id: this.payId
                        },
                        success: (res) => {
                            this.modal=false;
                            if (res.errorcode == '3') {
                                // this.$root.tip.isShow = true;
                                // this.$root.tip.content = '抱歉,需操作人本人修改!!!';             
                                // setTimeout(() => {
                                //     this.$root.tip.isShow = false;
                                // }, 1500);
                                this.$Message.warning('抱歉,需操作人本人修改!');
                            } else if(res.errorcode==4){
                                // this.$root.tip.isShow = true;
                                // this.$root.tip.content = '您没有权限修改缴款！';             
                                // setTimeout(() => {
                                //     this.$root.tip.isShow = false;
                                // }, 1500);
                                this.$Message.warning('您没有权限修改缴款！');

                            }else{
                                this.$Message.success('修改成功');
                                // this.$root.tip.isShow = true;
                                // this.$root.tip.content = '修改缴款成功!!!';
                                // setTimeout(() => {
                                //     this.$root.tip.isShow = false;
                                // }, 2000);
                                this.getPayList();
                                this.initialValue = '';
                                this.memo = '';
                                this.title = '';
                            }
                        }
                    })
                }
                
            }
           
        },
        /**
         *  删除缴款
         */
        deletePay() {
            this.$resetAjax({
                url: '/NewA/Shop/paydel',
                type: 'POST',
                data: {
                    id: this.payRemoveData.id
                },
                success: (res) => {
                    this.isDelete = false;
                    if (res.errorcode == '3'){
                        this.$Message.warning('抱歉,需操作人本人删除！');
                        // this.$Modal.success({
                        //     content: '抱歉,需操作人本人删除！'
                        // });
                        // this.$root.tip.isShow = true;
                        // this.$root.tip.content = '抱歉,需操作人本人删除！';             
                        // setTimeout(() => {
                        //     this.$root.tip.isShow = false;
                        // }, 1500);
                    } else if(res.errorcode == '4'){
                        this.$Message.warning('抱歉,您没有权限！');
                        // this.$root.tip.isShow = true;
                        // this.$root.tip.content = '抱歉,您没有权限！';             
                        // setTimeout(() => {
                        //     this.$root.tip.isShow = false;
                        // }, 1500);
                    }else{
                        this.$Message.success('删除成功');
                        // this.$root.tip.isShow = true;
                        // this.$root.tip.content = '删除缴款成功！';             
                        // setTimeout(() => {
                        //     this.$root.tip.isShow = false;
                        // }, 1500);
                        this.getPayList();
                    }
                }
            })
        },
        /* 
        *  审核
         */
        examine(){
            this.isExamine=false;
            this.$resetAjax({
                url:'/NewA/Shop/examine',
                type:'POST',
                data:{
                    id:this.row.id
                },
                success:(res)=>{
                    if(res.msg == "success") {
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '审核通过!';             
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                        }, 1500);
                        this.getPayList();
                    } else if(res.errorcode == 4) {
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '您没有权限审核!';             
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                        }, 1500);
                    } else{
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '审核失败!!!';             
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                        }, 1500);
                    }
                }
            })
        },
        /**
         * 获取财务类目
         */
        getFincls() {
            this.$resetAjax({
                url: '/NewA/Public/getfincls',
                type: 'POST',
                success: (res) => {
                    this.finclsList = JSON.parse(res);
                }
            })
        },
        /**
         * 缴款 
         */
        paymentReady() {
            $('.finclsError').css('display','none')
            $('.moneyError').css('display','none')
            this.initialValue = '';
            this.memo = '';
            this.modal = true;
            this.title = '新增缴款';
        },
        /**
         * 查看资金流水
         */
        goCapital() {
            this.$router.push({path: 'capital', query: {code: this.urlParams.code, name: this.urlParams.name}});
        },
        /**
         * 返回客户列表
         */
        gonameList() {
            this.$router.push({path: 'store'});
        },
        /**
         * 切换页码
         */
         changePage(index) {
            this.currentPage = index;
            this.getPayList();
        },
    }
}
</script>
