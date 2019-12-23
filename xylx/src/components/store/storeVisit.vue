<template>
    <div class="storeVisitPage">
        <!-- 头部 -->
        <div class="top">
            <h3 class="store_name" >店名: <span>{{storeName}}</span></h3>
            <div class="more">
                <Button type="info" size="small" class="add_visit" @click="addVisit()">新增回访</Button>
                <Button type="warning" size="small" @click="gonameList">返回客户列表</Button>
            </div>
        </div>
        <!-- 回访记录列表区 -->
        <ul class="visit_list" v-show="isShow">
            <Timeline>
                <TimelineItem v-for="(item, index) in visitData" :key="item.id">
                    <p class="time">{{changeday(Number(item.time)*1000)}}</p>
                    <li>
                        <div class="recode">
                            <h4 :style="item.classObject">{{item.title}}  <Icon type="flag" :style="item.colorObject" class="flag"></Icon></h4>
                        </div>
                        <div class="content">
                            <p class="point" :title="item.content">{{item.content}}</p>
                            <div class="right" style="margin-right: 20px">
                                <Button type="primary" size="small" style="background:#1596ad;border:0;color:#fff;" @click="editVisit(index,item.time)">编辑</Button>
                                <Button type="error" size="small" style="background:#fff;border:1px solid #ddd;color:#555;"  @click="goDelete(index,item.id,item)">删除</Button>
                            </div>
                        </div>
                    </li>
                </TimelineItem>
            </Timeline>
        </ul>
        <div class="no-comment" v-show="!isShow">
            <img src="@/assets/images/icon_comment.png" alt="">
            <p>智慧如你，不想<a @click="addVisit()"> 记录下客户的故事 </a>咩~</p>
        </div>
        <!-- 提示框 -->
        <tip v-if="istip" :tipContent="tip"></tip>
        <!-- 提示是否删除 -->
        <div class="outside" v-if="isDelete">
            <div class="delete">
                <p>确认删除</p>
                <div class="build">
                    <button type="close" @click="isDelete=false">取消</button>
                    <button type="checkmark"  @click="deleteVisit()">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import {getUrlParams} from  '@/assets/js/tool.js'
import tip from '../tip.vue'

export default {
    components: {
        tip,
    },
    inject:['reload'],
    data() {
        return {
             // 客户名称
            storeName: '',
             // 得到第几位删除
            deleIndex:0,
            // 当前选中哪条的回访记录的数据
            currendItem: {},
            // 当前选中哪条的回访记录的id
            currentid: '',
            // 是否显示确认删除框
            isDelete: false,
            // 回访记录数据
            visitData: [],
            // 得到网址的参数对象
            urlParams: {},
            // 该店的id
            code: '',
            // 是否显示提示框
            istip: false,
            // 提示框文字
            tip: '删除成功',
            // 是否显示回访记录列表
            isShow: true,
        }
    },

    created() {
        // 得到网址的参数
        this.getUrlData();
        // 得到回访记录
        this.getVisitList();
    },

    methods:{
        /**
         * 得到网址的参数
         */
        getUrlData() {
            this.urlParams = getUrlParams();
            this.storeName = this.urlParams.name;
            this.code = this.urlParams.code;
        },
        /**
         * 得到回访记录
         */
        getVisitList() {
            this.$resetAjax({
                type: 'POST',
                url:   '/NewA/Shop/getvisitlist',
                root: '',
                data: {
                    cid: this.code
                },
                success: (res) => {
                    if (Array.prototype.isPrototypeOf(res.data) && res.data.length === 0) {
                        this.visitData = res.data;
                        this.istip = true;
                        this.tip = '抱歉亲亲,暂无回访记录!';
                        this.isShow = false;
                        setTimeout(() => {
                            this.istip = false;
                        }, 1500);
                    } else {
                        this.isShow = true;
                        // 标注的状态
                        res.data.forEach(ele => {
                            if (ele.status == '3') {
                                ele.classObject = {color:'#ed3f14'};
                                ele.colorObject = {color: '#f90'}
                                
                            } else if (ele.status == '2') {
                                ele.classObject = {color: '#19be6b'};
                                ele.colorObject = {color: '#2db7f'}
                                
                            } else {
                                ele.classObject = {color: '#000'};
                                ele.colorObject = {color: '#ccc'};
                            }
                        });
                        this.visitData = res.data;
                    }
                }
            })
        },
         /**
         * 编辑得到详情
         */
        editVisit(index,time) {
            let data = this.visitData[index];
            // 跳到编辑页面
            this.$router.push({path: 'storevisitwrite', query: {cid: data.cid, id: data.id, isEdit:1,name:this.storeName,date1:time}});
        },
        /**
         * 新增回访
         */
        addVisit(index) {
            // 跳到新增页面
            this.$router.push({path: 'storevisitwrite', query:{data: this.code,isEdit:2,name:this.storeName}});
        },
        /**
         * 返回客户列表
         * */ 
        gonameList() {
            this.$router.push({path: 'store'});
        },
         /**
         * 准备删除
         */
        goDelete(index,id,item) {
            this.deleIndex = index;
            this.currendItem = item;
            this.currentid = id;
            this.isDelete = true;
        },
        /**
         * 删除记录
         */
        deleteVisit(id,item) {
            this.$resetAjax({
                type: 'POST',
                url:   '/NewA//Shop/visitdel',
                async: false,
                data: {
                    id: this.currentid,
                },
                success: (res) => {
                    this.isDelete = false;
                    this.istip = true;
                    this.tip = '棒棒哒,删除成功!';
                    setTimeout(() => {
                        this.istip = false;
                        this.reload();
                    }, 1500);
                    this.$resetAjax({
                        type: 'POST',
                        url:   '/NewA/Shop/getvisitlist',
                        root: '',
                        async: false,
                        data: {
                            cid: this.code
                        },
                        success: (res) => {
                        if (Array.prototype.isPrototypeOf(res.data) && res.data.length === 0) {
                            this.visitData = res.data;
                            this.istip = true;
                            this.tip = '抱歉亲亲,暂无回访记录!';
                            this.isShow = false;
                            setTimeout(() => {
                                this.istip = false;
                            }, 1500);
                        } else {
                                this.isShow = true;
                                // 标注的状态
                                res.data.forEach(ele => {
                                    if (ele.status == '3') {
                                        ele.classObject = {color:'#ed3f14'};
                                        ele.colorObject = {color: '#f90'}
                                        
                                    } else if (ele.status == '2') {
                                        ele.classObject = {color: '#19be6b'};
                                        ele.colorObject = {color: '#2db7f'}
                                        
                                    } else {
                                        ele.classObject = {color: '#000'};
                                        ele.colorObject = {color: '#ccc'};
                                        
                                    }
                                });
                                this.visitData = res.data;
                             }
                        }
                    })
                }
            })
        },
        /**
         * 毫秒转成-- 年月日形式
        */ 
        changeday(num) {
            let date = new Date(num);
            let z = date.getFullYear() + '-',
                b = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1)  : date.getMonth() + 1) + '-',
                n = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) ;
            return z+b+n;
        },
    }
}
</script>
