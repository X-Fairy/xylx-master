
<template>
    <div class="storevisitwritePage">
        <div class="write">
            <div class="title">
                <Input v-model="title" size="large" placeholder="请输入回访标题" />
            </div>
            <div class="submit">
                <div class="left">
                    <p class="selectepart">请选择回访时间</p>
                    <Row>
                        <DatePicker type="date" :options="options4" placeholder="Select date" :value="date1" style="width: 200px" @on-change="time1" format="yyyy-MM-dd"></DatePicker>
                    </Row>
                    <p class="selectepart two">请选择回访状态</p>
                    <Select v-model="model" style="width:200px">
                        <Option v-for="item in statuList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
                <div class="right">
                    <Button type="warning" @click="goVisitList()">返回回访列表</Button>
                    <Button type="info" @click="publish " style="margin:0 20px;">发布</Button>
                </div>
            </div>
            <div class="area">
                <Input v-model="content" type="textarea" placeholder="请输入回访内容" />
            </div>
        </div>
         <!-- 提示框 -->
        <tip v-if="istip" :tipContent="tip"></tip>
    </div>
</template>


<script>
import {getUrlParams} from  '@/assets/js/tool.js'  
import {changeday} from  '@/assets/js/tool.js'  
import tip from '../tip.vue'

export default {
    components: {
        tip,
    },
   
    data() {
        return {
            // 得到网址的参数对象
            urlParams: {},
            // 回访标题
            title: '',
            // 回访记录的Id
            id: 0,
            // 回访内容
            content: ``,
            // 是编辑
            edit: 0,
            // 回访记录的数据
            visitData:{},
            // 状态
            status: 1,
            // 门店编码
            cid: '',
            model: '1',
            // 回访状态
            statuList: [
                {
                    value: '1',
                    label: '正常'
                },
                {
                    value: '2',
                    label: '重要'
                },
                {
                    value: '3',
                    label: '紧急'
                },
            ],
            // 客户姓名
            storname:'',
            // 是否显示添加成功
            istip: false,
             // 提醒内容
            tip: '',
            // 选中的时间
            date1: '',
            // 对时间进行限制,选择不到大于今天的时间
            options4: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
        }
    },
    
    created() {
         // 得到网址的参数
        this.getUrlData();
        // 判断是否是编辑
        this.isEdit();
    },
    methods: {
        /**
         * 得到网址的参数
         */
        getUrlData:function(){
            this.urlParams = getUrlParams();
        },
        /**
         * 判断是否是编辑
         */ 
        isEdit() {
            if (this.urlParams.isEdit == 1) {
                // 编辑页面
                this.edit = 1;
                this.storname = this.urlParams.name;
                this.getDetail();
            } else {
                //  新增页面
                this.edit = 2;
                this.content = '';
                this.title = '';
                this.model = '1';
                this.cid = this.urlParams.data;
                this.storname = this.urlParams.name;
            }
        },
        /**
         * 编辑得到具体详情
         */
        getDetail() {
            this.id = this.urlParams.id;
            this.$resetAjax({
                type: 'POST',
                url:   '/NewA/Shop/getvisitinfo',
                data: {
                    id: this.urlParams.id
                },
                success: (res) => {
                    this.id = res.data.id;
                    this.title = res.data.title;
                    this.content = res.data.content;
                    this.status = res.data.status;
                    this.date1 = res.data.time;
                    this.statuList.forEach(ele => {
                        if (this.status == ele.value) {
                            this.model = ele.value
                        }
                    })
                    this.cid = res.data.cid;
                }
            })
        },
        /**
         * 判断是新增还是编辑
         */
        publish() {
            // 编辑请求
            if (this.edit == 1) {
                this.editQuery();
            } else {
                // 新增请求
                this.addNewQuery();
            }
        },
        // 获取当前的时间
        time1(e) {
            this.date1 = e;
        },
        /**
         *  返回回访列表
         */
        goVisitList() {
            this.$router.push({path: 'storeVisit',query: {code:this.cid,name:this.storname}})
        },
        /**
         *  编辑请求
         */
        editQuery() {
            this.$resetAjax({
                type: 'POST',
                url:   '/NewA/Shop/visitedit',
                data: {
                    id:  this.id,
                    content: this.content ,
                    title:  this.title,
                    status: this.model,
                    time: this.date1,
                },
                success: (res) => {
                    this.istip = true;
                    this.tip = '棒棒哒,修改成功';
                    setTimeout(() => {
                        this.istip = false;
                        this.$router.push({path: 'storeVisit',query: {code:this.cid,name:this.storname}})
                    }, 1000);
                }
            })
        },
        /*
        *  新增请求
        */ 
        addNewQuery() {
            this.$resetAjax({
                type: 'POST',
                url:   '/NewA//Shop/visitadd',
                data: {
                    cid:  this.cid,
                    content: this.content ,
                    title:  this.title,
                    status: this.model,
                    time: this.date1,
                },
                success: (res) => {
                    this.istip = true;
                    this.tip = '棒棒哒,新增成功！';
                    setTimeout(() => {
                        this.istip = false;
                        this.$router.push({path: 'storeVisit',query: {code:this.cid,name:this.storname}})
                    }, 1000);
                }
            })
        }
    },
    


}
</script>

