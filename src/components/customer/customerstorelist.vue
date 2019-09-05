<template>
    <div class="customerstorelist">
        <!-- 头部 -->
        <div class="top">
            <h3>
                客户姓名: <span> {{customer.name}}</span>
                电话: <span>{{customer.phone}}</span>
                来源: <span>{{customer.channel}}</span>
                门店:<span>{{customer.has_store}}</span>
                意向度: <span>{{customer.intention}}</span>
            </h3>
            <div class="right" style="margin-top: -10px;">
                <Button type="primary" @click="addStore" class="addstore" v-show="show">新增门店</Button>
                <button @click="$router.push({path:'customer'})" class="back">返回客户列表</button>
            </div>
        </div>  
         <!-- 内容区 -->
        <div class="contanier">
            <Table border ref="selection" :columns="columns" :data="tableData"></Table>
        </div>
        <!-- 走马灯 -->
        <div class="carouselcontent" v-if="carouse">
             <Icon type="ios-close-outline" class="close_icon" title="关闭弹窗" @click="carouse=false;"></Icon>
            <Carousel v-model="value1">
                <CarouselItem v-for="item in rowImage" :key="item.id">
                    <div class="demo-carousel"><img :src="item.path" alt="">123</div>
                    <p>照片名称:<span>{{item.title}}</span></p>
                </CarouselItem>
            </Carousel>
        </div>
        <!-- 提示是否删除 -->
        <div class="outside" v-if="isDelete">
            <div class="delete">
                <p>确认删除</p>
                <div class="build">
                    <button type="close" @click="isDelete=false">取消</button>
                    <button type="checkmark"  @click="getDeleteCustomer(rowData)">确定</button>
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
            //控制新增按钮的显示和隐藏
            show: true,
            // 得到网址的参数对象
            urlParams: {},
            // 客户信息
            customer: {
                name: '',
                id: '',
                phone: '',
                // 渠道来源
                channel: '',
                // 是否有门店
                has_store: '',
                // 意向度
                intention: '',
            },
            // 是否显示删除框
            isDelete:false,
            // 渠道来源数据
            sourceList: [],
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
            // 门店数据
            tableData: [],
            // 当前删除行门店信息
            rowData: {},
            // 得到当前行门店的所有照片
            rowImage: [],
            // 表头
            columns: [
                {
                    title: '门店状态',
                    key: 'status'
                },
                {
                    title: '是否为空铺',
                    key: 'empty'
                },
                {
                    title: '门店编码',
                    key: 'id'
                },
                {
                    title: '店面大小',
                    key: 'store_size'
                },
                {
                    title: '店面位置',
                    key: 'position',
                },
                {
                    title: '房租交付方式',
                    key: 'rent'
                },
                {
                    title: '有无类似店面',
                    key: 'similar_stores'
                },
                 {
                    title: '周边竞品备注',
                    key: 'compete_info'
                },
                {
                    title: '消费群体',
                    key: 'consumer'
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 260,
                    align: 'center',
                    render: (h, params) => {/*修改*/
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type:'eye',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '10px',
                                    cursor: 'pointer'
                                },
                                domProps:{
                                    title:'查看图片'
                                },
                                on: {
                                    click: () => {
                                        // 得到门店照片
                                       this.getLookImage(params.row);
                                    }
                                }
                            }, '查看照片'),
                            h('Icon', {
                                props: {
                                    type: 'edit',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '10px',
                                    cursor: 'pointer',
                                    display:(this.show == false)?"none":"inline-block",
                                },
                                domProps:{
                                    title:'编辑',
                                },
                                on: {
                                    click: () => {
                                        // 编辑门店
                                        // window.open(`http://oa.xmvogue.com/index.php/NewA/Index/main#/customerstore?isaim=2&name=${this.customer.name}&id=${this.customer.id}&storeid=${params.row.id}`,'_blank')
                                        this.$router.push({path: 'customerstore', query:{isaim: 2, name: this.customer.name, id:this.customer.id, storeid:params.row.id}})
                                    }
                                }
                            }, '编辑'),
                            h('Icon', {
                                props: {
                                    type: 'ios-trash-outline',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '10px',
                                    cursor: 'pointer',
                                    display:(this.show==false)?"none":"inline-block",
                                },
                                domProps:{
                                    title:'删除'
                                },
                                on: {
                                    click: () => {
                                        // 删除门店
                                        this.isDelete = true;
                                        this.rowData = params;
                                    }
                                }
                            }, '删除'),
                           
                        ]);
                    }
                }
            ],
            // 是否显示走马灯
            carouse: false,
            // 走马灯
            value1: 0,
        }
    },


    created() {
        // 得到网址的参数
        this.getUrlData();
        // 得到渠道来源数据
        this.getSourceList();
        // 得到客户信息
        this.getCustomerInfo();
        // 得到当前客户的所有门店
        this.getStoreList();
        
        
    },
    methods: {
        /**
         * 得到网址的参数
         */
        getUrlData() {
            this.urlParams = getUrlParams();
            if(this.urlParams.isShow == 1){
                this.show = false
            }else{
                this.show = true
            }
            this.customer.id = this.urlParams.id;
            this.customer.name = this.urlParams.name;
        },
        /**
         * 得到当前客户的所有门店
         */
        getStoreList() {
            this.$resetAjax({
                url: '/NewA/Customer/shop_list',
                type: 'POST',
                data: {
                    id: this.customer.id,
                },
                success: (res) => {
                    this.tableData = JSON.parse(res).data;
                    this.tableData.forEach(ele => {
                        // 有无店面
                        if (ele.status == '1' ) {
                            ele.status = '有';
                        } else {
                            ele.status = '有意向店面';
                        }
                        // 是否为空铺
                        if (ele.empty == '1' ) {
                            ele.empty = '是空铺';
                        } else if (ele.empty == '2' ){
                            ele.empty = '否,近期转让';
                        } else {
                             ele.empty = '待定';
                        }
                        // 有无类似店面
                        if (ele.similar_stores == '1' ) {
                            ele.similar_stores = '有类似店铺';
                        } else {
                            ele.similar_stores = '无类似店铺';
                        }
                        // 消费群体
                        if (ele.consumer == '1' ) {
                            ele.consumer = '少年儿童群体';
                        } else if (ele.consumer == '2') {
                            ele.consumer = '青年、青少年群体';
                        } else if (ele.consumer == '3') {
                            ele.consumer = '中年群体';
                        } else if (ele.consumer == '4'){
                            ele.consumer = '老年消费群体';
                        }  else {
                            ele.consumer = '各个年龄阶段的人';
                        }
                    })
                }
            })
        },
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
         * 得到客户信息
         */
        getCustomerInfo() {
             this.$resetAjax({
                url: '/NewA/Customer/getinfo',
                type: 'POST',
                data:{
                    id: this.customer.id
                },
                success:(res) => {
                    let result = JSON.parse(res).data;
                    this.customer.name = result.username;
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
                    this.customer.intention = result.intention;
                    this.intentionalityList.forEach(ele => {
                        if (ele.value == this.customer.intention) {
                           this.customer.intention = ele.label
                        }
                    })
                }
             })
        },
        /**
         * 新增门店
         */
        addStore() {
            // window.open(`http://oa.xmvogue.com/index.php/NewA/Index/main#/customerstore?isaim=1&name=${this.customer.name}&id=${this.customer.id}`,'_blank')
            this.$router.push({path: 'customerstore', query:{isaim: 1, name: this.customer.name, id: this.customer.id}})
        },
        /**
         * 得到门店照片
         */
        getLookImage(data) {
            this.$resetAjax({
                url: '/NewA/Customer/get_shop_img',
                type: 'POST',
                data: {
                    id:data.id,
                },
                success:(res) => {
                    if (JSON.parse(res).data.length !== 0) {
                        // 如果图片存在在的话
                        this.rowImage = JSON.parse(res).data;
                        this.carouse = true;
                    } else {
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '抱歉,该门店没有相关照片!';
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                        }, 1500);
                    }
                    
                }
            })
        },
        /**
         * 删除门店
         */
        getDeleteCustomer(data) {
            this.$resetAjax({
                url: '/NewA/Customer/delete_shop',
                type: 'POST',
                data: {
                    id:data.row.id,
                },
                success:(res) => {
                    this.isDelete = false;
                    if(JSON.parse(res).errorcode===100){
                        this.$Modal.info({
                            title: '提示',
                            content: '删除门店失败,该客户不属于您,请刷新列表!'
                        });
                    }else{
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '删除成功';
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                            this.getStoreList();
                        }, 1500);
                    }
                    
                }
            })
        }
    }
}
</script>

