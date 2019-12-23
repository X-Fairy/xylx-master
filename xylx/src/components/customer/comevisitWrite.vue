<template>
    <div class="come_visitWrite">
        <div class="write">
            <div class="submit">
                <!-- <div class="left">
                     <p class="selectepart">请选择来访时间:</p>
                    <Row>
                        <DatePicker type="date" placeholder="Select date" :value="selectDate" style="width: 200px" @on-change="getTime" format="yyyy-MM-dd"></DatePicker>
                    </Row> 
                </div> -->
                <div class="right">
                    <Button type="success" @click="$router.push({path: 'customer'})">返回客户列表</Button>
                    <Button type="warning" @click="goVisitList()">返回来访列表</Button>
                    <Button type="info" @click.once="publishQuery " style="margin:0 20px;">发布</Button>
                </div>
            </div>
            <div class="area">
                <Input v-model="notes" type="textarea" placeholder="请输入来访内容" />
            </div>
        </div>
    </div>
</template>


<script>
import tipModal from '../tip.vue'
import {getUrlParams} from  '@/assets/js/tool.js'
export default {
    components:{
        tipModal
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
            // 选中的时间
            selectDate: '',
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
            if ( this.urlParams.intention == 'A') {
                this.customer.intention = 'A(对我们品牌有直接兴趣的客户)'
            } else if ( this.urlParams.intention == 'B') {
                this.customer.intention = 'B(对我们行业有直接兴趣的客户)'
            }  else if ( this.urlParams.intention == 'C') {
                this.customer.intention =  'C(对投资开店有直接兴趣的客户)'
            } else if (this.urlParams.intention == 'D'){
                this.customer.intention = 'D(无效客户)'
            } else {
                this.customer.intention = '待定:未接，不接，暂时无法联系上的，拒接小于三次的'
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
                }
             })
        },
        /**
         * 判断是编辑还是新增
         */
        isAdd() {
            let isadd =  this.urlParams.isadd;
            if (isadd == 2) {
                // 说明是编辑来访记录
                this.isadd = '编辑来访';
                this.visit_id =   this.urlParams.id;
                this.customer.customer_id = this.urlParams.cid;
                // 得到来访详情
                this.getVisitDetail();
            } else {
                // 说明是增加来访记录
                this.isadd = '增加来访';
                this.customer.customer_id = this.urlParams.id;
                
            }
        },
        /**
         * 得到选择的时间
         */
        getTime(date) {
            this.selectDate = date;
        },
        /**
         * 编辑时得到来访详情
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
         * 返回来访列表
         */
        goVisitList() {
            this.$router.push({path: 'comeVisit', query:{isaim: 2, name: this.customer.name, id: this.customer.custormer_id, phone: this.customer.phone, channels: this.customer.channels, has_store: this.customer.status, intention: this.customer.intention}})
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
            if (this.isadd == '增加来访') {
                // 说明是增加来访发布请求
                this.$resetAjax({
                    type: 'POST',
                    url: '/NewA/Customer/add_visit',
                    data: {
                        id: this.customer.customer_id,
                        notes: this.notes,
                    },
                    success: (res) =>{
                        if(JSON.parse(res).errorcode===100){
                            this.$Modal.info({
                                title: '提示',
                                content: '新增回访失败,该客户不属于您,请刷新列表!'
                            });
                        }else{
                            this.$root.tip.isShow = true;
                            this.$root.tip.content = '增加来访成功!';
                            setTimeout(() => {
                                this.$root.tip.isShow = false;
                                this.$router.push({path: 'comeVisit', query:{isaim: 2, name: this.customer.name, id: this.customer.customer_id,  phone: this.customer.phone, channels: this.customer.channels, has_store: this.customer.status, intention: this.customer.intention}})
                            }, 1500); 
                        }
                        
                    }
                })
            } else {
                // // 来访时间不能大于今日
                // if (new Date(this.date1).getTime() > new Date().getTime()) {
                //     this.istip = true;
                //     this.tip = "修改来访时间不能大于今日";
                //     setTimeout(() => {
                //         this.istip = false;
                //     }, 2000);
                // } else {
                //     // 说明是编辑来访提交请求
                //     this.$resetAjax({
                //         type: 'POST',
                //         url: '/NewA/Customer/visitedit',
                //         data: {
                //             id: this.visit_id,
                //             notes: this.notes,
                //             time: this.selectDate
                //         },
                //         success: (res) =>{
                //             this.istip = true;
                //             this.tip = '修改来访成功';
                //             setTimeout(() => {
                //                 this.istip = false;
                //                 this.$router.push({path: 'customervisit', query:{isaim: 2, name: this.customer.name, id: this.customer.id}})
                //             }, 1500); 
                //         }
                //     })
                // }
            }
        }
    }
}
</script>
