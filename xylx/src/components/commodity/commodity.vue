<template>
     <div class="commodity" id="commodity">
        <div class="header_left">
            <div class="left">
                <div class="search">
                    <Input v-model="keyword" @on-enter="searchGoodsData" placeholder="请输入要搜索的内容..."/>
                    <Button slot="append" icon="ios-search"  @click="searchGoodsData"></Button>
                </div>
                <div class="selectPart" style="margin-left:45px;">
                    <span style="color:#1d8c9f;">商品分类：</span>
                    <Select v-model="goodsType" style="width:180px" @on-change="getgoodsType(goodsType)">
                        <Option value="" key="">全部</Option>
                        <Option v-for="item in goodsTypeList" :value="item.cls_no" :key="item.cls_no">{{ item.cls_name }}</Option>
                    </Select>
                </div>
                <div class="selectPart" style="margin-left:45px;">
                    <span style="color:#1d8c9f;">商品状态：</span>
                    <Select v-model="statusType" style="width:100px" @on-change="getstatusType(statusType)">
                        <Option value="" key="">全部</Option>
                        <Option v-for="item in statusTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
            </div>
            <div>
                    <button class="update" @click="update">更新商品</button> 
                    <button class="rank" @click="$router.push({path:'rankList'})">排行榜</button> 
            </div>
                
        </div>
        <!-- 内容区 -->
        <div class="contanier">
            <!-- 商品信息 -->
            <div class="table">
                <Table border :height="tableHeight"  :columns="columns" :data="goodsData"></Table>  
            </div>
            <!-- footer -->
            <div class="footer">
                <!-- 分页 -->
                <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
            </div>
        </div>
        <Modal :title="goodName" class="modal" v-model="isModal" class-name="vertical-center-modal" :mask-closable="false">
            <p class="img" style="width:440px;height:440px;padding-left:20px;">
                <img :src="imgUrl" alt="" />
            </p>
        </Modal>
        <!-- 加载进度 -->
        <spin v-if="spinShow"></spin>
     </div>
</template>
<script>
import spin from '../spin.vue'
export default {
    components:{
        // 加载进度
        spin,
    },
    data() {
        return {
            // 是否显示加载进度
            spinShow:false,
            // 搜索关键词
            keyword: '',
            // 状态类型
            statusType: 1,
            // 状态内容
            statusContent: [],
            // 商品分类
            goodsType: '',
            // 商品分类数据
            goodsTypeList: [],
            // 商品状态数据
            statusTypeList: [
                {
                    value: 1,
                    label: '在线'
                },
                {
                    value: 2,
                    label: '不在线'
                }
            ],
            // 商品列表表头数据
            columns: [
                {
                    title: '商品条码',
                    key: 'item_no'
                },
                {
                    title: '商品名称',
                    width: 280,
                    key: '',
                    render: (h, params) => {
                        // 鼠标经过有提示
                        return h('div', [
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                },
                                domProps: {
                                    title: params.row.item_name
                                }
                            }, params.row.item_name),
                            h('span', {
                                style: {
                                    display: params.row.item_en === null ? '' : 'inline-block',
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                },
                                domProps: {
                                    title: params.row.item_en
                                }
                            }, params.row.item_en)
                        ])
                    }
                },
                {
                    title: '商品图片',
                    key: 'img',
                    align: 'center',
                    // 单元格插入图片
                    render: (h, params) => {
                        return h('img', {
                            style: {
                                //设置样式
                                width: params.row.img ? '80px' : '',
                                'height': params.row.img ? '80px' : '',
                                'border-radius': '5%',
                                border: 0,
                                cursor: 'pointer'
                            },
                            attrs: {
                                //设置属性
                                src: params.row.img ? params.row.img : ''
                            },
                            domProps: {
                                title: params.row.img ? '点击查看大图' : '',
                            },
                            on: {
                                click: () => {
                                    this.isModal = true;
                                    $('.ivu-modal-footer .ivu-btn-text').text('');
                                    $('.ivu-modal-footer .ivu-btn-primary').text('关闭');
                                    this.goodName = params.row.item_name;
                                    this.imgUrl = params.row.img.replace('/80', '/440');
                                }
                            }
                        });
                    }
                },
                {
                    title: '零售价',
                    key: 'sale_price'
                },
                {
                    title: '配送价',
                    key: 'base_price'
                },
                {
                    title: '配送区域',
                    key: 'showtype'
                },
                {
                    title: '商品状态',
                    key: 'status',
                    render:(h, {row}) => {
                        return h('div', [
                            // 设置气泡式提醒
                            h('Tooltip', {
                                props: {
                                    placement: row.statu ? 'top' : '',
                                }
                            }, [
                                    h('div', 
                                    {
                                        slot: 'content',
                                        style: {
                                            whiteSpace: 'normal',
                                        },
                                    },  `配送区域：${row.showtype}； 规格：${row.purchase_spec}； 海外仓库存：${row.stock_en}； 库存：${row.stock_num} ; 库存占用：${row.occupyStock} ; 是否显示：${row.display_flag == '1' ? '是' : '否'} `// 气泡内的文字
                                    ),
                                    
                                    // 设置icon
                                    h('div', [
                                        h('icon', {
                                            props: {
                                            type: 'ionic',
                                        },
                                        style: {
                                            color: row.statu === '1' ? 'blue' : '#ed3f14',
                                            fontSize: '20px',
                                            cursor: 'pointer'
                                        },
                                        on: {
                                            click: () => {
                                                // 对当前的商品状态进行点击获取当前商品购物车及未完成的订单
                                                this.$router.push({path: 'goodDetail', query: {item_no: row.item_no, item_name: row.item_name}});
                                            }
                                        }
                                        })
                                    ])
                                ],
                                
                            ),
                            
                        ])
                        
                    }
                },
                // {
                //     title: '规格',
                //     key: 'purchase_spec'
                // },
                // {
                //     title: '是否显示',
                //     key: 'display_flag'
                // },
                // {
                //     title: '库存占用',
                //     key: 'occupyStock'
                // },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '10px',
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({path: 'analysis', query: {item_no: params.row.item_no, item_name: params.row.item_name}});
                                    }
                                }
                            }, '走势'),
                        ]);
                    }
                }
                
            ],
            // 模态框标题
            goodName: '',
            // 是否显示模态框
            isModal:false,
            // 模态框里图片地址
            imgUrl: '',
            // 表格高度
            tableHeight: 900,
            // 商品列表数据
            goodsData: [],
            // 总数
            total: 0,
            // 当前页有几条数据
            pageSize: 20,
            // 当前页码
            currentPage: 1,
            //占用库存
            occupyStock:'',
            row:{}
        }
    },

    // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 220);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 220);
        })
    },

    created() {
        // 获取商品列表数据
        this.getGoodsData();
        // 获取商品分类
        this.getGoodsType();
        
    },

    methods:{
    
        /**
         * 获取商品列表数据
         */
        getGoodsData() {
            this.$resetAjax({
                url: '/NewA/Goods/index',
                type: 'GET',
                data: {
                    p: this.currentPage,
                    keyword: this.keyword,
                    status: this.statusType,
                    cate: this.goodsType
                },
                success:(res) => {
                    var data=res.data.list;
                    this.total = Number(res.data.count);
                    
                    data.forEach(ele =>{
                        ele['occupyStock']=this.occupyStock;
                        if (ele.showtype == '1') {
                            ele.showtype = '国内'
                        } else if (ele.showtype == '2') {
                            ele.showtype = '国外'
                        } else {
                            ele.showtype = '全部'
                        }
                        /* 获取占用库存 */
                        this.item_no=ele.item_no;
                        this.$resetAjax({
                            url:'/NewA/Goods/getinfo',
                            type:'POST',
                            data:{
                                item_no:ele.item_no
                            },
                            success:(res)=>{
                                this.occupyStock=res.data;
                                ele['occupyStock']=this.occupyStock;
                            }
                        })
                        
                    });
                    this.goodsData=data;
                }
            })
            
        },
        /**
         * 获取商品分类
         */
        getGoodsType() {
             this.$resetAjax({
                url: '/NewA/Public/getCate',
                type: 'GET',
                success:(res) => {
                    this.goodsTypeList = JSON.parse(res).data;
                }
            })
        },
        /**
         * 搜索得到商品列表数据
         */
        searchGoodsData() {
            this.currentPage = 1;
            this.getGoodsData();
        },
        /**
         * 改变页数得到商品列表
         */
        changePage(index) {
            this.currentPage = index;
            this.getGoodsData();
        },
        /**
         * 得到状态
         */
        getstatusType(statusType) {
            this.currentPage = 1;
            this.keyword = '';
            this.statusType = statusType;
            this.getGoodsData();
        },
        /**
         * 得到选中哪个商品分类
         */
        getgoodsType(goodsType) {
            this.currentPage = 1;
            this.goodsType = goodsType;
            this.getGoodsData();
        },
        // 更新商品
        update(){
            this.spinShow=true;
            this.$resetAjax({
                url:'/NewA/Goods/savegoods',
                type:'GET',
                success:(res)=>{
                    console.log(res);
                    this.spinShow=false;
                    if(res.errorcode==0){
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '更新成功！';
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                        }, 3000);
                    }else if(res.errorcode==200){
                        this.$root.tip.content = '没有需要更新的数据';
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                        }, 3000);
                    }
                }
            })
        }
        
    },
}
</script>
