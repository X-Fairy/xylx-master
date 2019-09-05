<template>
    <div class="logistics">
        <div class="top">
            <div class="left">
                <div class="left_item">
                    <Input v-model="name" placeholder="请输入物流公司名称..." style="width: 200px"  @on-enter="searchLogistics" />
                    <Button slot="append" icon="ios-search" class="append"  @click="searchLogistics"></Button>
                </div>
                <div class="left_item">
                    <span class="item_title">合作状态</span>
                    <Select v-model="model1" style="width:200px"  @on-change="getstatus(status)">
                        <Option v-for="item in cooperationData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
            </div>
        </div>
        <div class="table">
            <div class="table_top">
                <!-- <Button class="moreDel" @click="moreDel">多项删除</Button> -->
                <Button class="addlogistics" @click="addLogistics" title="点击新增物流公司">新增</Button> 
            </div>
            <Table border  :columns="columns" :height="tableHeight" :data="tableData" @on-selection-change="getMoreSelect"></Table>
        </div>
        <div class="footer">
            <!-- 分页 -->
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <Modal :title="modalTitle" v-model="isShow"  :mask-closable="false" @on-cancel="isShow=false" class="logistics_pop">
            <!-- :rules="ruleValidate" -->
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate"  :label-width="80">
                <FormItem label="联系姓名"  prop="linkman">
                    <Input v-model="formValidate.linkman" placeholder="请输入联系姓名..."  /> 
                </FormItem>
                <FormItem label="联系电话"  prop="tel">
                    <Input v-model="formValidate.tel" placeholder="请输入联系电话..."  /> 
                </FormItem>
                <FormItem label="站点名称"  prop="name">
                    <Input v-model="formValidate.name" placeholder="请输入站点名称..."  /> 
                </FormItem>
                <FormItem label="站点地址"  prop="address">
                    <Input v-model="formValidate.address" placeholder="请输入站点地址..."  /> 
                </FormItem>
                <FormItem prop="coordinate" label="站点区域" class="coordinate">
                    <Select v-model="formValidate.coordinate" style="width: 361px;margin-left: 14px;margin-top: 13px;" placeholder='请选择区域地址'>
                        <!-- v-if="modalTitle=='新增物流公司'" -->
                        <!-- <Option value=" " key="" >不选</Option> -->
                        <Option v-for="item in areaList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="remark" label="额外备注">
                    <Input type="textarea" v-model="formValidate.remark" placeholder="请输入备注..."  /> 
                </FormItem>
            </Form>
            <div class="modal_footer">
                <Button @click="asyncOK">保存</Button>
            </div>
        </Modal>
    </div>
</template>


<script>

import {BmlMarkerClusterer} from 'vue-baidu-map'
import tipModal from '../tip.vue'

export default {
    components: {
        BmlMarkerClusterer,
        tipModal,
    },

    data() {
        return {   
            // 选中哪个合作状态
            model1: '1',   
             // 合作状态数据
            cooperationData: [
                {
                    value: '1',
                    label: '合作中'
                },
                {
                    value: '2',
                    label: '终止合作'
                },
                {
                    value: '3',
                    label: '全部'
                },
            ],            
            // 表头
            columns: [
                // {
                //     type: 'selection',
                //     width: 60,
                //     align: 'center'
                // },
                {
                    title: '名称',
                    key: "name",
                    align: 'center',
                },
                {
                    title: '地址',
                    key: "address",
                    align: 'center',
                },
                {
                    title: '电话',
                    key: "tel",
                    align: 'center',
                },
                {
                    title: '联系人',
                    key: "linkman",
                    align: 'center',
                },
                {
                    title: '区域',
                    key: "area",
                    align: 'center',
                },
                {
                    title: '状态',
                    key: 'status',
                    align: 'center',
                    render:(h, params) => {
                        return h('div', [
                            // 设置气泡式提醒
                            h('div', {
                                slot: 'content',
                                style: {
                                    whiteSpace: 'normal',
                                }
                            }),
                            // 设置icon
                            h('div', [
                                h('icon', {
                                class: params.row.status == '1' ?  'iconfont iconhezuo': 'iconfont iconzhongzhi',
                                style: {
                                    color: params.row.status == '1' ? '#1d8c9f' : 'red',
                                    fontSize: '22px',
                                    cursor: 'pointer'
                                },
                                domProps: {
                                    title: params.row.status == '1' ? '合作中' : '终止合作'
                                },
                                })
                            ])
                        ])
                    }
                },
                {
                    title: '备注',
                    key: "remark",
                    align: 'center',
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
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, {row}) => {
                        return h('div', [
                            h('Icon', {
                                props: {
                                    type: 'edit',
                                    size: 'small'
                                },
                                class: 'handle',
                                domProps:{
                                    title:'编辑'
                                },
                                on: {
                                    click: () => {
                                         // this.$router.push({path: 'logisticsAbout', query: {title: '编辑物流公司', rowId: row.id,name: row.name, linkman: row.linkman, tel: row.tel, address: row.address, coordinate: row.coordinate, remark: row.remark }})
                                        if (row.area_id == null || row.area_id == '0') {
                                            this.formValidate.coordinate = '';
                                        } else {
                                            this.formValidate.coordinate = row.area_id;
                                            $('.coordinate .ivu-form-item-error-tip').css({display: 'none'})
                                            $('.coordinate .ivu-select-selection').css({border: '1px solid #dddee1'})
                                            $('.coordinate .ivu-select-arrow').css({color: '#80848f'})
                                        }
                                        this.isShow = true;
                                        this.modalTitle = '编辑物流公司'
                                        this.rowId = row.id;
                                        this.formValidate.linkman = row.linkman;   // 姓名
                                        this.formValidate.tel = row.tel;           // 电话 
                                        this.formValidate.name = row.name;         // 公司名称
                                        this.formValidate.address = row.address;        // 公司地址
                                        this.formValidate.remark = row.remark;
                                    }
                                }
                            }, '编辑'),
                            h('span', [
                                h('Poptip', {
                                    class: 'handle delete',
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
                                            // 确定删除
                                            this.deleteArrID = [];
                                            this.deleteArrID.push(row.id)
                                            this.deleteLogisticsQuery();
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
            // 表高度
            tableHeight: 695,
            //数据总数
            total: 0,
            //当前页：
            currentPage: 1 ,
            //每页有多少条数据
            pageSize: 20,
            // 表格数据
            tableData: [],
            // 模态框数据
            formValidate: {
                linkman: '', // 姓名
                tel: '',   // 电话 
                name: '',  // 站点名称
                address: '',  // 站点地址
                coordinate: '', // 站点区域
                remark: ''  // 备注
            },
            // 站点区域数据
            areaList: [],
            // 模态框标题
            modalTitle: '新增物流公司',
            // 表单验证
            ruleValidate: {
                address: [
                    { required: true, message: '公司地址不能为空', trigger: 'blur' }
                ],
                name: [
                     { required: true, message: '站点名称不能为空', trigger: 'blur' }
                ],
                // tel: [
                //     { required: true,  message: '联系号码不能为空', trigger: 'blur' },
                // ],
                coordinate: [
                    { required: true,  message: '站点区域不能为空', trigger: 'change' }
                ],
            },
            // 是否显示模态框
            isShow: false,
            // 编辑当前行的物流公司的ID
            rowId: '',
            // 删除当前行的物流公司的ID数据
            deleteArrID: [],
            // 地图搜索地名关键词
            keyword: '',
            // 搜索物流公司名称
            name: '',
            
        }
    },

     mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight-250);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight -250);
        })
    },


    created() {
        // 得到物流公司数据
        this.getLogistics();
        // 得到区域数据
        this.getAreaList();

    },
    methods: {
        /**
         * 查找物流公司名称
         */
        searchLogistics() {
            this.currentPage = 1;
            this.getLogistics();
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
         * 得到物流公司数据
         */
        getLogistics() {
            this.$resetAjax({
                url:'/NewA/Logistics/index',    
                type:'GET',
                data:{
                    p:this.currentPage,
                    name: this.name,
                    status: this.model1
                },
                success:(res)=> {
                    this.tableData = res.data.list;
                    this.total= Number(res.data.count);
                }
            })
        },
        /**
         * 切换当前页
         */
        changePage(index) {
            this.currentPage=index;
            this.getLogistics();
        },
        /**
         * 添加物流公司
         */
        addLogistics() {
            // this.$router.push({path: 'logisticsAbout', query: {title: '新增物流公司'}})
            this.isShow = true;
            this.modalTitle = "新增物流公司";
            this.formValidate.linkman = '';   // 姓名
            this.formValidate.tel = '';           // 电话 
            this.formValidate.name = '';         // 公司名称
            this.formValidate.address = '';        // 公司地址
            this.formValidate.coordinate = ''; // 公司区域
            this.formValidate.remark = '';
        },
        /**
         * 判断是编辑添加物流公司
         */
        asyncOK() {
            switch(this.modalTitle) {
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
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    this.$resetAjax({
                        url: '/NewA/Logistics/add',
                        type:'POST',
                        data: {
                            linkman: this.formValidate.linkman,   // 姓名
                            tel: this.formValidate.tel,           // 电话 
                            name: this.formValidate.name,         // 公司名称
                            address: this.formValidate.address,        // 公司地址
                            area_id: this.formValidate.coordinate, // 公司区域
                            remark: this.formValidate.remark        // 备注
                        },
                        success:(res) => {
                            this.isShow = false;
                            this.formValidate.linkman = '';   // 姓名
                            this.formValidate.tel = '';           // 电话 
                            this.formValidate.name = '';         // 公司名称
                            this.formValidate.address = '';        // 公司地址
                            this.formValidate.coordinate = ''; // 公司区域
                            this.formValidate.remark = '';
                            this.$root.tip.isShow = true;
                            this.$root.tip.content = `棒棒哒, 新增成功！`;
                            setTimeout(() => {
                                this.$root.tip.isShow = false;
                                this.getLogistics();
                            }, 2000);
                        }
                    })  
                } 
            })
        },
       /**
        *  编辑物流公司请求
        */
        editLogisticsQuery() {
            this.$refs.formValidate.validate((valid) => {
                if (valid) {
                    this.$resetAjax({
                        url: '/NewA/Logistics/update',
                        type:'POST',
                        data: {
                            id: this.rowId,               // 当前行的id
                            linkman: this.formValidate.linkman,   // 姓名
                            tel: this.formValidate.tel,           // 电话 
                            name: this.formValidate.name,         // 公司名称
                            address: this.formValidate.address,        // 公司地址
                            area_id: this.formValidate.coordinate, // 公司区域id
                            remark: this.formValidate.remark        // 备注
                        },
                        success:(res) => {
                            this.isShow = false;
                            this.formValidate.linkman = '';   // 姓名
                            this.formValidate.tel = '';           // 电话 
                            this.formValidate.name = '';         // 公司名称
                            this.formValidate.address = '';        // 公司地址
                            this.formValidate.coordinate = ''; // 公司区域
                            this.formValidate.remark = '';
                            this.$root.tip.isShow = true;
                            this.$root.tip.content = `棒棒哒, 编辑成功！`;
                            setTimeout(() => {
                                this.$root.tip.isShow = false;
                                this.getLogistics();
                            }, 2000);
                        }
                    })  
                }
            })
        },
        /**
         * 删除物流公司请求
         */
        deleteLogisticsQuery() {
            this.$resetAjax({
                url: '/NewA/Logistics/delete',
                type:'POST',
                data: {
                    id: this.deleteArrID,               // 当前行的id
                },
                success:(res) => {
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = `棒棒哒, 删除成功！`;
                    setTimeout(() => {
                        this.$root.tip.isShow = false;
                        this.getLogistics();
                    }, 2000);
                }
            })  
        },
        /**
         *  多选行
         */
        getMoreSelect(selection, row) {
            this.deleteArrID = selection.map(ele => ele.id);
        },
        /**
         *  多项删除判断
         */
        moreDel() {
            switch(this.deleteArrID.length) {
                case 0: 
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = `抱歉亲, 多项删除前请先勾选您要删除的项!`;
                    setTimeout(() => {
                        this.$root.tip.isShow = false;
                    }, 3000);
                    break;
                default:
                    this.deleteLogisticsQuery();
            }
        },
        /**
         * 得到选中的状态 
         */
        getstatus(status) {
            this.currentPage = 1;
            this.status = status;
            this.getLogistics();
        }
        
    }
}
</script>
