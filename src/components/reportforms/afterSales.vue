<template>

    <div class="afterSales">
        <!-- 查询 -->
        <div class="top">
            <div class="top_left">
                <div class="part">
                    <span class="item">商品条码</span>
                    <Input v-model="code" placeholder="请输入要搜索的商品条码" style="width: 280px" @on-enter="getCode(code)" />
                </div>
               <div class="part">
                    <span class="item">产品类别</span>
                    <Input v-model="saleType" placeholder="请输入要搜索的产品类别的编码" style="width: 280px" @on-enter="getSaleType(saleType)" />
                </div> 
                <div class="part">
                    <span class="item">时间选择</span>
                    <DatePicker type="datetimerange" v-model="dateList" :options="options4" placeholder="请选择时间区间" style="width: 280px" @on-change="getDateList"></DatePicker>
                </div>
            </div>
            <div class="top_right">
                <div class="part" v-if="isShow">
                    <span class="item">出库数量</span>
                    <Input v-model="outStock" style="width: 60px;" disabled />
                </div>
                <div class="part" v-if="isShow" style="margin: 0 5px;">
                    <span class="item">次品数量</span>
                    <Input v-model="defectiveGoods" style="width: 60px;" disabled />
                </div>
                <Button class="check" @click="getimage">查询</Button>
                <Button class="load" @click="getPdf">查看PDF文件</Button>
            </div>
        </div>
        <!-- 列表 -->
        <div class="table">
             <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
        <div class="footer">
            <!-- 分页  -->
            <Page  :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 查看图片轮播图 -->
        <div class="carouselcontent" v-if="carouse">
            <!-- <Icon type="ios-close-outline" class="close_icon" title="关闭弹窗" @click="carouse=false"></Icon> -->
            <Carousel v-model="value1" v-if="imageData.length" @on-change="changeIndex">
                <CarouselItem v-for="(item,index) in imageData" :key="index" >
                    <div class="demo-carousel">
                        <img :src="item.imgUrl" alt=""></div>
                    <div class="bottom">
                        <p>名称:<span>{{goodName}}</span></p>
                        <Button @click="carouse=false">关闭</Button>
                    </div>
                
                </CarouselItem>
            </Carousel>
        </div>
        <!-- 加载进度 -->
        <spin v-if="spinShow"></spin>
        <p class="login" @click="login">12456464563</p>
    </div>
</template>
<script>
import spin from '../spin.vue'
// 提示组件
import tipModal from '../tip.vue'
export default {
     components:{
        // 加载进度
        spin,
        tipModal
    },

    data() {
        return {
            value1: 0,
            // 商品条码
            code: '',
            // 时间选择
            dateList: [],
            // 出库数据
            outStock: '0',
            // 次品数据
            defectiveGoods: '0',
            // 对时间进行限制,选择不到大于今天的时间
            options4: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            // 得到哪个售后类型
            saleType: '',
            // 商品数据
            tableData: [],
            // 页面总数
            total: 0,
            // 每页条数
            pageSize: 20,
            // 当前页码
            currentPage: 1,
            // 是否显示模态框
            carouse:false,
            // 表格高度
            tableHeight: 900,
            // 有效的图片数据
            imageData: [],
            // 表头
            columns: [
                 {
                    title: '门店编码',
                    key: 'sissid'
                },
                {
                    title: '商品条码',
                    key: 'item_no'
                },
                {
                    title: '商品名称',
                    key: 'item_name'
                },
                {
                    title: '图片数量',
                    align: 'center',
                    // 单元格插入图片
                    render: (h, {row}) => {
                        let imageNum = 0;
                        // 判断有没有返回image这个字段
                        if (row.image !== undefined) {
                            imageNum = row.image.length;
                        } else {
                            imageNum = 0;
                        }
                        return h('div', {
                            style: {
                                cursor: 'pointer'
                            },
                            domProps: {
                                title: imageNum !== 0 ? '点击查看大图' : '暂无图片',
                            },
                            on: {
                                click: (e) => {
                                    // 如果有图片，可以查看大图;没有图片，不能点击查看图片
                                    if (imageNum !== 0) {
                                        this.goodName = row.item_name;
                                        this.carouse = true;
                                        this.value1=0;
                                        $('.ivu-modal-footer .ivu-btn-text').text('');
                                        $('.ivu-modal-footer .ivu-btn-primary').text('关闭');
                                        row.image.forEach(ele => {
                                             // 循环出是OSS类型的图片
                                            if (ele.type == 'OSS') {
                                                ele.imgUrl = ele.url.replace('/80', '/440');
                                            }
                                            
                                        });
                                        
                                        this.imageData = row.image;
                                    } else {
                                        return false;
                                    }
                                }
                            }
                        }, imageNum  );
                    }
                },
                {
                    title: '次品数量',
                    key: 'qty'
                },
                {
                    title: '理由',
                    key: 'reason',
                    render: (h, params) => {
                        let texts = params.row.reason;
                        if (params.row.reason !== null) {
                            if (params.row.reason.length > 12) {
                                texts = params.row.reason.slice(0,12) + '...';
                            } else {
                                texts = params.row.reason;
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
                            }, params.row.reason)
                            ])
                        ])
                    }
                },
                {
                    title: '售后时间',
                    key: 'sqrq'
                }
            ],
            // 是否显示出库和次品数量
            isShow: false,
            // 弹窗里面的图片名称
            goodName: '',
             // 是否显示加载进度条
            spinShow: false,
            index:0,
        }
    },
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 240);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 240);
        })
      
    },
    methods: {
        login() {
            this.$resetAjax({
                url: '/NewA/Miandenglu/index',
                type: 'POST',
                success:(res)=>{
                    console.log(1)
                },
            })
        },
        /**
         * 得到商品条码
         */
        getCode(code) {
            this.currentPage = 1;
        },
        /**
         * 得到时间范围
         */
        getDateList(date) {
            this.currentPage = 1;
            this.dateList = date;
        },
        /**
         * 得到售后类型
         */
        getSaleType(saleType) {
            this.currentPage = 1;
        },
         /**
         * 切换页面
         */
        changePage(index) {
            this.currentPage = index;
            this.getimage();
        },
        /**
         * 得到商品列表
         */
        getimage() {
            if (this.dateList[0] == '') {
                this.dateList = [];
            }
            if (this.saleType == '' && this.code == '') {
               this.$root.tip.isShow = true;
                this.$root.tip.content = '抱歉亲亲, 查询前商品编码和商品类型必填其中一项呢！';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 4000);
            } else {
                this.spinShow = true;
                this.$resetAjax({
                    url:  '/NewA/Aftersale/getimage',
                    type: 'GET',
                    data: {
                        // 商品条码   6939837658457
                        item_no: this.code,
                        // 页码
                        p: this.currentPage,
                        // 产品类型
                        cls_no: this.saleType,
                        // 时间
                        timelist: this.dateList
                    },
                    success: (res) => {
                        this.spinShow = false;
                        this.isShow = true;
                        this.outStock = res.data.chuku == null ? '0' : res.data.chuku ;
                        this.defectiveGoods = res.data.cipin == null ? '0': res.data.cipin ;
                        this.tableData = res.data.list;
                        this.total = Number(res.data.count);
                    }
                })
            }
        },
        
        /**
         * 查看PDF
         */
        getPdf() {
            if (this.saleType == '' && this.code == '') {
                this.$root.tip.isShow = true;
                this.$root.tip.content = '抱歉亲亲, 查看PDF文件前商品编码和商品类型必填其中一项呢！';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 4000);
            } else {
                    window.open(`/NewA/Aftersale/getpdf?item_no=${this.code}&timelist=${this.dateList}&cls_no=${this.saleType}`)
                }
            }
        }
    }
</script>
