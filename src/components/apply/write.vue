<template>
    <div class="writePage">
        <div class="write">
            <div class="title">
                <Input v-model="title" size="large" placeholder="请输入回访标题" />
            </div>
            <div class="submit">
                <div class="left">
                    <p class="selectepart">请选择回访时间:</p>
                    <Row>
                        <DatePicker type="date" placeholder="Select date" :value="date1" style="width: 200px" @on-change="time1" format="yyyy-MM-dd"></DatePicker>
                    </Row>
                    <p class="selectepart two">请选择回访状态:</p>
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

import tip from '../tip.vue'

export default {
    components: {
        tip,
    },
   
    data() {
        return {
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
        }
    },
    
    created() {
        // 判断是否是编辑
        this.isEdit();
    },
    methods: {
        /**
         * 判断是否是编辑
         */ 
        isEdit() {
            if (this.$route.query.isEdit == 1) {
                this.edit = 1;
                this.storname = this.$route.query.name;
                this.getDetail();
            } else {
                this.edit = 2;
                this.content = '';
                this.title = '';
                this.model = '1';
                this.cid = this.$route.query.data;
                this.storname = this.$route.query.name;
            }
        },
        /**
         * 得到具体详情
         */
        getDetail() {
            this.id = this.$route.query.data.id;
            this.$resetAjax({
                type: 'POST',
                url:   '/NewA/Shop/getvisitinfo',
                data: {
                    id: this.id
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
        publish() {
            // 编辑请求
            if (this.edit == 1) {
                // 回访时间不能大于今日
                if (new Date(this.date1).getTime() > new Date().getTime()) {
                    this.istip = true;
                    this.tip = "修改回访时间不能大于今日";
                    setTimeout(() => {
                        this.istip = false;
                    }, 2000);
                } else {
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
                            this.tip = '修改成功';
                            setTimeout(() => {
                                this.istip = false;
                                this.$router.push({path: 'visit',query: {cid:this.cid,name:this.storname}})
                            }, 1000);
                        }
                    })
                }
            } else {
                // 回访时间不能大于今日
                if (new Date(this.date1).getTime() > new Date().getTime()) {
                    this.istip = true;
                    this.tip = "回访时间不能大于今日";
                    setTimeout(() => {
                        this.istip = false;
                    }, 2000);
                } else {
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
                            this.tip = '添加成功';
                            setTimeout(() => {
                                this.istip = false;
                                this.$router.push({path: 'visit',query: {cid:this.cid,name:this.storname}})
                            }, 1000);
                        }
                    })
                }
            }
        },
        // 获取当前的时间
        time1(e) {
            this.date1 = e;
        },
        // 毫秒转成-- 年月日形式
        changeday(num) {
            let date = new Date(num*1000);
            let z = date.getFullYear() + '-',
                b = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1)  : date.getMonth() + 1) + '-',
                n = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) ;
            return z+b+n;
        },
        // 返回回访列表
        goVisitList() {
            if (this.edit == 1) {
                this.$router.push({path: 'visit',query: {cid:this.cid,name:this.storname}})
            } else {
                this.$router.push({path: 'visit',query: {cid:this.cid,name:this.storname}})
            }
        }
        
         
    },
    


}
</script>

