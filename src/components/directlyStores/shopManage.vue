
<template>
    <div class="shopManage">
        <div class="top">
            <div class="item">
                <p>店名 / 编码: </p>
                <Input v-model="keyword" placeholder="请输入店名或店编码..." style="width:180px;" />
                <span @click="searchShop"><Icon type="ios-search-strong"></Icon></span>
            </div>
        </div>
        <p class="add_btn" @click="addShop">新增</p>
        <div class="table">
            <Table  :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
        <!-- 分页 -->
        <div class="footer">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 弹窗 -->
        <Modal v-model="isShow" :title="title" @on-cancel="isShow=false" class="shopManagePop">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="店名" prop="store_name">
                    <Input v-model="formValidate.store_name" placeholder=" 请输入店名..." />
                </FormItem>
                <FormItem label="编码" prop="store_code">
                    <Input v-model="formValidate.store_code" placeholder=" 请输入编码..." />
                </FormItem>
                 <FormItem label="店长" prop="manager">
                    <Input v-model="formValidate.manager" placeholder=" 请输入店长名称..." />
                </FormItem>
                <FormItem label="部门" prop="department">
                    <Input v-model="formValidate.department" placeholder=" 请输入部门..." />
                </FormItem>
                <FormItem label="人数" prop="clerk">
                    <Input v-model="formValidate.clerk" placeholder=" 请输入店面员工人数..." />
                </FormItem>
                <FormItem label="面积" prop="area">
                    <Input v-model="formValidate.area" placeholder=" 请输入店面面积..." />
                </FormItem>
                <FormItem label="租金" prop="rent">
                    <Input v-model="formValidate.rent" placeholder=" 请输入门店租金..." />
                </FormItem>
                <FormItem label="状态" prop="status" v-if="title==='编辑'">
                    <Input v-model="formValidate.status" placeholder=" 请输入门店状态..." />
                </FormItem>
                <FormItem label="经度" prop="longitude">
                    <Input v-model="formValidate.longitude" placeholder=" 请输入门店所在经度..." />
                </FormItem>
                <FormItem label="纬度" prop="latitude">
                    <Input v-model="formValidate.latitude" placeholder=" 请输入门店所在纬度..." />
                </FormItem>
            </Form>
            <p class="submit"><span @click="goQuery">保存</span></p>
        </Modal>
    </div>
</template>









<script>
// import {getToken} from '@/assets/js/tool.js'
export default {
    data() {
        return {
            currentPage: 1,         // 当前页码
            keyword: '',             // 关键字查询
            tableData: [],           // 表格列表数据
            tableHeight: 900,        // 表格高度
            columns: [               // 表头
                 {
                    align: 'center',
                    key: 'store_name',
                    title: '店名',
                    width: 180
                },
                {
                    align: 'center',
                    key: 'store_code',
                    title: '编码'
                },
                {
                    align: 'center',
                    key: 'manager',
                    title: '店长'
                },
                {
                    align: 'center',
                    key: 'department',
                    title: '部门'
                },
                {
                    align: 'center',
                    key: 'status',
                    title: '状态'
                },
                {
                    align: 'center',
                    key: 'area',
                    title: '面积'
                },
                {
                    align: 'center',
                    key: 'rent',
                    title: '租金'
                },
                {
                    align: 'center',
                    key: 'clerk',
                    title: '人数'
                },
                
                {
                    align: 'center',
                    key: 'district',
                    title: '区域'
                },
                {
                    align: 'center',
                    key: 'longitude',     
                    title: '经度'
                },
                {
                    align: 'center',
                    key: 'latitude',
                    title: '纬度'
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, {row}) => {
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type: 'edit',
                                    size: 'small',
                                    color: '#30aee0',
                                },
                                style: {
                                    cursor: 'pointer'
                                },
                                domProps:{
                                    title:'编辑'
                                },
                                on: {
                                    click: () => {
                                        this.isShow = true;
                                        this.title = '编辑';
                                        this.formValidate = {
                                            store_name: row.store_name,                                 // 店名
                                            store_code: row.store_code,                                 // 编码
                                            longitude: row.longitude === null ? row.longitude : '',     // 经度
                                            latitude: row.longitude === null ? row.latitude : '',       // 纬度
                                            area: row.longitude === null ? row.area : '',               // 面积
                                            manager: row.manager,                                       // 店长
                                            clerk: row.longitude === null ? row.clerk : '',             // 人数
                                            department: row.longitude === null ? row.department : '',   // 部门
                                            rent: row.longitude === null ? row.rent : '',               // 租金
                                            status: row.status,                                         // 状态
                                        };
                                    }
                                }
                            }),
                            h('span', [
                                h('Poptip', {
                                    class: 'delete',
                                    style: {
                                        cursor: 'pointer',
                                        marginLeft: '15px'
                                    },
                                    props: {
                                        confirm: true,
                                        transfer: true,
                                        placement: 'top',
                                        title: '确定要删除吗 ?',
                                        type: 'error',
                                        size: 'small',
                                        width: '150',
                                        vModel: true
                                    },
                                    domProps:{
                                        title:'删除'
                                    },
                                    on: {
                                        'on-ok': ()=>{
                                            this.deleteQuery(row.id)
                                        },
                                        'on-cancel': ()=>{
                                            // 取消删除
                                        }
                                    }
                                }, [
                                    h('Icon',{
                                        props: {
                                            type: 'trash-a',
                                            size:18
                                        }
                                    })
                                ])
                            ]),
                        ]);
                    }
                }
            ],     
            total: 0,               // 总页数
            pageSize: 20,           // 条数
            isShow: false,           // 是否显示弹窗
            title: '新增',          // 弹窗标题
            formValidate: {
                store_name: '',    // 店名
                store_code: '',    // 编码
                longitude: '',     // 经度
                latitude: '',      // 纬度
                area: '',          // 面积
                manager: '',       // 店长
                clerk: '',         // 人数
                department: '',    // 部门
                rent: '',          // 租金
                status: '',        // 状态
            },
            ruleValidate: {
                store_name: [
                    { required: true, message: '门店名称不能为空', trigger: 'blur' }
                ],
                store_code: [
                    { required: true, message: '门店编码不能为空', trigger: 'blur' },
                    { type: 'string', min: 5, max: 5, message: '门店编码为5位数', trigger: 'blur' }
                ],
                manager: [
                    { required: true, message: '门店店长不能为空', trigger: 'blur' }
                ],
                status: [
                    { required: true, message: '门店状态不能为空', trigger: 'blur' }
                ]
            }
            
        }
    },

    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 290);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 290);
        })
    },
    created() {
        // 得到所有直营门店数据
        this.getShopList();
    },

    methods: {
        /**
         * 得到所有直营门店数据
         */
        getShopList() {
            var data = {
                p: this.currentPage,
                token: '',
                keyword: this.keyword,
            }
            if(this.keyword !== '') {
                data = {
                    p: this.currentPage,
                    token: this.$md5(this.$md5(String(this.currentPage)) + (this.$md5(this.keyword))),
                    keyword: this.keyword
                }
            } else {
                data = {
                    p: this.currentPage,
                    token: this.$md5(this.$md5(String(this.currentPage))),
                };
            }
            this.$resetAjax({
                url:'/NewA/Storelist/get_list',
                type:'GET',
                data,
                success:(res)=>{
                    let result = JSON.parse(res);
                    this.tableData = result.list;
                    this.total = Number(result.count);
                }
            })
        },
        /**
         * 查询门店
         */
        searchShop() {
            this.currentPage = 1;
            this.getShopList();
        },
        /**
         * 切换页码
         */
        changePage(index) {
            this.currentPage = index;
            this.getShopList();
        },
        /**
         * 新增店面准备
         */
        addShop() {
            this.isShow = true;
            this.title = '新增';
            this.formValidate = {
                store_name:  '',    // 店名
                store_code:  '',    // 编码
                longitude:  '',     // 经度
                latitude:  '',      // 纬度
                area:  '',          // 面积
                manager:  '',       // 店长
                clerk:  '',         // 人数
                department:  '',    // 部门
                rent:  '',          // 租金
            };
        },
        /**
         * 请求判断并验证
         */
        goQuery() {
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    if(this.title === '新增') {
                        var token = this.getToken(this.formValidate); 
                            var data = {token,};
                            for(var k in this.formValidate) {
                                if(!(this.formValidate[k].length === 0 || this.formValidate[k] === '')) {
                                    data[k] = this.formValidate[k];
                                } else {}
                            }
                            this.$resetAjax({
                                url:'/NewA/Storelist/add',
                                type:'POST',
                                data: data,
                                success:(res)=>{
                                    let result = JSON.parse(res);
                                    switch(result.errorcode) {
                                        case 0:
                                            this.$Message.success('棒棒哒,新增成功');
                                            this.formValidate = {
                                                store_name:  '',    // 店名
                                                store_code:  '',    // 编码
                                                longitude:  '',     // 经度
                                                latitude:  '',      // 纬度
                                                area:  '',          // 面积
                                                manager:  '',       // 店长
                                                clerk:  '',         // 人数
                                                department:  '',    // 部门
                                                rent:  '',          // 租金
                                            };
                                            this.isShow = false;
                                            this.getShopList();
                                            break;
                                        case 1:
                                            this.$Message.error(`${result.msg}`);
                                        }
                                }
                            })
                    } else{
                        var token = this.getToken(this.formValidate); 
                            var data = {token,};
                            for(var k in this.formValidate) {
                                if(!(this.formValidate[k].length === 0 || this.formValidate[k] === '')) {
                                    data[k] = this.formValidate[k];
                                } else {}
                            }
                            this.$resetAjax({
                                url:'/NewA/Storelist/update',
                                type:'POST',
                                data: data,
                                success:(res) =>{
                                    let result = JSON.parse(res);
                                    switch(result.errorcode) {
                                        case 0:
                                            this.$Message.success('棒棒哒,新增成功');
                                            this.formValidate = {
                                                store_name:  '',    // 店名
                                                store_code:  '',    // 编码
                                                longitude:  '',     // 经度
                                                latitude:  '',      // 纬度
                                                area:  '',          // 面积
                                                manager:  '',       // 店长
                                                clerk:  '',         // 人数
                                                department:  '',    // 部门
                                                rent:  '',          // 租金
                                                status: '',         // 状态
                                            };
                                            this.isShow = false;
                                            break;
                                        case 1:
                                            this.$Message.error(`${result.msg}`);
                                        }
                                }
                            })
                    }
                    
                } else { }
            })
        },
        /**
         * 获取参数的加密的Token值  obj对象
         */
        getToken(obj) {
            var tokenStr = '',
                objValue = Object.values(obj);
            objValue.forEach(ele => {
                if(ele.length === 0 || ele === '') {
                    tokenStr = tokenStr
                } else {
                    tokenStr += this.$md5(ele)
                }
            })
            return this.$md5(tokenStr)
        },
        /**
         * 删除门店
         */
        deleteQuery(id) {
            this.$resetAjax({
                url:'/NewA/Storelist/delete',
                type:'POST',
                data:{
                    id,
                    token: this.getToken({id:id})
                },
                success:(res)=>{
                    let result = JSON.parse(res);
                    switch(result.errorcode) {
                        case 0:
                            this.$Message.success('棒棒哒,删除成功');
                            this.getShopList();
                            break;
                        default:
                            this.$Message.error(`${result.msg}`);
                    }
                    
                }
            })
        }
        
    }
}
</script>
