<template>
    <div class="contract">
        <div class="top">
            <div style="display:flex;align-items: center;">
                <h3 style="color: #1596ad">合同列表 &gt;&gt;</h3>
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
                <!-- <div class="part">
                    <span class="item">时间筛选：</span>
                    <DatePicker :value="datevalue" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="Select date" style="width: 260px" @on-change="getTime"></DatePicker>
                </div> -->
                <div class="part">
                    <Button @click="search" class="searchclass" >查询</Button>
                </div>
            </div>
            </div>
            <!-- 内容区 -->
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
                // 时间区间
                datevalue:[],
                username:'',
                store:'', //门店编码
                phone:'',
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
                tableHeight:900,
                //表格头部
                columns:[
                    // {
                    //     title: '交易编号',
                    //     key: 'dealcode',
                    //     align: 'center',
                    // },
                    
                    {
                        title: "姓名",
                        key: 'username',
                        align: 'center',
                    },
                    {
                        title: "电话号码",
                        key: 'phone',
                        align: 'center',
                    },
                    {
                        title: "开店地址",
                        key: 'address',
                        align: 'center',
                    },
                    {
                        title: '签单分类',
                        key: 'contract_cate',
                        align: 'center',
                    },
                    {
                        title: "签单时间",
                        key: 'sign_time',
                        align: 'center',
                    },
                    {
                        title: "总收款",
                        key: 'totalMoney',
                        align: 'center',
                    },
                    {
                        title: "本月收款",
                        key: 'curmonth',
                        align: 'center',
                    },
                    {
                        title: "是否需要拓展找店面",
                        key: 'expand',
                        align: 'center',
                    },
                    {
                        title: "备注",
                        key: 'remark',
                        align: 'center',
                    },
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
                        render: (h, params) => {
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
                                            this.$router.push({ name: 'signing', query: {id:params.row.id} });
                                            // window.open(routeData.href, '_blank');
                                        }
                                    }
                                }, '编辑'),
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
                                           this.status=2;
                                           this.getconfinish();
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
                                            this.rid=params.row.id;
                                            this.$resetAjax({
                                                url: '/NewA/Customer/consta',
                                                type: 'POST',
                                                data:{
                                                    id:this.rid,
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
                                            // this.formValidate.money=''
                                            // this.hasShow=true;
                                        }
                                    }
                                }, '退款'),
                                
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
                status:''
            }
        },
        created(){
            this.getconlist()
        //    this.getUrlData();
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
        methods:{
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
            // 根据时间删选
            getTime(date){
                this.datevalue=date;
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
                        p:this.currentPage,
                        type:'1',
                        id:this.id,
                        // time:this.datevalue,
                        username:this.username,
                        phone:this.phone,
                        store:this.store

                    },
                    success:(res) => {
                        this.tableData = JSON.parse(res).data;
                        this.total = Number(JSON.parse(res).count);
                        this.tableData.forEach(ele=>{
                            ele.sign_time=changeday(ele.sign_time*1000)
                        })
                    }
                })
            },
            // 新增签单
            add(){
                let routeData = this.$router.resolve({ name: 'signing'});
                window.open(routeData.href, '_self');
            },
            // 全款结单
            getconfinish(){
                this.$resetAjax({
                    url: '/NewA/Customer/confinish',
                    type: 'POST',
                    data:{
                        fid:this.fid,
                        status:this.status
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
                            url: '/NewA/Customer/consta',
                            type: 'POST',
                            data:{
                                id:this.rid,
                                // refund:this.formValidate.money
                            },
                            success:(res) => {
                               let result=JSON.parse(res);
                               if(result.errorcode==0){
                                    this.$Message.success('退款成功');
                                    this.getconlist();
                                    // this.hasShow=false;
                                    // let routeData = this.$router.resolve({ name: 'refund', query: {isShow:1,id:params.row.id}});
                                    // window.open(routeData.href, '_self');
                                    // this.$router.push({ name: 'refund', query: {isShow:1,id:params.row.id}});
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