<template>
    <div class="platoon">
        <div class="platoon_left">
            <div class="top">
                <p id="left_title"><span class="round"></span>排单表</p>
            </div>
            <div class="middle">
                <Button @click="getPlatoon" title="点击获取全部排单表" class="allList">全部</Button>
                <div class="search">
                    <Input v-model="searnum" placeholder="请输入配送单号..." style="width: 200px"  @on-enter="searchNum" />
                    <Button slot="append" icon="ios-search" class="append"  @click="searchNum"></Button>
                </div>
            </div>
            <!-- 表格 -->
            <Card class="table">
                <Table size="small" border @on-row-click="rowClick"  :columns="columns" :data="tableData" :height="tableHeight"></Table>
            </Card>
            <!-- 分页 -->
            <div class="footer">
                <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
            </div> 
        </div>
        <div class="platoon_right">
            <div class="top">
                <p><span class="round"></span>排单详情</p>
            </div>
            <div class="print">
                <p class="driver" style="position:relative;margin-right:82px">
                    <!-- <span>司机</span> -->
                    <img src="@/assets/images/platoon/drive.jpg" alt="" style="width:54px;height:54px;position: absolute;left: -60px;top: -12px;" title="司机">
                    <Input v-model="driver" disabled style="width: 80px" /> 
                </p>
                <p class="driver" style="position:relative;margin-right:14px;">
                    <!-- <span>跟车</span> -->
                    <img src="@/assets/images/platoon/accompany.jpg" alt="" style="width:50px;height:50px;position: absolute;left: -50px;top: -9px;" title="跟车">
                    <Input v-model="accompany" disabled style="width: 80px" />
                </p>
                <Button title="点击打印当前排单详情" @click="goPrintPage">打印</Button>
            </div>
            <Card class="right_area">
                <Table size="small" border class="right_table" :columns="columnsPlat" :data="platoonData" :height="platoonHeight"></Table>
            </Card>
        </div>
    </div>
</template>


<script>

import {changeday} from  '@/assets/js/tool.js'
import tipModal from '../tip.vue'

export default {
    components: {
        tipModal
    },
    data() {
        return{
            // 搜索时的复合单号
            searnum: '',
            // 门店表头数据
            columns: [
                {
                    title: '日期',
                    key: 'create_time',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                height: '48px',
                                lineHeight: '48px'
                            },
                            domProps: {
                                title: '单击当前行查看排单详情',
                            },
                            on: {
                                click: () => {}
                            }
                        }, params.row.create_time);
                    }
                },
                {
                    title: '件数',
                    key: 'qty',
                    align: 'center',
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','件数'),
                            h('span', {
                                style: {
                                    marginLeft: '15px',
                                    color: '#1d8c9f',
                                    fontSize: '14px',
                                    display: 'inline-block'
                                },
                            },`(合计: ${this.allTotal}  件)`)
                        ])
                    },
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                height: '48px',
                                lineHeight: '48px'
                            },
                            domProps: {
                                title: '单击当前行查看排单详情',
                            },
                            on: {
                                click: () => {}
                            }
                        }, params.row.qty);
                    }
                }
                  
            ],
            // 门店列表数据
            tableData: [],
            // 排单列表表格高度
            tableHeight: 700,
            // 总页数
            total: 0,
            // 页面条数
            pageSize: 20,
            // 当前页码
            currentPage: 1,
            // 排单详情要的参数
            platoonId: '',
            // 排单详情的数据
            platoonData: [],
            // 详情表格表头
            columnsPlat: [
                {
                    title: '客户名',
                    key: 'name',
                    align: 'center',
                },
                {
                    title: '物流公司',
                    key: 'express',
                    align: 'center',
                },
                 {
                    title: '地址',
                    key: 'address',
                    align: 'center',
                },
                {
                    title: '是否包邮',
                    key: 'postflag',
                    align: 'center',
                },
                {
                    title: '件数',
                    key: 'totle',
                    align: 'center',
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','件数'),
                            h('span', {
                                style: {
                                    marginLeft: '15px',
                                    color: '#1d8c9f',
                                    fontSize: '14px',
                                    display: 'inline-block'
                                },
                            },`(合计: ${this.sumNum}  件)`)
                        ])
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, row) => {
                        return h('div', [
                            h('a', {
                                class: 'handle',
                                domProps:{
                                    title:'撤销当前行排单'
                                },
                                on: {
                                    click: () => {
                                        // 撤销当前行排单
                                        this.cancelPlatoon(row)
                                    }
                                }
                            }, '撤销'),
                           
                        ]);
                    }
                }
            ],
            // 排单详情表格高度
            platoonHeight: 700,
            // 总件数
            sumNum: 0,
            // 左侧总件数
            allTotal: 0,
            // 装车司机
            driver: '无',
            //  跟车人员
            accompany: '无',
            
           

        }
    },
    
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 250);
            this.platoonHeight = (windowHeight- 250);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 250);
            this.platoonHeight = (windowHeight- 250);
        })
    },

    created() {
        // 如果进入当前页面
        this.moveTitle();
        // 得到排单数据
        this.getPlatoon();
    },


    methods: {
        /**
         * 标题滑倒正确的地方
         */
        moveTitle() {
            // var omoveTitle 
        },
        /**
         * 得到排单数据
         */
        getPlatoon() {
            this.$resetAjax({
                type: 'GET',
                url:  '/NewA/Carlist/index',
                data: {
                    p: this.currentPage
                },
                success: (res) => {
                    if(res.data.list.length !== 0) {
                        res.data.list.forEach(ele => {
                            if (ele.lp_num == null || ele.lp_num == '') {
                                ele.lp_num = 0;
                            } else {
                                ele.lp_num = ele.lp_num;
                            }
                            ele.create_time = changeday(Number(ele.create_time)*1000)
                        });
                        this.tableData = res.data.list;
                        this.total = Number(res.data.count)
                        this.platoonId = res.data.list[0].id;
                        this.allTotal = this.numAdd(res.data.list.map(ele => Number(ele.qty)));
                        this.sumNum = Number(res.data.list[0].qty);
                        this.driver = res.data.list[0].driver;
                        if (res.data.list[0].driver == null || res.data.list[0].driver == '') {
                            res.data.list[0].driver = '无';
                            this.driver = res.data.list[0].driver;
                        } else {
                            this.driver = res.data.list[0].driver;
                        }
                        if (res.data.list[0].accompany == null || res.data.list[0].accompany == '') {
                            res.data.list[0].accompany = '无';
                            this.accompany = res.data.list[0].accompany;
                        } else {
                            this.accompany = res.data.list[0].accompany;
                        }
                        // 右侧默认得到第一个门店的详情
                        this.$resetAjax({
                            type: 'GET',
                            url:  '/NewA/Carlist/info',
                            data: {
                                loading: this.platoonId,
                            },
                            success: (res) => {
                                // 默认显示第一个门店信息
                                $('.ivu-table-row').eq(0).find('td').addClass('td-click');
                                this.platoonData = res.data;
                            }
                        })
                    }
                }
            })
        },
        /**
         * 根据配送单号来请求数据
         */
        searchNum() {
            if (this.searnum == '') {
                this.instance('error');
                return false;
            }
            this.tableData = [];
            this.$resetAjax({
                type: 'POST',
                url:  '/NewA/Carlist/select',
                data: {
                    num: this.searnum,
                },
                success: (res) => {
                    let result = res.data;
                    this.tableData = result.car;
                    result.car[0].create_time = changeday(Number(result.car[0].create_time)*1000)
                    this.total = Number(result.car.length);
                    this.allTotal = Number(result.car[0].totle);
                    // 右侧数据
                    this.platoonData = result.info;
                }
            })
        },
        /**
         *  切换页码
         */
        changePage(index) {
            this.currentPage = index;
            this.getPlatoon();
        },
        /**
         * 单击数据
         */
        rowClick(data, index) {
            // 点击单行背景颜色变化
            let trNodes = $('.ivu-table-row td');
            trNodes.removeClass('td-click');
            $('.ivu-table-row').eq(index).find('td').addClass('td-click');
            // $('.right_table .ivu-table-body').fadeOut(150);    //淡入
            // $('.right_table .ivu-table-body').fadeIn(150);    //淡入
            // 获取当前门店详情数据
            this.platoonId = data.id;
            this.getPlatoonDeatil(data);
        },
        /**
         * 得到排单详情
         */
        getPlatoonDeatil(data) {
            // this.platoonData = [];
            this.$resetAjax({
                type: 'GET',
                url:  '/NewA/Carlist/info',
                data: {
                    loading: this.platoonId,
                },
                success: (res) => {
                    this.platoonData = res.data;
                    this.sumNum = Number(data.qty);
                    this.driver = data.driver;
                    if (data.driver == null || data.driver == '') {
                        data.driver = '无';
                        this.driver = data.driver;
                    } else {
                        this.driver = data.driver;
                    }
                    if (data.accompany == null || data.accompany == '') {
                        data.accompany = '无';
                        this.accompany = data.accompany;
                    } else {
                        this.accompany = data.accompany;
                    }
                }
            })
        },
        /**
         * 数组求和
         */
        numAdd(arr) {
            var a = 0;
            for(var i = 0; i < arr.length; i++){
                a += arr[i];
            }
            return a;
        },
        /**
         * 弹窗
         */
        instance (type) {
            const title = '提示';
            const content = '<p>Content of dialog</p><p>Content of dialog</p>';
            switch (type) {
                case 'info':
                    this.$Modal.info({
                        title: title,
                        content: content
                    });
                    break;
                case 'success':
                    this.$Modal.success({
                        title: title,
                        content: '棒棒哒,撤销成功！'
                    });
                    break;
                case 'warning':
                    this.$Modal.warning({
                        title: title,
                        content: content
                    });
                    break;
                case 'error':
                    this.$Modal.error({
                        title: title,
                        content: '亲亲抱歉,配送单号不能为空！'
                    });
                    break;
            }
        },
        /**
         * 打印跳转到新页面
         */
        goPrintPage() {
            let routeData = this.$router.resolve({ name: 'printPage', query: {loading: this.platoonId, driver: this.driver, accompany: this.accompany} });
            window.open(routeData.href, '_blank');
        },
        /**
         * 撤销当前行排单
         */
        cancelPlatoon(data) {
            this.$resetAjax({
                type: 'POST',
                url:  '/NewA/Carlist/backout',
                data: {
                    store_code: data.row.store_code,  // 当前行门店的CODE
                    id: this.platoonId,    // 左侧行的id
                },
                success: (res) => {
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = `棒棒哒, 撤销成功！`;
                    setTimeout(() => {
                        this.$root.tip.isShow = false;
                        this.getPlatoon();
                    }, 1500);
                }
            })
        }
    }
}
</script>
