<template>
    <div class="logisticsAbout">
        <div class="top">
            <h3>{{title}}</h3>
            <Button class="back" @click="$router.push({path: 'logistics'})">返回物流公司列表</Button>
        </div>
        <div class="content">
            <div class="content_top top_one">
                <div class="item">
                    <span class="item_title">联系姓名</span>
                    <Input v-model="formValidate.linkman" placeholder="请输入联系姓名..."  />
                </div>
                <div class="item">
                    <span class="item_title">联系电话</span>
                    <Input v-model="formValidate.tel" placeholder="请输入联系电话..."  /> 
                </div>
                <div class="item">
                    <span class="item_title">公司名称</span>
                    <Input v-model="formValidate.name" placeholder="请输入公司名称..."  /> 
                </div>
            </div>
            <div class="content_top">
                <div class="item">
                    <span class="item_title">公司地址</span>
                    <Input v-model="formValidate.address" placeholder="请输入公司地址..."  /> 
                </div>
                <div class="item">
                    <span class="item_title">公司坐标</span>
                    <Input v-model="formValidate.coordinate" @on-focus="inputCoordinate"  placeholder="请输入公司坐标..."  /> 
                </div>
                <div class="item">
                    <span >其他备注</span>
                    <Input type="textarea" v-model="formValidate.remark" placeholder="请输入备注..."  />
                </div>
            </div>     
        </div>
        <div style="margin-top: -55px;display:flex;justify-content: flex-end;"><Button @click="asyncOK" class="async">保存</Button></div>
        <div class="address">
            <Button class="close_list" @click="closeList">{{showtitle}}</Button>
            <div class="search">
                <label>关键词：<Input v-model="keyword" class="keyword" /></label>
                <label  style="display:none" >地区：<Input v-model="location"/></label>
            </div>
            <baidu-map class="map" center="全国" :zoom="zoom" :scroll-wheel-zoom="true" @click="syncCenterAndZoom">
                <bm-view class="map"></bm-view>
                <bm-local-search :keyword="keyword" :auto-viewport="true" :location="location" class="uio" v-if="showList"></bm-local-search>
                <bm-overview-map anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :isOpen="true"></bm-overview-map>
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>  <!-- 国、省、区 -->
              <!--   <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>    城市列表 -->
                <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>        <!-- 比例尺 -->
                <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation> <!-- 定位 -->
                <bm-marker v-for="item in positionData" :title="item.msg" :key="item.id"  :position="item.position" :dragging="false" :top="true" @dbclick="infoWindowOpen(item, true)">
                    <bm-info-window :show="item.isShow" @close="infoWindowOpen(item, false)" @open="infoWindowOpen(item, true)">{{item.msg}}</bm-info-window>
                </bm-marker> 
            </baidu-map>
        </div>
        
              
                    
    </div>
</template>

<script>
import {BmlMarkerClusterer} from 'vue-baidu-map'
import tipModal from '../tip.vue'
import {getUrlParams} from  '@/assets/js/tool.js'

export default {
    components: {
        BmlMarkerClusterer,
        tipModal,
    },
    data() {
        return {
            // 得到网址的参数对象
            urlParams: {},
            // 当前页面标题
            title: '新增物流公司',
            // 模态框数据
            formValidate: {
                linkman: '', // 姓名
                tel: '',   // 电话 
                name: '',  // 公司名称
                address: '',  // 公司地址
                coordinate: '', // 公司坐标
                remark: ''  // 备注
            },
            location: '北京',
            keyword: '义乌',
            zoom: 15,
            // 物流坐标数据
            positionData: [],
            // 是否显示搜索列表
            showList: true,
            showtitle: '关闭列表',

        }
    },

    created() {
        // 得到网址的参数
        this.getUrlData();
        // 判断是编辑添加物流公司
        this.isAdd();
    },
    
    
    methods: {
        /**
         * 得到网址的参数
         */
        getUrlData:function(){
            this.urlParams = getUrlParams();
        },
        /**
         * 判断是编辑添加物流公司
         */
        isAdd() {
            switch(this.urlParams.title) {
                case '新增物流公司':
                    this.title = '新增物流公司';
                    break;
                case '编辑物流公司':
                    this.title = '编辑物流公司';
                    this.formValidate = {
                        linkman: this.urlParams.linkman == 'undefined' ? '' : this.urlParams.linkman,  // 姓名
                        tel: this.urlParams.tel  == 'undefined' ? '' : this.urlParams.tel,   // 电话 
                        name: this.urlParams.name  == 'undefined' ? '' : this.urlParams.name,  // 公司名称
                        address: this.urlParams.address  == 'undefined' ? '' : this.urlParams.address,  // 公司地址
                        coordinate: this.urlParams.coordinate  == 'undefined' ? '' : this.urlParams.coordinate, // 公司坐标
                        remark: this.urlParams.remark   == 'undefined' ? '' : this.urlParams.remark// 备注
                    };
                     let arr = this.urlParams.coordinate.split(',');
                        let obj = {
                             // 是否显示物流公司信息弹窗
                            isShow: false,  
                            // 物流公司信息
                            msg: `物流公司名称： ${this.urlParams.name}; 公司地址: ${this.urlParams.address}; 坐标=> 经度: ${arr[0]}; 纬度: ${arr[1]};`,
                            // 物流公司坐标
                            position: {
                                lng: Number(arr[0]),
                                lat: Number(arr[1]),
                            }
                        };
                    this.positionData.push(obj);
                    break;
            }
        },
        /**
         * 聚焦电话号码框
         */
        inputCoordinate() {
            
        },
        /**
         * 获取经度纬度
         */
        syncCenterAndZoom (e) {
            this.formValidate.coordinate = '';
            this.formValidate.coordinate = `${e.point.lng},${e.point.lat}`;
        },
        /**
         * 点击图标弹出相关物流信息
         */
        infoWindowOpen(item,isShow) {
            item.isShow = isShow;
        },
         /**
         *  关闭列表
         */
        closeList() {
            if (this.showtitle == '关闭列表')  {
                this.showList = false;
                this.showtitle = '显示列表';
            } else {
                this.showList = true;
                this.showtitle = '关闭列表';
            }
        },
        /**
         * 判断是编辑添加物流公司
         */
        asyncOK() {
            switch(this.title) {
                case '新增物流公司':
                    this.addLogisticsQuery();
                    break;
                default: 
                    this.editLogisticsQuery();
            }
        },
        /**
         * 添加物流公司请求
         */
        addLogisticsQuery() {
            if (this.formValidate.tel == '') {
                this.$root.tip.isShow = true;
                this.$root.tip.content = `抱歉, 联系电话不能为空！`;
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 2000);
                return false;
            }
            if (this.formValidate.name == '') {
                this.$root.tip.isShow = true;
                this.$root.tip.content = `抱歉, 公司名称不能为空！`;
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 2000);
                return false;
            }
            this.$resetAjax({
                url: '/NewA/Logistics/add',
                type:'POST',
                data: {
                    linkman: this.formValidate.linkman,   // 姓名
                    tel: this.formValidate.tel,           // 电话 
                    name: this.formValidate.name,         // 公司名称
                    address: this.formValidate.address,        // 公司地址
                    coordinate: this.formValidate.coordinate, // 公司坐标
                    remark: this.formValidate.remark        // 备注
                },
                success:(res) => {
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = `棒棒哒, 新增成功！`;
                    setTimeout(() => {
                        this.$root.tip.isShow = false;
                        this.$router.push({path: 'logistics'})
                    }, 2000);
                }
            })  
        },
       /**
        *  编辑物流公司请求
        */
        editLogisticsQuery() {
            if (this.formValidate.tel == '') {
                this.$root.tip.isShow = true;
                this.$root.tip.content = `抱歉, 联系电话不能为空！`;
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 2000);
                return false;
            }
            if (this.formValidate.name == '') {
                this.$root.tip.isShow = true;
                this.$root.tip.content = `抱歉, 公司名称不能为空！`;
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 2000);
                return false;
            }
            if (this.formValidate.coordinate.length !== 0 && this.formValidate.coordinate.indexOf(',') == -1) {
                this.$root.tip.isShow = true;
                this.$root.tip.content = `抱歉, 坐标要以英文状态下的 数字逗号数字 的格式方可提交！`;
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 3000);
                return false;
            }
            this.$resetAjax({
                url: '/NewA/Logistics/update',
                type:'POST',
                data: {
                    id: this.urlParams.rowId,               // 当前行的id
                    linkman: this.formValidate.linkman,   // 姓名
                    tel: this.formValidate.tel,           // 电话 
                    name: this.formValidate.name,         // 公司名称
                    address: this.formValidate.address,        // 公司地址
                    coordinate: this.formValidate.coordinate, // 公司坐标
                    remark: this.formValidate.remark        // 备注
                },
                success:(res) => {
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = `棒棒哒, 编辑成功！`;
                    setTimeout(() => {
                        this.$root.tip.isShow = false;
                        this.$router.push({path: 'logistics'})
                    }, 2000);
                }
            })  
        },
    }
}
</script>
