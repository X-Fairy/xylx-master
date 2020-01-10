<template>
    <div class="signing">
        <div class="header">
            <div class="info">
                <h3>{{title}}&gt;&gt;</h3>
                <div class="num" v-show="title=='新增签单'">
                    <span class="item">门店编码：</span>
                    <Input v-model="store" placeholder="请输入5位数字编码"  maxlength="5" show-word-limit @on-enter="getStore" clearable  />
                    <Button slot="append" icon="ios-search" @click="getStore"></Button>
                </div>
            </div>
            <div>
                <Button type="warning" @click="back">查看合同列表</Button>
            </div>
        </div>
        <div class="main">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" class="signForm">
                <!-- <FormItem label="交易编号" prop="dealcode">
                    <Input v-model="formValidate.dealcode"></Input>
                </FormItem> -->
                <p style="width:100%">客户信息&gt;&gt;</p>
                <FormItem label="客户姓名" prop="name">
                    <Input v-model="formValidate.name" placeholder="请输入客户姓名" ></Input>
                </FormItem>
                <FormItem label="客户地址" prop="address">
                    <Input v-model="formValidate.address" type="textarea" :autosize="{minRows: 1,maxRows: 5}" placeholder="请输入客户地址"></Input>
                </FormItem>
                <FormItem label="客户来源" prop="source">
                    <Select v-model="formValidate.source" placeholder="请选择客户来源">
                        <Option v-for="item in sourceList" :value="item.cid" :key="item.cid">{{item.channels}}</Option>
                    </Select> 
                </FormItem>
                <FormItem label="签单时间" prop="sign_time">
                    <DatePicker type="date" placeholder="请选择签单时间" v-model="formValidate.sign_time" @on-change="getRange" :options="options" ></DatePicker>
                </FormItem>
                <FormItem label="联系方式" prop="phone">
                    <ul>
                        <li v-if="formValidate.phone==''">
                            <Input  placeholder="请输入客户电话号码"></Input>
                        </li>
                        <li v-for="(item,index) in formValidate.phone" :key="index" style="position:relative">
                            <Input  v-model="item.tel"  placeholder="请输入客户电话号码" @on-blur="blurInput" :disabled='item.disable'></Input>
                            <Button v-if="formValidate.phone.length>1 && index === (formValidate.phone.length - 1)"  type="error" class="error" shape="circle"  icon="ios-minus-outline" title="清除电话号码" @click="deletephoneNum" style="background:rgb(194, 189, 189);width: 25px;height: 25px;padding: 0;font-size: 16px;border-radius: 50%;position: absolute;top: -10px;right:-10px;"></Button>
                            <Button v-if="index === (formValidate.phone.length - 1)" type="error" shape="circle" class="error" icon="ios-plus-outline" title="添加电话号码" @click="addIphoneNum" style="background:#1596ad;border-color:#1596ad;width: 25px;height: 25px;padding: 0;font-size: 16px;border-radius: 50%;position: absolute;top: 19px;right:-10px;"></Button>
                        </li>
                    </ul>
                </FormItem>
                <FormItem label="联系时间" prop="contactdate">
                    <DatePicker type="date" placeholder="请选择联系时间" v-model="formValidate.contactdate" @on-change="getRange" :options="options"></DatePicker>
                </FormItem>
               <FormItem label="换货时间（天）：" prop="exchange">
                    <Input v-model="formValidate.exchange" type="number" @mousewheel.native.prevent></Input>
                    <!-- <RadioGroup v-model="formValidate.exchange">
                        <Radio label="换">换</Radio>
                        <Radio label="不换">不换</Radio>
                    </RadioGroup> -->
                </FormItem>
                <FormItem label="成交周期" prop="range">
                    <Input v-model="formValidate.range" readonly ></Input>
                </FormItem>
                <FormItem label="门店数量" prop="store_num">
                    <Input v-model="formValidate.store_num" placeholder="请输入门店数量"></Input>
                </FormItem>
               
                <FormItem label="搜索关键词" prop="keyword" >
                    <Input v-model="formValidate.keyword" placeholder="请输入关键词"></Input>
                </FormItem>                
                <!-- <FormItem label="选择：" prop="distribution">
                    <RadioGroup v-model="formValidate.distribution">
                        <Radio label="公司配货">公司配货</Radio>
                        <Radio label="自选货">自选货</Radio>
                    </RadioGroup>
                </FormItem> -->
                 <FormItem label="是否需要拓展找店面：" prop="expand" label-width="150">
                    <RadioGroup v-model="formValidate.expand">
                        <Radio label="是">是</Radio>
                        <Radio label="否">否</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="合同分类：" prop="contract_cate" style="width:100%;">
                    <RadioGroup v-model="formValidate.contract_cate" @on-change="getCate">
                        <Radio label="意向金">意向金</Radio>
                        <Radio label="合同">合同</Radio>
                        <Radio label="全款">全款</Radio>
                        <Radio label="退款">退款</Radio>
                    </RadioGroup>
                    <Upload multiple  action="/NewA/Workorder/getimage" style="position: absolute;top: 0;left: 240px;"
                        :on-success="handleSuccess"
                        :format="['jpg','jpeg','png']"
                        :on-format-error="handleFormatError">
                        <Button icon="ios-cloud-upload-outline">上传意向金/合同图片</Button>
                    </Upload>                    
                </FormItem>
                <FormItem class="up" label="上传图片：">
                    <Upload multiple  action="/NewA/Workorder/getimage" 
                        :on-success="handleSuccess1"
                        :format="['jpg','jpeg','png']"
                        :on-format-error="handleFormatError">
                        <Button icon="ios-cloud-upload-outline">上传政策表</Button>
                    </Upload>
                    <Upload multiple  action="/NewA/Workorder/getimage"
                        :on-success="handleSuccess2"
                        :format="['jpg','jpeg','png']"
                        :on-format-error="handleFormatError">
                        <Button icon="ios-cloud-upload-outline">上传补充协议</Button>
                    </Upload>                    
                   <Button v-show="uploadImages.length>0" @click="carouse=true">查看图片</Button>
                </FormItem>
                <p style="width:100%">账目信息&gt;&gt;</p>                
                <FormItem label="履约金" prop="performance_bond">
                    <Input v-model="formValidate.performance_bond" placeholder="请输入履约金" type="number" @mousewheel.native.prevent></Input>
                </FormItem>
                <FormItem label="加盟费/管理费" prop="manage_expense">
                    <Input v-model="formValidate.manage_expense" placeholder="请输入加盟费/管理费" type="number" @mousewheel.native.prevent></Input>
                </FormItem>
                <FormItem label="督导预付款" prop="prepayment">
                    <Input v-model="formValidate.prepayment" placeholder="请输入督导预付款" type="number" @mousewheel.native.prevent></Input>
                </FormItem>
                <FormItem label="货柜单价（元）" prop="unitPrice">
                    <Input v-model="formValidate.unitPrice" placeholder="请输入货柜单价" type="number" @mousewheel.native.prevent @on-change="getcontainerPayment"></Input>
                </FormItem>
                <FormItem label="货款" class="double">
                    <Row>
                        <Col span="11">
                            <FormItem prop="area" label="店面面积(平方米)" class="part">
                                <Input v-model="formValidate.area" type="number" @on-change="getcontainerPayment"></Input>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem prop="actual_payment" label="实到货款（元）" class="part">
                                <Input v-model="formValidate.actual_payment" type="number" @mousewheel.native.prevent></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem label="装修款" class="double">
                    <Row>
                        <Col span="11">
                            <FormItem prop="container_payment" label="货柜款（元）" class="part">
                                <Input v-model="formValidate.container_payment" type="number" @mousewheel.native.prevent @on-change="getPrice"></Input>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem prop="decoration_deposit"  label="装修押金（元）" class="part">
                                <Input v-model="formValidate.decoration_deposit"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </FormItem>
               <FormItem label="年房租" prop="rent_year">
                    <Input v-model="formValidate.rent_year" placeholder="请输入年房租" type="number" @mousewheel.native.prevent></Input>
                </FormItem>
                <FormItem label="本月总业绩" prop="curmonth">
                    <Input v-model="formValidate.curmonth" placeholder="请输入本月总业绩" readonly type="number" @mousewheel.native.prevent></Input>
                </FormItem>
                <FormItem label="目前总到款" prop="totalMoney">
                    <Input v-model="formValidate.totalMoney" placeholder="请输入总到款" readonly type="number" @mousewheel.native.prevent></Input>
                </FormItem>
                <p  style="width:100%">其他&gt;&gt;</p>
                <FormItem label="政策赠送" prop="give">
                    <Input v-model="formValidate.give" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                </FormItem>
                <FormItem style="width: 100%;" class="check">
                    <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                </FormItem>
            </Form>
            <div class="right">
                <Button  class="addDetail">账目明细</Button>
                <Table :columns="columns1" :data="data1" :height="tableHeight"></Table>           
            </div>
        </div>
         <!-- 查看图片轮播图 -->              
        <div class="carouselcontent" v-if="carouse">
            <Icon type="ios-close-outline" class="close_icon" title="关闭弹窗" @click="carouse=false;"></Icon>
            <Carousel v-model="value1">
                <CarouselItem v-for="(item,index) in uploadImages" :key="index">
                    <div class="demo-carousel"><img :src="item.imgs" alt="加载图片..."></div>
                    <div class="bottom">
                        <Button title="点击删除当前这张图片" @click="deleteImage(item)" style="backgroud:#ddd;">删除</Button>
                        <p>{{item.cate}}：{{item.name}}</p>
                        <Button @click="carouse=false;">确定</Button>
                    </div>
                </CarouselItem>
            </Carousel>
        </div>
        <!-- 提示是否删除 -->
        <div class="outside" v-if="isDelete">
            <div class="delete">
                <p>确认删除</p>
                <div class="build">
                    <button type="close" @click="isDelete=false">取消</button>
                    <button type="checkmark"  @click="getDelete">确定</button>
                </div>
            </div>
        </div>
        <Modal title="添加账目" v-model="hasShow" class="accountModal" :mask-closable="false" @on-cancel="closeModal">
            <Form ref="detailValidate" :model="detailValidate" :rules="ruleDetailValidate" :label-width="100">
                <FormItem label="日期" prop="time">
                    <DatePicker type="date" placeholder="请选择时间" v-model="detailValidate.time"></DatePicker>
                </FormItem>
                <FormItem prop="money" label="金额">
                    <Input v-model="detailValidate.money" type="number" @mousewheel.native.prevent placeholder="请输入金额..."  /> 
                </FormItem>
                <FormItem prop="method" label="银行选项">
                    <Input v-model="detailValidate.method"  placeholder="请输入收款方式..."  /> 
                </FormItem>
                <FormItem prop="note" label="付款备注">
                    <Input v-model="detailValidate.note" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注..."  /> 
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="submit('detailValidate')">添加</Button>
                    <Button type="ghost" @click="hasShow=false" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>        
    </div>
</template>
<script>
    import {getUrlParams} from  '@/assets/js/tool.js'
    import {changeday} from  '@/assets/js/tool.js'
    export default{
        components:{
            changeday
        },
        data(){
            return{
                // 签单类型
                catetype:'',
                // 头部
                title:'新增签单',
                id:'', //客户id
                store:'',//门店编码
                // 渠道来源数据
                sourceList: [],
                // 返回数据
                errorcode:'',
                // 上传的图片
                uploadImages:[],
                value1:0,
                // 是否显示删除框
                isDelete:false,
                // 要删除的图片数据
                deleteImageDate: {},
                // 查看图片
                carouse:false,
                // 上传的图片类型
                cate:'',
                // 是否必须上传
                need1:0,
                need2:0,
                // 对时间选择的限制
                options: {
                    disabledDate (date) {
                        return date && date.valueOf() >= Date.now();
                    }
                },
                formValidate: {
                    name:'', //客户姓名
                    address:'', //客户地址
                    source:'',  //客户来源
                    phone:[],
                    // dealcode:'',    //交易编号
                    contract_cate:'',    //合同分类 (意向金/合同)
                    sign_time :'',   //签单时间
                    contactdate:'',  //联系时间
                    keyword:'',    // 关键词
                    rent_year:'',   //年房租
                    area:'',     //门店面积大小
                    actual_payment:'',   //实到货款
                    unitPrice:'',   //货柜单价
                    container_payment:'',   //货柜款
                    decoration_deposit:'',   //装修押金
                    performance_bond:'',   //履约金
                    manage_expense:'',  //管理费/加盟费
                    prepayment:'',  //督导预付款
                    distribution:'',   //公司配货/自选货
                    exchange:'',  //换不换货  (60天/不换货)
                    give:'',     //政策赠送
                    remark:'',    //备注
                    range:'', //成交周期
                    store_num:'', //客户第几个门店
                    totalMoney:0, //总到款
                    curmonth:0,
                    expand:''  //是否需要拓展找店面
                    
                },
                ruleValidate: {
                    contract_cate:[
                        {required: true, message: '请选择合同分类', trigger: 'change'}
                    ],
                    contactdate:[
                        { required: true, type: 'date', message: '联系时间不能为空', trigger: 'change' }
                    ],
                    sign_time: [
                        { required: true, type: 'date', message: '签单时间不能为空', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '客户姓名不能为空', trigger: 'change' }
                    ],
                    address: [
                        { required: true, message: '客户地址不能为空', trigger: 'change' }
                    ],
                    // source: [
                    //     { required: true, message: '客户来源不能为空', trigger: 'change' }
                    // ],
                    // rent_year: [
                    //     { required: true,message: '年房租不能为空', trigger: 'change' },
                    // ],
                    // area:[
                    //     { required: true,message: '店面大小不能为空', trigger: 'change' },
                    // ]
                },
                // account_detail:[], // 账目明细(数组) 
                // 是否弹出账目明细弹出框
                hasShow:false,
                // 账目明细表单
                detailValidate:{
                    time:'',    //时间
                    money:'',       //金额
                    method:'' ,     //收款方式
                    note:'' //付款备注
                },
                // 账目明细表单认证
                ruleDetailValidate: {
                    time: [
                        { required: true, type: 'date', message: '时间不能为空', trigger: 'blur' }
                    ],
                    money:[
                        {required: true, message: '金额不能为空', trigger: 'blur'}
                    ],
                    method: [
                        { required: true, message: '付款方式不能为空', trigger: 'blur' }
                    ],
                },
                // 查看账目明细
                lookModal:false,
                // 账目明细列表表头
                columns1: [
                    {
                        title: '时间',
                        key: 'DATES',
                        align:'center'
                    },
                    {
                        title: '金额（元）',
                        key: 'MONEY',
                        align:'center'
                    },
                    {
                        title: '来源',
                        key: 'NAME',
                        align:'center'
                    },
                    {
                        title: '收款备注',
                        key: 'NOTE',
                        align:'center'
                    },
                    
                ],
                // 表格高度
                tableHeight: 1000,
                // 账目明细列表数据
                data1:[],
                cid:''
            }
        },
        created(){
            // 得到渠道来源数据
            this.getSourceList();
            this.getUrlData()
            // 获取客户信息
            this.getnowTime();
            
        },

        methods: {
            /**
             *功能：获取门店编码
            *时间：2019年12月16日 14:52:02
            *作者：项萍
            */
            getStore(){
                this.$resetAjax({
                    type: 'POST',
                    url: '/NewA/Customer/getuserinfo',
                    data:{
                        hdid:this.store
                    },
                    success: (res) => {
                        let result = JSON.parse(res).data;
                        this.data1=JSON.parse(res).detail;
                        this.errorcode=JSON.parse(res).errorcode;
                        if(this.errorcode==0){
                            this.id=result.id;
                            result.phone=result.phone.split(",");                        
                            let phone=[];
                            result.phone.forEach(ele=>{
                                phone.push({tel:ele,disable:'disabled'});
                            })
                            this.formValidate.phone = phone;
                            this.formValidate.address=result.address;
                            this.formValidate.name=result.username;
                            this.sourceList.forEach(ele=>{
                            if(ele.channels==result.channels){
                                this.formValidate.source=ele.cid;
                            }
                             this.formValidate.totalMoney=Number(result.totalMoney); //总到款
                            this.formValidate.curmonth=result.curmonth; //本月总收款
                        })
                        }else if(this.errorcode==1){
                            this.$Message.warning('crm中暂无该客户记录');
                            this.formValidate.phone =[{tel:result,disable:'disabled'}] ;
                        }else if(this.errorcode==2){
                            this.$Message.warning('数据异常,请联系管理员');
                        }else if(this.errorcode==3){
                            this.$Message.warning('门店编码有误');
                        }
                    }
                })
            },
            // 获取当前时间
            getnowTime(){
                this.formValidate.sign_time=new Date();
            },
            // 计算天数
            gettimeRange(start,end){                
                if(start!='' && end!=''){
                    let days='';
                    let date=end.getTime()-start.getTime();
                    //计算出相差天数
                    days = Math.floor(date / (24 * 3600 * 1000));
                    this.formValidate.range=days;
                    console.log(this.formValidate.range)
                }else{
                    this.formValidate.range='';
                }
                
            },
            // 获取周期
            getRange(){               
                this.gettimeRange(this.formValidate.contactdate,this.formValidate.sign_time);
            },
            /**
              *功能：获取货柜款
              *时间：2019年12月16日 14:30:57
              *作者：项萍
            */
            getcontainerPayment(){
                if(this.formValidate.unitPrice!=='' && this.formValidate.area!==''){
                    this.formValidate.container_payment=this.formValidate.unitPrice*this.formValidate.area;
                    this.formValidate.actual_payment=this.formValidate.container_payment*this.formValidate.area;
                }else{
                    this.formValidate.container_payment='';
                }
            },
            // 获取货款
            getPrice(){
                if(this.formValidate.container_payment!=='' && this.formValidate.area!==''){
                    this.formValidate.actual_payment=this.formValidate.container_payment*this.formValidate.area;
                }else{
                    this.formValidate.actual_payment='';
                }
            },
            // 获取合同类型
            getCate(value){
                this.cate=value;
            },
            // 上传意向金或合同成功
            handleSuccess (res) {                
                let data=res.data;
                if(this.cate==''){
                    this.$Message.warning('请选择合同分类类型')
                }else{                    
                    this.uploadImages.push({name:data.name,imgs:data.url,cate:this.cate});
                    this.need1=1;
                    this.$Message.success('图片上传成功')
                }
            },
            // 上传政策表成功
            handleSuccess1 (res, file) {                
                this.cate='政策表'
                let data=res.data;
                this.$Message.success('图片上传成功')
                this.uploadImages.push({name:data.name,imgs:data.url,cate:this.cate});
                this.$Message.success('图片上传成功')
                this.need2=1;
            },
            // 上传补充协议成功
            handleSuccess2 (res, file) {
                this.cate='补充协议'
                let data=res.data;
                this.uploadImages.push({name:data.name,imgs:data.url,cate:this.cate});
                this.$Message.success('图片上传成功')
            },
            /**
            * 删除图片工作准备
            */
            deleteImage(item) {
                this.isDelete = true;
                this.deleteImageDate = item;
            },
            /**
            * 删除图片或文件
            */
            getDelete() {
                this.isDelete = true;
                var dindex = 0;
                this.uploadImages.forEach((ele, index) => {
                    if (ele == this.deleteImageDate) {
                        dindex = index;
                    }
                });
                
                this.uploadImages.splice(dindex,1);
                this.isDelete = false;
                this.$Message.success('删除图片成功!');
                this.value1=0;            
                if (this.uploadImages.length == 0) {
                    this.carouse = false;
                    this.$Message.success('暂无上传图片!');                   
                }
            },
            // 上传图片失败
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '图片上传失败',
                    desc: '图片格式不正确，请选择上传jpg或png的图片！'
                });
            },
            /**
             * 得到网址的参数
             */
            getUrlData:function(){
                this.urlParams = getUrlParams();
                this.id = this.urlParams.id;                    
                if(typeof(this.id)=='undefined'){
                    this.title='新增签单';
                }else{
                    this.title='签单编辑';
                    this.getinfos();
                }
                this.catetype=this.urlParams.cate;        
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
            /* 得到客户信息 */
            getInfo(){
                this.$resetAjax({
                    url: '/NewA/Customer/getinfo',
                    type: 'POST',
                    data:{
                        id: this.id
                    },
                    success:(res) => {
                        let result = JSON.parse(res).data;
                        this.cid=result.id;
                        this.formValidate.phone = result.phone;
                        this.formValidate.address=result.address;
                        this.formValidate.name=result.username;
                        this.formValidate.store_num=result.store_num;
                        if(result.last_time!==null){
                            this.formValidate.contactdate=changeday(result.last_time*1000);
                            let date=result.sign_time*1000-result.last_time*1000
                            let days = Math.floor(date / (24 * 3600 * 1000));
                            this.formValidate.range=days;
                        }else{
                            this.formValidate.contactdate='';
                        };
                        this.sourceList.forEach(ele=>{
                            if(ele.cid==result.channel){
                                this.formValidate.source=ele.cid;
                            }
                        })
                    }
                })
            },
            // 得到签单详情
            getinfos(){
                this.$resetAjax({
                    url: '/NewA/Customer/getinfos',
                    type: 'POST',
                    data:{
                        id: this.id
                    },
                    success:(res) => {
                        let result = JSON.parse(res).data;
                        this.sourceList.forEach(ele=>{
                            if(ele.channels==result.channels){
                                this.formValidate.source=ele.cid;
                            }
                        })
                        this.cid=result.id;
                        this.formValidate.address=result.address;
                        this.formValidate.name=result.username;
                        result.phone=result.phone.split(",");                        
                        let phone=[];
                        result.phone.forEach(ele=>{
                            phone.push({tel:ele,disable:'disabled'});
                        })
                        this.formValidate.phone = phone;
                        if(result.contime!==null){
                            this.formValidate.contactdate=changeday(result.contime*1000);
                            let date=result.sign_time*1000-result.contime*1000
                            let days = Math.floor(date / (24 * 3600 * 1000));
                            this.formValidate.range=days;
                        }else{
                            this.formValidate.contactdate='';
                        }
                        this.formValidate.store_num=result.store_num;  //客户第几个门店
                        this.formValidate.actual_payment=result.actual_payment;  //实到货款
                        this.formValidate.area=result.area;     //面积大小
                        this.formValidate.container_payment=result.container_payment;  //货柜款
                        this.formValidate.unitPrice=result.unitPrice;  //货柜单价
                        this.formValidate.contract_cate=result.contract_cate;    //合同分类 (意向金/合同)
                        this.cate=this.formValidate.contract_cate; 
                        this.formValidate.decoration_deposit=result.decoration_deposit; //装修押金
                        this.formValidate.distribution=result.distribution  //公司配货/自选货
                        this.formValidate.exchange=result.exchange;     //换不换货
                        this.formValidate.expand=result.expand;   //是否需要拓展找店面
                        this.formValidate.give=result.give;    //政策赠送
                        this.formValidate.keyword=result.keyword;   //关键词
                        this.formValidate.manage_expense=result.manage_expense;   //管理费/加盟费
                        this.formValidate.prepayment=result.prepayment;  //督导预付款
                        this.formValidate.performance_bond=result.performance_bond;   //履约金
                        this.formValidate.remark=result.remark;     //备注
                        this.formValidate.rent_year=result.rent_year;    //年房租
                        this.formValidate.sign_time=changeday(result.sign_time*1000);    //签单时间                        
                        this.data1=JSON.parse(res).detail;
                        this.data1.forEach(ele=>{
                            ele.time=changeday(ele.time*1000);
                        });
                        this.formValidate.totalMoney=Number(result.totalMoney); //总到款
                        this.formValidate.curmonth=result.curmonth; //本月总收款
                        this.uploadImages=result.imgs;
                        if(this.uploadImages.length>0){
                            this.need1=1;
                            this.need2=1;
                        }
                        this.formValidate.unitPrice=this.formValidate.container_payment/this.formValidate.area; //货柜单价
                    }
                })
            },
            blurInput(e){
                let length = this.formValidate.phone.length - 1;
                this.formValidate.phone[length]={tel:e.target.value};                
            },
            /**
            * 添加电话号码
            */
            addIphoneNum() {
                this.formValidate.phone.push({tel:''});
            },
            /* 删除号码 */
            deletephoneNum(){
                if(this.formValidate.phone.length>1){
                    this.formValidate.phone.splice(-1);
                }
                
            },
            handleSubmit (name) {
                if(this.catetype=='全款'){
                    this.$Message.warning('已全款结单，不能修改')
                }else{
                    if(this.errorcode==2){
                    this.$Message.error('数据异常！')
                    }else{
                        this.$refs[name].validate((valid) => {
                            if (valid) {                            
                                var length = this.formValidate.phone.length - 1;
                                if(this.title=='新增签单'){
                                    if(this.formValidate.phone[length].tel==''){
                                        this.$Message.error('手机号不能为空！')
                                    }else if(this.need1!==1){
                                        this.$Message.error('请上传意向金/合同图片')
                                    }else if(this.need2!==1){  
                                        this.$Message.error('请上传政策表照片')                                
                                        
                                    }else{
                                        this.coninfo();
                                    }
                                }else if(this.title=='签单编辑'){
                                    if(this.formValidate.phone[length].tel==''){
                                        this.$Message.error('手机号不能为空！')
                                    }else{
                                        if(this.need1!==1){
                                            this.$Message.error('请上传意向金/合同图片')
                                        }else if(this.need2!==1){  
                                            this.$Message.error('请上传政策表照片')
                                        }else{
                                            this.conedit();
                                        }                                    
                                    }
                                }
                            } else {
                                this.$Message.error('信息不完整！');
                            }
                        })
                    }
                }
                
            },
            // 新增签单
            coninfo(){
                this.$resetAjax({
                    url: '/NewA/Customer/coninfo',
                    type: 'POST',
                    data:{
                        hdid:this.store, //门店编码
                        id:this.id,    // 客户id 
                        name:this.formValidate.name,
                        address:this.formValidate.address,
                        channel:this.formValidate.source,
                        phone:this.formValidate.phone.map(item => item.tel.trim()), //手机号码
                        contract_cate:this.formValidate.contract_cate,    //合同分类 (意向金/合同)
                        sign_time:changeday(this.formValidate.sign_time),    //签单时间
                        contime:changeday(this.formValidate.contactdate), //联系时间
                        keyword:this.formValidate.keyword,    //关键词
                        rent_year:this.formValidate.rent_year,    //年房租
                        area:this.formValidate.area,     //门店面积大小
                        actual_payment:this.formValidate.actual_payment,   //实到货款
                        unitPrice:this.formValidate.unitPrice,  //货柜单价
                        container_payment:this.formValidate.container_payment,   //货柜款
                        decoration_deposit:this.formValidate.decoration_deposit,   //装修押金
                        performance_bond:this.formValidate.performance_bond,   //履约金
                        manage_expense:this.formValidate.manage_expense,   //管理费/加盟费
                        prepayment:this.formValidate.prepayment,  //督导预付款
                        distribution:this.formValidate.distribution,    //公司配货/自选货
                        exchange:this.formValidate.exchange,    //换不换货  (60天/不换货)
                        give:this.formValidate.give,     //政策赠送
                        remark:this.formValidate.remark,     //备注
                        expand:this.formValidate.expand,
                        imgs:this.uploadImages,
                        store_num:this.store_num, //客户第几个门店
                        range:this.range //签单周期
                    },
                    success:(res) => {
                        this.$Message.success(JSON.parse(res).msg);                        
                    }
                })
            },
            // 编辑签单
            conedit(){
                this.$resetAjax({
                    url: '/NewA/Customer/conedit',
                    type: 'POST',
                    data:{
                        id:this.id,    // 客户id 
                        name:this.formValidate.name,
                        address:this.formValidate.address,
                        channel:this.formValidate.source,
                        phone:this.formValidate.phone.map(item => item.tel.trim()), //手机号码
                        contract_cate:this.formValidate.contract_cate,    //合同分类 (意向金/合同)
                        sign_time:changeday(this.formValidate.sign_time),    //签单时间
                        contime:changeday(this.formValidate.contactdate), //联系时间
                        keyword:this.formValidate.keyword,    //关键词
                        rent_year:this.formValidate.rent_year,    //年房租
                        area:this.formValidate.area,     //门店面积大小
                        actual_payment:this.formValidate.actual_payment,   //实到货款
                        container_payment:this.formValidate.container_payment,   //货柜款
                        decoration_deposit:this.formValidate.decoration_deposit,   //装修押金
                        performance_bond:this.formValidate.performance_bond,   //履约金
                        manage_expense:this.formValidate.manage_expense,   //管理费/加盟费
                        prepayment:this.formValidate.prepayment,  //督导预付款
                        distribution:this.formValidate.distribution,    //公司配货/自选货
                        exchange:this.formValidate.exchange,    //换不换货  (60天/不换货)
                        give:this.formValidate.give,     //政策赠送
                        remark:this.formValidate.remark,     //备注
                        account_detail:this.data1, //账目明细(数组)  
                        totalMoney:this.formValidate.totalMoney, //总到款
                        unitPrice:this.formValidate.unitPrice,  //货柜单价
                        expand:this.formValidate.expand,
                        imgs:this.uploadImages,
                        store_num:this.store_num, //客户第几个门店
                        range:this.range //成交周期
                    },
                    success:(res) => {
                        if(JSON.parse(res).errorcode==0){
                            this.$Message.success('修改成功');
                            this.getinfos();
                        }else if(JSON.parse(res).errorcode==1){
                            this.$Message.success('修改失败');
                        }
                    }
                })
            },
            // 添加账目明细
            submit(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.data1.push(this.detailValidate);
                        this.data1.forEach(ele=>{
                            ele.time=changeday(ele.time);
                        })
                        let month1=new Date().getMonth() + 1;
                        let month2=this.detailValidate.time.substr(5,2);
                        if(this.detailValidate.money>0){
                            this.formValidate.totalMoney+=Number(this.detailValidate.money);
                        }
                        if(month1==month2){
                            this.formValidate.curmonth+=Number(this.detailValidate.money);
                        }
                        this.$Message.success('添加成功');
                        this.hasShow=false;
                        this.detailValidate={};
                    }else{
                    }
                })
            },
            closeModal(){
                this.hasShow=false;
            },
            back(){  
                this.$router.push({name:'contract'});
            }
           
        }
    }
</script>