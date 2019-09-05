<template>
    <div class="workDetail">
        <div class="top">
            <p>工单发起人: <span>{{workInfo.fqname}}</span></p>
            <Button @click="$router.push({path: 'Workorder',query:{key:2}})" class="go_back">返回工单列表</Button>
        </div>
        <div class="detail">
            <!-- 工单详情 -->
            <ul class="work_info">
                <li class="info_title">工单详情</li>
                <li class="public">发起人: <span>{{workInfo.fqname}}</span></li>
                <li>发起人部门: <span>{{workInfo.dept_name}}</span></li>
                <li>监督人: <span>{{workInfo.jdname}}</span></li>
                <li>接收人: <span>{{workInfo.jsname}}</span></li>
                <li>标题: <span style="display: inline-block;width: 400px;height:100%;word-wrap: break-word;">{{workInfo.title}}</span></li>
                <li>内容: <span style="display: inline-block;width: 400px;height:100%;word-wrap: break-word;">{{workInfo.content}}</span></li>
                <li>等级: <span>{{workInfo.level}}</span></li>
                <li>状态: <span>{{workInfo.status}}</span></li>
                <li>创建时间: <span>{{workInfo.create_time}}</span></li>
                <li>期望完成时间: <span>{{workInfo.expect_time}}</span></li>
                <li>实际完成时间: <span>{{workInfo.actual_time}}</span></li>
                <li>附件:
                    <div class="check">
                        <Button class="look_image" icon="eye"  @click="checkImg" style="margin-left: -10px;margin-right:10px;">查看上传图片</Button>
                        <Button class="look_file" icon="upload"  @click="getLookFile">查看上传的文件</Button>
                        <!-- 查看图片轮播图 -->
                        <div class="carouselcontent" v-if="carouse">
                            <Icon type="ios-close-outline" class="close_icon" title="关闭弹窗" style="top:90px;" @click="carouse=false;"></Icon>
                            <Carousel v-model="value1">
                                <CarouselItem v-for="(item,index) in images" :key="item.url">
                                    <div class="demo-carousel"><img :src="item.url" alt="正在加载图片..."></div>
                                    <div class="bottom">
                                        <p>照片{{index+1}}:<span>{{item.name}}</span></p>
                                        <Button @click="carouse=false;">确定</Button>
                                    </div>
                                </CarouselItem>
                            </Carousel>
                        </div>
                        <!-- 查看文件的modal -->
                        <Modal title="文件信息" v-model="modal10" class-name="vertical-center-modal">
                            <div v-for="(item,index) in files" :key="item.url" style="display:flex;justify-content: space-between;color:#000;font-size:14px;margin-bottom: 10px;">
                                <p>文件{{index+1}}: <span style="color:#1596ad;font-size:14px;margin-left: 5px">{{item.name}}</span></p>
                                <p @click="download(item.fid)" style="color: #1596ad;cursor:pointer;margin-top: 5px;">下载</p>
                            </div>
                        </Modal>
                    </div>
                </li>
            </ul>
            <!-- 工单日志 -->
            <div class="work_log">
                <p class="log_title">工单日志</p>
                <Timeline style="margin-top: 50px;">
                    <TimelineItem color="green" v-for="(item,index) in workLog" :key="index">
                        <Icon type="trophy" slot="dot"></Icon>
                        <p class="start_apply">{{item.user_name}}:{{item.type}}</p>
                        <span style="font-weight:400">{{item.time}}</span>
                    </TimelineItem>
                </Timeline>
            </div>
            <!-- 工单评论 -->
            <div class="commentInfo">
                <p class="comment_title">工单评论</p>
                <button @click="modal=true" class="workCom">评论</button>
                <ul class="work_comment">
                    <Card :bordered="false" v-for="(item,index) in workComment" :key="index" style="border-bottom: 1px dashed;" v-if="workComment.length>0">
                        <p slot="title">{{item.user_name}}评论
                            <span style="font-weight: 400;font-size: 12px;">{{item.time}}</span>
                        </p>
                        <p style="margin-bottom:10px;">评论内容：{{item.content}}</p>
                        
                        <!-- 评论的图片展示 -->
                        <div class="imgs">
                            <div v-for="(item,index) in item.photo" :key="index"  style="width: 60px;height:60px;margin: 6px;">
                                <img :src="item.url" style="width: 100%;height:100%;" title="点击查看大图" @click="handleView(item.url)">
                                
                            </div>
                        </div>
                        <!-- 评论的文件展示  -->
                        <ul class="files" v-show="item.filetype=2">
                            <li v-for="(item,index) in item.file" :key="index" style="border-bottom: 1px dashed #ddd;margin-bottom: 8px;">
                                <div class="file_download">
                                    <p>附件{{index+1}}：<span style="font-size:14px;margin-left: 5px">{{item.name}}</span></p>
                                    <p @click="download(item.fid)" style="cursor: pointer;">下载</p>
                                </div>
                            </li>
                        </ul>
                    </Card>
                </ul>
            </div>
            
        </div>
        <!-- 评论弹出框 -->
        <div class="pop" v-if="modal">
            <div class="inner">
                <div class="inner_top">
                    <div class="left">
                        <p>发起人：<span>{{workInfo.fqname}}</span></p>
                        <p>接收人: <span>{{workInfo.jsname}}</span></p>
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
import {changeTime} from "@/assets/js/tool.js"//时分秒
import tipModal from '../tip.vue'
export default {
    components:{
        changeday,
        getUrlParams,
    },
    data() {
        return {
            //评论的图片和文件
            file:[],
            //下载地址
            href:'',
            //上传的图片
            images:[],
            //上传的文件
            files:[],
            //是否显示上传的图片
            carouse:false,
            // 图片走马灯
            value1: 0,
            //是否显示上传的文件
            modal10:false,
            //下载当前文件的id
            fid:'',
            // 得到网址的参数对象
            urlParams: {},
            // 工单详情的数据
            workInfo: {},
            // 工单评论的数据 
            workComment: [],
            // 工单操作日志的数据
            workLog: [],
            //状态列表
            orderList:[
                "未认领", 
                "我发起的",
                "我接受的", 
                "我监督的"
            ],
             // 等级列表
            levelData: [
                {
                    value: 'A',
                    label: 'A重要紧急'
                },
                {
                    value: 'B',
                    label: 'B重要不紧急'
                },
                {
                    value: 'C',
                    label: 'C不重要紧急'
                },
                {
                    value: 'D',
                    label: 'D不重要不紧急'
                }
            ],
            //是否评论弹出框
            modal:false,
             //上传评论的文件和图片
            photoarr:[],
            filearr:[],
            //评论的内容
            content:'',
            //是否显示查看大图
            isModal: false,        
            //查看大图的url
            largeUrl:'',
            //上传的图片列表
            uploadImg:[],
        }
    },

    created() {
        // 获取网址参数
        this.getUrlData();
        // 获取工单详情
        this.getWorkInfo();
        // 获取工单评论 
        this.getWorkComment();
        // 获取工单操作日志
        this.getWorkLog();
        
    },

    methods: {
        /*
        *查看图片大图
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
                    id:this.urlParams.id,
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
                            this.getWorkComment();
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
        /*
         *下载文件
        */
        download(value){
            this.fid=value;
            location.href =`/NewA/Workorder/download?fid=${this.fid}`;
            
        },
        /*
         *查看图片
        */
        checkImg(){
            if(this.images.length==0){
                
                this.carouse=false;
                this.$root.tip.isShow = true;
                this.$root.tip.content = '暂无上传图片';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 1500); 
            }else{
                this.value1=0;
                this.carouse=true;
            }
        },
        /**
         *查看上传的文件
        */
        getLookFile(){
            if(this.files.length==0){
                this.modal10=false;
                this.$root.tip.isShow = true;
                this.$root.tip.content = '暂无上传文件';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 1500); 
            }else{
                this.modal10=true;
            }
        },
        /**
         * 得到网址的参数
         */
        getUrlData:function(){
            this.urlParams = getUrlParams();
        },
        /**
         * 获取工单详情
         */
        getWorkInfo() {
             this.$resetAjax({
                url:'/NewA/Workorder/getinfo',
                type:'POST',
                data:{
                    id: this.urlParams.id
                },
                success:(res) =>{
                    this.workInfo = res.data;
                    let file=this.workInfo.file;
                    for(let i in file){
                        if(file[i].pictype==1){
                            file[i].pictype="工单上传文件"
                        }else if(file[i].pictype==2){
                            file[i].pictype="评论上传文件"
                        }
                        if(file[i].filetype==1){
                            this.images.push(file[i]);

                        }else if(file[i].filetype==2){
                            this.files.push(file[i])
                        }
                    };
                    this.workInfo.create_time=changeday(this.workInfo.create_time*1000);
                    this.workInfo.expect_time=changeday(this.workInfo.expect_time*1000);
                    this.workInfo.actual_time=changeday(this.workInfo.actual_time*1000);
                    if(this.workInfo.actual_time == "1970-01-01"){
                        this.workInfo.actual_time="";
                    }
                    if(this.workInfo.level == "A") {
                        this.workInfo.level = "A(紧急不重要)"
                    } else if(this.workInfo.level == "B") {
                        this.workInfo.level = "B(重要不紧急)"
                    } else if(this.workInfo.level == "C") {
                        this.workInfo.level = "C(不重要紧急)"
                    } else{
                        this.workInfo.level = "D(不重要不紧急)"
                    }
                    if(this.workInfo.status == 1) {
                        this.workInfo.status = "待接单"
                    } else if(this.workInfo.status == 2) {
                        this.workInfo.status="已接单";
                    } else if(this.workInfo.status == 3) {
                        this.workInfo.status = "需沟通";
                    } else{
                        this.workInfo.status = "已完成";
                    }
                }
            })
        },
         /**
         * 获取工单评论 
         */
        getWorkComment() {
             this.$resetAjax({
                url:'/NewA/Workorder/getcomment',
                type:'POST',
                data:{
                    id: this.urlParams.id
                },
                success:(res) =>{
                    this.workComment = res.data;
                    for(let i in this.workComment){
                        this.workComment[i].time=changeTime(this.workComment[i].time*1000);
                        if(this.workComment[i].content==null||this.workComment[i].content==""){
                            this.workComment[i].content="未留下评论"
                        }
                        
                        
                    }
                    
                    
                }
            })
        },
         /**
         * 获取工单操作日志 
         */
        getWorkLog(){
             this.$resetAjax({
                url:'/NewA/Workorder/getlog',
                type:'POST',
                data:{
                    id: this.urlParams.id
                },
                success:(res) =>{
                    this.workLog = res.data;
                    for(let i in this.workLog){
                        this.workLog[i].time=changeTime(this.workLog[i].time*1000);
                        if(this.workLog[i].type==1){
                            this.workLog[i].type="发起申请"
                        }else if(this.workLog[i].type==2){
                            this.workLog[i].type="已接单"
                        }else if(this.workLog[i].type==3){
                            this.workLog[i].type="发起沟通"
                        }else if(this.workLog[i].type==4){
                            this.workLog[i].type="已完成"
                        }else{
                            this.workLog[i].type="评论"
                        }
                    }
                }
            })
        },
        
    }
}
</script>
