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
            <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
        <div class="footer">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <Modal title="填写应退款金额" v-model="hasShow"  :mask-closable="false" class="refundModal">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" style="padding-top:20px;">
                <FormItem prop="money" label="金额">
                    <Input v-model="formValidate.money" type="number" placeholder="请输入金额..." style="width:200px;margin-top:0;" /> 
                </FormItem>
                <FormItem class="sub">
                    <Button type="primary" @click="submit('formValidate')">确定</Button>
                    <Button type="ghost" @click="hasShow=false" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import {getUrlParams} from  '@/assets/js/tool.js'
    import {changeday} from "@/assets/js/tool.js"//时间戳
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
                formValidate:{
                    money:''
                },
                ruleValidate: {
                    money:[
                        {required: true, message: '请输入退款金额', trigger: 'blur'}
                    ],
                },
                // 客户id
                id:'',
                fid:'',
                rid:'',
                // showButton:true,
                //表格的高度
                tableHeight:800,
                //表格头部
                columns:[
                    // {
                    //     title: '交易编号',
                    //     key: 'dealcode',
                    //     align: 'center',
                    // },
                    
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
                        title: "总回款（元）",
                        key: 'totalMoney',
                        align: 'center',
                        width:100,
                    },
                    // {
                    //     title: "本月收款",
                    //     key: 'curmonth',
                    //     align: 'center',
                    // },
                    // {
                    //     title: "是否需要拓展找店面",
                    //     key: 'expand',
                    //     align: 'center',
                    // },
                    // {
                    //     title: "备注",
                    //     key: 'remark',
                    //     align: 'center',
                    // },
                    // {
                    //     title: "标签",
                    //     key: 'intention',
                    //     align: 'center',
                    // },
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
                                            this.$router.push({ name: 'signing', query: {id:params.row.id,cate:this.contract_cate} });
                                            
                                        }
                                    }
                                }, text),
                                h('a', [
                                    h('Poptip', {
                                        class: 'handle',
                                        props: {
                                            confirm: true,
                                            transfer: true,
                                            placement: 'top',
                                            title: '确定要全款结单吗 ?',
                                            type: 'error',
                                            size: 'small',
                                            width: '150',
                                            vModel: true
                                        },                                    
                                        on: {
                                            'on-ok': ()=>{
                                                this.fid=params.row.id;
                                                this.newcontract_cate='全款';                                                
                                                this.getconfinish();
                                            },
                                            'on-cancel': ()=>{
                                                // 取消认领
                                            }
                                        },
                                        style: {
                                            marginRight: '10px',
                                            cursor: 'pointer',
                                            color:'#1d8c9f'
                                        },                                    
                                    }, '全款结单'),
                                ]),
                                h('a', [
                                    h('Poptip', {
                                        class: 'handle',
                                        props: {
                                            confirm: true,
                                            transfer: true,
                                            placement: 'top',
                                            title: '确定要删除吗 ?',
                                            type: 'error',
                                            size: 'small',
                                            width: '150',
                                            vModel: true
                                        },                                    
                                        on: {
                                            'on-ok': ()=>{
                                                // 确定删除;
                                                this.fid=params.row.id;
                                                this.newcontract_cate='退款';
                                                this.getconfinish();
                                            },
                                            'on-cancel': ()=>{
                                                // 取消认领
                                            }
                                        },
                                        style: {
                                            marginRight: '10px',
                                            cursor: 'pointer',
                                            color:'#1d8c9f'
                                        },                                    
                                    }, '退款'),
                                ]) 
                            ]);
                        }
                    },
                    
                ],
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
                this.tableHeight = (windowHeight- 300);
            },100)
            // 调整浏览器的时候
            $(window).on('resize', () => {
                var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight - 300);
            })
        
        },
        methods:{
            // 分类切换
            changeItem(key,index){  
                this.currentPage=1;
                this.liIndex=index;
                
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
                        })
                    }
                })
            },
            // 新增签单
            add(){
                let routeData = this.$router.resolve({ name: 'signing'});
                window.open(routeData.href, '_self');
            },
            // 全款结单//退款
            getconfinish(){
                this.$resetAjax({
                    url: '/NewA/Customer/confinish',
                    type: 'POST',
                    data:{
                        fid:this.fid,
                        contract_cate:this.newcontract_cate
                    },
                    success:(res) => {
                        if(JSON.parse(res).errorcode==0){
                            this.$Message.success('结单成功');
                            this.getconlist();
                        }else if(JSON.parse(res).errorcode==1){
                            this.$Message.success('结单失败')
                        }
                    }
                })
            },
            // 退款
            submit(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$resetAjax({
                            url: '/NewA/Customer/confinish',
                            type: 'POST',
                            data:{
                                id:this.rid,
                                contract_cate:this.newcontract_cate
                            },
                            success:(res) => {
                               let result=JSON.parse(res);
                               if(result.errorcode==0){
                                    this.$Message.success('退款成功');
                                    this.getconlist();
                                   
                               }else{
                                   this.$Message.success('退款失败');
                               }
                               
                            }
                        })
                       
                    }else{
                    }
                })
            },
            // 分页
            changePage(index){
                this.currentPage=index;
                this.getconlist();
            }
        }
    }
</script>