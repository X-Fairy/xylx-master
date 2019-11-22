<template>
    <div class="personnel">
        <div class="top">
            <div class="left">
                <Select v-model="store" label-in-value clearable filterable style="width:260px" @on-change="lookStore" placeholder="请选择门店">
                    <Option value="all" key="100">全选</Option>
                    <Option v-for="item in storeList" :value="item.CODE" :key="item.CODE">编码：{{item.CODE }} 名称：{{ item.NAME  }}</Option>
                </Select>
                <!-- <Button type="button" class="add" @click='look'>查看员工</Button> -->
            </div>
            <div class="right" style="margin-right: 100px;">
                <Button type="button" class="add" @click='useradd'>新增员工</Button>
            </div>
        </div>
        <!-- 列表 -->
        <div class="table">
            <Table border  :columns="columns" :height="tableHeight" :data="tableData"></Table>
        </div>
        <div class="footer">
            <!-- 分页 -->
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 新增员工弹窗 -->
        <Modal :title="title" v-model="hasShow" class="useraddModal" :mask-closable="false" @on-cancel="closeModal">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100" class="signForm">
                <FormItem label="姓名" prop="name">
                    <Input v-model="formValidate.name" style="width: 220px"></Input>
                </FormItem>
                <FormItem label="性别" prop="sex" class="sexName">
                    <RadioGroup v-model="formValidate.sex">
                        <Radio label="男">男</Radio>
                        <Radio label="女">女</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="学历" prop="edu">
                    <Input v-model="formValidate.edu" placeholder="请输入最高学历" style="width: 220px"></Input>
                </FormItem>
                <FormItem label="门店" prop="stores" class="storeClass">
                    <Select v-model="formValidate.stores" label-in-value clearable filterable style="width:220px" @on-change="changeStore">
                            <Option v-for="item in storeList" :value="item.CODE" :key="item.CODE">{{ item.NAME  }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="职位" prop="post">
                    <Input v-model="formValidate.post" placeholder="请输入职位" style="width: 220px"></Input>
                </FormItem>
                <FormItem label="入职日期" prop="entry_date">
                    <DatePicker type="date" placeholder="请选择入职时间" v-model="formValidate.entry_date" style="width: 220px"></DatePicker>
                </FormItem>
                <FormItem label="离职日期" prop="departure_date">
                    <DatePicker type="date" placeholder="请选择离职时间" v-model="formValidate.departure_date" style="width: 220px"></DatePicker>
                </FormItem>
                <FormItem label="身份证号" prop="id_card">
                    <Input v-model="formValidate.id_card" placeholder="请输入身份证号码" style="width: 220px"></Input>
                </FormItem>
                <FormItem label="联系方式" prop="phone">
                    <Input v-model="formValidate.phone" placeholder="请输入手机号码" style="width: 220px"></Input>
                </FormItem>
                <FormItem label="生日" prop="birth">
                    <DatePicker type="date" placeholder="请选择出生时间" v-model="formValidate.birth" style="width: 220px"></DatePicker>
                </FormItem>
                <FormItem label="籍贯详细地址" prop="address">
                    <Input v-model="formValidate.address" placeholder="请输入详细地址" style="width: 220px"></Input>
                </FormItem>
                <FormItem label="现居住地址" prop="cur_address">
                    <Input v-model="formValidate.cur_address" placeholder="请输入现居住地址" style="width: 220px"></Input>
                </FormItem>
                <FormItem label="签订合同日期" prop="contract_time">
                    <DatePicker type="date" placeholder="请选择签订合同时间" v-model="formValidate.contract_time" style="width: 220px"></DatePicker>
                </FormItem>
                <FormItem label="银行卡姓名" prop="bank_name">
                    <Input v-model="formValidate.bank_name" placeholder="请输入真实姓名" style="width: 220px"></Input>
                </FormItem>
                <FormItem label="银行卡号" prop="bank_id">
                    <Input v-model="formValidate.bank_id" placeholder="请输入银行卡号" style="width: 220px"></Input>
                </FormItem>
                <FormItem label="银行卡手机号" prop="bank_num">
                    <Input v-model="formValidate.bank_num" placeholder="请输入银行卡绑定的手机号" style="width: 220px"></Input>
                </FormItem>
                <FormItem label="紧急联系人姓名" prop="emergency_name">
                    <Input v-model="formValidate.emergency_name" placeholder="请输入紧急联系人姓名" style="width: 220px"></Input>
                </FormItem>
                <FormItem label="紧急联系人电话" prop="emergency_phone">
                    <Input v-model="formValidate.emergency_phone" placeholder="请输入紧急联系人联系方式" style="width: 220px"></Input>
                </FormItem>
                <FormItem label="关系" prop="relation">
                    <Input v-model="formValidate.relation" placeholder="请输入和紧急联系人的关系" style="width: 220px"></Input>
                </FormItem>
                <!-- <FormItem label="紧急人信息" class="double">
                    <Row>
                        <Col span="11">
                            <FormItem label="紧急联系人姓名" prop="emergency_name">
                                <Input v-model="formValidate.emergency_name" placeholder="请输入紧急联系人姓名" style="width: 180px"></Input>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="紧急联系人电话" prop="emergency_phone">
                                <Input v-model="formValidate.emergency_phone" placeholder="请输入紧急联系人联系方式" style="width: 180px"></Input>
                            </FormItem>
                        </Col>
                        <Col span="11">
                            <FormItem label="关系" prop="relation">
                                <Input v-model="formValidate.relation" placeholder="请输入和紧急联系人的关系" style="width: 180px"></Input>
                            </FormItem>
                        </Col>
                    </Row>
                </FormItem> -->
                <FormItem label="" prop="imgs"  class="upload">
                    <!-- <Button @click="uploadModal=true">上传身份证照片</Button> -->
                    <Upload style="margin-right: 10px;" action="/NewA/Audit/userimg" multiple :on-success="upLoadSuccess" :on-format-error="handleFormatError" :format="['jpg', 'png']" >
                        <Button type="ghost" icon="ios-cloud-upload-outline" class="ghost">上传照片</Button>
                        <!-- <Button type="ghost" icon="ios-cloud-upload-outline" class="ghost"  @click="imgType('2')">上传合同</Button>
                        <Button type="ghost" icon="ios-cloud-upload-outline" class="ghost"  @click="imgType('3')">上传离职证明</Button> -->
                    </Upload>
                    <Button class="look_image" icon="eye" v-if="imgs.length>0" @click="carouse=true">查看图片</Button>
                </FormItem>
                <FormItem style="width: 100%;" class="check">
                    <Button type="primary" @click="handleSubmit('formValidate')" class="submit">提交</Button>
                </FormItem>
            </Form>
        </Modal>
        <!-- <Modal title="上传图片" v-model="uploadModal"  :mask-closable="false" @on-cancel="closeModal" class="upload_pop">
            <Form ref="uploadformValidate" :model="uploadformValidate" :rules="uploadruleValidate"  :label-width="80">
                <FormItem prop="cate" label="上传类型">
                    <Select v-model="uploadformValidate.cate" placeholder='请选择文件类型'>
                        <Option v-for="item in cateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem class="upload_item">
                    <Upload style="margin-right: 10px;" action="/NewA/Audit/userimg" multiple :on-success="upLoadSuccess" :on-format-error="handleFormatError" :format="['jpg', 'png']" >
                        <Button type="ghost" icon="ios-cloud-upload-outline" class="ghost">上传图片</Button>
                    </Upload>
                    <Button class="look_image" icon="eye" v-if="isShowImageButton" @click="carouse=true">查看图片</Button>
                </FormItem>
                <FormItem class="form_footer">
                    <Button @click="uploadhandle('uploadformValidate')">确定</Button>
                </FormItem>
            </Form>
        </Modal> -->
         <!-- 查看图片轮播图 -->
         <div class="carouselcontent" v-if="carouse">
            <Icon type="ios-close-outline" class="close_icon" title="关闭弹窗" @click="carouse=false"></Icon>
            <Carousel v-model="value1">
                <CarouselItem v-for="(item,index) in imgs" :key="index">
                    <div class="demo-carousel"><img :src="item.imgs || item" alt="加载图片..."></div>
                    <div class="bottom" >
                        <Button title="点击删除当前这张图片" @click="deleteImage(item)" >删除</Button>
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
    </div>
</template>
<script>
    import {changeday} from  '@/assets/js/tool.js'
    export default{
        data(){
            return {
                store:[],
                // 门店
                storeList:[],
                // 员工id
                id:'',
                // 表格高度
                tableHeight:'900',
                // 表头
                columns:[
                    {
                        title: '序号',
                        key: 'id',
                        width: 100,
                        fixed: 'left'

                    },
                    {
                        title: '姓名',
                        key: 'name',
                        width: 120,
                        fixed: 'left'
                    },
                    {
                        title: '性别',
                        key: 'sex',
                        width: 80,
                    },
                    {
                        title: '学历',
                        key: 'edu',
                        width: 100,
                    },
                    {
                        title: '职务',
                        key: 'post',
                        width: 100,
                    },
                    {
                        title: '所属门店名称',
                        key: 'store_name',
                        width: 180,
                    },
                    {
                        title: '入职日期',
                        key: 'entry_date',
                        width: 120,
                    },
                    {
                        title: '离职日期',
                        key: 'departure_date',
                        width: 120,
                    },
                    {
                        title: '身份证号',
                        key: 'id_card',
                        width: 220,
                    },
                    {
                        title: '手机号码',
                        key: 'phone',
                        width: 200,
                    },
                    {
                        title: '生日',
                        key: 'birth',
                        width: 120,
                    },
                    {
                        title: '籍贯详细地址',
                        key: 'address',
                        width: 200,
                    },
                    {
                        title: '现居住地址',
                        key: 'cur_address',
                        width: 200,
                    },
                    {
                        title: '合同签订日期',
                        key: 'contract_time',
                        width: 120,
                    },
                    {
                        title: '银行卡姓名',
                        key: 'bank_name',
                        width: 180,
                    },
                    {
                        title: '银行卡号',
                        key: 'bank_id',
                        width: 220,
                    },
                    {
                        title: '银行卡手机号码',
                        key: 'bank_num',
                        width: 200,
                    },
                    {
                        title: '紧急联系人姓名',
                        key: 'emergency_name',
                        width: 180,
                    },
                    {
                        title: '紧急联系人电话',
                        key: 'emergency_phone',
                        width: 200,
                    },
                    {
                        title: '关系',
                        key: 'relation',
                        width: 180,
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        fixed: 'right',
                        width: 220,
                        render: (h, {row}) => {
                            return h('div', [
                                h('span', {
                                    class: 'contributions',
                                    style:{
                                        cursor:'pointer',
                                        marginRight:'10px'
                                    },
                                    on: {
                                        click: () => {
                                            this.value1=0;
                                            if(typeof(row.imgs)!=='undefined'){
                                                this.imgs=row.imgs;
                                                this.carouse=true;
                                            }else{
                                                this.$Message.warning('暂无图片！')
                                            }
                                        }
                                    }
                                }, '查看图片'),
                                h('span', {
                                    class: 'contributions',
                                    style:{
                                        cursor:'pointer',
                                    },
                                    on: {
                                        click: () => {
                                            this.id=row.id;
                                            this.title='修改【'+row.name+'】信息';
                                            this.hasShow=true;
                                            this.formValidate=row;
                                            this.formValidate.stores=row.store;
                                            this.formValidate.store=row.store;
                                            this.formValidate.store_name=row.store_name;
                                            if(row.departure_date=='0000-00-00'){
                                                this.formValidate.departure_date=""
                                            }
                                            if(typeof(row.imgs)!=='undefined'){
                                                this.imgs=row.imgs;
                                            }else{
                                                this.imgs=[];
                                            }
                                        }
                                    }
                                }, '编辑'),
                                h('span', [
                                    h('Poptip', {
                                        class: 'contributions',
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
                                        style: {
                                            marginLeft:'10px',
                                            cursor: 'pointer'
                                        },
                                        on: {
                                            'on-ok': ()=>{
                                                this.remove(row.id);
                                            },
                                            'on-cancel': ()=>{
                                            }
                                        },
                                    }, '删除'),
                                ]),
                            ]);
                        }
                    }
                ],
                // 表格数据
                tableData:[],
                // 数据总数
                total:0,
                // 当前页数
                currentPage:1,
                // 每页显示几条数据
                pageSize:20,
                // 是否显示弹窗
                hasShow:false,
                // 弹窗标题
                title:'',
                // 添加员工表单
                formValidate:{
                    name:'',  //姓名
                    sex:'',  //性别
                    edu:'',  //学历 
                    post:'',  //职务 
                    stores:'', //门店
                    store:'',  //门店编码
                    store_name:'',  //门店名称
                    entry_date:'',  //入职日期  
                    departure_date:'',  //离职日期  
                    id_card:'',        //身份证  
                    phone:'',      //手机号码 
                    birth:'',    //生日 
                    address:'',   //籍贯详细地址 
                    cur_address:'',  //现居住地址 
                    contract_time:'',   //合同签订日期 
                    bank_name:'',   //银行卡姓名 
                    bank_id:'',      //银行卡身份证号码 
                    bank_num:'',    //银行卡手机号 
                    emergency_name:'',    //紧急联系人姓名  
                    emergency_phone:'',  //紧急联系人电话  
                    relation:'',  //关系
                    imgs:[]//图片
                },
                // 图片类型
                cate:'0',
                // 表单验证
                ruleValidate:{
                    name:[
                        {required: true, message: '姓名不能为空', trigger: 'blur'}
                    ],
                    sex: [
                        { required: true, message: '性别不能为空', trigger: 'blur' }
                    ],
                    edu: [
                        { required: true, message: '学历不能为空', trigger: 'blur' }
                    ],
                    post: [
                        { required: true, message: '职位不能为空', trigger: 'blur' }
                    ],
                    stores: [
                        { required: true, message: '门店名称不能为空', trigger: 'blur' }
                    ], 
                    phone: [
                        { required: true, message: '手机号不能为空', trigger: 'blur' }
                    ], 
                    birth: [
                        { required: true, message: '出生日期不能为空', trigger: 'blur',  pattern: /.+/}
                    ], 
                    address: [
                        { required: true, message: '籍贯详细地址不能为空', trigger: 'blur' }
                    ], 
                    cur_address: [
                        { required: true, message: '现居住地址不能为空', trigger: 'blur' }
                    ], 
                    contract_time: [
                        { required: true, message: '合同签订日期不能为空', trigger: 'blur', pattern: /.+/ }
                    ], 
                    entry_date: [
                        { required: true, message: '入职时间不能为空', trigger: 'blur', pattern: /.+/ },
                    ],
                    id_card:[
                        { required: true,message: '身份证号不能为空', trigger: 'blur' },
                    ],
                    bank_name:[
                        { required: true,message: '银行卡姓名不能为空', trigger: 'blur' },
                    ],
                    bank_id:[
                        { required: true,message: '银行卡号不能为空', trigger: 'blur' },
                    ]
                },
                // 上传文件类型
                cateList: [                        // 类别数据
                    {
                        id: '1',
                        name: '身份证',
                    },
                    {
                        id: '2',
                        name: '合同',
                    },
                    {
                        id: '3',
                        name: '离职表',
                    },
                ],
                // 上传表单
                uploadformValidate:{
                    cate:'',
                },
                uploadruleValidate:{
                    cate:[
                        {required: true, message: '文件类型不能为空', trigger: 'change'}
                    ]
                },
                // 上传图片弹出框
                uploadModal:false,
                // 图片轮播弹出框
                carouse:false,
                value1:0,
                // 是否显示查看图片
                isShowImageButton:false,
                // 上传的图片
                imgs:[],
                // 要删除的图片数据
                deleteImageDate: {},
                // 确定删除
                isDelete:false
            }
        },
        created(){
            // 获取门店信息
            this.getStoreList();
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
        methods:{
             /**
             * 得到门店数据
             */
             getStoreList() {
                this.$resetAjax({
                    type: 'GET',
                    url: '/NewA/Audit/get_store',
                    success:(res) => {
                        this.storeList = res;
                    }
                })
            },
            /**
             * 选中到哪个直营门店
             */
            changeStore(data) {
                this.formValidate.store_name=data.label;
                this.formValidate.store=data.value;
            },
            lookStore(data){
                this.currentPage=1;
                let arr=[];
                if(data.value=='all'){
                    this.storeList.forEach(ele=>{
                        arr.push(ele.CODE);
                    })
                    this.$resetAjax({
                        url:'/NewA/Audit/userlist',
                        type:'get',
                        data:{
                            store:arr,
                            p:this.currentPage
                        },
                        success:(res)=>{
                            res.data.forEach(ele=>{
                                if(ele.departure_date=='0000-00-00'){
                                    ele.departure_date=""
                                }
                            });
                            this.tableData=res.data;
                            this.total=res.count;
                        }
                    })
                }else{
                    this.store=[data.value];
                    this.getpersonnel();
                }
            },
            // 点击新增按钮
            useradd(){
                this.title='新增员工信息';
                this.hasShow=true;
                this.formValidate={};
            },
            // 关闭弹窗
            closeModal(){
                this.hasShow=false;
            },
            // 查看员工
            look(){
                
            },
            // 提交表单
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(this.title=='新增员工信息'){
                            this.adduser();
                        }else{
                            this.useredit();
                        }
                    } else {
                    }
                })
            },
            // 新增员工信息
            adduser(){
                this.$resetAjax({
                    url:'/NewA/Audit/useradd  ',
                    type:'post',
                    data:{
                        name:this.formValidate.name,  //姓名
                        sex:this.formValidate.sex,  //性别
                        edu:this.formValidate.edu,  //学历 
                        post:this.formValidate.post,  //职务 
                        store:this.formValidate.store,  //门店编码
                        store_name:this.formValidate.store_name,  //门店名称
                        entry_date:changeday(this.formValidate.entry_date),  //入职日期  
                        departure_date:changeday(this.formValidate.departure_date),  //离职日期  
                        ID_card:this.formValidate.id_card,        //身份证  
                        phone:this.formValidate.phone,      //手机号码 
                        birth:changeday(this.formValidate.birth),    //生日 
                        address:this.formValidate.address,   //籍贯详细地址 
                        cur_address:this.formValidate.cur_address,  //现居住地址 
                        contract_time:changeday(this.formValidate.contract_time),   //合同签订日期 
                        bank_name:this.formValidate.bank_name,   //银行卡姓名 
                        bank_id:this.formValidate.bank_id,      //银行卡身份证号码 
                        bank_num:this.formValidate.bank_num,    //银行卡手机号 
                        emergency_name:this.formValidate.emergency_name,    //紧急联系人姓名  
                        emergency_phone:this.formValidate.emergency_phone,  //紧急联系人电话  
                        relation:this.formValidate.relation,  //关系
                        imgs:this.imgs  //图片 
                    },
                    success:(res)=>{
                       if(res.errorcode==0){
                           this.$Message.success('添加成功');
                           this.hasShow=false;
                           this.getpersonnel();
                        }
                    }
                })
            },
            /* 获取员工信息 */
            getpersonnel(){
                this.$resetAjax({
                    url:'/NewA/Audit/userlist',
                    type:'get',
                    data:{
                        store:this.store,
                        p:this.currentPage
                    },
                    success:(res)=>{
                        res.data.forEach(ele=>{
                            if(ele.departure_date=='0000-00-00'){
                                ele.departure_date=""
                            }
                        });
                        this.tableData=res.data;
                        this.total=res.count;
                    }
                })
            },
            // 修改员工信息
            useredit(){
                this.$resetAjax({
                    url:'/NewA/Audit/useredit',
                    type:'post',
                    data:{
                        id:this.id,
                        name:this.formValidate.name,  //姓名
                        sex:this.formValidate.sex,  //性别
                        edu:this.formValidate.edu,  //学历 
                        post:this.formValidate.post,  //职务 
                        store:this.formValidate.store,  //门店编码
                        store_name:this.formValidate.store_name,  //门店名称
                        entry_date:changeday(this.formValidate.entry_date),  //入职日期  
                        departure_date:changeday(this.formValidate.departure_date),  //离职日期  
                        ID_card:this.formValidate.id_card,        //身份证  
                        phone:this.formValidate.phone,      //手机号码 
                        birth:changeday(this.formValidate.birth),    //生日 
                        address:this.formValidate.address,   //籍贯详细地址 
                        cur_address:this.formValidate.cur_address,  //现居住地址 
                        contract_time:changeday(this.formValidate.contract_time),   //合同签订日期 
                        bank_name:this.formValidate.bank_name,   //银行卡姓名 
                        bank_id:this.formValidate.bank_id,      //银行卡身份证号码 
                        bank_num:this.formValidate.bank_num,    //银行卡手机号 
                        emergency_name:this.formValidate.emergency_name,    //紧急联系人姓名  
                        emergency_phone:this.formValidate.emergency_phone,  //紧急联系人电话  
                        relation:this.formValidate.relation,  //关系
                        imgs:this.imgs  //图片 
                    },
                    success:(res)=>{
                       if(res.errorcode==0){
                           this.$Message.success('修改成功');
                           this.getpersonnel();
                           this.hasShow=false;
                        }
                    }
                })
            },
            // 删除员工
            remove(id){
                this.$resetAjax({
                    url:'/NewA/Audit/userdel',
                    type:'post',
                    data:{
                        id:id
                    },
                    success:(res)=>{
                        if(res.errorcode==0){
                            this.$Message.success('删除成功');
                            this.getpersonnel();
                        }
                    }
                })
            },
             /**
             * 上传文件成功
             */
            upLoadSuccess(res){
                if(res.errorcode === 0) {
                    this.imgs.push(res.data);
                    this.isShowImageButton=true;
                }
                
            },
            imgType(value){
                this.cate=value;
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件类型错误',
                    desc: '文件 ' + file.name + '上传失败, 请选择jpg或png格式'
                });
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
                let index = 0;
                this.imgs.forEach((ele, i) => {
                    if (ele == this.deleteImageDate) {
                        index = i;
                    }
                });
                this.imgs.splice(index,1);
                this.isDelete = false;
                this.$Message.success('删除图片成功!');
                this.value1=0;
                if (this.imgs.length == 0) {
                    this.carouse = false;
                    this.$Message.success('暂无上传图片!');
                    this.isShowImageButton = false;
                }
            },
            uploadhandle(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.uploadModal=false;
                        console.log(this.formValidate.imgs)
                        this.formValidate.imgs.cate=this.uploadformValidate.cate;
                        
                        this.formValidate.imgs.imgs=this.imgs;
                        
                    } else {
                       
                    }
                })
            },
            // 改变页数
            changePage(index){
                this.currentPage=index;
                this.getpersonnel();
            }
        }
    }
</script>