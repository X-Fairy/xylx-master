<template>
    <div class="come_visit">
         <div class="contanier">
            <!-- 来访列表 -->
            <div class="visit_content">
                <div class="visit_top">
                    <h3>
                        来访客户姓名:<span>{{customer.name}}</span>
                        电话: <span>{{customer.phone}}</span>
                        来源: <span>{{customer.channel}}</span>
                        门店:<span>{{customer.has_store}}</span>
                        意向度: <span>{{customer.intention}}</span>
                        </h3>
                    <div class="visit_go">
                        <Button type="info" class="add_visit" @click="addVisit()" v-show="show">新增来访</Button>
                        <Button type="warning" @click="$router.push({path: 'customer'})">返回客户列表</Button>
                    </div>
                </div>
                <!-- 来访内容区 -->
                <ul class="visit_list" v-if="isShowList">
                    <Timeline>
                        <TimelineItem v-for="(item) in visitData" :key="item.id">
                            <p class="time">{{changeday(Number(item.time)*1000)}}</p>
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
                <div class="no-comment" v-else>
                    <img src="@/assets/images/icon_comment.png" alt="">
                    <p>智慧如你，不想<a @click="addVisit()"> 记录下客户的故事 </a>咩~</p>
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
            //控制按钮的显示和隐藏
            isShow:true,
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
            // 来源暗号
            channel_num: '',
            // 来访的所有数据
            visitData: [],
            // 渠道来源数据
            sourceList: [],
            // 是否提醒删除
            isDelete: false,
            // 当前这条回访的id
            visit_id: 0,
            show:true,
            // 是否显示来访记录列表
            isShowList: true,

        }
    },

    created() {
        // 得到客户信息
        this.getSourceList();
        // 得到网址的参数
        this.getUrlData();
        // 得到用户信息
        this.getCustomerInfo();
       
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
            if(this.urlParams.isShow == 1){
                this.show = false
            } else{
                this.show = true
            }
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
                    this.sourceList.forEach(ele => {
                        if (ele.cid == result.channel) {
                            this.customer.channel = ele.channels;
                        }
                    })
                    this.customer.has_store = result.has_shop;
                    if (this.customer.has_store == '0') {
                        this.customer.has_store = '无'
                    } else if (this.customer.has_store == '1') {
                        this.customer.has_store = '有'
                    } else {
                        this.customer.has_store = '有意向店面'
                    }
                    this.getCustormerList();
                }
             })
        },
        /**
         * 得到来访列表
         */
        getCustormerList() {
             this.$resetAjax({
                type: 'POST',
                url: '/NewA/Customer/get_visit',
                data: {
                    id: this.customer.custormer_id
                },
                success: (res) =>{
                    this.isShowList = true;
                    this.visitData = JSON.parse(res).data;
                    if (this.visitData.length == 0) {
                        this.isShowList = false;
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '抱歉,来访记录为空!';
                        setTimeout(() => {
                            this.$root.tip.isShow  = false;
                        }, 1500);
                    }
                    
                }
             })
        },
         /**
         * 新增来访
         */
        addVisit() {
            this.$router.push({path: 'comevisitWrite', query:{isadd:1, name: this.customer.name, id: this.customer.custormer_id, phone: this.customer.phone, channels: this.customer.channels, has_store: this.customer.status, intention: this.customer.intention}});
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

