<template>
    <div class="customer_store" id="customer_store">
        <!-- 头部 -->
        <div class="top">
            <h3>
                客户姓名:<span>{{customer.name}}</span>
                电话: <span>{{customer.phone}}</span>
                来源: <span>{{customer.channel}}</span>
                门店:<span>{{customer.has_store}}</span>
                意向度: <span>{{customer.intention}}</span>
            </h3>
            <div class="btn">
                <Button type="info" @click="$router.push({path:'customer'})">返回客户列表</Button>
                <Button type="success" class="gostorelist" @click="goStoreList">返回门店列表</Button>
            </div>
        </div>
         <!-- 内容区 -->
        <div class="contanier">
            <Form class="customerstorm_form" ref="storeForm" :model="storeForm" :rules="ruleValidate">
                <FormItem style="margin-right: 0;height: 40px;border:1px solid #ddd;background: #f7f7f7;margin-left: 0;padding-left: 10px;">
                    <h4>{{aimname}}&gt;&gt;</h4>
                </FormItem>
                <FormItem label="门店状态" prop="status" class="masses">
                    <Select v-model="storeForm.status"  @on-change="getStoreStatus(storeForm.status)">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="店面位置" prop="storePosition" class="masses">
                    <Input v-model="storeForm.storePosition" placeholder="请输入店面位置" />
                </FormItem>
                <FormItem label="店面面积(平方米)" prop="measure" class="masses">
                    <Input v-model="storeForm.measure" placeholder="请输入店面面积" />
                </FormItem>
                <FormItem label="店面是否空铺" prop="isEmptyShop" class="masses">
                    <Select v-model="storeForm.isEmptyShop"  @on-change="getIsEmptyShop(storeForm.isEmptyShop)">
                        <Option v-for="item in isEmptyShopList" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="门店情况" prop="storeSituation" class="masses">
                    <Input v-model="storeForm.storeSituation" placeholder="请输入门店情况备注" />
                </FormItem>
                <FormItem label="房租资费方式" prop="payRentTYpe" class="masses">
                    <Input v-model="storeForm.payRentTYpe" placeholder="请输入房租资费方式" />
                </FormItem>
                <FormItem label="消费群体" prop="groups" class="masses">
                    <Select v-model="storeForm.groups"  @on-change="getStoreGroups(storeForm.groups)">
                        <Option v-for="item in groupsList" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="周边有无类似店面" prop="similar" class="masses">
                    <Select v-model="storeForm.similar"  @on-change="getSimilar(storeForm.similar)">
                        <Option v-for="item in similarList" :value="item.value" :key="item.value">{{item.label}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="周边竞品备注" prop="products" class="masses">
                    <Input v-model="storeForm.products" placeholder="请输入周边竞品" />
                </FormItem> 
                <FormItem label="店面相关图片" class="specialItem" style="width: 100%">
                    <div class="uploadImage">
                        <ul class="imgList">
                            <li v-for="(item,index) in imgList" :key="item.path">
                                <img :src="item.path"/>
                                <Icon type="trash-a" title="删除上传图片" @click="deleteImg(item,index)"></Icon>
                                <Input v-model= "item.title" placeholder="请输入图片名称" />
                            </li>
                            <li class="upload" >
                                <input type="file" name="file" id="upstore"/>
                                <Icon type="ios-camera-outline" class="camera"></Icon>
                            </li>
                        </ul>
                    </div>
                </FormItem>
                
                <FormItem style="height: 0">
                    <Button type="primary" long @click="submitModal">提交保存</Button>
                </FormItem>
            </Form>
        </div>
        <!-- 提示框 -->
        <tip v-if="istip" :tipContent="tip"></tip>
         <!-- 提示是否删除 -->
        <div class="outside" v-if="isDelete">
            <div class="delete">
                <p>确认删除原来上传的照片?</p>
                <div class="build">
                    <Icon type="close" @click="isDelete=false"></Icon>
                    <Icon type="checkmark"  @click="getDeleteImg(imgItem,imgIndex)"></Icon>
                </div>
            </div>
        </div>
        <!-- 提示是否删除 -->
        <div class="outsider" v-if="isDeleteEdit">
            <div class="delete">
                <p>确认删除现在上传的照片?</p>
                <div class="build">
                    <Icon type="close" @click="isDeleteEdit=false"></Icon>
                    <Icon type="checkmark"  @click="getDeleteEdit(nowIndex)"></Icon>
                </div>
            </div>
        </div>
    </div>
</template>




<script>
// 引入图片上传js插件
import '@/assets/js/ajaxfileupload'
import tip from '../tip.vue'
import {getUrlParams} from  '@/assets/js/tool.js'

export default {
    components: {
        tip,
    },

    data() {
        return {
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
            // 是新增还是编辑门店文本
            aimname: '',
            // 是否显示提示框
            istip: false,
            // 提示框文本
            tip: '',
            // 刚上传图片的位置
            nowIndex: 1,
            // 确定删除现在上传的照片
            isDeleteEdit: false,
            // 门店上传照片数据 
            imgList: [],
            // 当前点击的这张图片的详情
            imgItem: {},
            // 当前所点击的图片的位置索引
            imgIndex:1,
            // 是否提示删除框
            isDelete: false,
            // 当前编辑的门店的id
            storeid: '',
            // 门店信息
            storeForm: {
                // 门店状态
                status: 1,
                // 店面大小
                measure: '',
                // 门店情况
                storeSituation: '',
                // 店面是否空铺默认选择
                isEmptyShop: 1,
                // 店面位置
                storePosition: '',
                // 房租资费方式
                payRentTYpe: '',
                // 消费群体
                groups:0,
                // 周边有无类似店面
                similar: 1,
                // 周边竞品备注
                products: ''
            },
            // 门店状态数据
            statusList: [
                {
                    value: 1,
                    label: '有'
                },
                {
                    value: 2,
                    label: '有意向店面'
                },
            ],
            // 店铺是否为空铺数据
            isEmptyShopList: [
                {
                    value: 1,
                    label: '是'
                },
                {
                    value: 2,
                    label: '否,近期转让'
                },
                {
                    value: 3,
                    label: '待定'
                }
            ],
            // 消费群体数据
            groupsList:[
                {
                    value: 0,
                    label: '全部'
                },
                {
                    value: 1,
                    label: '少年儿童群体'
                },
                {
                    value: 2,
                    label: '青年、青少年群体'
                },
                {
                    value: 3,
                    label: '中年群体',
                },
                {
                    value: 4,
                    label: '老年消费群体',
                }
            ],
            // 有无类似店面数据
            similarList: [
                {
                    value: 1,
                    label: '有'
                },
                {
                    value: 2,
                    label: '无'
                }
            ],


            // 验证规则
            ruleValidate:{
                storePosition: [
                    { required: true, message: '请输入店面位置', trigger: 'change' },
                ],
                groups: [
                    { required: true, message: '请选择消费群体', trigger: 'change', type: 'number' },
                ],
            },
        }
    },

    created() {
        // 得到网址的参数
        this.getUrlData();
        // 得到渠道来源数据
        this.getSourceList();
        // 得到客户信息
        this.getCustomerInfo();
        // 判断是新增还是编辑门店
        this.isAim();
    },
     mounted () {
        let that = this;
        $('#customer_store').on('change', '#upstore', () => {
            this.fileChange('upstore', 'storeUrl');
        });
    },

    methods: {
        /**
         * 得到网址的参数
         */
        getUrlData:function(){
            this.urlParams = getUrlParams();
            this.customer.id = this.urlParams.id;
            this.customer.name = this.urlParams.name;
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
         * 判断是新增还是编辑门店
         */
        isAim() {
            if (this.urlParams.isaim == 1) {
                this.aimname = '新增店面';
            } else {
                this.aimname = '编辑店面信息';
                this.storeid = this.urlParams.storeid;
                // 请求门店详情
                this.getStoreDetail(this.storeid);
            }
            
        },
        /**
         * 选择文件
         * @param {String} id file的id
         * @param {String} fileUrl 文件上传成功后存的url
         */
        fileChange(id, fileUrl) {
            $.ajaxFileUpload({
                // 上传地址
                url: '/NewA/Dingfutong/getimage',
                // input:file的id
                fileElementId: id,
                // 要求服务器返回什么数据类型
                dataType: 'json',
                // 请求成功后，回调函数
                success:  (data) =>{
                    if (this.aimname == '新增店面') {
                        let path = data.data;
                        let title = '';
                        this.imgList.push({path,title});
                    } else {
                        let path = data.data;
                        let title = '';
                        this.imgList.push({path, title})
                    }
                    
                }
            })
        },
        /**
         * 删除新增客户里面的上传图片
         */
        deleteImg(item,index) {
            if (this.aimname == '新增店面') {
                this.imgList.splice(index,1)
            } else {
                // 如果删除的是已经之前保存店面里的照片，要id
                if (item.id) {
                    // 当前点击的这张图片的详情
                    this.imgItem = item;
                    this.imgIndex = index;
                    this.isDelete = true;
                } else {
                    this.nowIndex = index;
                    this.isDeleteEdit = true;
                }
            }
            
        },
        /**
        * 得到门店状态
         */
         getStoreStatus(status) {
             this.storeForm.status = status;
         },
        /**
         * 得到消费群体
         */
        getStoreGroups(groups) {
            this.storeForm.groups = groups;
        },
        /**
         * 得到有无类似店面
         */
        getSimilar(similar) {
            this.storeForm.similar = similar;
        },
        /**
         * 得到店铺是否为空铺
         */
        getIsEmptyShop(isEmptyShop) {
            this.storeForm.isEmptyShop = isEmptyShop;
        },
        /**
         * 删除已上传保存过店的图片
         */
        getDeleteImg(imgItem,imgIndex) {
            this.$resetAjax({
                url: '/NewA/Customer/del_img',
                type: 'POST',
                data: {
                    id: imgItem.id
                },
                success: (res) => {
                    this.isDelete = false;
                    this.istip = true;
                    this.tip = '删除图片成功';
                    setTimeout(() => {
                        this.istip = false;
                        this.imgList.splice(imgIndex,1)
                    }, 1500);
                }
            })

        },
        /**
         * 删除刚刚上传的图片 
         */
        
        getDeleteEdit(nowIndex) {
            this.imgList.splice(nowIndex,1);
            this.isDeleteEdit = false;
        },
        /**
         * 编辑门店请求
         */
        getStoreDetail(data) {

            this.$resetAjax({
                url: '/NewA/Customer/shopinfo',
                type: 'POST',
                data:{
                    id: this.storeid
                },
                success: (res) => {
                    let shop = JSON.parse(res).data.shop;
                    this.storeForm.measure = shop.store_size;
                    this.storeForm.storeSituation = shop.shop_info;
                    this.storeForm.isEmptyShop = Number(shop.empty);
                    this.storeForm.storePosition = shop.position;
                    this.storeForm.payRentTYpe = shop.rent;
                    this.storeForm.groups = Number(shop.consumer);
                    this.storeForm.similar = Number(shop.similar_stores);
                    this.storeForm.products = shop.compete_info;
                    this.imgList = JSON.parse(res).data.imglist;
                    if(shop.status == '1') {
                        this.storeForm.status = 1;
                    } else {
                        this.storeForm.status = 2;
                    }
                }
            })
        },
        /**
         * 新增店面保存
         */
        submitModal() {
            if (this.aimname == '新增店面') {
                this.$refs.storeForm.validate((valid) => {
                    // 如果验证了
                    if (valid) {
                        let data = {
                            // 客户表id
                            cid: this.customer.id,
                            // 店面位置在哪
                            position: this.storeForm.storePosition,
                            // 消费群体
                            consumer: this.storeForm.groups,
                            // 店面大小
                            store_size: this.storeForm.measure,
                            // 房租交付方式
                            rent: this.storeForm.payRentTYpe,
                            // 周边有无类似店面
                            similar_stores: this.storeForm.similar,
                            // 周边竞品备注
                            compete_info: this.storeForm.products,
                            // 店面是否空铺  1是 2否,近期转让
                            empty: this.storeForm.isEmptyShop,
                            // 图片详情
                            imgList: this.imgList,
                            // 门店特殊备注
                            shop_info: this.storeForm.storeSituation,
                            // 门店状态
                            status: this.storeForm.status
                        };
                        this.$resetAjax({
                            url: '/NewA/Customer/add_shop',
                            type: 'POST',
                            data,
                            success: (res) => {
                                if(JSON.parse(res).errorcode===100){
                                    this.$Modal.info({
                                        title: '提示',
                                        content: '新增门店失败,该客户不属于您,请刷新列表!'
                                    });
                                }else{
                                    this.istip = true;
                                    this.tip = '新增门店成功';
                                    setTimeout(() => {
                                        this.istip = false;
                                        this.$router.push({path: 'customerstorelist', query:{name:this.customer.name, id: this.customer.id}})
                                    }, 2000);
                                }
                                
                            }
                        })
                    } 
                })
            } else {
                this.$refs.storeForm.validate((valid) => {
                    // 如果验证了
                    if (valid) {
                        let data = {
                            // 客户表id
                            id: this.storeid,
                            // 店面位置在哪
                            position: this.storeForm.storePosition,
                            // 消费群体
                            consumer: this.storeForm.groups,
                            // 店面大小
                            store_size: this.storeForm.measure,
                            // 房租交付方式
                            rent: this.storeForm.payRentTYpe,
                            // 周边有无类似店面
                            similar_stores: this.storeForm.similar,
                            // 周边竞品备注
                            compete_info: this.storeForm.products,
                            // 店面是否空铺  1是 2否,近期转让
                            empty: this.storeForm.isEmptyShop,
                            // 图片详情
                            imgList: this.imgList,
                            // 门店特殊备注
                            shop_info: this.storeForm.storeSituation,
                            // 门店状态
                            status: this.storeForm.status
                        };
                        this.$resetAjax({
                            url: '/NewA/Customer/update_shop',
                            type: 'POST',
                            data,
                            success: (res) => {
                                if(JSON.parse(res).errorcode===100){
                                    this.$Modal.info({
                                        title: '提示',
                                        content: '修改门店失败,该客户不属于您,请刷新列表!'
                                    });
                                }else{
                                    this.istip = true;
                                    this.tip = '修改门店成功';
                                    setTimeout(() => {
                                        this.istip = false;
                                        this.$router.push({path: 'customerstorelist', query:{name:this.customer.name, id: this.customer.id}})
                                    }, 2000);
                                }
                                
                            }
                        })
                    } 
                })
            }
            
        },
        
        /**
         * 返回门店列表
         */
        goStoreList() {
            this.$router.push({path: 'customerstorelist', query:{name:this.customer.name, id: this.customer.id}});
        },
        
    }
}
</script>

