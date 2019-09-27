<template>
    <div class="customervisit">
         <div class="contanier">
            <!-- 回访列表 -->
            <div class="visit_content">
                <div class="visit_top">
                    <h3>
                        回访客户姓名:<span @click="editname(customer.name)" class="editIntention" title="点击修改客户姓名">{{customer.name}}</span>
                        电话: <span>{{customer.phone}}</span>
                        来源: <span>{{customer.channel}}</span>
                        门店:<span>{{customer.has_store}}</span>
                        意向度: <span @click="editIntention(customer.intention)" class="editIntention" title="点击修改意向度">{{customer.intention}}</span>
                    </h3>
                    <!-- <div v-show="show" class="edit">
                       
                        <DatePicker  type="date" :options="options" placeholder="选择跟进时间" :value="orderDate" style="width:200px" @on-change="getOrderTime" format="yyyy-MM-dd"></DatePicker>  
                        <Button type="info" class="add_visit" @click="editVisit" v-show="show">修改跟进时间</Button>
                        
                    </div> -->
                    <div class="visit_right">
                        <Button type="info" @click="handlePubsea" v-show="show">放入公海池</Button>
                        <!-- <Button type="info" class="add_visit" @click="addVisit()" v-show="show">新增跟进</Button> -->
                        <Button type="warning" @click="$router.push({path: 'customer'})">返回客户列表</Button>
                    </div>
                </div>
                <!-- 回访内容区 -->
                <div class="writeContent">
                    <ul class="visit_list" v-show="isShowList" :class="show?'addwrite' :'nowrite'">
                        <Timeline>
                            <TimelineItem v-for="(item) in visitData" :key="item.id">
                                <span style="float: left">{{item.user_name}}</span>
                                <p class="time">&nbsp;&nbsp;&nbsp;{{changeday(Number(item.last_time)*1000)}}</p>
                                <li>
                                    <div class="recode">
                                            <p class="point" :title="item.notes">{{item.notes}}</p>
                                        <!-- <div class="right">
                                            <Button type="primary" size="small" @click="editVisit(index,item)">编辑</Button>
                                            <Button type="error" size="small" @click="goDelete(index,item)">删除</Button>
                                        </div> -->
                                    </div>
                                </li>
                            </TimelineItem>
                        </Timeline>
                    </ul>
                    <div class="no-comment" v-show="!isShowList">
                            <img src="@/assets/images/icon_comment.png" alt="">
                            <p>暂无客户跟进</p>
                        </div>
                    <customervisit-Write v-show="show"></customervisit-Write>
                </div>
               
                
            </div>
        </div>
        <!-- 提示是否删除 -->
        <div class="outside" v-if="isDelete">
            <div class="delete">
                <p>确认删除</p>
                <div class="build">
                    <Icon type="close" @click="isDelete=false"></Icon>
                    <Icon type="checkmark"  @click="deleteVisit()"></Icon>
                </div>
            </div>
        </div>
        <!-- 修改意向度弹窗 -->
        <Modal v-model="modal1"  @on-ok="editIntentionQuery" @on-cancel="modal1 = false">
            <div style="display: flex;align-items: center;margin-bottom: 30px;" >
                <span style="font-size: 13px;color: #1296ad;">修改意向度：</span>
                <Select v-model="modelIntention" style="width:470px" placeholder="请选择意向度" @on-change="getIntention">
                    <Option v-for="item in intentionalityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
            <div style="display: flex;align-items: center;margin-bottom: 20px;">
                <span style="font-size: 13px;color: #1296ad;">修改标记：</span>
                <CheckboxGroup v-model="sign" @on-change="getsign(sign)" style="padding-left: 25px;">
                    <Checkbox :label="item.value" v-for="item in signList" :key="item.value"><Icon type="ios-pricetags" :style="item.objectClass"></Icon></Checkbox>
                </CheckboxGroup>
            </div>
        </Modal>
        <Modal title="修改客户姓名" v-model="nameModal" :mask-closable="false" class="userModal">
            <Form ref="userData" :model="userData" :rules="ruleValidate" :label-width="80">
                <FormItem label="客户姓名" prop="username">
                    <Input v-model="userData.username" /> 
                </FormItem>
            </Form>
            <div class="modal_footer">
                <Button @click="editNameQuery('userData')">确定</Button>
            </div>
        </Modal>
    </div>
</template>


<script>
import tipModal from '../tip.vue'
import {getUrlParams} from  '@/assets/js/tool.js'
import customervisitWrite from '@/components/customer/customervisitWrite'
export default {
    components: {
        tipModal,
        customervisitWrite
    },

    data() {
        return {
            // 标记选定
            sign: '',
            // 标记数据
            signList:[
                {
                    value: '1',
                    label: '',
                    objectClass: {
                        color: '#9d50c8',
                    }
                },
                 {
                    value: '2',
                    label: '',
                    objectClass: {
                        color: '#f35a59',
                    }
                },
                {
                    value: '3',
                    label: '',
                    objectClass: {
                        color: '#169aff',
                    }
                },
                {
                    value: '4',
                    label: '',
                    objectClass: {
                        color: '#20b275',
                    }
                },
                {
                    value: '5',
                    label: '',
                    objectClass: {
                        color: '#f5c635',
                    }
                },
                {
                    value: '6',
                    label: '',
                    objectClass: {
                        color: '#fb9200',
                    }
                },
                {
                    value: '7',
                    label: '',
                    objectClass: {
                        color: '#7f2c27',
                    }
                },
                {
                    value: '8',
                    label: '',
                    objectClass: {
                        color: '#1bf945',
                    }
                },
                {
                    value: '9',
                    label: '',
                    objectClass: {
                        color: '#045c5d',
                    }
                },
                {
                    value: '10',
                    label: '',
                    objectClass: {
                        color: '#e9aaa0',
                    }
                },
            ],
            // 得到网址的参数对象
            urlParams: {},
            // 客户的信息
            customer:{
                name: 'xxl',
                custormer_id: 0,
                phone: '',
                // 渠道来源
                channel: '',
                // 是否有门店
                has_store: '',
                // 意向度
                intention: '',
            },
            // 回访的所有数据
            visitData: [],
             // 渠道来源数据
            sourceList: [],
            // 是否提醒删除
            isDelete: false,
            // 当前这条回访的id
            visit_id: 0,
            // 是否显示修改意向度弹窗
            modal1: false,
            // 编辑时选择到了哪个意向度
            modelIntention: '',
            // 客户意向度数据
            intentionalityList: [
                {
                    value: 1,
                    label: 'A(对我们品牌有直接兴趣的客户)'
                },
                {
                    value: 2,
                    label: 'B(对我们行业有直接兴趣的客户)'
                },
                {
                    value: 3,
                    label: 'C(对投资开店有直接兴趣的客户)'
                },
                {
                    value: 4,
                    label: 'D(无效客户)'
                },
                {
                    value: 5,
                    label: '待定:未接，不接，暂时无法联系上的，拒接小于三次的'
                }
            ],
            show:true,
            // 是否显示来访记录列表
            isShowList: true,
            // 修改客户姓名弹出框
            nameModal:false,
            // 新的客户姓名
            userData:{
                username:''
            },
            ruleValidate: {
                username: [
                    { required: true, message: '客户姓名不能为空', trigger: 'change' }
                ]
            },
        }
    },
     
    created() {
        // 得到渠道来源数据
        this.getSourceList();
        // 得到网址的参数
        this.getUrlData();
        // 得到客户信息
        this.getCustomerInfo();
        // 得到回访列表
        this.getCustormerList();
    },

    methods:{
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
        /**
         * 得到网址的参数
         */
        getUrlData() {
            this.urlParams = getUrlParams();
            if(this.urlParams.isShow == 1) {
                this.show = false
            } else{
                this.show = true
            }
            // console.log(this.urlParams);
            this.customer.custormer_id = this.urlParams.id;
            this.customer.name = this.urlParams.name;
            this.customer.has_store = this.urlParams.has_store;
            this.customer.channel = this.urlParams.channels;
            var intention = this.urlParams.intention;
            switch(intention) {
                case 'A': 
                    this.customer.intention = 'A(对我们品牌有直接兴趣的客户)';
                    break;
                case 'B':
                    this.customer.intention = 'B(对我们行业有直接兴趣的客户)'
                    break;
                case 'C':
                    this.customer.intention = 'C(对投资开店有直接兴趣的客户)'
                    break;
                case 'D':
                    this.customer.intention = 'D(无效客户)'
                    break;
                default: 
                    this.customer.intention = '待定:未接，不接，暂时无法联系上的，拒接小于三次的';

            }
        },
        /**
         * 得到客户信息
         */
        getCustomerInfo() {
             this.$resetAjax({
                url: '/NewA/Customer/getinfo',
                type: 'POST',
                data:{
                    id: this.customer.custormer_id
                },
                success:(res) => {
                    let result = JSON.parse(res).data;
                    this.customer.phone = result.phone[result.phone.length - 1];
                    this.sourceList.forEach(ele => {
                        if (ele.cid == result.channel) {
                            this.customer.channel = ele.channels;
                        }
                    })
                    this.customer.has_store = result.has_shop;
                    switch(this.customer.has_store) {
                        case '0':
                            this.customer.has_store = '无';
                            break;
                        case '1':
                            this.customer.has_store = '有'
                            break;
                        default:
                            this.customer.has_store = '有意向店面';
                    };
                    this.getCustormerList();
                }
             })
        },
        /**
         * 选择得到哪个标志详情
         */
         getsign(sign) {
            // if (signmodel.length !==0) {
            //     signmodel = signmodel[signmodel.length - 1]
            // }
            this.sign = [this.sign];
            this.signHandle();
            
        },
        /**
         * 编辑客户标记
         */
        signHandle() {
            this.$resetAjax({
                type: 'POST',
                url: '/NewA/Public/updatesign',
                data: {
                    id: this.customer.custormer_id,
                    sign: this.signmodel
                },
                success: (res) =>{
                    this.modal1 = false;
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = '客户标志编辑成功';
                    setTimeout(() => {
                        this.$root.tip.isShow = false;
                    }, 1000);
                }
            })
        },
        /**
         * 得到回访列表
         */
        getCustormerList() {
            this.$resetAjax({
                type: 'POST',
                url: '/NewA/Customer/visitlist',
                data: {
                    id: this.customer.custormer_id
                },
                success: (res) =>{
                    if(JSON.parse(res).data.length !== 0) {
                        this.isShowList = true;
                        let intention = JSON.parse(res).intention;
                        this.modelIntention = intention;
                        switch(intention) {
                            case '1': 
                                this.customer.intention = 'A(对我们品牌有直接兴趣的客户)';
                                break;
                            case '2':
                                this.customer.intention = 'B(对我们行业有直接兴趣的客户)'
                                break;
                            case '3':
                                this.customer.intention = 'C(对投资开店有直接兴趣的客户)'
                                break;
                            case '4':
                                this.customer.intention = 'D(无效客户)'
                                break;
                            default: 
                                this.customer.intention = '待定:未接，不接，暂时无法联系上的，拒接小于三次的';

                        }
                    } else {
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '抱歉,回访记录为空!';
                        this.isShowList = false;
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                        }, 1500);
                    }
                    this.visitData = JSON.parse(res).data;
                }
            })
        },
        /* 放入公海池 */
        handlePubsea(){
            this.$Modal.confirm({
                content: '是否确定将选择的客户放入公海池？',
                onOk:()=>{
                    this.$resetAjax({
                        url:'/NewA/Customer/pubsea',
                        type:'POST',
                        data:{
                            id:[this.customer.custormer_id]
                        },
                        success:(res)=>{
                            if(JSON.parse(res).msg=="success"){
                                this.$root.tip.isShow = true;
                                this.$root.tip.content = '加入成功';
                                setTimeout(() => {
                                    this.$root.tip.isShow = false;
                                }, 1500);
                            }
                        }
                    })
                },
            });
        },
        /**
         * 得到预约回访时间
         */
        //  getOrderTime(date) {
        //     this.orderDate = date;
            
        // },
        // editVisit(){
        //     console.log(this.orderDate);
        //     if(this.orderDate){
        //         this.$Modal.confirm({
        //             content: '是否确定修改客户跟进时间？',
        //             onOk:()=>{
        //                 this.$resetAjax({
        //                     type: 'POST',
        //                     url: '/NewA/Customer/savefollow',
        //                     data: {
        //                         id: this.customer.custormer_id,
        //                         date: this.orderDate,
        //                     },
        //                     success: (res) =>{
        //                         if(JSON.parse(res).errorcode==0){
        //                             this.$root.tip.isShow = true;
        //                             this.$root.tip.content = '修改回访时间成功';
        //                             setTimeout(() => {
        //                                 this.$root.tip.isShow = false;
        //                             }, 1500); 
        //                         }else if(JSON.parse(res).errorcode==200){
        //                             this.$root.tip.isShow = true;
        //                             this.$root.tip.content = '该客户未设置预约回访';
        //                             setTimeout(() => {
        //                                 this.$root.tip.isShow = false;
        //                             }, 1500); 
        //                         }
                               
        //                     }
        //                 })
        //             },
        //         });
        //     }else{
        //         this.$Message.error('跟进时间不能为空');
        //     }
            
            
        // },
        /**
         * 新增回访
         */
        addVisit() {
            this.$router.push({path: 'customervisitWrite', query:{isadd:1, name: this.customer.name, id: this.customer.custormer_id, phone: this.customer.phone, channels: this.customer.channels, has_store: this.customer.status, intention: this.customer.intention}});
        },
        /**
         * 编辑回访记录
         */
        // editVisit(index,item) {
        //     this.$router.push({path: 'customervisitWrite', query:{isadd:2, item: item, name: this.customer.name, id: this.customer.id}});
        // },
        /**
         * 删除准备工作
         */
        // goDelete(index,item) {
        //     this.isDelete = true;
        //     this.visit_id = item.id;
        // },
        /**
         * 删除回访记录
         */
        // deleteVisit() {
        //     this.$resetAjax({
        //         type: 'POST',
        //         url: '/NewA/Customer/visitdel',
        //         data: {
        //             id: this.visit_id
        //         },
        //         success: (res) =>{
        //             this.isDelete = false;
        //             this.istip = true;
        //             this.tip = '删除回访成功';
        //             setTimeout(() => {
        //                 this.istip = false;
        //                 this.getCustormerList();
        //             }, 1500);
        //         }
        //      })
        // },
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
        /**
         * 修改意向度准备工作，得到意向度详情
         */
        editIntention(data) {
            let intentionData = data;
            this.intentionalityList.forEach(ele => {
                if (ele.label == intentionData) {
                    this.modelIntention = ele.value;
                }
            })
            this.modal1 = true;
        },
        /* 修改客户姓名准备工作，得到客户姓名 */
        editname(name){
            this.nameModal=true;
            this.userData.username=name;
        },
        /**
         * 编辑意向度时选择到哪个意向度
         */
        getIntention(data) {
            this.modelIntention = data;
        },
        /**
         * 提交修改意向度请求
         */
        editIntentionQuery() {
            this.$resetAjax({
                type: 'POST',
                url: '/NewA/Customer/update_intention',
                data: {
                    id: this.customer.custormer_id,
                    intention: this.modelIntention
                },
                success: (res) =>{
                    this.modal1 = false;
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = '棒棒哒,修改意向度成功 !';
                    setTimeout(() => {
                        this.$root.tip.isShow = false;
                    }, 1500);
                    this.getCustormerList();
                }
             })
        },
        /* 修改客户姓名 */
        editNameQuery(name){
            this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$resetAjax({
                            url: '/NewA/Customer/update',
                            type: 'POST',
                            data: {
                                // 客户id   
                                id: this.customer.custormer_id,
                                username: this.userData.username,
                            },
                            success: (res) => {
                                if(JSON.parse(res).errorcode==0){
                                    this.customer.name=this.userData.username;
                                    this.nameModal=false;
                                    this.$Message.success('修改成功')
                                }else{
                                    this.$Message.error('修改失败')
                                }
                                
                            }
                        })
                    }
                })
        }
    }
}
</script>
