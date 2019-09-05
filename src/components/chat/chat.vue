<template>
    <div class="chat" @click="closeCard">
        <!-- 联系人列表 -->
        <ul class="source">
            <li class="ownHeader" @click="isInfoCard = !isInfoCard">
                <Tooltip content="我的靓照" placement="right">
                    <img class="ownHeaderImg" :src="ownHeader" alt="">
                </Tooltip><br><br>
            </li>
            <li :class="{selected: sourceIndex == 1}" @click="getChatList">
                <Tooltip content="聊天" placement="right">
                     <Icon type="chatbox-working"></Icon>
                </Tooltip><br><br>
               
            </li>
            <li v-for="(item, index) in navListData" :key="item.value" @click="getOrigin(item, index)" :class="{selected: sourceIndex == 2 + index}">
                <Tooltip :content="item.title" placement="right">
                    <Icon :type="item.icon"></Icon>
                </Tooltip><br><br>
            </li>
        </ul>
        <div class="on_linePerson">
            <div class="search">
                <div class="input_search">
                    <Input v-model="keyword" placeholder="请输入联系人名称..." style="width: 200px" @on-enter="getAllOnLine"/>
                    <Button slot="append" icon="ios-search"  @click="getAllOnLine"></Button>
                </div>
                <Select v-model="pageType"  @on-change="getPageType(pageType)" style="width:206px;margin-top: 5px;box-shadow:none">
                    <Option value="" key="">全部</Option>
                    <Option v-for="item in pageList" :value="item.page" :key="item.page">{{ item.page }}</Option>
                </Select>
            </div>
            <!-- 消息列表 -->
            <!-- <ul class="mes_list">
                <li v-for="item in onLineData" :key="item.id">
                    <div class="left">
                        <img :src="item.imgUrl" alt="">
                        <p class="line_count">{{item.line_count}}</p>
                    </div>
                    <div class="middle">
                        <h4>{{item.line_name}}</h4>
                        <p class="line_mes">{{item.line_mes}}</p>
                    </div>
                    <div class="right">{{item.line_date}}</div>
                </li>
            </ul> -->
            <!-- 在线列表 -->
            <ul class="on_line">
                <li v-for="(item, index) in contactData" :key="item.fid" @click="getContactInfo(item, index)" :class="{selected: currendIndex== index}">
                    <!-- <img :src="item.contactUrl" alt=""> -->
                    <span>{{item.user_name}}</span>
                </li>
            </ul>
        </div>
        
        <!-- 收送消息窗 -->
        <div class="mes_area" >
            <!-- 和联系人的聊天窗-->
            <!-- <div class="contact_area" v-if="isShowMesPop">
                <div class="top">
                    <h3 class="left">
                        {{contact_info.info_name}}
                    </h3>
                </div>
                <div class="middle">

                </div>
                <div class="bottom">
                    <div class="left">
                        <Upload action="//jsonplaceholder.typicode.com/posts/">
                           <Icon type="ios-browsers-outline" title="发送文件"></Icon>
                        </Upload>
                    </div>
                    <p class="right">
                        发送(S)
                    </p>
                </div>
            </div> -->
            <!-- 联系人信息 -->
            <div class="contact_info">
                <div class="info_top">
                    <p>时间: <span>{{contact_info.opentime}}</span></p>
                    <p>页面: <span>{{contact_info.page}}</span></p>
                </div>
                <div class="info_table">
                    <Table border :height="carHeight" :columns="carColumns" :data="carData"></Table>
                </div>
                <!-- <div class="inner">
                    <div class="inner_top">
                        <h3 class="left">{{contact_info.info_name}}<Icon type="person"></Icon></h3> -->
                        <!-- <div class="right" @click="lookContactUrl(contact_info.info_url)">
                            <img :src="contact_info.info_url" alt="">
                        </div> -->
                    <!-- </div>
                    <div class="inner_middle">
                        <p>来源<span>{{contact_info.info_origin}}</span></p>
                        <p>fid<span>{{contact_info.fid}}</span></p>
                        <p>opentime<span>{{contact_info.opentime}}</span></p>
                    </div>
                    <div class="inner_bottom">
                        <button @click="getContactChat(contact_info)">发消息</button>
                    </div>
                </div> -->
            </div>
            
            
        </div>
        


        <!-- 点击头像得到自己大概的信息弹窗 -->
        <Card v-if="isInfoCard" class="infoCard">
            <div class="card_center">
                <div class="left">
                    <h3 class="login_name">{{login_name}}<span><Icon type="person"></Icon></span></h3>
                    <p class="origin_style">来源：<span>{{origin_style}}</span></p>
                </div>
                <div class="right">
                    <img :src="ownHeader" @click="isPictureCard=true" class="view_picture" title="点击查看大图">
                </div>
            </div>
        </Card>
        <!-- 点击卡片里照片看自己大图 -->
        <Card v-if="isPictureCard" class="pictureCard">
            <div class="card_center">
                <h3 class="top"><Icon type="close-circled" title="关闭" @click="isPictureCard=false"></Icon></h3>
                <div class="img">
                    <img :src="ownHeader">
                </div>
            </div>
        </Card>
        <!-- 点击卡片里照片看联系人大图 -->
        <Card v-if="isContactCard" class="pictureCard">
            <div class="card_center">
                <h3 class="top"><Icon type="close-circled" title="关闭" @click="isContactCard=false"></Icon></h3>
                <div class="img">
                    <!-- <img :src="contact_info.info_url"> -->
                </div>
            </div>
        </Card>
    </div>
</template>


<script>
import {sortName} from  '@/assets/js/tool.js' 
import {getNumBox} from  '@/assets/js/tool.js' 

export default {
    data() {
        return {
            // 自己登录的头像
            ownHeader: 'http://img.52z.com/upload/news/image/20181108/20181108204521_83402.jpg',
            // 是否显示卡片信息
            isInfoCard: false,
            // 来源区域的选择
            sourceIndex: 2,
            // 登录人名字
            login_name: '哒哒哒',
            // 选择得到哪个来源 src
            origin_src: 1,
            // 左边来源数据
            navListData: [
                {
                    value: 1,
                    title: 'App 联系人',
                    icon: 'android-phone-portrait'
                },
                {
                    value: 2,
                    title: 'OA 联系人',
                    icon: 'social-angular'
                },
                {
                    value: 3,
                    title: 'WEB 联系人',
                    icon: 'monitor',
                },
            ],
            // 登录人来源
            origin_style: 'APP联络人',
            // 是否显示头像大图卡片
            isPictureCard: false,
            // 搜索关键字
            keyword: '',
            // page类型
            pageType: '',
            // page类型数据
            pageList: [],
            // 在线人数据
            onLineData: [],
            // 联系人数据
            contactData: [],
            // 点击到哪个联系人
            currendIndex: 0,
            // 是否显示消息窗
            isShowMesPop: true,
            // 联系人具体信息
            contact_info: {
                // 联系人名字
                info_name: '',
                // 联系人头像
                // info_url: '',
                // 联系人来源
                info_origin: '',
                // 联系人id
                info_id: '',
                // 联络人fid
                fid: '',
                // 联系人开店时间
                opentime: '',

            },
            // 是否显示联系人卡片大图
            isContactCard: false,
            // 联系人购物车数据
            carData: [],
            // 购物车列表高度
            carHeight: 740,
            // 购物车表头数据
            carColumns: [
                {
                    key: 'sphh',
                    title: '商品条码',
                    align: 'center'
                },
                {
                    key: 'item_name',
                    title: '商品名称',
                    align: 'center'
                },
                {
                    key: 'num',
                    title: '数量',
                    align: 'center',
                    renderHeader: (h,params)=>{
                        let text1 = getNumBox(this.carData.map(ele => Number(ele.num)));
                        return h('div',[
                            h('strong','数量'),
                            h('span', {
                                style: {
                                    marginLeft: '15px',
                                    color: '#1596ad',
                                    fontSize: '14px',
                                    display: 'inline-block'
                                },
                            },`(合计: ${text1})`)
                        ])
                    },
                },
                {
                    key: 'price',
                    title: '单价',
                    align: 'center'
                },
                {
                    key: 'cowtotal',
                    title: '',
                    align: 'center',
                    renderHeader: (h,params)=>{
                        let text = getNumBox(this.carData.map(ele => Number(ele.cowtotal))).toFixed(2);
                        return h('div',[
                            h('strong','小计'),
                            h('span', {
                                style: {
                                    marginLeft: '15px',
                                    color: '#1596ad',
                                    fontSize: '14px',
                                    display: 'inline-block'
                                },
                            },`(合计: ￥${text})`)
                        ])
                    },
                },
            ],
           

        }
    },
    created() {
        // 得到所有page类型
        this.getPageList();
        // 得到所有在线列表
        this.getAllOnLine();
        
        
    },
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.carHeight = (windowHeight-205);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.carHeight = (windowHeight -205);
        })

    },

    methods: {
        /**
         * 得到所有page类型
         */
        getPageList() {
            this.$resetAjax({
                type: 'GET',
                url: '/NewA/Chat/getpage',
                success: (res) => {
                    this.pageList = res.data;
                    this.$nextTick(() => {
                        this.ownHeader = this.$root.userData.iconUrl;       // 得到当前用户的头像
                        this.login_name = this.$root.userData.name;     // 得到当前用户的姓名
                    })
                }
            })
        },
        /**
         * 选择时得到page类型
         */
        getPageType(pageType) {
            this.pageType = pageType;
            this.getAllOnLine();
        },
        /**
         * 得到列表的来源
         */
        getOrigin(item, index) {
            this.sourceIndex = index + 2;
            this.origin_src = item.value;
            this.getAllOnLine();
        },
        /**
         * 得到所有在线列表
         * @param {String} username 搜索关键字
         * @param {Number} src 联系人来源
         * @param {String} page page类型
         */
        getAllOnLine() {
            this.$resetAjax({
                type: 'GET',
                url: '/NewA/Chat/getlist',
                data: {
                    username: this.keyword,
                    src: this.origin_src,
                    page: this.pageType
                },
                success: (res) => {
                    if (JSON.parse(res).count !== '0') {
                        this.currendIndex = 0;
                        this.contactData = sortName(JSON.parse(res).data, 'user_name');
                        this.contact_info = {
                            info_name: this.contactData[0].user_name,       // 联系人名字
                            info_code: this.contactData[0].user_id,         // 门店id
                            info_origin: this.contactData[0].src,           // 联系人来源
                            fid: this.contactData[0].fid,                   // 联系人fid
                            opentime: this.contactData[0].opentime,         // 联系人opentime
                            page: this.contactData[0].page                  // 联系人page类型
                        }
                        // 得到该联系人的门店详情
                        this.getStoreDetail();
                    } else {
                        this.contact_info = {
                            info_name: '',       // 联系人名字
                            info_code: '',         // 门店id
                            info_origin: '',           // 联系人来源
                            fid: '',                   // 联系人fid
                            opentime: '',         // 联系人opentime
                            page: ''                  // 联系人page类型
                        };
                        this.carData = [];
                    }
                    
                }
            })
        },
        /**
         * 点击除了卡片的地方可以关闭卡片
         */
        closeCard(event) {
            if (this.isInfoCard == true && event.target.className !== 'ownHeaderImg') {
                this.isInfoCard = false;
            }
        },
        /**
         * 得到联系人信息
         */
        getContactInfo(item, index) {
            this.currendIndex = index;
            this.contact_info = {
                info_name: item.user_name,                 // 联系人名字
                info_code: item.user_id,                  // 门店id
                info_origin: item.src,                   // 联系人来源
                fid: item.fid,                           // 联系人fid
                opentime: item.opentime,               // 联系人opentime
                page: item.page                       // 联系人page类型
            }
            // 得到该联系人的门店详情
            this.getStoreDetail();
        },
        /**
         * 得到该联系人的门店详情
         * @param {String}  code  门店id
         */
        getStoreDetail() {
            this.$resetAjax({
                type: 'POST',
                url: '/NewA/Chat/getinfo',
                data: {
                   code: this.contact_info.info_code
                },
                success: (res) => {
                    res.data.forEach(ele => {
                        ele.cowtotal = (Number(ele.price) * Number(ele.num)).toFixed(2)
                    });
                    this.carData = res.data;
                }
            })
        },
        /**
         * 查看联系人头像大图
         */
        lookContactUrl(url) {
            this.isContactCard = true;
        },
        /**
         * 点击哪个得到和某人的聊天记录
         */
        getContactChat(data) {
            // 聊天界面显示出来
            this.isShowMesPop = true;
        },
        /**
         * 得到聊天过的左侧列表
         */
        getChatList() {
            this.sourceIndex = 1;
        },
        
    }
}
</script>
