
<template>
    <div class="shopManage">
        <div class="top">
            <div class="item">
                <p>店名 / 编码: </p>
                <Input v-model="keyword" placeholder="请输入店名或店编码..." style="width:180px;" />
                <span @click="searchShop"><Icon type="ios-search-strong"></Icon></span>
            </div>
        </div>
        <p class="add_btn" @click="query">新增</p>
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
                <FormItem label="区域" prop="district">
                    <Input v-model="formValidate.district" placeholder=" 请输入门店区域..." />
                </FormItem>
                <!-- @on-change="loadData" -->
                <FormItem label="城市" prop="city" class="cityClass">
                    <Cascader :data="cityData" v-model="formValidate.city" change-on-select   @on-change="handleChange"  trigger="hover"  placeholder="请选择城市"></Cascader>
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
            editId: '',
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
                    key: 'target',
                    title: '销售目标'
                },
                {
                    align: 'center',
                    key: 'district',
                    title: '区域'
                },
                {
                    align: 'center',
                    key: 'city',
                    title: '城市'
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
                                        this.editId = row.id;
                                        console.log(row);
                                        this.formValidate = {
                                            store_name: row.store_name,                                 // 店名
                                            store_code: row.store_code,                                 // 编码
                                            longitude: row.longitude || '',     // 经度
                                            latitude: row.latitude  || '',       // 纬度
                                            area: row.area,               // 面积
                                            manager: row.manager,                                       // 店长
                                            clerk: row.clerk,            // 人数
                                            department: row.department || '',   // 部门
                                            rent: row.rent,               // 租金
                                            status: row.status,                                         // 状态
                                            district: row.district,     // 区域
                                            
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
                area: 0.00,          // 面积
                manager: '',       // 店长
                clerk: 0,         // 人数
                department: '',    // 部门
                rent: 0.00,          // 租金
                status: '',        // 状态
                district: '',     // 区域
                city:''
            },
            ruleValidate: {
                store_name: [
                    { required: true, message: '门店名称不能为空', trigger: 'blur' }
                ],
                store_code: [
                    { required: true, message: '门店编码不能为空', trigger: 'blur' },
                    { type: 'string', min: 5, max: 5, message: '门店编码为5位数', trigger: 'blur' }
                ],
                department: [
                    { required: true, message: '部门不能为空', trigger: 'blur' }
                ],
                manager: [
                    { required: true, message: '门店店长不能为空', trigger: 'blur' }
                ],
                status: [
                    { required: true, message: '门店状态不能为空', trigger: 'blur' }
                ],
                clerk: [
                    { required: true, message: '门店人数不能为空', trigger: 'blur' }
                ],
                rent: [
                    { required: true, message: '门店租金不能为空', trigger: 'blur' }
                ],
                area: [
                    { required: true, message: '门店面积不能为空', trigger: 'blur' }
                ],
                district: [
                    { required: true, message: '区域不能为空', trigger: 'blur' }
                ],
                city: [
                    { required: true, message: '城市不能为空', trigger: 'blur' }
                ],
            },
            // 城市数据
            cityData:[
                {
                    value:'',
                    label:'',
                    children:[
                        {
                            value:'',
                            label:'',
                            children:[
                                {
                                    value:'',
                                    label:''
                                }
                            ]
                        }
                    ]
                }
            ]
            
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
        this.getCity();
    },

    methods: {
        /**
        * 转化ztree数据；数据递归处理
        * @param {Array} data 需要转换的数据
        */
        dgZtree(data) {
            
            data.forEach(item => {
                // title转化
                item.label = item.city;
                item.value = item.cityid
                // // 当前节点是否要展开
                // item.value = item.dept_id;
                // 是否选中当前节点
                // item.selected = false;
                // 如果当前节点有子节点，再次把子节点进行递归处理；数据判断，子节点数据是数组，防止报错
                if (item.children instanceof Array && item.children.length) {
                    this.dgZtree(item.children);
                }
            })
            return data;
        },
        /* 获取城市 */
        getCity(){
            this.$resetAjax({
                url:'/NewA/Storelist/getcity',
                type:'POST',
                // data,
                success:(res)=>{
                    let result = JSON.parse(res);
                    this.cityData = this.dgZtree([JSON.parse(res)][0]);
                }
            })
        },
        handleChange(value, selectedData){
            this.formValidate.city=value[value.length-1];
        },
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
        query() {
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
                district: '',     // 区域
                city:''
            };
        },
        /**
         * 请求判断并验证
         */
        goQuery() {
            this.$refs.formValidate.validate((valid) => {
                if (!valid) {
                    return false;
                }
                if(this.title === '新增') {
                    this.addShopquery()
                } else{
                   this.editShopQuery();
                }
                    
                
            })
        },
        /**
         * 新增请求
         */
        addShopquery() {
            var token = this.getToken(this.formValidate); 
            
            var data = {token,};
            for(var k in this.formValidate) {
                if(!(this.formValidate[k].length === 0 || this.formValidate[k] === '')) {
                    data[k] = this.formValidate[k];
                }
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
                                district: '',     // 区域
                                city:''
                            };
                            this.isShow = false;
                            this.getShopList();
                            break;
                        case 1:
                            this.$Message.error(`${result.msg}`);
                        }
                }
            })
        },
        /**
         * 编辑请求
         */
        editShopQuery() {
            var data1 = {};
            this.formValidate.clerk === '' ? '0' : this.formValidate.clerk;
            var dataObj = this.formValidate;
            // console.log(dataObj);
            
            var data2 = {id:this.editId};
            for(var key in dataObj) {
                data2[key] = dataObj[key]
            };
            for(var i in data2) {
                if(data2[i] === "" ) {
                    data1[i] = data2[i];
                    delete data2[i]
                }
            }
            console.log(data2)
            debugger
            // console.log(data2);
            var token = this.getToken(data2); 
            data2.token = token;
            this.$resetAjax({
                url:'/NewA/Storelist/update',
                type:'POST',
                data: data2,
                success:(res) =>{
                    let result = JSON.parse(res);
                    switch(result.errorcode) {
                        case 0:
                            this.$Message.success('棒棒哒,编辑成功');
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
                                district: '',     // 区域
                                city:''
                            };
                            this.isShow = false;
                            this.getShopList();
                            break;
                        case 1:
                            this.$Message.error(`您没有修改当前门店`);
                            setTimeout(() => {
                                this.isShow = false;
                            }, 1500);
                        }
                }
            })
        },
        /**
         * 获取参数的加密的Token值  obj对象
         */
        getToken(obj) {
           
            var tokenStr = '',
            objValue = Object.values(obj);
            objValue.forEach(ele => {
                if (ele.trim()) {
                    tokenStr += this.$md5(ele.trim())
                    // console.log(ele);
                    console.log(tokenStr);
                }
            })
            console.log(this.$md5(tokenStr));
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
