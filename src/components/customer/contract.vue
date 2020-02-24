<template>
    <div class="contract">
        <div class="top">
            <div style="display:flex;align-items: center;margin-right:10px;">
                <!-- <h3 style="color: #1596ad">合同列表 &gt;&gt;</h3> -->
                <Button @click="add" class="addclass">新增签单</Button>
            </div>            
            <div class="right">
                <div class="part">
                    <span class="item">门店编码：</span>
                    <Input v-model="store" placeholder="请输入门店编码" clearable style="width:120px;"></Input>
                </div>
                <div class="part">
                    <span class="item">姓名：</span>
                    <Input v-model="username" placeholder="请输入客户姓名" clearable style="width:150px;"></Input>
                </div>
                <div  class="part">
                    <span class="item">联系方式：</span>
                    <Input v-model="phone" placeholder="请输入联系方式" style="width:150px;" clearable></Input>
                </div>
                <div class="part">
                    <span class="item">获客渠道：</span>
                    <Select clearable v-model="channels" placeholder="请选择客户来源">
                        <Option v-for="item in sourceList" :value="item.cid" :key="item.cid">{{item.channels}}</Option>
                    </Select>
                </div>             
                <div class="part">
                    <span class="item">部门：</span>
                    <Select clearable v-model="department" placeholder="请选择部门">
                        <Option v-for="item in departmentList" :value="item.department" :key="item.id">{{item.department}}</Option>
                    </Select>                
                </div>
                 <div class="part">
                    <span class="item">招商：</span>
                    <Select clearable v-model="user_name" style="width:180px" placeholder="请选择下级" @on-change="getlowlevel(user_name)">
                        <Option value="1" key="01">全部</Option>
                        <Option v-for="item in lowlevelList" :value="item.userid" :key="item.userid">{{ item.user_name}}</Option>
                    </Select>
                </div>
                <div class="part">
                <span class="item">联系时间：</span>
                <DatePicker :value="contimevalue" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 160px" @on-change="getTimec"></DatePicker>
            </div>
            <div class="part">
                <span class="item">签单时间：</span>
                <DatePicker :value="signtimevalue" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 160px" @on-change="getTimes"></DatePicker>
            </div>            
            <!-- <div  class="part">
                <span class="item">签约周期：</span>
                <Input v-model="range" placeholder="请输入签约周期" style="width:150px;" clearable></Input>
            </div> -->
            <div  class="part">
                <span class="item">客户几个店面：</span>
                <Input v-model="store_num" placeholder="请输入客户几个店面" style="width:150px;" clearable></Input>
            </div>
                <Button @click="search" class="searchclass" >查询</Button>
            </div>
        </div>
        
        <!-- 内容区 -->
        <ul class="tab">
            <li v-for="(item,index) in typeList" :key="index" @click="changeItem(item.contract_cate,item.id)" :class="liIndex==item.id?'active':''">{{item.contract_cate}}</li>
        </ul>
        <div class="table">
            <div style="width:260px;display:flex;align-items: center;padding-bottom:10px;" v-show="examineShow">
                <span style="width:150px;color:#189cd">客户审批状态：</span>
                <Select placeholder="请选择审批状态" v-model="examine" @on-change="getexamine(examine)">
                    <Option value="0" label="全部">全部</Option>
                    <Option value="2" label="已审批">已审批</Option>
                    <Option value="1" label="未审批">未审批</Option>
                </Select>
            </div>
            <Table :row-class-name="rowClassName" border :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
        <div class="footer">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 全款结单弹出框 -->
        <Modal title="全款结单" v-model="hasShow"  :mask-closable="false" class="refundModal">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" style="padding-top:20px;">
                <FormItem prop="time" label="选择时间">
                   <DatePicker v-model="formValidate.time" type="datetime" placeholder="选择全款结单时间" style="width:200px;"></DatePicker> 
                </FormItem>
                <FormItem class="sub">
                    <Button type="primary" @click="submit('formValidate')">确定</Button>
                    <Button type="ghost" @click="hasShow=false" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>
        <!-- 退款弹出框 -->
        <Modal title="退款" v-model="refundShow"  :mask-closable="false" class="refundModal">
            <Form ref="refundformValidate" :model="refundformValidate" :rules="refundruleValidate" :label-width="100" style="padding-top:20px;">
                <FormItem prop="return_money" label="退款金额">
                   <Input v-model="refundformValidate.return_money" placeholder="请输入退款金额" type="number" @mousewheel.native.prevent ></Input>
                </FormItem>
                <!-- <FormItem prop="time" label="选择时间">
                   <DatePicker v-model="refundformValidate.time" type="datetime" placeholder="选择全款结单时间" style="width:200px;"></DatePicker> 
                </FormItem> -->
                <FormItem label="备注" prop="remark">
                    <Input v-model="refundformValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                </FormItem>
                <FormItem class="sub">
                    <Button type="primary" @click="refundsubmit('refundformValidate')">确定</Button>
                    <Button type="ghost" @click="refundShow=false" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import {getUrlParams} from  '@/assets/js/tool.js'
    import {changeday,changeTime} from "@/assets/js/tool.js"//时间戳
    export default{
        components:{
            changeday
        },
        data(){
            return{
                // 应退款弹出框
                hasShow:false,
                // 联系时间区间
                contimevalue:[],
                // 签单时间
                signtimevalue:[],
                // 渠道来源数据
                sourceList: [],
                channels:'',
                // 签约周期
                range:'',
                // 客户第几个店面
                store_num:'',
                // 部门数据
                departmentList:[
                    {id:'1',department:'加盟二部'},
                    {id:'2',department:'加盟三部'},
                    {id:'3',department:'南京加盟部'},
                    {id:'4',department:'成都加盟部'},
                    {id:'5',department:'广州加盟部'},
                ],
                // 客户状态列表
                typeList:[
                    {id:'0',contract_cate:'全部'},
                    {id:'1',contract_cate:'意向金'},
                    {id:'2',contract_cate:'合同'},
                    {id:'3',contract_cate:'全款'},
                    {id:'4',contract_cate:'退款'},
                ],
                liIndex:'0',
                // 下级数据
                lowlevelList: [],
                contract_cate:'',
                username:'',
                store:'', //门店编码
                phone:'',
                // 招商选择
                user_name:'',
                // 部门选择
                department:'',
                // 全款结单
                formValidate:{
                    time:''
                },
                ruleValidate: {
                    time:[
                        {required: true, type: 'date', message: '请输入全款结单时间', trigger: 'blur'}
                    ],
                },
                // 退款
                refundShow:false,
                refundformValidate:{
                    // time:'',
                    return_money:'',
                    remark:''
                },
                refundruleValidate: {
                    return_money:[
                        {required: true, message: '请输入退款金额', trigger: 'blur'}
                    ],
                    // time:[
                    //     {required: true, type: 'date', message: '请输入退款时间', trigger: 'blur'}
                    // ],
                },
                // 客户id
                id:'',
                fid:'',//全款结单id
                rid:'',//退款结单id
                // 是否显示审批状态
                examineShow:false,
                //表格的高度
                tableHeight:700,
                //表格头部
                columns:[                    
                    {
                        title: "客户姓名",
                        key: 'username',
                        align: 'center',
                        width:120,
                        fixed: "left",
                    },
                    {
                        title: "招商",
                        key: 'user_name',
                        align: 'center',
                        width:120,
                        fixed: "left",
                    },
                    {
                        title: "部门",
                        key: 'department',
                        align: 'center',
                        width:100,
                        fixed: "left",
                    },
                    {
                        title: "电话号码",
                        key: 'phone',
                        align: 'center',
                        width:120,
                        fixed: "left",
                    },
                    {
                        title: "联系时间",
                        key: 'contime',
                        align: 'center',
                        width:110,
                    },
                    {
                        title: "签单时间",
                        key: 'sign_time',
                        align: 'center',
                        width:110,
                    },
                    {
                        title: "获客渠道",
                        key: 'channels',
                        align: 'center',
                        width:100,
                    },
                    {
                        title: "签约周期",
                        key: 'range',
                        align: 'center',
                        width:100,
                    },
                    {
                        title: "客户第几个店面",
                        key: 'store_num',
                        align: 'center',
                        width:130,
                    },
                    {
                        title: "货款（元）",
                        align: 'center',
                        width:160,
                        children:[
                            {
                                title: '店面大小',
                                key: 'area',
                                align: 'center',
                                width: 100,
                            },
                            {
                                title: '实到货款',
                                key: 'actual_payment',
                                align: 'center',
                                width: 100,
                            },
                        ]
                    },
                    {
                        title: "装修款（元）",
                        align: 'center',
                        width:160,
                        children:[
                            {
                                title: '货柜',
                                key: 'container_payment',
                                align: 'center',
                                width: 100,
                            },
                            {
                                title: '装修押金',
                                key: 'decoration_deposit',
                                align: 'center',
                                width: 100,
                            },
                        ]
                    },
                    {
                        title: "履约金（元）",
                        key: 'performance_bond',
                        align: 'center',
                        width:100,
                    },
                    {
                        title: "品牌使用费（元）",
                        key: 'manage_expense',
                        align: 'center',
                        width:100,
                    },
                    {
                        title: "督导预付款（元）",
                        key: 'prepayment',
                        align: 'center',
                        width:100,
                    },
                    {
                        title: '客户状态',
                        key: 'contract_cate',
                        align: 'center',
                        width:120,
                    },
                    {
                        title: '审批状态',
                        key: 'examine',
                        align: 'center',
                        width:100,
                         render: (h, params) => {                           
                            return h('div', [
                                h('a', {
                                    class: 'handle',
                                    style: {
                                        marginRight: '10px',
                                        cursor: 'pointer',
                                        color:'#1d8c9f'
                                    },
                                    domProps: {
                                        title: '点击通过审批'
                                    },
                                   
                                    on: {
                                        click: () => {
                                            if(params.row.examine=='未审批'){
                                                this.$resetAjax({
                                                    url:'/NewA/Customer/examine',
                                                    type:'post',
                                                    data:{
                                                        id:params.row.id
                                                    },
                                                    success:(res)=>{
                                                        let result=JSON.parse(res)
                                                        this.$Message.success(result.msg);
                                                        if(result.errorcode==0){
                                                            this.getconlist();
                                                        }    
                                                    }
                                                })  
                                            }else if(params.row.examine=='已审批'){
                                                this.$Message.warning('已通过审批！')
                                            }
                                           
                                        }
                                    }
                                }, params.row.examine),                

                            ]);
                        }
                    },
                    {
                        title: "总回款（元）",
                        key: 'totalMoney',
                        align: 'center',
                        width:100,
                    },                  
                    {
                        title: '操作',
                        key: 'action',
                        width: 200,
                        align: 'center',
                        fixed:'right',
                        render: (h, params) => {
                            var text=''
                            if(this.contract_cate=='全款'){
                                text='详情'
                            }else{
                                text='编辑'
                            }                                       
                            return h('div', [
                                h('a', {
                                    class: 'handle',
                                    style: {
                                        marginRight: '10px',
                                        cursor: 'pointer',
                                        color:'#1d8c9f'
                                    },
                                    on: {
                                        click: () => {                                                                                       
                                            this.$router.push({ name: 'signing', query: {id:params.row.id,cate:this.contract_cate}});                                            
                                        }
                                    }
                                }, text),
                                h('a', {
                                    class: 'handle',
                                    style: {
                                        marginRight: '10px',
                                        cursor: 'pointer',
                                        color:'#1d8c9f'
                                    },
                                    on: {
                                        click: () => {
                                            this.fid=params.row.id;
                                            this.newcontract_cate='全款';  
                                            this.hasShow=true; 
                                        }
                                    }
                                }, '全款结单'),
                                h('a', {
                                    class: 'handle',
                                    style: {
                                        marginRight: '10px',
                                        cursor: 'pointer',
                                        color:'#1d8c9f'
                                    },
                                    on: {
                                        click: () => {                                          
                                            this.fid=params.row.id;
                                            this.newcontract_cate='退款';
                                            this.refundShow=true; 
                                        }
                                    }
                                }, '退款'),
                                                    
                            ]);
                        }
                    },
                    
                ],
                // 审批状态
                examine:'0',
                //表格数据
                tableData:[],
                // 对时间进行限制,选择不到大于今天的时间
                options: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                //输入的时间范围
                dateRange:[],
                pageSize:20,
                currentPage:1,
                total:0,
                // 订单状态
                newcontract_cate:''
            }
        },
        created(){
            // 得到下级数据
            this.getlowlevelList();
            // 得到渠道来源数据
            this.getSourceList();
            this.getconlist()
            //    this.getUrlData();
            
        },
        
        mounted() {
            setTimeout(()=> {
                // 得到浏览器内容高度
                var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight- 360);
            },100)
            // 调整浏览器的时候
            $(window).on('resize', () => {
                var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight - 360);
            })
        
        },
        methods:{
            rowClassName (row) {
                if(this.liIndex==='0'){
                    if(row.contract_cate=='全款'){
                        return 'demo-table-info-row';
                    } else if(row.contract_cate=='退款'){
                        return 'demo-table-error-row';
                    }
                    return '';
                }
                if(this.liIndex==='4'){
                    return 'demo-table-error-row';
                }
                if(this.liIndex==='3'){
                    return 'demo-table-info-row';
                }
                
            
            },
            // 分类切换
            changeItem(key,index){  
                this.currentPage=1;
                this.liIndex=index;
                if(this.liIndex==4){
                    this.examineShow=true;
                    this.examine='0'
                }else{
                    this.examineShow=false
                }
                this.contract_cate=key;
                if(this.contract_cate=='全部'){
                    this.contract_cate='';
                }
                this.getconlist();
            },
            /**
            * 得到渠道来源数据
            */
            getSourceList() {
                this.$resetAjax({
                    type: 'POST',
                    url: '/NewA/Public/getchannel',
                    success: (res) => {
                        this.sourceList = JSON.parse(res).data;
                    }
                })
            },
            /**
             * 得到网址的参数
             */
             getUrlData:function(){
                this.urlParams = getUrlParams();
                this.id = this.urlParams.id;
                if(typeof(this.id)=='undefined'){
                    this.showButton=false;
                }else{
                    this.showButton=true;
                }
                this.getconlist();
            },
            /**
            * 得到所有下级的数据
            */
            getlowlevelList() {
                this.$resetAjax({
                    url: '/NewA/Public/getnext',
                    type: 'POST',
                    success: (res) => {
                        this.lowlevelList = JSON.parse(res).data;
                    }
                })
            },
            // 得到招商
            getlowlevel(value){
                console.log(value);
            },
            // 根据时间删选联系时间
            getTimec(date){
                this.contimevalue=date;
            },
            // 签单时间
            getTimes(date){
                this.signtimevalue=date;
            },
            search(){
                this.getconlist()
            },
            // 获取合同客户列表
            getconlist(){
                this.$resetAjax({
                    url: '/NewA/Customer/conlist',
                    type: 'GET',
                    data:{
                        p:this.currentPage, //分页
                        // type:'1',
                        // id:this.id, 
                        contime:this.contimevalue, //联系时间
                        sign_time:this.signtimevalue, //签单时间
                        username:this.username, //客户姓名
                        user_name:this.user_name, //招商
                        channels:this.channels, //渠道
                        phone:this.phone, //手机号
                        store:this.store, //门店编码
                        // range:this.range, //成交周期
                        store_num:this.store_num,  //客户第几个店面
                        contract_cate:this.contract_cate //客户状态
                    },
                    success:(res) => {
                        this.tableData = JSON.parse(res).data;
                        this.total = Number(JSON.parse(res).count);
                        this.tableData.forEach(ele=>{
                            ele.sign_time=changeday(ele.sign_time*1000);
                            ele.contime=changeday(ele.contime*1000);
                            if(ele.examine==1){
                                ele.examine='未审批'
                            }else if(ele.examine==2){
                                ele.examine='已审批'
                            }else{
                                ele.examine='';
                            }
                        })
                    }
                })
            },
            // 获取审批状态数据
            getexamine(examine){
                this.currentPage=1
                if(examine=='0'){
                    this.contract_cate='退款';
                    this.getconlist();
                }else{
                    this.$resetAjax({
                        url:'/NewA/Customer/examinelist',
                        type:'GET',
                        data:{
                            examine:examine,
                            p:this.currentPage
                        },
                        success:(res)=>{
                            this.tableData = JSON.parse(res).data;
                            // console.log(this.tableData)
                            this.total = Number(JSON.parse(res).count);
                            this.tableData.forEach(ele=>{
                                ele.sign_time=changeday(ele.sign_time*1000);
                                ele.contime=changeday(ele.contime*1000);
                                if(ele.examine==1){
                                    ele.examine='未审批'
                                }else if(ele.examine==2){
                                    ele.examine='已审批'
                                }
                            })
                        }
                    })
                }
            },
            // 新增签单
            add(){
                let routeData = this.$router.resolve({ name: 'signing'});
                window.open(routeData.href, '_self');
            },
            // 全款结单
            submit(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$resetAjax({
                            url: '/NewA/Customer/confinish',
                            type: 'POST',
                            data:{
                                fid:this.fid,
                                contract_cate:this.newcontract_cate,
                                time:changeTime(this.formValidate.time)
                            },
                            success:(res) => {
                               let result=JSON.parse(res);
                               if(result.errorcode==0){
                                    this.$Message.success('全款结单成功');
                                    this.hasShow=false;
                                    this.getconlist();
                                   
                               }else{
                                   this.$Message.success('全款结单失败');
                                   this.hasShow=true;
                               }
                               
                            }
                        })
                       
                    }else{
                    }
                })
            },
            // 退款
            refundsubmit(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$resetAjax({
                            url: '/NewA/Customer/confinish',
                            type: 'POST',
                            data:{
                                fid:this.fid,
                                contract_cate:this.newcontract_cate,
                                // time:changeTime(this.refundformValidate.time),
                                remark:this.refundformValidate.remark,
                                return_money:this.refundformValidate.return_money
                            },
                            success:(res) => {
                               let result=JSON.parse(res);
                               if(result.errorcode==0){
                                    this.$Message.success('退款成功');
                                    this.refundShow=false;
                                    this.getconlist();                                   
                               }else{
                                   this.$Message.success('退款失败');
                                   this.refundShow=true;
                               }
                               
                            }
                        })                       
                    }else{
                    }
                })
            },
            // 分页
            changePage(index){
                console.log(this.examine);
                this.currentPage=index;
                this.getconlist();
            }
        }
    }
</script>