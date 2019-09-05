<template>
    <div class="customervisitWrite">
        <div class="write">
            <div class="submit">
                <div class="left">
                    <p class="selectepart">请选择回访时间</p>
                    <Row>
                        <DatePicker type="date" :options="options3" placeholder="Select date" :value="selectDate" style="width: 140px" @on-change="getTime" format="yyyy-MM-dd"></DatePicker>
                    </Row>
                    <p class="selectepart" style="margin-left:20px;">是否要预约回访</p>
                    <Select v-model="orderModel" style="width:80px" @on-change="getOrder(orderModel)">
                        <Option v-for="item in orderList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                    <div style="display:flex;align-items:center;" v-show="orderModel == 1">
                    <p class="selectepart order">选择预约回访时间</p>
                        <Row>
                            <DatePicker type="date" :options="options4" placeholder="Select date" :value="orderDate" style="width: 140px" @on-change="getOrderTime" format="yyyy-MM-dd"></DatePicker>
                        </Row>
                    </div>
                </div>
                <div class="right">
                    <Button type="success" @click="$router.push({path: 'customer'})">返回客户列表</Button>
                    <Button type="primary" @click="goVisitList()">返回回访列表</Button>
                    <Button type="info" @click="publishQuery">发布</Button>
                </div>
            </div>
            <div class="area">
                <Input v-model="notes" type="textarea" placeholder="请在此输入回访内容..." />
            </div>
        </div>
    </div>
</template>


<script>
import tipModal from '../tip.vue'
import {getUrlParams} from  '@/assets/js/tool.js'

export default {
    components: {
        tipModal,
    },

    data() {
        return {
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
            // 判断是增加还是编辑回访
            isadd: '增加回访',
            // 编辑时该条回访记录的id
            visit_id: 0,
            // 回访内容
            notes: '',
            // 回访选中的时间
            selectDate: '',
            // 预约回访时间
            orderDate: '',
            // 对时间进行限制,选择大于今天的时间
            options4: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now();
                }
            },
            // 对时间进行限制,选择不到大于今天的时间
            options3: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            // 是否要预约回访
            orderModel: 1,
            // 是否要预约回访数据
            orderList: [
                {
                    value: 1,
                    label: '是'
                },
                {
                    value: 2,
                    label: '否'
                }
            ],
            

        }
    },


    created() {
         // 得到网址的参数
        this.getUrlData();
         // 得到用户信息
        this.getCustomerInfo();
        // 判断是编辑还是新增
        this.isAdd();
    },

    methods: {
        /**
         * 得到网址的参数
         */
        getUrlData:function(){
            this.urlParams = getUrlParams();
            this.customer.custormer_id = this.urlParams.id;
            this.customer.name = this.urlParams.name;
            this.customer.has_store = this.urlParams.has_store;
            this.customer.channel = this.urlParams.channels;
            switch(this.urlParams.intention) {
                case 'A': 
                    this.customer.intention = 'A (对我们品牌有直接兴趣的客户)';
                    break;
                case 'B':
                    this.customer.intention = 'B (对我们行业有直接兴趣的客户)';
                    break;
                case 'C':
                    this.customer.intention = 'C (对投资开店有直接兴趣的客户)';
                    break;
                case 'D':
                    this.customer.intention = 'D (无效客户)';
                    break;
                default: 
                    this.customer.intention = '待定:未接，不接，暂时无法联系上的，拒接小于三次的';
            };  
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
                }
             })
        },
        /**
         * 判断是编辑还是新增
         */
        isAdd() {
            let isadd = this.urlParams.isadd;
            if (isadd == 2) {
                // 说明是编辑回访记录
                this.isadd = '编辑回访';
                this.visit_id =  this.urlParams.id;
                this.customer.customer_id =  this.urlParams.cid;
                // 得到回访详情
                this.getVisitDetail();
            } else {
                // 说明是增加回访记录
                this.isadd = '增加回访';
                this.customer.customer_id =  this.urlParams.id;
               
            }
        },
        /**
         * 得到选择的时间
         */
        getTime(date) {
            this.selectDate = date;
        },
        /**
         * 得到预约回访时间
         */
        getOrderTime(date) {
            this.orderDate = date;
        },
        /**
         * 得到是否要预约
         */
        getOrder(orderModel) {
            this.orderModel = orderModel;
        },
        /**
         * 编辑时得到回访详情
         */
        getVisitDetail() {
            this.$resetAjax({
                type: 'POST',
                url: '/NewA/Customer/visitinfo',
                data: {
                    id: this.visit_id,
                },
                success: (res) => {
                    this.notes = JSON.parse(res).data.notes;
                    this.visit_id = JSON.parse(res).data.id;
                    this.selectDate = this.changeday(Number(JSON.parse(res).data.last_time*1000));
                }
            })
        },
        /**
         * 返回回访列表
         */
        goVisitList() {
            this.$router.push({path: 'customervisit', query:{isaim: 2, name: this.customer.name, id: this.customer.customer_id,  phone: this.customer.phone, channels: this.customer.channels, has_store: this.customer.status, intention: this.customer.intention}})
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
        /**
         * 发布请求
         */
        publishQuery() {
            if (this.isadd == '增加回访') {
                 if (this.orderModel == '1' && this.orderDate.length == 0) {
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = '请选择预约回访时间!';
                    setTimeout(() => {
                        this.$root.tip.isShow = false;
                    }, 2000);
                }  else {
                    if (this.notes == '') {
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '抱歉,预约内容不能为空!';
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                        }, 2000);
                    } else {
                        this.$resetAjax({
                            type: 'POST',
                            url: '/NewA/Customer/visitadd',
                            data: {
                                rid: this.customer.customer_id,
                                notes: this.notes,
                                time: this.selectDate,
                                visit: this.orderModel,
                                follow_up_time: this.orderDate,
                            },
                            success: (res) =>{
                                if(JSON.parse(res).errorcode===100){
                                    this.$Modal.info({
                                        title: '提示',
                                        content: '新增跟进失败,该客户不属于您,请刷新列表!'
                                    });
                                }else{
                                    this.$root.tip.isShow = true;
                                    this.$root.tip.content = '增加回访成功';
                                    setTimeout(() => {
                                        this.$root.tip.isShow = false;
                                        this.$router.push({path: 'customervisit', query:{isaim: 2, name: this.customer.name, id: this.customer.customer_id,  phone: this.customer.phone, channels: this.customer.channels, has_store: this.customer.status, intention: this.customer.intention}})
                                    }, 1500);
                                }
                                 
                            }
                        })
                    }
                }
                
            } else {
                // 说明是编辑回访提交请求
                this.$resetAjax({
                    type: 'POST',
                    url: '/NewA/Customer/visitedit',
                    data: {
                        id: this.visit_id,
                        notes: this.notes,
                        time: this.selectDate,
                        visit: this.orderModel,
                        follow_up_time: this.orderDate,
                    },
                    success: (res) =>{
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '修改回访成功';
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                            this.$router.push({path: 'customervisit', query:{isaim: 2, name: this.customer.name, id: this.customer.customer_id,  phone: this.customer.phone, channels: this.customer.channels, has_store: this.customer.status, intention: this.customer.intention}})
                        }, 1500); 
                    }
                })
            }
        }
    }
}
</script>
