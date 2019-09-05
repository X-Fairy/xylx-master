<template>
    <div class="shipmentTwo">
        <!-- 复核单  -->
        <div class="left">
            <div class="left_top">
                <p class="top_title">
                    <span class="round"></span>
                    复核单
                </p>
            </div>
            <div class="table"> 
                <div class="allList">
                    <Button class="goPlat" title="勾选多项进行排单" @click="goPlatMore">排单</Button>
                    <div class="allList_right">
                        <Select v-model="selectArea" multiple style="width:260px" placeholder='请选择区域地址' @on-change="changeArea(selectArea)">
                            <Option value="02" key="02">全选</Option>
                            <Option v-for="item in areaList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                        </Select>
                    </div>
                </div>
                <Table id="J_dragTable" @on-selection-change="changeSelect"  border :height="tableHeight" :columns="columns" :data="tableData" ></Table>
            </div>
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
                    <Button @click="goCancel" class="arrangeLeft"  title="勾选多项取消排单">取消</Button>
                    <div class="arrangeRight">
                         <p class="driver" style="margin-right:82px">
                            <!-- <span>司机</span> -->
                            <img src="@/assets/images/platoon/drive.jpg" alt="" style="width:54px;height:54px;position:absolute;left: -60px;top: -13px;" title="司机">
                            <Input v-model="driver" placeholder="请输入装车司机姓名..." style="width: 140px" /> 
                        </p>
                         <p class="driver" style="margin-right:14px;">
                            <!-- <span>跟车</span> -->
                            <img src="@/assets/images/platoon/accompany.jpg" alt="" style="width:53px;height:53px;position:absolute;left: -52px;top: -11px;" title="跟车">
                            <Input v-model="accompany" placeholder="请输入跟车人员姓名..." style="width: 140px" />
                        </p>
                        <Button class="platoon" @click="platoonQuery" title="点击提交排单">提交</Button>
                    </div>
                </div>
                <Table id="J_enterTable" @on-selection-change="changeCancel" border :height="detailHeight"  :columns="detailcolumns" :data="detailData" class="enterTable"></Table>
            </div>
        </div>
        <!-- 提示是否打印 -->
        <div class="outside" v-if="isPrint">
            <div class="delete">
                <p>排单成功,确认打印？</p>
                <div class="build">
                    <button type="close" class="close" @click="cancelPrint">取消</button>
                    <button type="checkmark" class="checkmark" @click="goPrint">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>

import tipModal from '../tip.vue'
import expandRow from './table-expand.vue';
import { timingSafeEqual } from 'crypto';


export default {
    components:{
        tipModal,
        expandRow
    },
    data() {
        return {
            // 左侧表格高度
            tableHeight: 900,
            // 区域数据
            areaList: [],
            // 选中哪个区域
            selectArea: [],
            // 左侧表头数据
            columns: [
                {
                    type: 'expand',
                    width: 60,
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
                    width: 60,
                },
                {
                    title: '客户姓名',
                    align: 'center',
                    key: 'NAME',
                    render:(h,{row})=>{
                        return h('div',{
                            style: {
                                color: '#495060',
                                fontSize: '12px',
                                paddingTop: '15px'
                            },
                            on: {
                                click: () => {
                                    // 点击左侧当前行项单元格进行当前行排单
                                    this.clickPlat(row);
                                }
                            }
                        }, row.NAME)
                    }

                },
                {
                    title: '物流地址',
                    align: 'center',
                    key: 'address',
                    render: (h, {row}) => {
                        return h('div', {
                                style: {
                                    color: '#495060',
                                    fontSize: '12px',
                                    paddingTop: '15px'
                                },
                                domProps: {
                                    title: row.address,
                                },
                                on: {
                                    click: () => {
                                        // 把左侧所有的相同物流的数据全部刷选出来
                                        var expreArr = this.tableData.filter(ele => ele.address == row.address && ele.address !== undefined);
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
                        }, row.address)
                    }
                },
                {
                    title: '是否包邮',
                    align: 'center',
                    key: 'POSTFLAG',
                    render:(h,{row})=>{
                        return h('div',{
                            style: {
                                color: '#495060',
                                fontSize: '12px',
                                paddingTop: '15px'
                            },
                            on: {
                                click: () => {
                                    // 点击左侧当前行项单元格进行当前行排单
                                    this.clickPlat(row);
                                    // this.tableData.forEach((ele,i) => {
                                    //     if (ele.NUM1 == row.NUM1 && ele.EXPRESS == row.EXPRESS && ele.BOXQTY == row.BOXQTY && ele.logistics == row.logistics) {
                                    //         // 右侧表格添加数据
                                    //         this.detailData.splice(0,0, ele);
                                    //         // 删除左侧表格的数据
                                    //         var ii = this.tableData.indexOf(ele);
                                    //         this.tableData.splice(ii,1);
                                    //     }
                                    // });
                                    // // 得到右侧总安排数
                                    // this.boxTotal= this.getNumBox(this.detailData.map(ele => Number(ele.BOXQTY)));
                                    // // 求未安排有多少件
                                    // this.waitTotal = this.getNumBox(this.tableData.map(ele => Number(ele.BOXQTY)));
                                }
                            }
                        }, row.POSTFLAG)
                    }
                },
                // {
                //     title: '物流地址',
                //     align: 'center',
                //     key: 'address',
                //     render:(h,{row})=>{
                //         return h('div',{
                //             style: {
                //                 color: '#495060',
                //                 fontSize: '12px',
                //                 paddingTop: '15px'
                //             },
                //             on: {
                //                 click: () => {
                //                     // 点击左侧当前行项单元格进行当前行排单
                //                     this.clickPlat(row);
                //                     // this.tableData.forEach((ele,i) => {
                //                     //     if (ele.NUM1 == row.NUM1 && ele.EXPRESS == row.EXPRESS && ele.BOXQTY == row.BOXQTY && ele.logistics == row.logistics) {
                //                     //         // 右侧表格添加数据
                //                     //         this.detailData.splice(0,0, ele);
                //                     //         // 删除左侧表格的数据
                //                     //         var ii = this.tableData.indexOf(ele);
                //                     //         this.tableData.splice(ii,1);
                //                     //     }
                //                     // });
                //                     // // 得到右侧总安排数
                //                     // this.boxTotal= this.getNumBox(this.detailData.map(ele => Number(ele.BOXQTY)));
                //                     // // 求未安排有多少件
                //                     // this.waitTotal = this.getNumBox(this.tableData.map(ele => Number(ele.BOXQTY)));
                //                 }
                //             }
                //         }, row.address)
                //     }
                // },
                {
                    title: '件数',
                    align: 'center',
                    key: 'BOXQTY',
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','件数'),
                            h('span', {
                                style: {
                                    marginLeft: '15px',
                                    color: '#1d8c9f',
                                    fontSize: '14px',
                                    marginTop: '10px',
                                    display: 'inline-block'
                                },
                            },`(待排单: ${this.waitTotal}  件)`)
                        ])
                    },
                    render:(h,{row})=>{
                        return h('div',{
                            style: {
                                color: '#495060',
                                fontSize: '12px',
                                paddingTop: '15px'
                            },
                            on: {
                                click: () => {
                                    // 点击左侧当前行项单元格进行当前行排单
                                    this.clickPlat(row);
                                }
                            }
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
                    width: 60,
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
                     width: 60,
                },
                {
                    title: '客户姓名',
                    align: 'center',
                    key: 'NAME',
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
                        }, row.NAME)
                    }
                },
                {
                    title: '物流地址',
                    align: 'center',
                    key: 'address',
                    render: (h, {row}) => {
                        return h('div', {
                                style: {
                                    color: '#495060',
                                    fontSize: '12px',
                                    paddingTop: '15px'
                                },
                                domProps: {
                                    title: row.address,
                                },
                                on: {
                                    click: () => {
                                         // 点击右侧当前行项单元格取消当前行排单
                                        this.clickCells(row);
                                    }
                                }
                        }, row.address)
                    }
                },
                // {
                //    title: '物流地址',
                //     align: 'center',
                //     key: 'address',
                //     render:(h,{row})=>{
                //         return h('div',{
                //             style: {
                //                 color: '#495060',
                //                 fontSize: '12px',
                //                 paddingTop: '15px'
                //             },
                //             on: {
                //                 click: () => {
                //                     // 点击右侧当前行项单元格取消当前行排单
                //                     this.clickCells(row);
                //                 }
                //             }
                //         }, row.address)
                //     }
                // },
                {
                    title: '是否包邮',
                    align: 'center',
                    key: 'POSTFLAG',
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
                        }, row.POSTFLAG)
                    }
                },
                {
                    title: '件数',
                    align: 'center',
                    key: 'BOXQTY',
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','件数'),
                            h('span', {
                                style: {
                                    marginLeft: '15px',
                                    color: '#1d8c9f',
                                    fontSize: '14px',
                                    marginTop: '10px',
                                    display: 'inline-block'
                                },
                            },`(已排单: ${this.boxTotal}  件)`)
                        ])
                    },
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
            // 打印的参数
            loading: '',
            // 是否显示打印弹窗
            isPrint: false,
            // 装车司机
            driver: '',
            //  跟车人员
            accompany: '',
            
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
                this.tableData = this.arrFilter(this.tableData, this.detailData, 'NUM1');
            })
        }
    },

    // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
    mounted() {
        let that = this;
        setTimeout(()=> {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 220);
            this.detailHeight = (windowHeight- 220);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 220);
            this.detailHeight = (windowHeight- 220);
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
        // 得到区域数据
        this.getAreaList();
    },

    methods: {
        /**
         *  得到出货列表数据
         * @param {String} area 区域地址
         */
        getShipmentList() {
            this.$resetAjax({
                type: 'GET',
                url:  '/NewA/Loading/index',
                data: {
                    area: this.selectArea, 
                },
                success: (res) => {
                    this.tableData = res;
                    this.fixedData = res.concat();
                    this.tableData = this.arrFilter(this.tableData, this.detailData, 'NUM1');
                    this.waitTotal = this.getNumBox(this.tableData.map(ele => Number(ele.BOXQTY)));
                }
            })
        },
        /**
         * 根据一个数组数据，过滤另一个数组数据
         * @param {Array}  arr 被过滤的数组
         * @param {Array}  filterArr 过滤的数组
         * @param {String} id 对象的属性名（根据哪个字段）
         * 
         */
        arrFilter(arr, filterArr, id) {
            let filterIds = filterArr.map(item => item[id]);
            return arr.filter(item => !filterIds.includes(item[id]));
        },

        /**
         *  得到区域数据
         */
        getAreaList() {
            this.$resetAjax({
                url:'/NewA/Public/get_loading_area',
                type:'GET',
                success:(res)=>{
                    this.areaList = JSON.parse(res).data;
                }
            })
        },
        /**
         *  选中哪个区域
         */
        changeArea(selectArea) {
            if (this.selectArea[this.selectArea.length - 1] == '02') {
                // 说明是不选
                this.selectArea = [];
                this.getShipmentList();
            } else {
                this.getShipmentList();
            }
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
            this.moreCalData.forEach((ele,index) => {
                for(var i = 0; i < this.detailData.length; i++) {
                    if (this.detailData[i].CODE == ele.CODE && this.detailData[i].NUM1 == ele.NUM1 && this.detailData[i].BOXQTY == ele.BOXQTY && this.detailData[i].EXPRESS == ele.EXPRESS) {
                        // 右侧表格移除这些数据
                        this.detailData.splice(i,1);
                        // 得到已排单总数
                        this.boxTotal = this.getNumBox(this.detailData.map(ele => Number(ele.BOXQTY)))
                        // 左侧表格加上这些数据
                        // this.tableData.splice(0,0,ele);
                        // 得到待安排所有的数量
                        // this.waitTotal = this.getNumBox(this.tableData.map(ele => Number(ele.BOXQTY)));
                    }
                }
            });

            this.detailData.forEach((item, ii) => {
                for(var j = 0; j < this.fixedData.length; j++) {
                    if (this.fixedData[j].NUM1 == item.NUM1 && this.fixedData[j].BOXQTY == item.BOXQTY) {
                        this.fixedData.splice(j, 1)
                    }
                }
            })
            // 得到左侧表格数据
            this.tableData = this.fixedData;
            // 得到待安排所有的数量
            this.waitTotal = this.getNumBox(this.tableData.map(ele => Number(ele.BOXQTY)));



            // 把移除勾选的数据为空；
            this.moreCalData = [];
        },
        /**
         *  点击左侧当前行项单元格进行当前行排单
         */
        clickPlat(row) {
            // 右侧表格添加数据
            this.detailData.splice(0, 0, row);
            // 得到右侧总安排数
            this.boxTotal = this.getNumBox(this.detailData.map(ele => Number(ele.BOXQTY)));
            // 得到当前数据在左侧的索引位置
            this.tableData.splice(row._index, 1);
            // 求未安排有多少件
            this.waitTotal = this.getNumBox(this.tableData.map(ele => Number(ele.BOXQTY)));
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
                    goodslist: this.detailData,   // 右侧表格数据
                    driver: this.driver,         // 装车司机
                    accompany: this.accompany     // 跟车人员
                },
                success: (res) => {
                    // 跳出排单成功及打印提示弹窗
                    this.isPrint = true;
                    this.loading = res.loading;
                    this.boxTotal = 0;
                    this.detailData = [];
                    this.getShipmentList();
                }
            })
        },
        /**
         * 取消打印
         */
        cancelPrint() {
            this.isPrint = false;
        },
        /**
         *  跳转到去打印页面
         */
        goPrint() {
            this.isPrint = false;
            let routeData = this.$router.resolve({ name: 'printPage', query: {loading: this.loading, driver: this.driver, accompany: this.accompany} });
            window.open(routeData.href, '_blank');
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
        },
    }
}
</script>
