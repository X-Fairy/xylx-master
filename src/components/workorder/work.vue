<template>
    <div class="work">
        <Form :rules="ruleValidate" ref="create_data" :model="create_data" class="header">
            <div class="form_left">
                <FormItem  prop="departmentid" style="width:400px;" class="departmentid" >
                    <Cascader :data="depData" trigger="hover" change-on-select filterable @on-change="handleChange" placeholder="请选择要请求的部门"></Cascader>
                    <ul class="record" v-if="isRecordShow">
                        <li>历史发布工单部门</li>
                        <li v-for="item in depRecords" :key="item.dept_id" @click="getDepRecord(item)">{{item.dept_name}}</li>
                    </ul>
                </FormItem>
                <FormItem  prop="level" class="level">
                    <Select  style="width:200px;" clearable placeholder="请选择工单等级" @on-change="optionChange">
                        <Option v-for="item in list" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="supervisorid" class="supervisorid">
                    <Select style="width:200px;" clearable placeholder="请选择监督人" @on-change="supervisor" filterable :model.sync="model">
                        <Option v-for="option in options1" :value="option.userid" :key="option.userid" >{{option.user_name}}</Option>
                    </Select>
                </FormItem>
                <FormItem  prop="expect_time">
                    <DatePicker type="date" placeholder="请选择完成时间" style="width: 200px"  :options="options4" @on-change="timeChange"></DatePicker>
                </FormItem>
             </div>
              <FormItem>
                <Button @click="$router.push({path: 'Workorder',query:{key:2}})" class="go_back">返回工单列表</Button>
            </FormItem>
        </Form>
        <div class="content">
            <div class="title">
                <Input v-model="create_data.title" placeholder="请输入工单标题..." size="large"/>
            </div>
            <div class="content_middle">
                <div class="left">
                    <Upload multiple action="/NewA/Workorder/getimage" :on-success="uploadImage" :format="['jpg','jpeg','png']" :on-format-error="handleFormatError">
                        <Button type="ghost" icon="images" class="ghost" >上传图片</Button>
                    </Upload>
                    <Button class="look_image" icon="eye" v-if="isShowImageButton" @click="carouse=true">查看上传图片</Button>

                    <Upload multiple action="/NewA/Workorder/getfile" :on-success="uploadfile">
                        <Button type="ghost" icon="ios-albums">上传文件</Button>
                    </Upload>
                    <Button class="look_file" icon="upload" v-if="isShowFileButton" @click="getLookFile">查看上传的文件</Button>
                </div>
                <Button @click="create('formValidate')" class="public">发布工单</Button>
            </div>
            <div class="area">
                <Input v-model="create_data.content" type="textarea" placeholder="请输入工单内容..." />     
            </div>
        </div>
        <!-- 查看图片轮播图 -->
        <div class="carouselcontent" v-if="carouse">
            <Icon type="ios-close-outline" class="close_icon" title="关闭弹窗" @click="carouse=false;"></Icon>
            <Carousel v-model="value1">
                <CarouselItem v-for="item in create_data.photoarr" :key="item.url">
                    <div class="demo-carousel"><img :src="item.url" alt="加载图片..."></div>
                    <div class="bottom">
                        <p>照片名称:<span>{{item.name}}</span></p>
                        <Button title="点击删除当前这张图片" @click="deleteImage(item)">删除</Button>
                    </div>
                </CarouselItem>
            </Carousel>
        </div>
        <!-- 查看文件的modal -->
        <Modal title="文件信息" v-model="modal10" class-name="vertical-center-modal">
            <div v-for="(item,index) in create_data.filearr" :key="item.url" style="display:flex;justify-content: space-between;color:#000;font-size:14px;margin-bottom: 10px;">
                <p>文件名{{index+1}}: <span style="color:#1596ad;font-size:14px;margin-left: 5px">{{item.name}}</span></p>
                <Button title="点击删除当前这个文件" @click="deleteFile(item)" style="border:1px solid #1596ad;padding: 2px 5px;">删除</Button>
            </div>
        </Modal>
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
    // 引入弹出框
import tipModal from '../tip.vue'

import { create } from 'domain';
    export default{
        components: {
            tipModal,
        },

        data(){
            return {
                //  是否显示查看图片按钮
                isShowImageButton: false,
                // 是否显示图片
                carouse: false,
                // 是否显示删除框
                isDelete:false,
                // 要删除的图片数据
                deleteImageDate: {},
                // 要删除的文件数据
                deleteFileDate: {}, 
                // 走马灯
                value1: 0,
                // 是否显示查看文件信息按钮
                isShowFileButton: false,
                // 是否显示历史部门信息
                isRecordShow: false,
                modal10: false,
                // 根据这个是判断删除图片还是文件
                contentDelete: '图片',
                // 部门选择的数据
                depData: [
                    {
                        value:'',
                        label:'',
                        children:[
                            {
                                value:'',
                                label:'',
                                children:[
                                    {
                                        value:'',
                                        label:''
                                    }
                                ]
                            }
                        ]
                    }
                ],
                // 等级列表
                list: [
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
                // 对时间进行限制,选择大于今天的时间
                options4: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now();
                    }
                },
                // 上级数据
                options1: [],
                // 发布要的参数数据
                create_data: {
                    departmentid: '',//部门编号
                    expect_time:'',//时间
                    level:'',//等级
                    supervisorid: '',//监督人ID
                    //上传图片
                    photoarr:[],
                    //文件上传
                    filearr:[],
                    title:"",//工单标题
                    content:"",//工单内容
                },
                // 验证规则
                ruleValidate:{
                    departmentid: [
                        { required: true, message: '部门不能为空', trigger: 'blur' },
                    ],
                    level: [
                        { required: true, message: '工单等级不能为空', trigger: 'blur' }
                    ],
                    supervisorid: [
                        { required: true, message: '监督人不能为空', trigger: 'blur' }
                    ]
                },
                //发起工单部门历史记录列表
                depRecords:[
                    {
                        value:'',
                        label:'',
                    }
                ],  
                //监督人
                model:''
            }
        },
        created(){
            //获取部门信息
            this.getWorkOrders();
            //获取员工信息
            this.getuserlist();
            // 最近提交工单的部门信息
            this.bygone();
        },

        methods:{
             /*
             * 最近提交工单的部门信息
            */
             bygone(){
                this.$resetAjax({
                    url:'/NewA/Public/get_bygone_dept',
                    type:'get',
                    success:(res)=>{
                        this.depRecords = res;
                        // console.log(this.depRecords);
                        for(let i in this.depRecords){
                            this.depRecords[i].value=this.depRecords[i].dept_id;
                            this.depRecords[i].label=this.depRecords[i].dept_name;
                            this.depData.push(this.depRecords[i])
                        }
                        
                    }
                })
            },
            /*
            * 选择监督人的id
            */
            supervisor(value){
                if (value) { 
                    $('.supervisorid .ivu-form-item-error-tip').css({display: 'none'});
                    $('.supervisorid .ivu-select-selection').css({border: '1px solid #fff'})
                    $('.supervisorid .ivu-icon-arrow-down-b').css({color: '#80848f'})
                }
                this.create_data.supervisorid=value;
            },
             /*
            * 得到所有员工的数据
            */ 
            getuserlist() {
                this.$resetAjax({
                    url: '/NewA/Public/getuserlist',
                    type: 'POST',
                    async: false,
                    success: (res) => {
                        this.options1 = JSON.parse(res);
                    }
                })
            },
            /*
            * 上传文件
            */ 
            uploadfile(res) {
                this.create_data.filearr.push(res.data);
                if(res.errorcode == 0){
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = '上传文件成功!';
                    setTimeout(() => {
                            this.$root.tip.isShow = false;
                    }, 1500); 
                }else{
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = '抱歉,文件格式不对';
                    setTimeout(() => {
                            this.$root.tip.isShow = false;
                    }, 1500); 
                }
                if (this.create_data.filearr.length !== 0) {
                    this.isShowFileButton = true;
                } else {
                    this.isShowFileButton = false;
                }
                // console.log(this.create_data.filearr)
            },
            /**
             * 查看文件
             */
            getLookFile() {
                this.modal10 = true;
            },
            /**
             * 删除文件准备
             */
            deleteFile(item) {
                this.deleteFileDate = item;
                this.isDelete = true;
                this.contentDelete = '文件';
            },
             /*
            * 上传图片
            */ 
            uploadImage(res) {
                this.create_data.photoarr.push(res.data);
                if(res.errorcode == 0) {
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = '上传图片成功!';
                    setTimeout(() => {
                            this.$root.tip.isShow = false;
                    }, 1500); 
                } else {
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = '抱歉,文件格式不对!!!';
                    setTimeout(() => {
                            this.$root.tip.isShow = false;
                    }, 1500); 
                }
                if (this.create_data.photoarr.length !== 0) {
                    this.isShowImageButton = true;
                } else {
                    this.isShowImageButton = false;
                }
            },
            /**
             * 删除图片工作准备
             */
            deleteImage(item) {
                this.isDelete = true;
                this.deleteImageDate = item;
                this.contentDelete = '图片';
            },
            /**
             * 删除图片或文件
             */
            getDelete() {
                this.isDelete = true;
                if (this.contentDelete == '图片') {
                    let index = 0;
                    this.create_data.photoarr.forEach((ele, index) => {
                        if (ele.name == this.deleteImageDate.name) {
                            index = index;
                        }
                    });
                    this.create_data.photoarr.splice(index,1);
                    this.isDelete = false;
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = '删除图片成功!';
                    setTimeout(() => {
                        this.$root.tip.isShow = false;
                    }, 1500);
                    if (this.create_data.photoarr.length == 0) {
                        this.carouse = false;
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '暂无上传图片!';
                        this.isShowImageButton = false;
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                        }, 1500);
                    }
                } else {
                    let i = 0;
                    this.create_data.filearr.forEach((ele, index) => {
                        if (ele.name == this.deleteFileDate.name) {
                            i = index; 
                        }
                    });
                    this.create_data.filearr.splice(i,1);
                    this.isDelete = false;
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = '删除文件成功!';
                    setTimeout(() => {
                        this.$root.tip.isShow = false;
                    }, 1500);
                    if (this.create_data.filearr.length == 0) {
                        this.modal10 = false;
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '暂无上传的文件!';
                        this.isShowFileButton = false;
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                        }, 1500);
                    }
                }
                
            },
            /*
            * 图片格式验证
            */ 
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                });
            },
             /*
            * 获取部门信息
            */ 
            getWorkOrders() {
                this.$resetAjax({
                    url:'/NewA/Public/getdeptlist',
                    type:'post',
                    success:(res) =>{
                       this.depData = this.dgZtree([JSON.parse(res).data]);
                    //    console.log(this.depData);
                    }
                })
            },
            /**
             * 得到历史部门选择的数据
             */
            getDepRecord(item) {
                
                this.create_data.departmentid = item.dept_id;
                this.depData[0].value = item.dept_id;
                this.depData[0].label = item.dept_name;
            },
             /*
            * 获取当前行的id
            */ 
            handleChange (value, selectedData) {
                if (value) {
                    $('.departmentid .ivu-form-item-error-tip').css({display: 'none'});
                    $('.departmentid .ivu-input').css({border: '1px solid #fff'})
                    $('.departmentid .ivu-icon-arrow-down-b').css({color: '#80848f'})
                    
                }
                this.create_data.departmentid = value[value.length-1];
            },
            /*
            * 工单等级选择
            */ 
            optionChange(value) {
                if (value) {
                    $('.level .ivu-form-item-error-tip').css({display: 'none'});
                    $('.level .ivu-select-selection').css({border: '1px solid #fff'})
                    $('.level .ivu-icon-arrow-down-b').css({color: '#80848f'})
                }
                this.create_data.level = value;
            },
            /*
            * 获取时间
            */
            timeChange(date) {
                this.create_data.expect_time = new Date(date).getTime()/1000;
            },
            /**
             * 转化ztree数据；数据递归处理
             * @param {Array} data 需要转换的数据
             */
            dgZtree(data) {
                data.forEach(item => {
                    // title转化
                    item.label = item.dept_name;
                    item.value = item.dept_id
                    // // 当前节点是否要展开
                    // item.value = item.dept_id;
                    // 是否选中当前节点
                    // item.selected = false;
                    // 如果当前节点有子节点，再次把子节点进行递归处理；数据判断，子节点数据是数组，防止报错
                    if (item.children instanceof Array && item.children.length) {
                        this.dgZtree(item.children);
                    }
                })
                return data;
            },
            /*
            * 创建工单
            */
            create() {
                this.$refs.create_data.validate((valid) => {
                    if (valid) {
                        let data={
                            departmentid:this.create_data.departmentid,
                            level:this.create_data.level,
                            expect_time:this.create_data.expect_time,
                            supervisorid:this.create_data.supervisorid,
                            title:this.create_data.title,
                            content:this.create_data.content,
                            photoarr:this.create_data.photoarr,
                            filearr:this.create_data.filearr
                        };
                        this.$resetAjax({
                            url:'/NewA/Workorder/create',
                            type:'post',
                            data,                            
                            success:(res)=>{
                                if(res.errorcode == 0){
                                    this.$root.tip.isShow = true;
                                    this.$root.tip.content = '发布成功!';
                                    setTimeout(() => {
                                        this.$root.tip.isShow = false;
                                        this.$router.push({path: 'workOrder',query:{key:2}});
                                    }, 1500); 
                                }
                            }
                        })
                    }
                })
                
            }
        }
    }
</script>