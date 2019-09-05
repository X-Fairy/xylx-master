<template>
    <div class="order">
        <!-- 状态选择 -->
        <div class="header-info">
            <div class="search" style="float: left;margin-right: 10px;margin-left: 10px;">
                <span style="color:#1d8c9f;">状态分类：</span>
                <Select v-model="orderType" style="width:180px" @on-change="getOrderChange" placeholder="我发起的">
                    <Option v-for="(item,index) in orderList" :value="index" :key="index" >{{item}}</Option>
                </Select>
            </div>
            <button @click="$router.push({path: 'work'})" style="float: right;margin-right:50px;">发起工单</button>
        </div>
        <div class="container">
            <!-- 工单列表 -->
            <div class="table">
                <Table border :columns="columns" :data="orders" :height="tableHeight" @on-row-dblclick="getRowData"></Table>
            </div>
            <div class="footer">
                <!-- 分页 -->
                <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
            </div>
        </div>
        <!-- 评论弹出框 -->
        <div class="pop" v-if="modal">
            <div class="inner">
                <div class="inner_top">
                    <div class="left">
                        <p>发起人：<span>{{row.fqname}}</span></p>
                        <p>接收人: <span>{{row.jsname}}</span></p>
                    </div>
                    <Icon type="ios-close" @click="modal=false" title="关闭弹窗"></Icon>
                </div>
                <div class="inner_info">
                    <textarea name="" id="" cols="90" rows="10" placeholder="请输入评论内容" style="padding: 10px;" v-model="content"></textarea>
                </div>
                <div class="demo-upload-list" v-for="item in uploadImg" :key="item.status">
                    <template v-if="item.status === 'finished'">
                        <img :src="item.response.data.url" style="width: 100%;height:100%;">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click="handleView(item.response.data.url)"></Icon>
                            <Icon type="ios-trash-outline" @click="handleRemove(item)"></Icon>
                        </div>
                    </template>
                    <template v-else>
                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                </div>
                <Upload
                    :show-upload-list="false"
                    :default-file-list="uploadImg"
                    :on-success="handleSuccess"
                    :format="['jpg','jpeg','png']"
                    :max-size="2048"
                    :on-format-error="handleFormatError"
                    type="drag"
                    action="/NewA/Workorder/getimage"
                    v-model="photoarr"
                    style="display: inline-block;width:58px;margin-left: 10px;">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                        <Icon type="camera" size="20"></Icon>
                    </div>
                </Upload>
                <div class="upload">
                    <Upload 
                        multiple
                        action="/NewA/Workorder/getfile"
                        :on-success="uploadfile"
                        v-model="filearr"
                        :on-remove="removefile"
                        :max-size="3048"
                        :on-exceeded-size="handleMaxSize">
                        <Button type="ghost" icon="ios-albums">上传文件</Button>
                    </Upload>
                </div>
                <div class="bottom">
                    <Button class="cancel" @click="modal=false">取消</Button>
                    <Button type="error" @click="createComment" style="background: #1596ad;border-color:#1596ad">提交</Button>
                </div>
            </div>     
        </div>
        <Modal title="查看图片" class="modal"  class-name="vertical-center-modal" v-model="isModal">
            <p class="img" style="width:440px;height:440px;padding-left:20px;">
                <img :src="largeUrl" alt="" style="width: 100%;height:100%"/>
            </p>
        </Modal>
    </div> 
</template>
<script>
import {getUrlParams} from  '@/assets/js/tool.js'
import {changeday} from "@/assets/js/tool.js"//时间戳
import tipModal from '../tip.vue'//弹出框
import {changeTime} from "@/assets/js/tool.js"//时分秒
export default{
    components: {
        changeday,
        tipModal,
        getUrlParams,
        changeTime
    },
    data() {
        return {
            //不同类型工单的key
            key:'',
            // 得到网址的参数对象
            urlParams: {},
            //工单状态
            orderType:'',
            //状态列表
            orderList:["未认领", "我发起的", "我接受的", "我监督的", '待审核'],
            //列表高度
            tableHeight: 900,
            //工单表格头部信息
            columns: [
                {
                    title: '发起人',
                    key: 'fqname'
                },
                {
                    title: '接收人',
                    key: 'jsname'
                },                    
                {
                    title:'标题',
                    key:'title',
                    render: (h, params) => {
                        let texts = params.row.title;
                        if (params.row.title !== null) {
                            if (params.row.title.length > 12) {
                                texts = params.row.title.slice(0,12) + '...';
                            } else {
                                texts = params.row.title;
                            }
                        }
                        return h('div', [
                            h('Tooltip', {
                                props: {
                                    placement: 'top',
                                    transfer: true
                                },
                                style: {
                                    whiteSpace: 'normal',
                                    cursor: 'pointer'
                                }
                            }, [texts, h('span', {
                                slot: 'content'
                            }, params.row.title)
                            ])
                        ])
                    }
                },
                {
                    title: '内容',
                    key: 'content',
                    render: (h, params) => {
                        let texts = params.row.content;
                        if (params.row.content !== null) {
                            if (params.row.content.length > 12) {
                                texts = params.row.content.slice(0,12) + '...';
                            } else {
                                texts = params.row.content;
                            }
                        }
                        return h('div', [
                            h('Tooltip', {
                                props: {
                                    placement: 'top',
                                    transfer: true
                                },
                                style: {
                                    whiteSpace: 'normal',
                                    cursor: 'pointer'
                                }
                            }, [texts, h('span', {
                                slot: 'content',
                                style: {
                                    whiteSpace: 'normal',
                                }
                            }, params.row.content)
                            ])
                        ])
                    }
                },
                {
                    title: '等级',
                    key: 'level'
                },
                {
                    title: '状态',
                    key: 'status'
                },
                {
                    title: '创建时间',
                    key: 'create_time'
                },
                {
                    title: '期待时间',
                    key: 'expect_time'
                },
                {
                    title: '完成时间',
                    key: 'actual_time',
                    width: 170,
                    align: 'center',
                    render: (h, params) => {
                        if(this.key==3&&params.row.actual_time==""){
                            return h('div', [
                            h('a', {
                                class: 'finish',
                                style: {
                                    cursor: 'pointer',
                                    color: '#1596ad',
                                },
                                on: {
                                    click: () => {
                                        this.id=params.row.id
                                        this.finish();
                                    }
                                }
                            }, '完成'),
                        ]);
                        }else{
                            return h('div', [
                            h('p', {                               
                            }, params.row.actual_time),
                        ]);
                        }
                    }
                },
                {
                    title: '评论',
                    key: 'action',
                    width: 130,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    cursor: 'pointer',
                                    color: '#1596ad',
                                },
                                on: {
                                    click: () => {
                                        this.modal = true;
                                        this.row=params.row;
                                    }
                                }
                            }, '评论'),
                            
                        ]);
                    }
                }
            ],
            //总页数
            total:0,
            // 当前页有几条数据
            pageSize: 20,
            //当前页
            currentPage:1,
            //工单列表
            orders:[],
            //工单最后一项评论列
            action:{
                    title: '操作',
                    key: 'action',
                    width: 130,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    cursor: 'pointer',
                                    color: '#1596ad',
                                    border:'0',
                                    background:'#fff',
                                    borderRadius:'0'
                                },
                                on: {
                                    click: () => {
                                        let id=params.row.id;
                                        this.$resetAjax({
                                            url:'/NewA/Workorder/claim',
                                            type:'post',
                                            data:{
                                                id:id
                                            },
                                            success:(res)=>{
                                                if(res.errorcode==0){
                                                    this.$root.tip.isShow = true;
                                                    this.$root.tip.content = '认领成功!';
                                                    setTimeout(() => {
                                                        this.$root.tip.isShow = false;
                                                        this.getOrderChange(0);
                                                    }, 1500); 
                                                }else{
                                                    this.$root.tip.isShow=true;
                                                    this.$root.tip.content="提示：不允许认领本人工单！"
                                                    setTimeout(() => {
                                                        this.$root.tip.isShow = false;
                                                    }, 1500);
                                                }
                                            }
                                        })
                                    }
                                }
                            }, '认领'),
                        ]);
                    }
                },
            //是否显示评论弹出框
            modal:false,
            //提交评论的当前工单的信息
            row:[],
            //上传评论的文件
            filearr:[],
            //上传评论的图片
            photoarr:[],
            //评论的内容
            content:'',
            //是否弹出查看图片
            isModal:false,
            //查看大图url
            largeUrl:'',
            uploadImg:[],
            //当前行的id
            id:''
        }
    },
    // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 280);
            this.errorHeight = windowHeight- 480;
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 280);
            this.errorHeight = windowHeight- 480;
        })
    },
    created() {
        // 得到网址的参数
        this.getUrlData();
        // 获取默认显示的工单列表数据
        // this.getOrders();
        this.getOrderChange(1);
        // this.login();        
    },
    methods:{
        // login() {
        //     this.$resetAjax({
        //         url: '/NewA/Miandenglu/index',
        //         type: 'POST',
        //         success:(res)=>{
        //         },
        //     })
        // },
        /*
        * 查看图片大图
        */
        handleView (url) {
            this.isModal=true;
            this.largeUrl = url;
        },
        /*
        * 移除图片
        */
        handleRemove (file,res) {
            let arr=this.uploadImg;
            this.uploadImg.splice(arr.indexOf(file),1);
            this.photoarr.splice(file.response.data,1);
        },
        /*
        * 上传图片
        */ 
        handleSuccess (res, file) {
            this.uploadImg.push(file);
            this.photoarr.push(res.data);
        },
        /*
        *上传图片格式限制
        */
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
        /*
        *上传文件大小限制
        */
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '超出文件大小限制',
                desc: '文件 ' + file.name + ' 太大，不能超过 3M。'
            });
        },
         /*
        * 上传文件
        */ 
        uploadfile(res) {
            this.filearr.push(res.data);
        },
        /*
        *移除文件
        */
        removefile(file,fileList){
            this.filearr.splice(file.response.data,1)
        },
        /*
         *评论当前工单
        */
        createComment(data){
            this.$resetAjax({
                url:'/NewA/Workorder/comment',
                type:'post',
                data:{
                    id:this.row.id,
                    content:this.content,
                    photoarr:this.photoarr,
                    filearr:this.filearr
                },
                success:(res)=>{
                    if(res.errorcode==0){
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '评论成功!';
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                            this.modal=false;
                            this.content="";
                            this.uploadImg=[];
                            this.photoarr=[];
                            this.filearr=[];
                        }, 1500); 
                    }
                }
            })
        },
        /**
         * 得到网址的参数
         */
        getUrlData:function(){
            this.urlParams = getUrlParams();
        },
        /**
         *  不同工单类型对应的数据
         */
        getOrderChange(value) {
            this.key = value+1;
            this.currentPage=1;
            if(this.key !== 1) {
                this.columns.splice(10,1);
            } else if(this.columns.length == 10 && this.key == 1) {
                this.columns.push(this.action)
            }
            this.getOrders();
        },
        /*
        *   获取工单列表数据
        */
        getOrders() {
            this.$resetAjax({
                url:'/NewA/Workorder/getlist',
                type:'get',
                data:{
                    p:this.currentPage,
                    key:this.key
                },
                success:(res) =>{
                    this.total = parseInt(res.count);
                    this.orders = res.data;
                    for(let i in this.orders){
                        this.orders[i].expect_time = changeday(this.orders[i].expect_time*1000);
                        this.orders[i].create_time = changeday(this.orders[i].create_time*1000);
                        this.orders[i].actual_time = changeTime(this.orders[i].actual_time*1000);
                        if(this.orders[i].actual_time == "1970-01-01 08:00:00") {
                            this.orders[i].actual_time = "";
                        }else{

                        }
                        if(this.orders[i].level == "A") {
                            this.orders[i].level = "A(紧急不重要)"
                        } else if(this.orders[i].level=="B") {
                            this.orders[i].level = "B(重要不紧急)"
                        } else if(this.orders[i].level == "C"){
                            this.orders[i].level = "C(不重要紧急)"
                        } else{
                            this.orders[i].level = "D(不重要不紧急)"
                        }
                        if(this.orders[i].status == 1) {
                            this.orders[i].status = "待接单"
                        } else if(this.orders[i].status == 2) {
                        this.orders[i].status = "已接单";
                        } else if(this.orders[i].status == 3) {
                        this.orders[i].status = "需沟通";
                        } else{
                        this.orders[i].status = "已完成";
                        }
                    }
                }
            })
        },
        /*
        *   选择当前页
        */
        changePage(index) {
            this.currentPage = index;
            this.getOrders();
        },
        /*
        *  点击当前行获取工单详情
        */
        getRowData(data, index) {
            this.$router.push({path: 'workDetail', query: {id: data.id}})
        },
        /*
        *完成时间
        */
        finish(){
            this.$resetAjax({
                url:'/NewA/Workorder/finish',
                type:'post',
                data:{
                    id:this.id
                },
                success:(res)=>{
                    for(var i  in this.orders){
                        this.orders[i].actual_time=changeTime(res.data.actual_time*1000)
                        
                    }
                }
            })
        }
    },
        
}
</script>
