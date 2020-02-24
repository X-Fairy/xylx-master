<template>
<div class="apply" id="applyPage">
        <!-- 资料填写 -->
        <div class="contanier">
            <div class="middle">
                <Form  class="apply-form" ref="applyForm" :model="applyForm" :rules="ruleValidate" :label-width="90">
                    <!-- 门店编码 -->
                    <FormItem label="门店编码" prop="hd_id">
                        <Input v-model="applyForm.hd_id" placeholder="请输入门店编码" />
                    </FormItem>
                    <!-- 门店名称 -->
                    <FormItem label="门店名称" prop="storeName">
                        <Input v-model="applyForm.storeName" placeholder="输入门店名称" />
                    </FormItem>
                     <!-- 连锁商户 -->
                    <FormItem label="连锁商户" prop="chain">
                        <Input v-model="applyForm.chain" placeholder="请输入连锁商户" disabled/>
                    </FormItem>
                    <!-- 门店类型-->
                    <FormItem label="门店类型" prop="storeType">
                        <Select v-model="applyForm.storeType" placeholder="请选择门店类型" @on-change="getShopType(applyForm.storeType)">
                            <Option v-for="item in storeOptions" :value="item.value" :key="item.value">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                     <!-- 上传门店照片 -->
                    <div class="uploadImage">
                        <p class="title">门店照片</p>
                        <div>
                            <div class="upload" id="J_uploadstore">
                                <img id="store" :src="storeUrl" v-if="isShow" />
                                <p class="aboutImage">点击上传门店照片,图片不能少哦</p>
                                <input type="file" name="file" id="upstore"/>
                            </div>
                        </div>
                        <div class="view" v-if="storeUrl" style="display: flex;align-items: center;margin-left: 5px;cursor: pointer;" @click="lookView(storeUrl, '门店照片')">查看大图</div>
                        <div class="model">
                            <p>照片示范：</p>
                            <img src="@/assets/images/storeUrl.jpg" alt="" title="点击查看大图" @click="lookUpImage($event, '门店照片示范')">
                        </div>
                    </div>
                    <!-- 上传收银台照片 -->
                    <div class="uploadImage">
                        <p class="title">收银台照片</p>
                        <div>
                            <div class="upload" id="J_uploadcash">
                                <img id="cash" :src="cashUrl" v-if="isShow"/>
                                <p class="aboutImage">点击上传收银台照片,图片不能少哦</p>
                                <input type="file" name="file" id="upcash"/>
                            </div>
                        </div>
                        <div class="view" v-if="cashUrl"  style="display: flex;align-items: center;margin-left: 5px;cursor: pointer;" @click="lookView(cashUrl, '收银台照片')">查看大图</div>
                        <div class="model">
                            <p>照片示范：</p>
                            <img src="@/assets/images/cash.jpg" alt="" title="点击查看大图" @click="lookUpImage($event,'收银台照片示范')">
                        </div>
                    </div>
                     <!-- 上传TIM照片 -->
                    <div class="uploadImage">
                        <p class="title">工商局网站截图</p>
                        <div>
                            <div class="upload" id="J_uploadtim">
                                <img id="tim" :src="timUrl" v-if="isShow"/>
                                <p class="aboutImage">点击工商局网站截图,截图不能少哦</p>
                                <input type="file" name="file" id="uptim" />
                            </div>
                        </div>
                        <div class="view" v-if="timUrl" style="display: flex;align-items: center;margin-left: 5px;cursor: pointer;" @click="lookView(timUrl,'工商局网站截图')">查看大图</div>
                        <div class="right">
                            <a class="go-gov" href="http://www.gsxt.gov.cn" target="_blank">点击跳转到工商局进行截图</a>
                        </div>
                        <div class="model">
                            <p>截图示范：</p>
                            <img src="@/assets/images/timUrl.jpg" alt="" title="点击查看大图" @click="lookUpImage($event,'工商局网站截图示范')">
                        </div>
                    </div>
                    <!-- 注册号 -->
                    <FormItem label="营业执照号码" prop="registration" class="registration">
                        <Input v-model="applyForm.registration" placeholder="请输入营业执照号码" />
                    </FormItem>
                    <!-- 上传营业执照照片 -->
                    <div class="uploadImage">
                        <p class="title">营业执照照片</p>
                        <div>
                            <div class="upload" id="J_uploadLicense">
                                <img id="showImg" :src="licenseUrl" v-if="isShow"/>
                                <p class="aboutImage">点击上传营业执照照片,图片不能少哦</p>
                                <input type="file" name="file" id="license"/>
                            </div>
                        </div>
                        <div class="view" v-if="licenseUrl"  style="display: flex;align-items: center;margin-left: 5px;cursor: pointer;" @click="lookView(licenseUrl,'营业执照照片')">查看大图</div>
                        <div class="model">
                            <p>照片示范：</p>
                            <img src="@/assets/images/license.jpg" alt="" title="点击查看大图" @click="lookUpImage($event,'营业执照照片示范')">
                        </div>
                    </div>
                    <!-- 业务联络人 -->
                    <FormItem label="联络人" prop="contacts">
                        <Input v-model="applyForm.contacts" placeholder="请输入联系人姓名" />
                    </FormItem>
                     <!-- 业务联络人手机号码 -->
                    <FormItem label="电话号码" prop="phoneNumber">
                        <Input v-model="applyForm.phoneNumber" placeholder="请输入联系人号码" />
                    </FormItem>
                    <!-- 业务联络人邮箱 -->
                    <FormItem label="邮箱" prop="email">
                        <Input v-model="applyForm.email" placeholder="请输入联系人号码" />
                    </FormItem>
                    <!-- 业务联络人证件类型 -->
                    <FormItem label="证件类型" prop="certificates">
                        <Select v-model="applyForm.cardType" placeholder="请选择证件类型" @on-change="getCardType(applyForm.cardType)">
                            <Option v-for="item in certificates" :value="item.value" :key="item.value">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <!-- 证件号码 -->
                    <FormItem label="证件号码" prop="certificateNumber">
                        <Input v-model="applyForm.certificateNumber" placeholder="请输入证件号码" />
                    </FormItem>
                    <!--  上传身份 -->
                    <div class="person">
                        <!-- 上传身份正面照片 -->
                        <div class="uploadImage positive">
                            <p class="title">身份证正面照片</p>
                            <div>
                                <div class="upload" id="J_uploadpositive">
                                    <img id="positiveImage" :src="positiveUrl" v-if="isShow" title="点击查看大图" @click="lookUpImage($event,'身份证正面照片')" />
                                    <p class="aboutImage">点击上传身份证正面照片,图片不能少哦</p>
                                    <input type="file" name="file" id="positive"/>
                                </div>
                            </div>
                        </div>
                        <div class="view" v-if="positiveUrl"  style="display: flex;align-items: center;margin-left: 5px;cursor: pointer;" @click="lookView(positiveUrl,'身份证正面照片')">查看大图</div>
                        <div class="model">
                            <p>照片示范：</p>
                            <img src="@/assets/images/positive.jpg" alt="" title="点击查看大图" @click="lookUpImage($event,'身份证正面照片示范')">
                        </div>
                    </div>
                    <!-- 上传身份反面照片 -->
                    <div class="uploadImage reverse">
                        <p class="title">身份证反面照片</p>
                        <div>
                            <div class="upload" id="J_uploadreverse">
                                <img id="reverseImage" :src="reverseUrl" v-if="isShow"/>
                                <p class="aboutImage">点击上传身份证反面照片,图片不能少哦</p>
                                <input type="file" name="file" id="reverse"/>
                            </div>
                        </div>
                        <div class="view" v-if="reverseUrl" style="display: flex;align-items: center;margin-left: 5px;cursor: pointer;" @click="lookView(reverseUrl,'身份证反面照片')">查看大图</div>
                        <div class="model">
                            <p>照片示范：</p>
                            <img src="@/assets/images/reverse.jpg" alt="" title="点击查看大图" @click="lookUpImage($event,'身份证反面照片示范')">
                        </div>
                    </div>
                    <!-- 银行账户名称 -->
                    <FormItem label="账户名" prop="accountName">
                        <Input v-model="applyForm.accountName" placeholder="请输入银行账户名" />
                    </FormItem>
                    <!-- 账户类型-->
                    <FormItem label="账户类型" prop="accountType">
                        <Select v-model="applyForm.accountType" placeholder="请选择账户类型"  @on-change="getAccountName(applyForm.accountType)">
                            <Option v-for="item in accountTypes" :value="item.value" :key="item.value">{{item.name}}</Option>
                        </Select>
                    </FormItem>
                    <!-- 银行号 -->
                    <FormItem label="银行卡号" prop="银行卡号">
                        <Input v-model="applyForm.bankNumber" placeholder="请输入银行卡号"/>
                    </FormItem>
                    <!-- 上传银行卡照片 -->
                    <div class="uploadImage">
                        <p class="title">银行卡照片</p>
                        <div>
                            <div class="upload" id="J_uploadbankCard">
                                <img id="bankCard" :src="bankcardUrl" v-if="isShow"/>
                                <p class="aboutImage">点击上传银行卡照片,图片不能少哦</p>
                                <input type="file" name="file" id="upbankCard"/>
                            </div>
                        </div>
                        <div class="view" v-if="bankcardUrl"  style="display: flex;align-items: center;margin-left: 5px;cursor: pointer;" @click="lookView(bankcardUrl,'银行卡照片')">查看大图</div>
                        <div class="model">
                            <p>照片示范：</p>
                            <img src="@/assets/images/bankcardUrl.jpg" alt="" title="点击查看大图" @click="lookUpImage($event,'银行卡照片示范')">
                        </div>
                    </div>
                    <!-- 银联号链接 -->
                    <FormItem label="联行号查询" >
                        <a href="http://www.kaihuhang.cn/" target="_blank" class="lyh">点击查询联行号</a>
                    </FormItem>
                    <!-- 银联号 -->
                    <FormItem label="联行号" prop="jointLineNum">
                        <Input v-model="applyForm.jointLineNum" @on-change="jointChange"  placeholder="请输入银联号" />
                    </FormItem>
                     <!-- 开户银行 -->
                    <FormItem label="开户银行" prop="开户银行">
                        <Input v-model="depositBank"  class="bankname"/>
                    </FormItem>
                    <!-- 开户支行 -->
                    <FormItem label="开户支行:" prop="开户支行">
                        <Input v-model="applyForm.suBbranch" placeholder="请输入开户支行"/>
                    </FormItem>
                    <div class="open">
                        <!-- 开户省份 -->
                        <FormItem label="开户省份" prop="开户省份" class="province">
                            <Input v-model="provinceBank" placeholder="请输入开户省份"/>
                            <!-- <Select v-model="provinceBank" placeholder="请选择开户省份" @on-change="getProvinceBank(provinceBank)">
                                <Option v-for="item in province" :value="item.areaid" :key="item.areaid">{{item.areaname}}</Option>
                            </Select> -->
                        </FormItem>
                        <!-- 开户城市 -->
                        <FormItem label="开户城市" prop="开户城市">
                            <Input v-model="cityBank" placeholder="请输入开户城市"/>
                            <!-- 不要选择框，如果要选择框，放开getCityBank() -->
                            <!-- <Select v-model="cityBank" placeholder="请选择开户城市" @on-change="getCityBank(cityBank)">
                                <Option v-for="item in citys" :value="item.areaid" :key="item.areaid">{{item.areaname}}</Option>
                            </Select> -->
                        </FormItem>
                     </div>
                     <!-- 威付通号 -->
                    <FormItem label="威付通号" prop="威付通号"  v-if="isPayShow">
                        <Input v-model="pay_num"  placeholder="请输入威付通号"/>
                    </FormItem>
                    <!-- 威付通号密码 -->
                    <FormItem label="威付通密码" prop="威付通密码"  v-if="isPayShow">
                        <Input v-model="pay_psw"  placeholder="请输入威付通密码"/>
                    </FormItem>
                    <!-- 提交重置 -->
                    <FormItem>
                        <Button type="primary" long @click="submit" class="apply_submit">提交保存</Button>
                    </FormItem>
                </Form>
            </div>
        </div>
        <Modal v-model="isView" :title="viewTitle" @on-ok="isView=false;" @on-cancel="isView=false;" id="view_modal">
            <p><img :src="viewSrc" alt="" style="width:100%;"></p>
        </Modal>
    </div>
</template>

<script>
// 引入图片上传js插件
import '@/assets/js/ajaxfileupload'
import {getUrlParams} from '@/assets/js/tool.js'
export default {
    data() {
        return {
            // 是否显示查看图片
            isView:false,
            viewTitle:'',
            viewSrc: '',
            applytable: false,
            visitpage: false,
            backstage: false,
            // 提示框文本
            tip: '修改成功 !',
            // 用户名字
            userName: '',
            // 用户头像
            userHeader: '',
            // li选中的
            currentIndex: 2,
            // 表单数据
            applyForm: {
                // 门店编码
                hd_id: '',
                // 门店名称
                storeName: '',
                // 门店类型
                storeType: 0,
                // 证件类型
                cardType: 0,
                // 账户类型
                accountType: 0,
                // 业务联系人
                contacts: '',
                // 联络人号码
                phoneNumber: '',
                // 邮箱
                email: '',
                // 证件号码
                certificateNumber: '',
                // 连锁商户
                chain: '熙美',
                // 注册号
                registration: '',
                // 银行账户名
                accountName: '',
                // 银联号
                jointLineNum: '',
                // 开户支行
                suBbranch: '',
                // 银行账号
                bankNumber: '',
            },
            // 开户省份的选中的id
            provinceBank: '',
            // 开户城市的选中的名称
            cityBank:  '',
            // 编辑时选中的省份
            selectedProvince: [],
            // 编辑时选中的城市
            selectedCitys: [],
            // 证件类型
            certificates: [ 
                { value: 1, name: '身份证'},
            ],
            // 门店类型
            storeOptions: [
                { value: 1, name: '加盟'},
            ],
            // 账户类型
            accountTypes: [
                { value: 1, name: '个人'},
            ],
            // 开户银行
             depositBank: "",
            //  开户省份
            province: [],
             //  开户城市
            citys:[],
            // 是否显示
            isShow: false,
            // 是否显示北京城区
            isHidden: true,
            // 营业执照照片
            licenseUrl: '',
            // 门店照片
            storeUrl: '',
            // 身份证正面照片
            positiveUrl:'',
            // 身份证反面照片
            reverseUrl: '',
            // 银行卡照片
            bankcardUrl: '',
            // 收银台照片
            cashUrl: '',
            // 信息证明照片
            timUrl: '',
            // 弹窗提示是否显示
            show: false,
            // 得到选中的省名
            provinceName: '',
            // 得到选中的城市名
            cityName: '',
            // 得到证件名
            cardName: '',
            // 得到门店类型的名称
            shopType: '',
            // 账户类型的名称
            interest_rate: '',
            // 判断是编辑还是增加
            isAdd: '',
            idArr: [],
            // 威付通号
            pay_num: '',
            // 威付通号密码
            pay_psw: '',
            // 是否显示威付通号
            isPayShow: false,
            // 是否编辑数据回填了
            isEidtInp: false,
            // 验证规则
            ruleValidate:{
                hd_id: [
                    { required: true, message: '门店编码不能为空,不能重复', trigger: 'blur' },
                    { type: 'string', min: 5, max:5, message: '门店编码位数为5位数', trigger: 'blur' }
                ],
                provinceBank: [
                    { required: true, message: '开户省份不能为空', trigger: 'blur' }
                ],
                cityBank: [
                    { required: true, message: '开户城市不能为空', trigger: 'blur' }
                ],
                storeName: [
                    { required: true, message: '门店名称不能为空', trigger: 'blur' }
                ],
                contacts: [
                    { required: true, message: '联系人不能为空', trigger: 'blur' }
                ],
                phoneNumber: [
                    { required: true, message: '联络人号码不能为空', trigger: 'blur' },
                ],
                email: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur' },
                ],
                certificateNumber: [
                    { required: true, message: '证件号码不能为空', trigger: 'blur' }
                ],
                chain: [
                    { required: true, message: '连锁商务不能为空', trigger: 'blur' }
                ],
                registration: [
                    { required: true, message: '注册号不能为空', trigger: 'blur' },
                    { type: 'string', min: 18, max: 18, message: '注册号位数为18位数', trigger: 'blur' }
                ],
                accountName:[
                    { required: true, message: '银行账户名不能为空', trigger: 'blur' }
                ],
                jointLineNum: [
                    { required: true, message: '银联号不能为空', trigger: 'blur' },
                    { type: 'string', min: 12, max: 12, message: '银联号位数为12位数', trigger: 'blur' }
                ],
                bankNumber: [
                    { required: true, message: '银行卡号不能为空', trigger: 'blur' }
                ],
                suBbranch: [
                    { required: true, message: '开户支行不能为空', trigger: 'blur' }
                ],
                pay_num: [
                    { required: true, message: '威付通号不能为空', trigger: 'blur' },
                    { type: 'string', min: 12, max: 12, message: '威付通号位数为12位数', trigger: 'blur' }
                ],
                pay_psw: [
                    { required: true, message: '威付通密码不能为空', trigger: 'blur' },
                    { type: 'string', min: 6, max: 20, message: '威付通位数为6到20位数', trigger: 'blur' }
                ]
               
            },
        }
    },

    watch: {
        // 监听省份id变化，当省份id变了，省份名称也要变
        provinceBank(val) {
            this.province.forEach(item => {
                if (item.areaid === val) {
                    this.provinceName = item.areaname;
                }
            })
        },

        // 监听城市id变化，当城市id变了，城市名称也要变
        cityBank(val) {
            this.citys.forEach(item => {
                if (item.areaid === val) {
                    this.cityName = item.areaname;
                }
            })
        }
    },

    created() {
        // 是否编辑数据回填了
        if (this.$route.query.data) {
            this.isEidtInp = true;
        }
        // 获取省份
        this.getProvince(() => {
            // 判断是编辑还是新增
            this.judgeIsAdd();
        });
        console.log(this.$root.applyInfo)
    },

    mounted() {
        $('#view_modal .ivu-btn-primary').text('关闭')
        let that = this;
        /**
         * TIM照片上传
         */
        // 事件委托，防止新生成的file，事件没有绑定上
        $('#applyPage').on('change', '#uptim', () => {
            this.fileChange('uptim', 'timUrl');
        });
        // 收银台上传照片
        $('#applyPage').on('change', '#upcash', () => {
            this.fileChange('upcash', 'cashUrl');
        });
        // 营业执照照片上传
        $('#applyPage').on('change', '#license', () => {
            this.fileChange('license', 'licenseUrl');
        });
        /**
         * 上传门店照片
         */
        $('#applyPage').on('change', '#upstore', () => {
            this.fileChange('upstore', 'storeUrl');
        });
        /**
         * 上传身份正面照片
         */
         $('#applyPage').on('change', '#positive', () => {
            this.fileChange('positive', 'positiveUrl');
        });
        /**
         * 上传身份反面照片
         */
        $('#applyPage').on('change', '#reverse', () => {
            this.fileChange('reverse', 'reverseUrl');
        });
        /**
         * 上传银行卡照片
         */
        $('#applyPage').on('change', '#upbankCard', () => {
            this.fileChange('upbankCard', 'bankcardUrl');
        });
    },

    methods: {
        lookView(src,title) {
            this.viewTitle = title;
            this.isView = true;
            this.viewSrc = src;
        },
        lookUpImage($event,title) {
            this.isView = true;
            this.viewTitle = title;
            this.viewSrc = $event.path[0].currentSrc;
        },
        /**
         *   判断是编辑还是新增
         */
        judgeIsAdd() {
            if (this.$route.query.data) {
                this.isAdd = '编辑';
                this.isPayShow = true;
                let info = JSON.parse(this.$route.query.data);
                this.$root.applyInfo = info;
                this.applyForm.hd_id = info.hd_id;
                this.applyForm.storeName = info.shop_name;
                this.applyForm.chain = info.chain;
                // （string）（注册号）
                this.applyForm.registration = info.registration_number;
                // bank（string）（开户银行）
                this.depositBank = info.bank;
                // interest_rate（string）（账户类型）
                this.accountTypes =  [
                    { value:0, name: '个人'},
                ],
                this.interest_rate = this.accountTypes[0].name;
                // sub_branch（string）（支行）
                this.applyForm.suBbranch = info.sub_branch;
                // payment_lines（string）（联行号）
                this.applyForm.jointLineNum = info.payment_lines;
                this.jointChange();
                // id_type（string）（证件类型）
                // 证件类型
                this.certificates = [ 
                    { value: 0, name: '身份证'},
                ],
                this.getCardType();
                // 门店类型
                this.storeOptions =  [
                    { value: 0, name: '加盟'},
                ],
                this.getShopType();
                // id_num（string）（证件号）
                this.applyForm.certificateNumber = info.id_num;
                // phone_num（string）（手机号码）
                this.applyForm.phoneNumber = info.phone_num;
                // contact（string）（联系人）
                this.applyForm.contacts = info.contact;
                // 威付通号
                this.pay_num = info.pay_num;
                // 威付通密码
                this.pay_psw = info.pay_psw;
                // mailbox（string）（业务联络人邮箱）
                this.applyForm.email = info.mailbox;
                // img_front（image）（身份证正面照）
                this.positiveUrl = info.img_front;
                this.isShow = true;
                // img_contrary（image）（身份证反面照）
                this.reverseUrl = info.img_contrary;
                // img_bankcard（image）（银行卡）
                this.bankcardUrl = info.img_bankcard;
                // img_business_license（image）（营业执照）
                this.licenseUrl = info.img_business_license;
                // img_credit（image）（信用证明）
                this.timUrl = info.img_credit;
                // img_checkstand（image）（收银台）
                this.cashUrl = info.img_checkstand;
                // img_gate（image）（门头照）
                this.storeUrl = info.img_gate;
                // bank_num（string）（银行卡号）
                this.applyForm.bankNumber = info.bank_num;
                // account_name（string）（账户名）
                this.applyForm.accountName = info.account_name;
            }  else {
                this.isAdd = '新增';
            }
            
            
        },
        /**
         * 跳转到门店管理 
         */
        storeManage() {
            this.$router.push({path: 'visit'})
        },
        /**
        * 跳转到鼎付通列表
        */
       godftList() {
           this.currentIndex = 1;
           this.$router.push({path: 'applytable'});
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
                    this.isShow = true;
                    this[fileUrl] = data.data;
                }
            })
        },
        /**
         *  获取省份
         */
        getProvince(callback) {
            this.$resetAjax({
                url: '/NewA/Public/getprovinces',
                type: 'POST',
                async: false,
                success: (res) => {
                    this.province = JSON.parse(res).data;
                    // this.provinceBank = JSON.parse(res).data[0].areaid;
                    
                    this.getCitys(1); 
                },
                complete() {
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            })
        },
        /**
         * 当省份变化的时候，省份的id也变化，通过省份的id得到省份下城市下的数据
         */
        getProvinceBank() {
           // 得到省名this.provinceName[0].areaname
            this.provinceName = this.province.filter(ele => {
                return ele.areaid == this.provinceBank;
            });
            this.provinceName = this.provinceName[0].areaname;
            // 得到选中的省份独有的id this.provinceBank
            this.getCitys(this.provinceBank); 
        },
        /**
         *  获取城市
         */
        getCitys(areaId) {
            this.$resetAjax({
                url: '/NewA/Public/getcity',
                type: 'POST',
                async: false,
                data: {
                    areaId:areaId,
                },
                success: (res) => {
                   
                    this.citys = JSON.parse(res).data;
                    this.isHidden = false;
                    // 如果是编辑数据回填，则不需要改变城市数据
                    if (this.isEidtInp) {
                        // 重置成false，防止下次进来，还是编辑数据回填状态
                        this.isEidtInp = false;
                    } else {
                        // 获取到城市，说明需要把城市重置为第一个
                        // this.cityBank = JSON.parse(res).data[0].areaid;
                        this.cityName = JSON.parse(res).data[0].areaname;
                    }
                }
            })
        },
        /**
         *  获取银联号
         * */
        jointChange() {
            this.$resetAjax({
                url:  '/NewA/Public/getbank',
                type: 'POST',
                data: {
                    bankno: this.applyForm.jointLineNum
                },
                success:(res) => {
                    this.applyForm.suBbranch = JSON.parse(res).data.branch_bank;
                    this.depositBank = JSON.parse(res).data.head_bank;
                    this.provinceBank = JSON.parse(res).data.province;
                    this.cityBank = JSON.parse(res).data.city;
                },
            })
        },
        /**
         * 得到证件名称
         */
        getCardType() {
            this.cardName = this.certificates.filter(ele => {
                return ele.value == this.applyForm.cardType;
            })
            this.cardName = this.cardName[0].name;
        },
        /**
         * 得到门店类型
         */
        getShopType() {
            this.shopType = this.storeOptions.filter(ele => {
                return ele.value == this.applyForm.storeType;
            });
            this.shopType = this.shopType[0].name;
        },
        /**
         * 获取账户类型
         */
        getAccountName() {
            this.interest_rate = this.accountTypes.filter(ele => {
                return ele.value == this.applyForm.accountType;
            })
            this.interest_rate = this.interest_rate[0].name;
        },
        /**
         * 提交
         */
        submit() {
             this.$refs.applyForm.validate((valid) => {
                if (valid) {
                    let data = {
                        // 门店编码
                        hd_id: this.applyForm.hd_id,
                        // 店铺名称
                        shop_name: this.applyForm.storeName,
                        // 连锁商户 
                        chain: this.applyForm.chain,
                        // （string）（注册号）
                        registration_number: this.applyForm.registration,
                        // bank（string）（开户银行）
                        bank: this.depositBank,
                        // interest_rate（string）（账户类型）
                        interest_rate: this.interest_rate,
                        // bank_num（string）（银行卡号）
                        bank_num: this.applyForm.bankNumber,
                        // account_name（string）（账户名）
                        account_name: this.applyForm.accountName,
                        // province（string）（省份）
                        province: this.provinceBank,
                        // city（string）（城市）
                        city: this.cityBank,
                        // sub_branch（string）（支行）
                        sub_branch: this.applyForm.suBbranch,
                        // payment_lines（string）（联行号）
                        payment_lines: this.applyForm.jointLineNum,
                        // id_type（string）（证件类型）
                        id_type: this.cardName,
                        // id_num（string）（证件号）
                        id_num: this.applyForm.certificateNumber,
                        // phone_num（string）（手机号码）
                        phone_num: this.applyForm.phoneNumber,
                        // contact（string）（联系人）
                        contact: this.applyForm.contacts,
                        // mailbox（string）（业务联络人邮箱）
                        mailbox: this.applyForm.email,
                        // img_front（image）（身份证正面照）
                        img_front: this.positiveUrl,
                        // img_contrary（image）（身份证反面照）
                        img_contrary: this.reverseUrl,
                        // img_bankcard（image）（银行卡）
                        img_bankcard: this.bankcardUrl,
                        // img_business_license（image）（营业执照）
                        img_business_license: this.licenseUrl,
                        // img_credit（image）（信用证明）
                        img_credit: this.timUrl,
                        // img_checkstand（image）（收银台）
                        img_checkstand: this.cashUrl,
                        // img_gate（image）（门头照）
                        img_gate: this.storeUrl
                    };
                    if (this.isAdd == "新增") {
                        this.$resetAjax({
                                type: 'POST',
                                url: '/NewA/Dingfutong/upload',
                                data,
                                success:(res) => {
                                    if (res.errorcode == '3') {
                                        this.$Message.error({
                                            content: '很抱歉，图片未上传',
                                            duration: 3
                                        });
                                    } else if (res.errorcode == '2') {
                                        this.$Message.error({
                                            content: '很抱歉，门店编码重复',
                                            duration: 3
                                        });
                                    } else if (res.errorcode == '0') {
                                        this.$Message.success({
                                            content: '新增成功',
                                            duration: 3
                                        });
                                        setTimeout(() => {
                                            this.$router.push({path: 'applytable'})
                                        }, 3000);
                                    }
                                    
                                }
                            })
                        }
                    else {
                        let data = {
                                // 门店编码
                                "hd_id": this.applyForm.hd_id,
                                // 店铺名称
                                "shop_name": this.applyForm.storeName,
                                // 连锁商户 
                                "chain": this.applyForm.chain,
                                // （string）（注册号）
                                "registration_number": this.applyForm.registration,
                                // bank（string）（开户银行）
                                "bank": this.depositBank,
                                // interest_rate（string）（账户类型）
                                "interest_rate": this.interest_rate,
                                // bank_num（string）（银行卡号）
                                "bank_num": this.applyForm.bankNumber,
                                // account_name（string）（账户名）
                                "account_name": this.applyForm.accountName,
                                // province（string）（省份）
                                "province": this.provinceBank,
                                // city（string）（城市）
                                "city": this.cityBank,
                                // sub_branch（string）（支行）
                                "sub_branch": this.applyForm.suBbranch,
                                // payment_lines（string）（联行号）
                                "payment_lines": this.applyForm.jointLineNum,
                                // id_type（string）（证件类型）
                                "id_type": this.cardName,
                                // id_num（string）（证件号）
                                "id_num": this.applyForm.certificateNumber,
                                // phone_num（string）（手机号码）
                                "phone_num": this.applyForm.phoneNumber,
                                // contact（string）（联系人）
                                "contact": this.applyForm.contacts,
                                // mailbox（string）（业务联络人邮箱）
                                "mailbox": this.applyForm.email,
                                // img_front（image）（身份证正面照）
                                "img_front": this.positiveUrl,
                                // img_contrary（image）（身份证反面照）
                                "img_contrary": this.reverseUrl,
                                // img_bankcard（image）（银行卡）
                                "img_bankcard": this.bankcardUrl,
                                // img_business_license（image）（营业执照）
                                "img_business_license": this.licenseUrl,
                                // img_credit（image）（信用证明）
                                "img_credit": this.timUrl,
                                // img_checkstand（image）（收银台）
                                "img_checkstand": this.cashUrl,
                                // img_gate（image）（门头照）
                                "img_gate": this.storeUrl,
                                // 威付通号
                                'pay_num': this.pay_num,
                                // 威付通密码
                                'pay_psw': this.pay_psw,
                        };
                        this.$resetAjax({
                            type: 'POST',
                            url:  '/NewA/Dingfutong/update',
                            data: {
                                data,
                                id:JSON.parse(this.$route.query.data).id
                                // id:this.$route.query.data.id,
                            },
                            success: (res) => {
                                if (res.errorcode == '3') {
                                    this.$Message.error({
                                        content: '很抱歉，图片未上传',
                                        duration: 3
                                    });
                                } else if (res.errorcode == '2') {
                                    this.$Message.error({
                                        content: '门店编码重复',
                                        duration: 3
                                    });
                                } else if (res.errorcode == '0') {
                                    this.$Message.success({
                                        content: '编辑成功',
                                        duration: 3
                                    });
                                    setTimeout(() => {
                                        this.$router.push({path: 'applytable'})
                                    }, 1000);
                                }
                            }
                        })
                    }
                }
             })
            
        }
    }
}


</script>
