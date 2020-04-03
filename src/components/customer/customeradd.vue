<template>
    <div class="customeradd" id="customeradd">
        <!-- 头部 -->
            <div class="header">
                <h3>{{customer_title}}&gt;&gt;</h3>
                <Button type="warning" @click="$router.push({path:'customer'})">返回客户列表</Button>
            </div>
            <div class="aim">
                <p>客户意向: <span>{{intentiona}}</span></p>
            </div>
        <!-- 内容区 -->
        <div class="contanier">
           <Form class="customer_form" ref="inputForm" :model="inputForm" :rules="ruleValidate">
               <div>
                    <FormItem label="客户姓名" prop="inputName">
                        <Input v-model="inputForm.inputName" placeholder="请输入客户姓名"/>
                    </FormItem>
                    <FormItem label="电话号码" prop="inputPhone" class="addnum">
                        <ul>
                            <li v-for="(val,index) in inputForm.inputPhone" :key="index" style="position:relative">
                                <Input :disabled="val.disabled" v-model="val.tel"  @on-blur="blurInput" placeholder="请输入客户电话号码"/>
                                <Button v-if="inputForm.inputPhone.length>1 && index === (inputForm.inputPhone.length - 1)"  type="error" class="error" shape="circle"  icon="ios-minus-outline" title="清除电话号码" @click="deletephoneNum" style="background:rgb(194, 189, 189);width: 25px;height: 25px;padding: 0;font-size: 16px;border-radius: 50%;position: absolute;right: -5px;top: -10px;"></Button>
                                <Button v-if="index === (inputForm.inputPhone.length - 1)" type="error" shape="circle" class="error" icon="ios-plus-outline" title="添加电话号码" @click="addIphoneNum" style="width: 25px;height: 25px;padding: 0;font-size: 16px;border-radius: 50%;position: absolute;right: -5px;top: 19px;"></Button>
                            </li>
                        </ul>
                    </FormItem>
                    <FormItem label="渠道来源" prop="inputSource" class="choose">
                        <Select v-model="inputForm.inputSource"  @on-change="getInputSource(inputForm.inputSource)">
                            <Option v-for="item in sourceList" :value="item.cid" :key="item.cid">{{item.channels}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="客户意向度" prop="intentionality">
                        <Select v-model="inputForm.intentionality"  @on-change="getIntentionality(inputForm.intentionality)">
                            <Option v-for="item in intentionalityList" :value="item.value" :key="item.value">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="开店省份" prop="openProvice" class="pro"> 
                        <Select v-model="inputForm.openProvice"  @on-change="getOpenProvice(inputForm.openProvice)" filterable clearable>
                            <!-- <Option value="" key="">待定</Option> -->
                            <Option v-for="item in openProviceList" :value="item.areaid" :key="item.areaid">{{item.areaname}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="开店城市" prop="openCity">
                        <Select v-model="inputForm.openCity"  @on-change="getOpenCity(inputForm.openCity)" filterable clearable>
                            <Option v-for="item in openCityList" :value="item.areaid" :key="item.areaid">{{item.areaname}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="详细地址" prop="address">
                        <Input v-model="inputForm.address" placeholder="请输入客户的详细地址"/>
                    </FormItem>
                    <FormItem label="目前状态" prop="personalState">
                        <Select v-model="inputForm.personalState"  @on-change="getpersonalState(inputForm.personalState)">
                            <Option v-for="item in personalStateList" :value="item.value" :key="item.value">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="是否有门店" prop="haveStore" v-if="customer_title==='编辑客户'">
                            <Input disabled v-model="inputForm.haveStore"/>
                        </FormItem>
                        <FormItem label="渠道备注" prop="sourceMemo">
                                <Input v-model="inputForm.sourceMemo" placeholder="请输入渠道备注"/>
                            </FormItem>
               </div>
                <div>
                    <FormItem label="投资预算(万)" prop="budget">
                        <Input v-model="inputForm.budget" placeholder="请输入投资预算"/>
                    </FormItem>
                    <FormItem label="是否看过我们店面" prop="hasLook">
                        <Select v-model="inputForm.hasLook"  @on-change="getHasLook(inputForm.hasLook)">
                            <Option v-for="item in hasLookList" :value="item.value" :key="item.value">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="看过哪些别的品牌" prop="otherBrand">
                        <Input v-model="inputForm.otherBrand" placeholder="请输入内容"/>
                    </FormItem>  
                    <FormItem label="客户编码" prop="inputUserid" v-show="customer_title==='编辑客户'" >
                        <Input v-model="inputForm.inputUserid" placeholder="" readonly/>
                    </FormItem>
                    <FormItem label="有无开店经验" prop="hasExperience">
                        <Select v-model="inputForm.hasExperience"  @on-change="getHasExperience(inputForm.hasExperience)">
                            <Option v-for="item in hasExperienceList" :value="item.value" :key="item.value">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="是否要再次跟进" prop="isFollow" v-show="customer_title == '新增客户'">
                        <Select v-model="inputForm.isFollow"  @on-change="getIsFollow(inputForm.isFollow)">
                            <Option v-for="item in isFollowList" :value="item.value" :key="item.value">{{item.label}}</Option>
                        </Select>
                    </FormItem>
                    
                        <FormItem label="设置跟进提醒时间" prop="followTime" v-show="customer_title == '新增客户'&& inputForm.isFollow == 1">
                        <DatePicker type="date" :options="options3" placeholder="设置跟进提醒时间" v-model="inputForm.followTime" @on-change="getFollowTime(inputForm.followTime)"></DatePicker>
                    </FormItem>
                        
                    <FormItem label="准备给谁开" prop="whom">
                        <Input v-model="inputForm.whom" placeholder="请输入内容"/>
                    </FormItem>
                    
                        
                    
                    <FormItem label="考虑行业" prop="industry">
                        <Input v-model="inputForm.industry" placeholder="请输入有意向的行业"/>
                    </FormItem>
                    
                    
                        <FormItem label="期望开店时间"  prop="expectOpen">
                        <DatePicker type="date" :options="options4"  placeholder="选择期望开店时间" v-model="inputForm.expectOpen" @on-change="getExpectOpen(inputForm.expectOpen)"></DatePicker>
                    </FormItem>
                    <FormItem label="特殊情况">
                        <Input v-model="inputForm.specialMemo" placeholder="请输入特殊情况备注"/>
                    </FormItem>
                    <FormItem v-if="issave" style="width:100%;margin-left: -25%;">
                            <Button type="primary" long @click="submitModal">保存</Button>
                        </FormItem>
                </div>
                
                
            </Form>
        </div>
        
    </div>
</template>

<script>

import tipModal from '../tip.vue'

export default {
    components: {
        tipModal,
    },
    data() {
        // 检查省份
        const checkProvice = (rule, value, callback) => {
            if (value === '') {
                    
            }else{
               
                if (typeof(value)=='undefined') {
                    callback(new Error('该省份不存在，请重新选择'));
                }
                callback();
            }
            
        }
        
        return {
            // 是否显示可以编辑电话
            
            isInput: true,
            // 显示这个页面是什么功能
            customer_title: '新增客户信息',
            // 是否显示保存功能
            issave: true,
            // 电话号码数组
            phoneNumArr: [],
            // 编辑的时候是否显示新增号码功能
            isaddnum: false,
            // 编辑时当前客户的id
            customer_id: '',
            // 客户信息对象
            objCustomer: {},
            // 客户录入信息
            inputForm: {
                // 客户姓名
                inputName: '',
                // 客户id
                inputUserid: '',
                // 客户电话号码
                inputPhone: [{tel:'', disabled: false}],
                // 客户渠道来源
                inputSource: '',
                // 渠道备注
                sourceMemo: '',
                // 特殊情况备注
                specialMemo: '',
                // 开店省份
                openProvice: '',
                // 开店城市
                openCity: '',
                // 是否有开店
                haveStore: '',
                // 考虑哪些行业
                industry: '',
                // 还看过哪些品牌
                otherBrand: '',
                // 准备给谁开
                whom: '',
                // 是否有开店经验
                hasExperience: '',
                // 目前状态
                personalState: '',
                // 有没有了解我们店面
                hasLook: '',
                // 期望开店时间
                expectOpen: '',
                // 投资预算
                budget: '',
                // 客户意向度
                intentionality: '',
                // 是否要跟进
                isFollow: 2,
                // 跟进时间
                followTime: '',
                // 客户的详细地址
                address: '',
               
            },
             // 对时间进行限制,选择大于今天的时间
            options4: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now();
                }
            },
             // 对时间进行限制,选择大于今天的时间
            options3: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now();
                }
            },
            //  客户意向度名称
            intentiona: '',
            // 开店省份数据
            openProviceList: [],
            // 开店城市数据
            openCityList: [],
            // 渠道来源数据
            sourceList: [],
            // 是否有开店经验
            hasExperienceList: [
                {
                    value: 1,
                    label: '有'
                },
                {
                    value: 2, 
                    label: '无'
                },
                {
                    value: 3,
                    label: '待定'
                }
            ],
            // 目前状态数据
            personalStateList: [
                {
                    value: 1,
                    label: '在职',
                },
                {
                    value: 2,
                    label: '待业',
                },
                {
                    value: 3,
                    label: '开店中',
                },
                {
                    value: 4,
                    label: '待定',
                },
            ],
            // 有没有了解我们店面数据
            hasLookList: [
                {
                    value: 1,
                    label: '有了解'
                },
                {
                    value: 2,
                    label: '未曾了解'
                },
                {
                    value: 3,
                    label: '待定',
                }
            ],
            
            
            // 客户意向度数据
            intentionalityList: [
                 {
                    value: '0',
                    label: '0(新分配且未打通电话的客户)'
                },
                {
                    value: '1',
                    label: '1(有店面的客户)'
                },
                {
                    value: '2',
                    label: '2(无店面，有投资实力，意向高)'
                },
                {
                    value: '3',
                    label: '3(无店面，有投资实力，意向不明)'
                },
                {
                    value: '4',
                    label: '4(无店面，无投资实力)'
                },
                {
                    value: '5',
                    label: '5（明确不做，或态度极差的客户）'
                }
            ],
            // 是否要跟进数据
            isFollowList: [
                {
                    value: 1,
                    label: '是',
                },
                {
                    value: 2,
                    label: '否'
                }
            ],
            

            // 验证规则
            ruleValidate:{
                inputPhone: [
                    { required: true, type: 'array', message: '电话号码不能为空',trigger: 'change'},
                ],
                inputName: [
                    { required: true, message: '客户姓名不能为空', trigger: 'change' },
                ],
                inputSource: [
                    { required: true, message: '渠道来源不能为空', trigger: 'change' }
                ],
                intentionality: [
                    { required: true, message: '客户意向度不能为空', trigger: 'change' }
                ],
                
            },
        }
    },

    created() {
        // 判断是新增还是编辑还是详情
        this.aimFor();
        // 得到渠道来源数据
        this.getSourceList();
        // 获取省份
        this.getProvinces();
        
    },
    mounted: {
        
    },
   

    methods: {
        // 检查城市
        checkCity (rule, value, callback)  {
                for (let i = 0, len = this.openCityList.length; i < len; i++) {
                    callback(new Error('该城市不存在，请重新选择'));
                }
        },
        /**
         * 判断是新增还是编辑还是详情
         */
        aimFor() {
            let index = decodeURI(window.location.href).indexOf('?');
            let url = decodeURI(window.location.href).substr(index+1);
            let arr = url.split('&');
            for(var i=0; i< arr.length; i++) {
               this.objCustomer[arr[i].split("=")[0]]=unescape(arr[i].split("=")[1]);
            }
            let isaim = this.objCustomer.isaim;
            if (isaim == 1) {
                this.customer_title = '新增客户';
                this.isInput = true;
            } else if (isaim == 2) {
                this.customer_title = '编辑客户';
                this.isaddnum = true;
                this.isInput = false;
                this.customer_id = this.objCustomer.id;
                 // 得到用户详情
                this.getCustomerDetail(this.customer_id);
            } 
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
         * 筛选前获取省份数据
         */
        getProvinces() {
            this.$resetAjax({
                url: '/NewA/Public/getprovinces',
                type: 'POST',
                async: false,
                success: (res) => {
                    this.openProviceList = JSON.parse(res).data;
                  
                    
                }
            })
        },
        /**
         * 筛选前获取城市数据
         */
        getCitys(provincemodel) {
            this.$resetAjax({
                url: '/NewA/Public/getcity',
                type: 'POST',
                async: false,
                data: {
                    areaId:provincemodel,
                },
                success: (res) => {
                   this.openCityList = this.cityList = JSON.parse(res).data;
                   this.inputForm.openCity = this.citymodel = JSON.parse(res).data[0].areaid;
                }
            })
        },
         /**
          * 得到来源哪个渠道
          */
        getInputSource(source) {
             this.inputForm.inputSource = source;
        },
         /**
          * 得到哪个开店省份
          */
        getOpenProvice(openProvice) {
            this.inputForm.openProvice = openProvice;
            this.inputForm.openCity='';
            this.getCitys(this.inputForm.openProvice);
            
        },
        /**
          * 得到哪个开店城市
          */
        getOpenCity(openCity) {
            this.inputForm.openCity = openCity;
        },
         /**
          * 得到是否有开店经验
          */
        getHasExperience(hasExperience) {
            this.inputForm.hasExperience = hasExperience;
        },
         /**
          * 得到个人状态
          */
        getpersonalState(personalState){
            this.inputForm.personalState = personalState;
        },
        /**
         * 得到有没有了解我们店面
         */
        getHasLook(hasLook) {
            this.inputForm.hasLook = hasLook;
        },
        /**
         * 得到期望开店时间
         */
        getExpectOpen(date) {
            this.inputForm.expectOpen = this.changeday(Date.parse(date));
        },
        /**
         * 得到客户意向度
         */
        getIntentionality(intentionality) {
            this.inputForm.intentionality = intentionality;
            let result = this.intentionalityList.filter(ele =>{
                return ele.value == this.inputForm.intentionality
            });
            this.intentiona = result[0].label;
        },
        /**
        * 编辑时新增客户状态
         */
         getStatus(status) {
            this.status = status;
         },
        /**
         * 得到是否要跟进
         */
        getIsFollow(isFollow){
            this.inputForm.isFollow = isFollow;
        },
        /**
         * 电话号码验证
         */
        blurInput() {
            if (this.customer_title == '新增客户') {
                return false
            } else {
                let length = this.inputForm.inputPhone.length - 1;
                this.$resetAjax({
                    url: '/NewA/Public/checkphone',
                    type: 'POST',
                    data:{
                        phone: this.inputForm.inputPhone[length].tel.trim()
                    },
                    success: (res) => {
                        if (JSON.parse(res).msg == 'error') {
                            this.$root.tip.isShow = true;
                            this.$root.tip.content = '抱歉,请输入新的手机号码!';
                            setTimeout(() => {
                                this.$root.tip.isShow = false;
                            }, 1500);
                        }
                    }
                })
            }
        },
        /**
         * 添加电话号码
         */
        addIphoneNum() {
            this.inputForm.inputPhone.push({tel: '', disabled: false});
        },
        deletephoneNum(){
            if(this.inputForm.inputPhone.length>1){
                this.inputForm.inputPhone.splice(-1);
            }
            
        },
        /**
         * 得到跟进时间
         */
        getFollowTime(date) {
            this.inputForm.followTime = this.changeday(Date.parse(date));
        },
        /**
        *毫秒转成-- 年月日形式
        */ 
        changeday(num) {
            let date = new Date(num);
            let z = date.getFullYear() + '-',
                b = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1)  : date.getMonth() + 1) + '-',
                n = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) ;
            return z+b+n;
        },
        /**
         * 得到客户详情
         */
        getCustomerDetail(id) {
            this.$resetAjax({
                url: '/NewA/Customer/getinfo',
                type: 'POST',
                data:{
                    id: id
                },
                success:(res) => {
                    let result = JSON.parse(res).data;
                    this.inputForm.budget = result.budget;
                    this.inputForm.inputPhone = result.phone.map(item =>({tel: item, disabled: true}));
                    this.inputForm.inputSource = result.channel;
                    this.inputForm.sourceMemo = result.channel_notes;
                    this.inputForm.inputName = result.phone;
                    this.inputForm.inputUserid = result.userid;
                    this.inputForm.specialMemo = result.special;
                    if (result.has_shop == '0') {
                        this.inputForm.haveStore = '无';
                    } else if (result.has_shop == '1') {
                        this.inputForm.haveStore = '有';
                    } else {
                        this.inputForm.haveStore = '有意向店面';
                    }
                    this.inputForm.inputName = result.username;
                    this.inputForm.industry = result.consider_industry;
                    this.inputForm.otherBrand = result.other_brands;
                    this.inputForm.whom = result.open_for;
                    this.inputForm.address = result.address;
                    // 有无开店经验 1有 2无
                   this.inputForm.hasExperience = Number(result.has_experience);
                    // 目前上班还是做生意
                    this.inputForm.personalState = Number(result.work_or_business);
                    // 有没有看到过我们的店面  1有  2无
                    this.inputForm.hasLook = Number(result.seen);
                    // 期望开店时间
                    if (result.opening_time == '0' || result.opening_time == null) {
                        // this.changeday(Date.parse(new Date()))
                        this.inputForm.expectOpen = '';
                    } else {
                        this.inputForm.expectOpen = this.changeday(Number(result.opening_time)*1000);
                    }
                    // 意向度
                    this.inputForm.intentionality = Number(result.intention);
                    let intenArr = this.intentionalityList.filter(ele =>{
                        return ele.value == this.inputForm.intentionality
                    });
                    this.intentiona = intenArr[0].label;
                    // // 是否再跟进（1 是 2否）
                    // this.inputForm.isFollow = Number(result.follow_up);
                    // // 跟进时间提醒
                    // if (result.follow_up_time == '0') {
                    //     this.inputForm.followTime = this.changeday(Date.parse(new Date()))
                    // } else {
                    //     this.inputForm.followTime = this.changeday(Number(result.follow_up_time)*1000);
                    // }
                    // 开店
                    this.inputForm.openProvice = result.provinceid,
                    this.getCitys(this.inputForm.openProvice);
                    // 开店城市
                    this.inputForm.openCity = result.cityid;
                }
            })
        },
        /**
         * 保存
         */
        submitModal() {
            if (this.customer_title == '新增客户') {
                for(let i in this.inputForm.inputPhone){
                    if(this.inputForm.inputPhone[i].tel.trim()===''){
                        this.$root.tip.isShow = true;
                         this.$root.tip.content = '抱歉,电话号码不能为空!';
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                        }, 1500);
                    } else {
                        this.$refs.inputForm.validate((valid) => {
                            if (valid) {
                                let data =  {
                                        // 渠道来源
                                        channel: this.inputForm.inputSource,
                                        // 渠道备注
                                        channel_notes: this.inputForm.sourceMemo,
                                        // 客户姓名
                                        username: this.inputForm.inputName,
                                        // 电话号码
                                        phone: this.inputForm.inputPhone.map(item => (item.tel).trim()),
                                        // 特殊备注
                                        special: this.inputForm.specialMemo,
                                        // 是否有门店  1有一家  2有多家  3有意向  4无
                                        // has_shop: this.inputForm.haveStore,
                                        // 在考虑哪些行业
                                        consider_industry: this.inputForm.industry,
                                        // 还看过哪些别的品牌
                                        other_brands: this.inputForm.otherBrand,
                                        // 准备给谁开
                                        open_for: this.inputForm.whom,
                                        // 有无开店经验 1有 2无
                                        has_experience: this.inputForm.hasExperience,
                                        // 目前上班还是做生意
                                        work_or_business: this.inputForm.personalState,
                                        // 有没有看到过我们的店面  1有  2无
                                        seen: this.inputForm.hasLook,
                                        // 期望开店时间
                                        opening_time: this.inputForm.expectOpen,
                                        // 投资预算
                                        budget: this.inputForm.budget,
                                        // 意向度
                                        intention: this.inputForm.intentionality,
                                        // 是否再跟进（1 是 2否）
                                        follow_up: this.inputForm.isFollow,
                                        // 跟进时间提醒
                                        follow_up_time: this.inputForm.followTime,
                                        // 开店省
                                        provinceid: this.inputForm.openProvice,
                                        // 开店城市
                                        cityid: this.inputForm.openCity,
                                        // 客户的详细地址
                                        address: this.inputForm.address
                                    };
                                this.$resetAjax({
                                    url: '/NewA/Customer/insert',
                                    type: 'POST',
                                    data,
                                    success: (res) => {
                                        let result = JSON.parse(res);
                                        if (result.errorcode == '2') {
                                            this.$root.tip.isShow = true;
                                            this.$root.tip.content = '新增客户失败, 已存在手机号相同的客户';
                                            setTimeout(() => {
                                                this.$root.tip.isShow = false;
                                            }, 2000);
                                        } else if (result.errorcode == '0') {
                                            this.$root.tip.isShow = true;
                                            this.$root.tip.content = '新增成功';
                                            setTimeout(() => {
                                                this.$root.tip.isShow = false;
                                                this.$router.push({path: 'customer'});
                                            }, 2000);
                                            this.sourceList.forEach(ele=>{
                                                if(ele.cid==this.inputForm.inputSource){
                                                    this.inputForm.inputSource=ele.channels
                                                }
                                            })
                                            let id=JSON.parse(res).id;
                                            let phone=this.inputForm.inputPhone.map(item => item.tel.trim());
                                            let routeData= this.$router.resolve({ name: 'customervisit', query: {isaim: 1,id:id, name: this.inputForm.inputName, phone: phone, channels: this.inputForm.inputSource, intention: this.inputForm.intentionality,isShow:2} });
                                        
                                            window.open(routeData.href, '_blank');
                                        }
                                    }
                                })
                            }
                        })
                    }
                // }
                }
               
            }
            else if (this.customer_title == '编辑客户') {
                let time = Date.parse(this.inputForm.expectOpen);
                this.$resetAjax({
                    url: '/NewA/Customer/update',
                    type: 'POST',
                    data: {
                        id: Number(this.customer_id),
                        // 渠道来源
                        channel: this.inputForm.inputSource,
                        // 渠道备注
                        channel_notes: this.inputForm.sourceMemo,
                        // 客户姓名
                        username: this.inputForm.inputName,
                        // 客户id
                        userid: this.inputForm.inputUserid,
                        // 电话号码
                        phone:this.inputForm.inputPhone.map(item => item.tel.trim()),
                        // 特殊备注
                        special: this.inputForm.specialMemo,
                        // 是否有门店  1有一家  2有多家  3有意向  4无
                        status: this.inputForm.haveStore,
                        // 在考虑哪些行业
                        consider_industry: this.inputForm.industry,
                        // 还看过哪些别的品牌
                        other_brands: this.inputForm.otherBrand,
                        // 准备给谁开
                        open_for: this.inputForm.whom,
                        // 有无开店经验 1有 2无
                        has_experience: this.inputForm.hasExperience,
                        // 目前上班还是做生意
                        work_or_business: this.inputForm.personalState,
                        // 有没有看到过我们的店面  1有  2无
                        seen: this.inputForm.hasLook,
                        // 期望开店时间
                        opening_time: this.changeday(time),
                        // 投资预算
                        budget: this.inputForm.budget,
                        // 意向度
                        intention: this.inputForm.intentionality,
                        // // 是否再跟进（1 是 2否）
                        // follow_up: this.inputForm.isFollow,
                        // // 跟进时间提醒
                        // follow_up_time: this.changeday(this.inputForm.followTime),
                        // 开店省
                        provinceid: this.inputForm.openProvice,
                        // 开店城市
                        cityid: this.inputForm.openCity,
                        // 客户的详细地址
                        address: this.inputForm.address
                    },
                    success: (res) => {
                        if(JSON.parse(res).errorcode===100){
                            this.$Modal.info({
                                title: '提示',
                                content: '修改客户信息失败,该客户不属于您,请刷新列表!'
                            });
                        }else{
                            this.$root.tip.isShow = true;
                            this.$root.tip.content = '修改成功';
                            setTimeout(() => {
                                this.$root.tip.isShow = false;
                                this.$router.push({path: 'customer'});
                            }, 2000);
                            let routeData4= this.$router.resolve({ name: 'customervisit', query: { isShow:2,isaim: 2, name: this.inputForm.inputName, id: Number(this.customer_id), phone: this.inputForm.inputPhone, channels: this.inputForm.inputSource, has_store: this.inputForm.hasExperience, intention: this.inputForm.intentionality} });
                            window.open(routeData4.href, '_blank');
                        }
                    }
                })
            }
        }
    }
}
</script>


