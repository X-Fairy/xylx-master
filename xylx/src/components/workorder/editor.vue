<template>
  <div class="editorPage">
        <Form :rules="ruleValidate" ref="create_data" :model="create_data" class="editor_header">
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
        <!-- 上传的文件显示列表 -->
        <ul class="fileList">
            <li v-for="(item, index) of create_data.filearr" :key="index">
                <p>
                    <a :href="item.Url">{{item.name}}</a>
                </p>
                <Button>删除</Button>
            </li>
        </ul>
        <!-- 上传图片 -->
        <Upload
            :show-upload-list="false"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png','gif']"
            :max-size="2048"
            multiple
            action="/newoa/NewA/Workorder/getimage"
            >
            <Button icon="ios-cloud-upload-outline" ></Button>
        </Upload>
        <!-- 上传文件 -->
        <Upload :show-upload-list="false"
            :on-success="handleFileSuccess"
            :before-upload="handleFileBeforeUpload"
            type="drag"
            action="/newoa/NewA/Workorder/getfile"
            class="uploadFile">
        </Upload>
        <quill-editor
            v-model="create_data.content"
            :options="editorOption"
            ref="QuillEditor">
        </quill-editor>
        <button v-on:click="saveHtml" class="saveHtml">提交</button>
    </div>  
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import * as Quill from 'quill' //引入编辑器
import { ImageDrop } from 'quill-image-drop-module';
Quill.register('modules/imageDrop', ImageDrop);
// 自定义插入a链接
var Link = Quill.import('formats/link');
class FileBlot extends Link {  // 继承Link Blot
    static create(value) {
      let node = undefined
      if (value&&!value.href){  // 适应原本的Link Blot
        node = super.create(value);
      }
      else{  // 自定义Link Blot
        node = super.create(value.href);
        // node.setAttribute('download', value.innerText);  // 左键点击即下载
        node.innerText = value.innerText;
        node.download = value.innerText;
      }
      return node;
    }
  }
FileBlot.blotName = 'link';
FileBlot.tagName = 'A';
Quill.register(FileBlot);

// 工具栏配置
    const toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
    
      [{'header': 1}, {'header': 2}],               // custom button values
      [{'list': 'ordered'}, {'list': 'bullet'}],
      [{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
      [{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
      [{'direction': 'rtl'}],                         // text direction
    
      [{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
      [{'header': [1, 2, 3, 4, 5, 6, false]}],
    
      [{'color': []}],
      [{'background': []}],          // dropdown with defaults from theme
      [{'font': []}],
      [{'align': []}],
      ['link', 'image', 'upload'],
      ['clean']                                         // remove formatting button
    ];
    // 给菜单栏添加中文标题title
    const titleConfig = {
        'ql-bold':'加粗',
        'ql-color':'颜色',
        'ql-font':'字体',
        'ql-code':'插入代码',
        'ql-italic':'斜体',
        'ql-link':'添加链接',
        'ql-background':'背景颜色',
        'ql-size':'字体大小',
        'ql-strike':'删除线',
        'ql-script':'上标/下标',
        'ql-underline':'下划线',
        'ql-blockquote':'引用',
        'ql-header':'标题',
        'ql-indent':'缩进',
        'ql-list':'列表',
        'ql-align':'文本对齐',
        'ql-direction':'文本方向',
        'ql-code-block':'代码块',
        'ql-formula':'公式',
        'ql-image':'图片',
        'ql-video':'视频',
        'ql-clean':'清除字体样式',
        'ql-upload':'文件'
    };

export default {
  name: 'App',
  data(){
        return {
            content: ``,
            editorOption: {
                //debug: 'info',   调试的快捷方式。注意debug是静态方法
                theme:'snow',
                modules: {
                    imageDrop: true, 
                    // imageResize: {},
                    toolbar: {
                        container: toolbarOptions,  // 工具栏
                        handlers: {
                            'image': (value)=> {
                                if (value) {
                                    // 调用iview图片上传
                                    document.querySelector('.ivu-upload .ivu-btn').click()
                                } else {
                                    this.quill.format('image', false);
                                }
                            },
                             'upload': ((value) => {
                                if (value) {
                                    document.querySelector('.uploadFile input').click()
                                }
                            })
                        }
                    }
                }
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
            // 发布要的参数数据
            create_data: {
                departmentid: '',//部门编号
                expect_time:'',//时间
                level:'',//等级
                supervisorid: '',//监督人ID
                //上传图片
                photoarr: [],
                //文件上传
                filearr: [],
                title: "",//工单标题
                content: "",//工单内容
            },
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
            // 是否显示历史部门信息
            isRecordShow: false,
            //发起工单部门历史记录列表
            depRecords:[
                {
                    value:'',
                    label:'',
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
            // 上级数据
            options1: [],
            // 对时间进行限制,选择大于今天的时间
            options4: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now();
                }
            },
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

    mounted () {
      this.addQuillTitle()
    },
    computed: {
        editor() {
            return this.$refs.myQuillEditor.quill;
        },
    },
    methods: {
        handleFileBeforeUpload() {

        },
        /*
        *   上传图片
        */ 
        handleSuccess (res) {
            // 获取富文本组件实例
            let quill = this.$refs.QuillEditor.quill
            // 如果上传成功
            if (res) {
                // 获取光标所在位置
                let length = quill.getSelection().index;
                // 插入图片，res为服务器返回的图片链接地址
                quill.insertEmbed(length, 'image', res.data.url)
                // 调整光标到最后
                quill.setSelection(length + 1);
            } else {
                // 提示信息，需引入Message
                Message.error('图片插入失败')
            }
        },
        /*
        * 上传文件
        */ 
        handleFileSuccess (res, file) {       
            let fileNameLength = file.name.length
            // 插入链接
            let quill = this.$refs.QuillEditor.quill
            let length = quill.getSelection().index;
            quill.insertEmbed(length, 'link', {href:res.data.url, innerText:file.name}, "api")
            this.create_data.filearr.push(res.data)
            console.log(this.create_data.filearr)
            quill.setSelection(length + fileNameLength)
        },
        // 鼠标悬浮富文本标题查看对应中文内容
        addQuillTitle () {
            const oToolBar = document.querySelector('.ql-toolbar'),
            aButton = oToolBar.querySelectorAll('button'),
            aSelect =  oToolBar.querySelectorAll('select');
            aButton.forEach(function(item){
            if(item.className === 'ql-script'){
                item.value === 'sub' ? item.title = '下标': item.title = '上标';
            }else if(item.className === 'ql-indent'){
                item.value === '+1' ? item.title ='向右缩进': item.title ='向左缩进';
            }else{
                item.title = titleConfig[item.classList[0]];
            }
            });
            aSelect.forEach(function(item){
                item.parentNode.title = titleConfig[item.classList[0]];
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
        * 最近提交工单的部门信息
        */
        bygone(){
            this.$resetAjax({
                url:'/NewA/Public/get_bygone_dept',
                type:'get',
                success:(res)=>{
                    this.depRecords = res;
                    for(let i in this.depRecords){
                        this.depRecords[i].value=this.depRecords[i].dept_id;
                        this.depRecords[i].label=this.depRecords[i].dept_name;
                        this.depData.push(this.depRecords[i])
                    }
                }
            })
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
        /**
         * 得到历史部门选择的数据
         */
        getDepRecord(item) {
            this.create_data.departmentid = item.dept_id;
            this.depData[0].value = item.dept_id;
            this.depData[0].label = item.dept_name;
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
        //获取时间
        timeChange(date) {
            this.create_data.expect_time = new Date(date).getTime()/1000;
        },
        // 准备编辑器
        onEditorReady(editor) { 
            console.log(editor)
        },
        // 失去焦点事件
        onEditorBlur(e) {
            this.content = e.root.innerHTML;
           
        }, 
        // 获得焦点事件
        onEditorFocus() { 

        },
        // 内容改变事件
        onEditorChange(event,html,text) {

        }, 
        /**
         * 发布工单
         */
        saveHtml(event) {
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
        },
        // 富文本获得焦点时的事件
        onEditorFocus(val,editor){
            // console.log(val); // 富文本获得焦点时的内容
        }
    }
}
</script>