<template>
    <div class="shipment">
        <!-- 复核单  -->
        <div class="left">
            <div class="left_top">
                <p>
                    <span class="round"></span>
                    复核单
                </p>
            </div>
            <div class="table"> 
                <div class="allList">
                    <Button class="goPlat" title="勾选多项进行排单" @click="goPlatMore">排单</Button>
                    <div class="allList_right">
                        <p class="waitPlat">待安排: <span>{{waitTotal}}</span> 件</p>
                        <Button class="all"  title="点击查看全部出货复核单" @click="getShipmentList">全部</Button>
                    </div>
                </div>
                <Table id="J_dragTable" @on-selection-change="changeSelect"  border :height="tableHeight" :columns="columns" :data="tableData" ></Table>
            </div>
        </div>
        <!-- 地图 -->
        <div class="middle">
            <div class="middle_top">
                <p class="title">
                    <span class="round"></span>
                    物流坐标
                </p>
            </div>
            <bm-control class="button_control">          <!-- 缩放等级按钮 -->
                <Button title="点击地图缩放到最大" @click="addZoom(19)">最大</Button>
                <Button title="点击地图还原" @click="addZoom(10)">还原</Button>
                <Button title="点击地图缩放到最小" @click="addZoom(3)">最小</Button>
            </bm-control>
            <baidu-map class="map map_content" :scroll-wheel-zoom="true" center="义乌" :zoom="zoom">  <!-- 开启滚轮缩放 scroll-wheel-zoom="true" -->
                <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>    <!--  在右上角加入比例尺控件 -->
                <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>   
                <bm-overview-map anchor="" :isOpen="true"></bm-overview-map>   <!-- 在地图右下角加入缩略图控件 -->
                <bm-city-list anchor="BMAP_ANCHOR_TOP_LEFT"></bm-city-list>  <!-- 城市列表 -->
                <!-- icon坐标图标设置 title鼠标悬浮设置 position坐标经纬度 dragging坐标图标不可拖拽  top将标注置于其他标注之上-->
                <bm-marker v-for="item in positionData" :icon="item.url" :title="item.tip" :key="item.id"  :position="item.position" :dragging="false" :top="true" @dblclick="getLogisticsInfo(item, true)">
                    <bm-info-window :show="item.isShow" @close="infoWindowOpen(item, false)" @open="infoWindowOpen(item, true)">{{item.msg}}</bm-info-window>
                </bm-marker> 
            </baidu-map>
        </div>
        <!-- 排单表 -->
        <div class="right">
            <div class="right_top">
                <p class="arrangetable">
                    <span class="round"></span>
                    排单表
                </p>
            </div>
            <div class="content">
                <div class="arrangeNum">
                    <Button @click="goCancel" class="arrangeLeft"  title="点击取消排单">取消</Button>
                    <div class="arrangeRight">
                        <p>已安排: <span>{{boxTotal}}</span> 件</p>
                        <Button class="platoon" @click="platoonQuery" title="点击提交排单">提交</Button>
                    </div>
                </div>
                <!-- @on-row-click="cancelPlat" 点击单行 -->
                <Table id="J_enterTable" @on-selection-change="changeCancel" border :height="detailHeight" :columns="detailcolumns" :data="detailData"></Table>
            </div>
        </div>
    </div>
</template>


<script>

import tipModal from '../tip.vue'
import {BmlMarkerClusterer} from 'vue-baidu-map' // 引入地图插件
import expandRow from './table-expand.vue';


export default {
    components:{
        tipModal,
        BmlMarkerClusterer,
        expandRow
    },
    data() {
        return {
            // 左侧表格高度
            tableHeight: 900,
            // 左侧表头数据
            columns: [
                {
                    type: 'expand',
                    render: (h, params) => {
                        return h(expandRow, {
                            props: {
                                row: params.row
                            }
                        })
                    }
                },
                {
                    type: 'selection',
                    align: 'center',
                },
                {
                    title: '合作物流',
                    width: 80,
                    align: 'center',
                    key: 'EXPRESS',
                    render: (h, {row}) => {
                        let texts = row.EXPRESS;
                        if (row.EXPRESS !== null) {
                            if (row.EXPRESS.length > 4) {
                                texts = row.EXPRESS.slice(0,4);
                            } else {
                                texts = row.EXPRESS;
                            }
                        }
                        return h('div', {
                                style: {
                                    color: '#495060',
                                    fontSize: '12px',
                                    paddingTop: '15px'
                                },
                                domProps: {
                                    title: row.EXPRESS,
                                },
                                on: {
                                    click: () => {
                                        // 把左侧所有的相同物流的数据全部刷选出来
                                        var expreArr = this.tableData.filter(ele => ele.EXPRESS == row.EXPRESS);
                                        expreArr.forEach(ele => {
                                            // 右侧表格添加数据
                                            this.detailData.splice(0, 0, ele);
                                            // 查看ele在左侧的位置，好让ele在左侧清除掉
                                            var ii = this.tableData.indexOf(ele);
                                            this.tableData.splice(ii, 1)
                                        })
                                        // 得到右侧总安排数
                                        this.boxTotal = this.getNumBox(this.detailData.map(ele => Number(ele.BOXQTY)));
                                        // 求未安排有多少件
                                        this.waitTotal = this.getNumBox(this.tableData.map(ele => Number(ele.BOXQTY)));
                                    }
                                }
                        }, texts)
                    }
                },
                {
                    title: '配送单号',
                    align: 'center',
                    width: 120,
                    key: 'NUM1',
                    render:(h,{row})=>{
                        return h('div',{
                            style: {
                                color: '#495060',
                                fontSize: '12px',
                                paddingTop: '15px'
                            },
                            on: {
                                click: () => {
                                    this.tableData.forEach((ele,i) => {
                                        if (ele.NUM1 == row.NUM1 && ele.EXPRESS == row.EXPRESS && ele.BOXQTY == row.BOXQTY) {
                                            // 右侧表格添加数据
                                            this.detailData.splice(0,0, ele);
                                            // 删除左侧表格的数据
                                            var ii = this.tableData.indexOf(ele);
                                            this.tableData.splice(ii,1);
                                        }
                                    });
                                    // 得到右侧总安排数
                                    this.boxTotal= this.getNumBox(this.detailData.map(ele => Number(ele.BOXQTY)));
                                    // 求未安排有多少件
                                    this.waitTotal = this.getNumBox(this.tableData.map(ele => Number(ele.BOXQTY)));
                                }
                            }
                        }, row.NUM1)
                    }
                },
                {
                    title: '件数',
                    align: 'center',
                    width: 60,
                    key: 'BOXQTY',
                    render:(h,{row})=>{
                        return h('div',{
                            style: {
                                color: '#495060',
                                fontSize: '12px',
                                paddingTop: '15px'
                            },
                        }, row.BOXQTY)
                    }
                },
            ],
            // 左侧表格列表数据
            tableData: [],
            // 左侧表格数据不变的,一开始加载出来的数据，没有经过移动的
            fixedData: [],
            // 右侧表格表头
            detailcolumns: [
                 {
                    type: 'expand',
                    render: (h, params) => {
                        return h(expandRow, {
                            props: {
                                row: params.row
                            },
                        })
                    }
                },
                {
                    type: 'selection',
                    align: 'center',
                },
                {
                    title: '合作物流',
                    align: 'center',
                    width: 80,
                    key: 'EXPRESS',
                    render: (h, {row}) => {
                        let texts = row.EXPRESS;
                        if (row.EXPRESS !== null) {
                            if (row.EXPRESS.length > 4) {
                                texts = row.EXPRESS.slice(0,4);
                            } else {
                                texts = row.EXPRESS;
                            }
                        }
                        return h('div', {
                                style: {
                                    color: '#495060',
                                    fontSize: '12px',
                                    paddingTop: '15px'
                                },
                                domProps: {
                                    title: row.EXPRESS,
                                },
                                on: {
                                    click: () => {
                                         // 点击右侧当前行项单元格取消当前行排单
                                        this.clickCells(row);
                                    }
                                }
                        }, texts)
                    }
                },
                {
                    title: '配送单号',
                    align: 'center',
                    width: 120,
                    key: 'NUM1',
                    render:(h,{row})=>{
                        return h('div',{
                            style: {
                                color: '#495060',
                                fontSize: '12px',
                                paddingTop: '15px'
                            },
                            on: {
                                click: () => {
                                    // 点击右侧当前行项单元格取消当前行排单
                                    this.clickCells(row);
                                }
                            }
                        }, row.NUM1)
                    }
                },
                {
                    title: '件数',
                    align: 'center',
                    width: 60,
                    key: 'BOXQTY',
                    render:(h,{row})=>{
                        return h('div',{
                            style: {
                                color: '#495060',
                                fontSize: '12px',
                                paddingTop: '15px'
                            },
                            on: {
                                click: () => {
                                    // 点击右侧当前行项单元格取消当前行排单
                                    this.clickCells(row);
                                }
                            }
                        }, row.BOXQTY)
                    }
                },
            ],
            // 右侧表格数据
            detailData: [],
            // 右侧表格高度
            detailHeight: 900,
            // 缩放等级
            zoom: 15,
            // 物流坐标数据
            positionData: [],
            // 已安排多少箱数
            boxTotal: 0,
            // 待安排多少箱数
            waitTotal: 0,
            // 左侧移到右侧时数据在左侧的index索引
            indexs: [],
            // 左侧表格多选时要进行排单的数据
            moreSelData: [],
            // 右侧表格多先要取消排单的数据
            moreCalData: [],
            
            
        }
    },

    watch: {
        tableData(val) {
            // 当数据改变后，等待页面重新渲染了
            this.$nextTick(() => {
                $('tr', '#J_dragTable').prop('draggable', true);
                $('tr', '#J_dragTable').each(function (index, item) {
                    $(item).data('params', {
                        index: index - 1,
                        row: val[index - 1]
                    })
                });
            })
        },
        detailData(val) {
            // 当数据改变后，等待页面重新渲染了
            this.$nextTick(() => {
                $('tr', '#J_enterTable').prop('draggable', true);
                $('tr', '#J_enterTable').each(function (index, item) {
                    $(item).data('params', {
                        index: index - 1,
                        row: val[index - 1]
                    })
                });
            })
        }
    },

    // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
    mounted() {
        let that = this;
        setTimeout(()=> {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 180);
            this.detailHeight = (windowHeight- 180);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 180);
            this.detailHeight = (windowHeight- 180);
        })
        // 从左侧拖拽到右侧
        $('#J_dragTable').on('dragend', 'tr', function (e) {
            let $enterTable = $('#J_enterTable');
                // 获取拖拽目标胡数据
            let data = $(e.target).data('params'),
                // 放开拖拽鼠标位置
                position = {
                    x: e.clientX,
                    y: e.clientY
                },
                // 需要被放置的table位置,四个顶点的位置
                tablePostion = {
                    x: $enterTable.offset().left,
                    y: $enterTable.offset().top,
                    x2: $enterTable.offset().left + $enterTable.width(),
                    y2: $enterTable.offset().top + $enterTable.height()
                }
            // 判断拖放位置，鼠标是否在table里面
            if ((position.x > tablePostion.x && position.x < tablePostion.x2) && (position.y > tablePostion.y && position.y < tablePostion.y2)) {
                // 删除左边table数据
                that.tableData.splice(data.index, 1);
                that.detailData.splice(0,0,data.row);
                let arr = that.detailData.map(ele => Number(ele.BOXQTY));
                // 累加求已安排多少件
                that.boxTotal = that.getNumBox(arr);
                // 求未安排有多少件
                that.waitTotal = that.getNumBox(that.tableData.map(ele => Number(ele.BOXQTY)))
            }
        });
        // 从右侧拖拽到左侧
        $('#J_enterTable').on('dragend', 'tr', function (e) {
            let $enterTable2 = $('#J_dragTable');
                // 获取拖拽目标胡数据
            let data2 = $(e.target).data('params'),
                // 放开拖拽鼠标位置
                position2 = {
                    x: e.clientX,
                    y: e.clientY
                },
                // 需要被放置的table位置,四个顶点的位置
                tablePostion2 = {
                    x: $enterTable2.offset().left,
                    y: $enterTable2.offset().top,
                    x2: $enterTable2.offset().left + $enterTable2.width(),
                    y2: $enterTable2.offset().top + $enterTable2.height()
                }
            // 判断拖放位置，鼠标是否在table里面
            if ((position2.x > tablePostion2.x && position2.x < tablePostion2.x2) && (position2.y > tablePostion2.y && position2.y < tablePostion2.y2)) {
                // 删除右边table数据
                that.detailData.splice(data2.index, 1);
                that.tableData.splice(0,0,data2.row);
                let arr2 = that.detailData.map(ele => Number(ele.BOXQTY));
                // 累加求已安排多少件
                that.boxTotal = that.getNumBox(arr2);
                // 求未安排有多少件
                that.waitTotal = that.getNumBox(that.tableData.map(ele => Number(ele.BOXQTY)))
            }
        });

    },


    created() {
        // 得到出货列表数据
        this.getShipmentList();
        // 获取所有物流公司的坐标
        this.getLogistics();
    },

    methods: {
        /**
         *  得到出货列表数据
         */
        getShipmentList() {
            this.detailData = [];
            this.boxTotal = 0;
            this.$resetAjax({
                type: 'GET',
                url:  '/NewA/Loading/index',
                success: (res) => {
                    this.fixedData = res.concat();
                    this.tableData = res;
                    // 得到待安排所有的数量
                    this.waitTotal = this.getNumBox(this.tableData.map(ele => Number(ele.BOXQTY)));
                }
            })
        },
        /**
         * 获取所有物流公司的坐标
         */
        getLogistics() {
            this.$resetAjax({
                type: 'GET',
                url:  '/NewA/Public/getlogistics',
                success: (res) => {
                    JSON.parse(res).forEach(ele => {
                        if (ele.coordinate !== null && ele.coordinate !== '') {
                            let arr = ele.coordinate.split(',');
                            let obj = {
                                // 一开始默认物流公司的信息弹窗为关闭
                                isShow: false,
                                // 双击物流坐标提示的信息
                                msg: '',    
                                // 物流公司的详细信息，比如地址，公司名，联系人等等。 
                                data: ele,
                                // 鼠标悬浮时物流坐标提示的信息
                                tip: `公司:${ele.name}  电话:${ele.tel}  地址:${ele.address}`,
                                // 物流公司的id
                                id: ele.id,
                                // 物流公司的坐标颜色
                                url: {url: require('@/../static/images/position-fill (3).png'), size: {width:28, height: 32}},
                                // 物流公司的坐标
                                position: {
                                    lng: Number(arr[0]),
                                    lat: Number(arr[1]),
                                }
                            };
                            // 所有的物流公司数据
                            this.positionData.push(obj);
                            // 把左边今天有合作的物流公司名字全部汇合一起，判断所有物流公司数据是否有左边物流公司名称
                            let logsApply = this.tableData.map(ele => ele.logistics);
                            // 得到所有物流公司名称
                            let logsAll = this.positionData.map(ele => ele.data.name);
                                //临时数组存放
                            var tempArray1 = [];//临时数组1
                            var tempArray2 = [];//临时数组2
                            // 左边物流在所有物流数据中的indexArr
                            var indexArr = [];
                            for(var i = 0;i < logsApply.length; i++){
                                tempArray1[logsApply[i]] = true ;//将数array2 中的元素值作为tempArray1 中的键，值为true；
                            }
                            for(var i = 0;i < logsAll.length; i++){
                                if(tempArray1[logsAll[i]]){
                                    tempArray2.push(logsAll[i]);//过滤array1 中与array2 相同的元素；
                                    // 有物流装车的索引位置放到一个数据里面
                                    indexArr.push(i)
                                }
                            }
                            // 在所有物流公司里把有物流公司装车的用其他颜色标注出来
                            this.positionData.forEach((ele, i) => {
                                if (indexArr.indexOf(i) !== -1) {
                                    ele.url = {url: require('@/../static/images/position-fill (1).png'), size: {width:28, height: 32}};
                                } 
                            });
                        }
                    });
                }
            })
        },
        /**
         * 看地图的策略
         */
        addZoom (level) {
            this.zoom = level
        },
        /**
         * 点击图标弹出相关物流信息
         */
        infoWindowOpen(item,isShow) {
            // 双击时让当前点击的物流公司的信息弹窗显示出来
            item.isShow = isShow;
        },
        /**
         *  双击物流坐标查看相关信息
         */
        getLogisticsInfo(item, isShow) {
            // 双击时让当前点击的物流公司的信息弹窗显示出来
            item.isShow = isShow;
            // 让右侧表格数据为空
            this.detailData = [];
            this.$resetAjax({
                type: 'POST',
                url:  '/NewA/Loading/index',
                data: {
                    logistics: item.id
                },
                success: (res) => {
                    this.tableData = res;
                    if(res.length !== 0) {
                        let arr3 = res.map(ele => Number(ele.BOXQTY));
                        var a = 0;
                        for(var i = 0;i < arr3.length; i++){
                            a += arr3[i];
                        }
                        item.msg = `物流公司: ${item.data.name}; 电话: ${item.data.tel}; 地址: ${item.data.address}; 待发件:${a}件`;
                    } else {
                        item.msg = `物流公司: ${item.data.name}; 电话: ${item.data.tel}; 地址: ${item.data.address}; 待发件: 无`;
                    }
                }
            })
        },
        /**
         * 数组求和函数
         */
        getNumBox(arr) {
            var a = 0;
            for(var i = 0;i < arr.length; i++){
                a += arr[i];
            }
            return a;
            // this.boxTotal = a;
        },
        /**
         * 右侧表格点击当前行从排单里移除
         */
        cancelPlat(data, index) {
            this.detailData.forEach((ele, ii) => {
                if (ele.BOXQTY == data.BOXQTY && ele.CODE == data.CODE && ele.NUM1 == data.NUM1 && ele.EXPRESS == data.EXPRESS) {
                    this.detailData.splice(ii, 1);
                }
            })
            // 左侧表格里添加这项已被清除的数据
            this.tableData.splice(0,0,data);
            // 查看右侧这时候的已排单情况
            this.boxTotal = this.getNumBox(this.detailData.map(ele => Number(ele.BOXQTY)));
            // 左侧未排单数量
            this.waitTotal = this.getNumBox(this.tableData.map(ele => Number(ele.BOXQTY)));
        },
        /**
         * 左侧表格多选时变化
         */
        changeSelect(selection) {
            this.moreSelData = selection;
        },
        /**
         * 多项数据勾选移到右侧
         */
        goPlatMore() {
            // 如果没有勾选数据，不能移动数据，给予提示
            if (this.moreSelData.length == 0) {
                this.instance('error');
                return false;
            }  else {
                    this.moreSelData.forEach(ele => {
                    // 右侧表格增加数量
                    this.detailData.splice(0, 0, ele);
                    // 得到已排单总数
                    this.boxTotal = this.getNumBox(this.detailData.map(ele => Number(ele.BOXQTY)));
                    for(var i = 0; i < this.tableData.length; i++) {
                        if (this.tableData[i].NUM1 == ele.NUM1 && this.tableData[i].BOXQTY == ele.BOXQTY && this.tableData[i].EXPRESS == ele.EXPRESS && this.tableData[i].CODE == ele.CODE) {
                        this.tableData.splice(i, 1);
                        // 得到待安排所有的数量
                            this.waitTotal = this.getNumBox(this.tableData.map(ele => Number(ele.BOXQTY)));
                        }
                    }
                })
            };
            // 把排单勾选中的数据为空；
            this.moreSelData = [];
        },
        /**
         * 右侧表格多选时变化
         */
        changeCancel(selection) {
            this.moreCalData = selection;
        },
        /**
         * 取消所有排单数据
         */
        goCancel() {
            if(this.moreCalData.length == 0) {
                this.instance('info');
                return false;
            }
            // 在右侧移除这些数据
            this.moreCalData.forEach(ele => {
                for(var i = 0; i < this.detailData.length; i++) {
                    if (this.detailData[i].CODE == ele.CODE && this.detailData[i].NUM1 == ele.NUM1 && this.detailData[i].BOXQTY == ele.BOXQTY && this.detailData[i].EXPRESS == ele.EXPRESS) {
                        // 右侧表格移除这些数据
                        this.detailData.splice(i,1);
                        // 得到已排单总数
                        this.boxTotal = this.getNumBox(this.detailData.map(ele => Number(ele.BOXQTY)))
                        // 左侧表格加上这些数据
                        this.tableData.splice(0,0,ele);
                    }
                    // 得到待安排所有的数量
                    this.waitTotal = this.getNumBox(this.tableData.map(ele => Number(ele.BOXQTY)));
                }
            });
            // 把移除勾选的数据为空；
            this.moreCalData = [];
        },
        /**
         *  点击右侧行项单元格取消当前行排单
         */
        clickCells(row) {
            this.fixedData.map((ele, index) => {
                if (ele.BOXQTY == row.BOXQTY && ele.CODE == row.CODE && ele.EXPRESS == row.EXPRESS && ele.NUM1 == row.NUM1 && ele.TOTAL == row.TOTAL) {
                    this.tableData.splice(index, 0, row);
                }
            });
            // 把当前行的数据移到左侧
            // this.tableData.splice(0, 0, row);
            // 得到当前行在右侧表格的索引位置,以方便在右侧删除这个数据
            var ii = row._index;
            // 右侧表格清除这条数据
            this.detailData.splice(ii, 1);
            // 得到右侧总安排数
            this.boxTotal = this.getNumBox(this.detailData.map(ele => Number(ele.BOXQTY)));
            // 求未安排有多少件
            this.waitTotal = this.getNumBox(this.tableData.map(ele => Number(ele.BOXQTY)));
        },
        /**
         * 排单提交请求
         */
        platoonQuery() {
            if (this.detailData.length == 0) {
                this.instance('warning');
                return false;
            }
            this.$resetAjax({
                type: 'POST',
                url:  '/NewA/Loading/loading',
                data: {
                    goodslist: this.detailData   // 右侧表格数据
                },
                success: (res) => {
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = `棒棒哒！排单成功`;
                    setTimeout(() => {
                        this.$root.tip.isShow = false;
                        this.boxTotal = 0;
                        this.detailData = [];
                        this.getShipmentList();
                    }, 2000);
                }
            })
        },
        /**
         *  提示弹窗
         */
        instance (type) {
            var  title = '提示';
            var  content = '<p>Content of dialog</p><p>Content of dialog</p>';
            switch (type) {
                case 'info':
                    this.$Modal.info({
                        title: title,
                        content: '抱歉亲亲,请先勾选您要取消的排单数据！'
                    });
                    break;
                case 'success':
                    this.$Modal.success({
                        title: title,
                        content: content
                    });
                    break;
                case 'warning':
                    this.$Modal.warning({
                        title: title,
                        content: '抱歉亲亲, 请先添加您要排单数据！'
                    });
                    break;
                case 'error':
                    this.$Modal.error({
                        title: title,
                        content:  '抱歉亲亲, 请先勾选您要排单的数据！'
                    });
                    break;
            }
        }
    }
}
</script>
