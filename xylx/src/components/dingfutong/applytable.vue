<template>
    <div class="applytable">
        <div class="contanier">
            <div class="top">
                <div class="operation">
                    <Button type="info" large @click="$router.push({path: 'apply'})">申请</Button>
                    <Button type="error" large @click="remove(idArr)">批量删除</Button>
                </div>
                <div class="search">
                    <Input v-model="keyword" placeholder="请输入要搜索的内容" @on-enter="searchApply" @on-change="searchApply" />
                    <Button slot="append" icon="ios-search" @click="searchApply"></Button>
                </div>
            </div>
            <!-- 列表区 -->
            <div class="middle">
                <Table border ref="selection" :columns="columns" :data="tableData" :height="tableHeight" @on-selection-change="checkMore"></Table>
            </div>
             <!-- 分页 -->
            <div class="footer">
                <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
            </div>
        </div>
        <!-- 提示框 -->
        <tip v-if="isShow" :tipContent="tip"></tip>
        <!-- 提示是否删除 -->
        <div class="outside" v-if="isDelete">
            <div class="delete">
                <p>确认删除？</p>
                <div class="build">
                    <button type="close" @click="isDelete=false">取消</button>
                    <button type="checkmark"  @click="remove(idArr)">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import tip from '../tip.vue'

export default {
    components: {
        tip,
    },
    
    data() {
        return {
            // 表格高度
            tableHeight: 900,
            // 是否隐藏
            applytable: false,
            visitpage: false,
            backstage: false,
            // 是否删除
            isDelete: false,
            // 当前选中nav里面的哪个li
            currentIndex: 3,
            // 搜索的关键词
            keyword: '',
            // 商户的id
            hd_id: '',
            // （string）（证件号）
            id_num: '',
            // 联系人
            contact: '',
            // 用户名
            userName: 'xxl',
            // 用户头像
            userHeader: '',
            // 数据的id的集合
            idArr: [],
            // 表头的数据
            columns: [
                {
                    type: 'selection',
                    width: 60,
                    align: 'center'
                },
                {
                    title: '门店编码',
                    width: 100,
                    key: 'hd_id'
                },
                {
                    title: '门店名称',
                    width: 150,
                    key: 'shop_name'
                },
                {
                    title: '营业执照号码',
                    key: 'registration_number'
                },
                {
                    title: '账户名称',
                    width: 100,
                    key: 'account_name',
                },
                {
                    title: '银行账号',
                    key: 'bank_num',
                },
                {
                    title: '威付通号',
                    width: 150,
                    key: 'pay_num',
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    color: '#495060',
                                    fontSize: '12px'
                                },
                                domProps: {
                                    title: '点击登录威付通'
                                },
                                on: {
                                    click: () => {
                                        window.open("https://unionpayshmch.swiftpass.cn/");    
                                    }
                                }
                            }, params.row.pay_num),
                        ])
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 320,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type: 'edit',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '20px',
                                    cursor: 'pointer',
                                    // border:'1px solid #ddd',
                                    padding:'5px',
                                    fontSize:'15px'
                                },
                                domProps:{
                                    title:'编辑'
                                },
                                on: {
                                    click: () => {
                                        this.$router.push({path: 'apply', query: {data: params.row}})
                                    }
                                }
                            }, '编辑'),
                            h('Icon', {
                                props: {
                                    type: 'ios-trash-outline',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '20px',
                                    cursor: 'pointer',
                                    // border:'1px solid #ddd',
                                    padding:'5px',
                                    fontSize:'20px'
                                },
                                domProps:{
                                    title:'删除'
                                },
                                on: {
                                    click: () => {
                                        this.isDelete = true;
                                        this.idArr.push(params.row.id)
                                    }
                                }
                            }, '删除'),
                            h('Icon', {
                                props: {
                                    type: 'image',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '20px',
                                    cursor: 'pointer',
                                    // border:'1px solid #ddd',
                                    padding:'5px',
                                    fontSize:'16px'
                                },
                                domProps:{
                                    title:'下载图片'
                                },
                                on: {
                                    click: () => {
                                        location.href = `/NewA/Dingfutong/download?id=${params.row.id}`
                                    }
                                }
                            }, '下载图片'),
                            h('Icon', {
                                props: {
                                    type: 'ios-cloud-download-outline',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '20px',
                                    cursor: 'pointer',
                                    // border:'1px solid #ddd',
                                    padding:'5px',
                                    fontSize:'16px'
                                },
                                domProps:{
                                    title:'下载Excel'
                                },
                                on: {
                                    click: () => {
                                        location.href = `/NewA/Dingfutong/daochu?id=${params.row.id}`
                                    }
                                }
                            }, '下载EXcel')
                        ]);
                    }
                }
            ],
            // 表格列表数据
            tableData: [],
            // 总条数 
            total: 0,
            // 页面条数
            pageSize: 20,
            // 是否显示提示框
            isShow: false,
            // 提示框提示内容
            tip: '删除成功',
            // 第几页
            currentPage: 1,
            
        }
    },

    created() {
        // 得到鼎付通数据
        this.getList();
    },

    // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 240);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 240);
        })
      
    },

    methods: {
        /**
         * 跳转到申请鼎付通页面里
         */
        godftApply() {
            this.currentIndex = 1;
            this.$router.push({path: 'apply'})
        },
        /**
         * 跳转到门店管理 
         */
        storeManage() {
            this.$router.push({path: 'visit'})
        },
        /**
         * 得到鼎付通数据
         */
        getList() {
            this.$resetAjax({
                type:'GET',
                url:  '/NewA/Dingfutong/getList',
                data: {
                    p: this.currentPage,
                    keyword: this.keyword,
                },
                success:(res) => {
                    this.tableData = res.data.list;
                    this.total = Number(res.data.count);
                }
            })
        },
        /**
         * 查找数据
         */
        searchApply() {
            this.getList();
        },
        /**
         * 删除数据
         */
        remove() {
            this.isDelete = false;
            this.$resetAjax({
                type: 'POST',
                url:  '/NewA/Dingfutong/delete',
                data: {
                    id: this.idArr
                },
                success: (res) => {
                    if (res.errorcode == 0) {
                        this.isShow = true;
                        setTimeout(() => {
                            this.isShow = false;
                            this.currentPage = 1;
                            this.getList();
                        }, 1000);
                    } else if (res.errorcode == 2) {
                        this.isShow = true;
                        this.tip = "抱歉，您没有权限删除数据";
                        setTimeout(() => {
                            this.isShow = false;
                            this.currentPage = 1;
                            this.getList();
                        }, 2000);
                    }
                    
                }
            })
        },
        /**
         * 多项选择
         */
        checkMore(selection) {
            this.idArr = selection.map(ele => {
               return ele.id
            });
        },
        /**
         * 分页显示
         */
        changePage(index) {
            this.currentPage = index;
            this.getList();
        }
    }
}
</script>

