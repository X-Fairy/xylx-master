<template>
    <div class="daily">
        <!-- 头部 -->
        <div class="top">
            <div class="left">
                <span class="item">日期</span>
                <DatePicker type="daterange" :options="options4" placeholder="请选择日期" @on-change="getDateRange"></DatePicker>
            </div>
            <button @click="$router.push({path: 'backstage'})">返回后台人员列表</button>
        </div>
       <!-- 内容区 -->
       <div class="table">
            <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
        <div class="footer" v-if="isShow">
            <!-- 分页 -->
            <!-- <Page :page-size="pageSize" @on-change="changePage" :current="currentPage"></Page> -->
            <a @click="getHomePage"  :class="{selected: currentIndex == 1}">首页</a>
            <a @click="getUpPage" :class="{selected: currentIndex == 2}" v-show="isUpPage">上一页</a>
            <a @click="getNextPage" :class="{selected: currentIndex == 3}" v-show="isNextPage">下一页</a>
            <a @click="getEndPage"  :class="{selected: currentIndex == 4}" v-show="isEndPage">尾页</a>
        </div>
    </div>
</template>


<script>
import {getUrlParams} from  '@/assets/js/tool.js'
import {changeday} from  '@/assets/js/tool.js'

export default {
    data() {
        return {
            // 得到网址的参数对象
            urlParams: {},
            // 得到时间范围
            dateRange: [],
            // 对时间进行限制,选择不到大于今天的时间
            options4: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            // 表头
            columns: [
                {
                    title: '姓名',
                    key: 'creator_name'
                },
                {
                    title: '部门',
                    key: 'dept_name'
                },
                {
                    title: '提交时间',
                    key: 'create_time',
                    render: (h, params) => {
                        let texts = changeday(params.row.create_time);
                        return h('div', [
                            h('span', {
                            }, texts)
                        ])
                    }
                },
                {
                    title: '已完成工作',
                    key: 'today',
                    render: (h, params) => {
                        let texts = params.row.today;
                        if (params.row.today !== null) {
                            if (params.row.today.length > 12) {
                                texts = params.row.today.slice(0,12) + '...';
                            } else {
                                texts = params.row.today;
                            }
                        }
                        return h('div', [
                            h('Tooltip', {
                                props: {
                                    placement: 'top',
                                    transfer: true
                                }
                            }, [texts, h('span', {
                                slot: 'content',
                                style: {
                                    whiteSpace: 'normal'
                                }
                            }, params.row.today)
                            ])
                        ])
                    }
                },
                {
                    title: '未完成工作',
                    key: 'unfinished',
                    render: (h, params) => {
                        let texts = params.row.unfinished;
                        if (params.row.unfinished !== null) {
                            if (params.row.unfinished.length > 12) {
                                texts = params.row.unfinished.slice(0,12) + '...';
                            } else {
                                texts = params.row.unfinished;
                            }
                        }
                        return h('div', [
                            h('Tooltip', {
                                props: {
                                    placement: 'top',
                                    transfer: true
                                }
                            }, [texts, h('span', {
                                slot: 'content',
                                style: {
                                    whiteSpace: 'normal'
                                }
                            }, params.row.unfinished)
                            ])
                        ])
                    }
                },
                {
                    title: '需协调工作',
                    key: 'help',
                    render: (h, params) => {
                        let texts = params.row.help;
                        if (params.row.help !== null) {
                            if (params.row.help.length > 12) {
                                texts = params.row.help.slice(0,12) + '...';
                            } else {
                                texts = params.row.help;
                            }
                        }
                        return h('div', [
                            h('Tooltip', {
                                props: {
                                    placement: 'top',
                                    transfer: true
                                }
                            }, [texts, h('span', {
                                slot: 'content',
                                style: {
                                    whiteSpace: 'normal'
                                }
                            }, params.row.help)
                            ])
                        ])
                    }
                },
                 {
                    title: '备注',
                    key: 'remark',
                    render: (h, params) => {
                        let texts = params.row.remark;
                        if (params.row.remark !== null) {
                            if (params.row.remark.length > 12) {
                                texts = params.row.remark.slice(0,12) + '...';
                            } else {
                                texts = params.row.remark;
                            }
                        }
                        return h('div', [
                            h('Tooltip', {
                                props: {
                                    placement: 'top',
                                    transfer: true
                                }
                            }, [texts, h('span', {
                                slot: 'content',
                                style: {
                                    whiteSpace: 'normal'
                                }
                            }, params.row.remark)
                            ])
                        ])
                    }
                },
            ],
            // 内容数据
            tableData: [],
            // 表格高度
            tableHeight: 900,
            // 是否显示分页
            isShow: true,
            currentIndex : 1,
            // 是否显示上一页按钮
            isUpPage: false,
             // 是否显示下一页按钮
            isNextPage: true,
            // 是否显示尾页按钮
            isEndPage: false,
            // 连接下一页的核心关键字
            next_cursor: 0,
            // 连接下一页的核心关键数组
            next_cursorArr: [0],
            
        }
    },
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 220);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 220);
        })
      
    },


    created() {
        // 得到网址的参数
        this.getUrlData();
        // 得到日报列表
        this.getDailyList();
    },
    
    methods:{
        /**
         * 得到网址的参数
         */
        getUrlData:function(){
            this.urlParams = getUrlParams();
        },
        /**
         * 得到时间范围
         */
        getDateRange(date) {
            // 让首页按钮被选中
            this.currentIndex = 1;
            this.next_cursor = 0;
            this.next_cursorArr = [0]
            // 让上一页按钮隐藏
            this.isUpPage = false;
            // 让下一页按钮隐藏
            this.isNextPage = true;
            // 让尾页按钮隐藏
            this.isEndPage = false;
            // 得到选择的时间数组
            date.forEach(ele =>　{
                if (ele == '') {
                    this.dateRange = [];
                } else {
                    this.dateRange = date;
                }
            });
            this.getDailyList();
            // 让首页按钮被选中
            // this.currentIndex = 1;
            // 跳到首页的数据
            // this.next_cursor = 0;
            // 让上一页按钮隐藏
            // this.isUpShow = false;
            // 显示
            
        },
        /**
         * 得到日报列表数据
         */
        getDailyList() {
            this.$resetAjax({
                type: 'POST',
                url: '/NewA/Users/get_report',
                data: {
                    userid: this.urlParams.user_id,
                    timelist: this.dateRange,
                    next_cursor: this.next_cursor
                },
                success:(res) => {
                    let result = res.data;
                    this.tableData = result.list;
                    // 如果有更多提示，说明有下一页，说明要分页部分
                    if (result.has_more == true) {
                        this.isShow = true;
                        // 把当前的连接到下一个的push到数组里,用这个可以请求到下一页的数据,不能让数组里的数据有相同的
                        if (!this.next_cursorArr.includes(result.next_cursor)) {
                            this.next_cursorArr.push(result.next_cursor);
                        }
                    } else if (result.has_more == false && this.currentIndex == 1){
                        // 说明没有更多页数,不要用到分页部分
                        this.isShow = false;
                    } else if (result.has_more == false && this.currentIndex == 3) {
                        this.isEndPage = true;
                        this.isUpPage = true;
                        this.isNextPage = false;
                        this.currentIndex = 4;
                    }
                    
                    // 看下是否有多页
                    // if (result.has_more == true) {
                    //     
                    //     if (!this.next_cursorarr.includes(result.next_cursor)) {
                    //         this.next_cursorarr.push(result.next_cursor);
                    //     }
                    //     this.next_cursor = result.next_cursor;
                    // } else if (this.dateRange[0] == '' && result.has_more == false){
                    //     this.isShow = false;
                    // }
                }
            })
        },
        /**
         * 切换到首页
         */
        getHomePage() {
            this.currentIndex = 1;
            this.next_cursor = 0;
             // 让上一页隐藏
            this.isUpPage = false;
            // 让下一页显示
            this.isNextPage = true;
            // 让尾页隐藏
            this.isEndPage = false;
            this.getDailyList();
        },
         /**
         * 切换到上页
         */
        getUpPage() {
            this.currentIndex = 2;
            // 让尾页隐藏
            this.isEndPage = false;
            // 让上一页出现
            this.isNextPage = true;
            // 得到数组里的倒数索引位置1的数为下一页的关键接连
            this.next_cursor = this.next_cursorArr[this.next_cursorArr.length - 2];
            // 去请求下一页的数据
            this.getDailyList();
           // this.next_cursorArr.length = 2上一页就是首页了，把上一页按钮隐藏
            if (this.next_cursorArr.length == 2) {
                this.isUpPage = false;
                this.currentIndex = 1;
            }
            // 如果是有时间选择下的分页
            // if (this.dateRange.length !== 0) {
            // }
            // this.currentIndex = 2;
            // this.footerName = '下一页';
            // this.next_cursor = this.next_cursorarr[this.next_cursorarr.length - 2];
           
            // this.getDailyList();
            // if (this.next_cursorarr.length == 2) {
            //     this.isUpShow = false;
            //     this.currentIndex = 1;
            // }
        },
        /**
         * 切换到下页
         */
        getNextPage() {
            // 选中下一页按钮
            this.currentIndex = 3;
            // 得到数组里的倒数索引位置1的数为下一页的关键接连
            this.next_cursor = this.next_cursorArr[this.next_cursorArr.length -1];
            // 去请求下一页的数据
            this.getDailyList();
            // this.currentIndex = 3;
            // if (this.dateRange.length !== 0) {
            // }
            // 让上一页按钮显示
            // this.isUpShow = true;
            // this.$resetAjax({
            //     type: 'POST',
            //     url: '/NewA/Users/get_report',
            //     data: {
            //         userid: this.urlParams.user_id,
            //         timelist: this.dateRange,
            //         next_cursor: this.next_cursor
            //     },
            //     success:(res) => {
            //         this.tableData = res.data.list;
            //         if (res.data.has_more == true) {
            //             this.next_cursor = res.data.next_cursor;
            //         } else {
            //             this.footerName = '尾页'
            //         }
            //     }
            // })
            // console.log(this.next_cursorarr)
        },
        /**
         * 切换到尾页
         */
        getEndPage() {

        }
    }
}
</script>

