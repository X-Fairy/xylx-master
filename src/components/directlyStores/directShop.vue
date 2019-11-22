<template>
    <div class="directShop">
        <div class="top">
            <p>类型：</p>
            <Select v-model="cateCode" style="width:200px;" placeholder='请选择文件类型' @on-change="changeCate">
                <Option v-for="item in cateList1" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
        </div>
        <div class="table">
            <p class="add_btn" @click="isShow=true;">新增</p>
            <Table :columns="columns" :data="tableData" :height="tableHeight"></Table>
        </div>
        <!-- 分页 -->
        <div class="footer">
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 新增弹窗 -->
        <Modal title="新增" v-model="isShow"  :mask-closable="false" @on-cancel="closeModal" class="directShop_pop">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate"  :label-width="80">
                <FormItem prop="cate" label="类别">
                    <Select v-model="formValidate.cate" style="width: 361px;margin-left: 14px;margin-top: 13px;" placeholder='请选择文件类型'>
                        <Option v-for="item in cateList" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="describe" label="备注">
                    <Input v-model="formValidate.describe" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..." />
                </FormItem>
                <!-- :format="['xlsx', 'pptx', 'docx', 'doc', 'xls', 'pdf','ppt']" :on-format-error ="formatError" -->
                <FormItem class="upload_item">
                    <Upload action="/NewA/Workorder/getfile" :on-success="upLoadSuccess"
                     :on-error="upLoadError"  :on-progress="uploadProess"  
                      class="upload_customer">
                        <Button type="ghost" icon="ios-cloud-upload-outline" class="ghost">上传文件</Button> 
                    </Upload>
                </FormItem>
                <FormItem>
                    <ul class="list">
                        <li v-for="(item,index) in uploadData" :key="index" >
                             文件{{index+1}} :
                            <div class="name">
                                <p>{{item.name}}</p>
                                <span @click="deleteFile(item,index)">删除</span>
                            </div>
                        </li>
                        <li v-if="isSpinShow">
                            <Spin>
                                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                                <div>上传中。。。</div>
                            </Spin>
                        </li>
                    </ul>
                </FormItem>
               <FormItem class="form_footer">
                    <Button @click="asyncOK">保存</Button>
                </FormItem>
            </Form>
        </Modal>
        <!-- 查看图片 -->
        <Modal title="查看图片" class="modal" v-model="isLookShow" class-name="vertical-center-modal" :mask-closable="false">
            <p class="img" style="width:100%;height:100%;">
                <img style="width:100%;height:100%;" :src="imgUrl" alt="" />
            </p>
        </Modal>
    </div>
</template>

<script>
   
import tipModal from '../tip.vue'                // 引入弹出框
import {changeTime} from  '@/assets/js/tool.js'

export default {
    components: {
        tipModal,
    },
    data() {
        return {
            tipContent: '',                     // 上传提示语
            currentPage: 1,                     // 当前页码
            cateCode: 5,                        // 选中哪个类型
            columns: [                          // 表头
                {
                    title: '文件',
                    key: 'name',
                    align: 'center',
                    render:(h, {row}) => {
                        let url = row.file;
                        let icon = '';
                        let color = '';
                        if(url.indexOf('xlsx') !== -1 || url.indexOf('xls') !== -1) {
                            icon = 'iconfont icon-excel';
                            color = '#45b058';
                        } else if (url.indexOf('doc') !== -1 || url.indexOf('docx') !== -1){
                            icon = 'iconfont icon-WORD';
                            color = '#2a5699';
                        } else {
                            icon = 'iconfont icon-PDF';
                            color = '#d93838';
                        }
                        return h('div', [
                            // 设置气泡式提醒
                            h('div', {
                                slot: 'content',
                                style: {
                                    whiteSpace: 'normal',
                                }
                            }),
                            // 设置icon
                            h('span', [
                                h('icon', {
                                class: icon,
                                style: {
                                    color: color,
                                    fontSize: '22px',
                                },
                                domProps: {
                                    title: row.name 
                                },
                                })
                            ]),
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    width: '100%',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    fontSize: '12px',
                                },
                            },row.name)
                        ])
                    }
                },
                {
                    title: '类别',
                    key: 'cate_name',
                    align: 'center',
                },
                {
                    title: '说明',
                    key: 'describe',
                    align: 'center',
                    render: (h, {row}) => {
                        let texts = row.describe;
                        if (row.describe !== null) {
                            if (row.describe.length > 12) {
                                texts = row.describe.slice(0,12) + '...';
                            } else {
                                texts = row.describe;
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
                            }, row.describe)
                            ])
                        ])
                    }
                },
                {
                    title: '上传人',
                    key: 'user_name',
                    align: 'center',
                },
                {
                    title: '时间',
                    key: 'date',
                    align: 'center',
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, {row}) => {
                        return h('div', 
                            {class: 'download'},
                        [
                            h('Icon', {
                                props: {
                                    type: 'ios-cloud-download-outline',
                                    size: 'small',
                                    color: '#30aee0'
                                },
                                domProps:{
                                    title:'下载'
                                },
                                on: {
                                    click: () => {
                                        this.download(row.id);
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
            tableData: [],                      // 操作数据
            tableHeight: 900,                   // 表格高度
            total: 0,                           // 数据总条数
            pageSize: 20,                       // 页数
            isShow: false,                      // 是否显示模态框
            cateList1: [                        // 类别数据
                {
                    id: 1,
                    name: '运营',
                },
                {
                    id: 2,
                    name: '财务',
                },
                {
                    id: 4,
                    name: '模板',
                },
                {
                    id: 6,
                    name: '音视频',
                },
                {
                    id: 3,
                    name: '其他',
                },
                {
                    id: 5,
                    name: '全选',
                },
            ],
            cateList: [                         // 类别数据
                {
                    id: 1,
                    name: '运营',
                },
                {
                    id: 2,
                    name: '财务',
                },
                {
                    id: 6,
                    name: '音视频',
                },
                {
                    id: 4,
                    name: '模板',
                },
                {
                    id: 3,
                    name: '其他',
                },
            ],
            uploadData: [],
            formValidate: {                     // 模态框数据
                cate: 1,                        // 类别选中
                describe: '',                   // 描述    
            },
            isLookShow: false,                  // 是否显示查看图片模态框
            imgUrl: '',                         // 图片地址
            isSpinShow: false,                  // 文件上传中提示
            // 表单验证
            ruleValidate: {
                name: [
                     { required: true, message: '站点名称不能为空', trigger: 'blur' }
                ],
                cate: [
                    { required: true,  message: '文件类型不能为空', trigger: 'change',pattern: /.+/ }
                ],
            },
        }
    },
    created() {
        // 得到操作数据
        this.cateCode = '';
        this.getTableData();
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
    methods: {
        /**
         * 选择类型
         */
        changeCate(value) {
            this.currentPage = 1;
            if(value === 5) {
                this.cateCode = '';
            } else {
                this.cateCode = value;
            }
            this.getTableData();
        },
        /**
         * 上传文件成功
         */
        upLoadSuccess(res) {
            this.isSpinShow = false;
            if(res.errorcode === 0) {
                this.uploadData.unshift(res.data);
            } else if(res.errorcode === 101) {
                this.$root.tip.isShow = true;
                this.$root.tip.content = '上传文件格式不对!';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 1500); 
            }
        },
        /**
         * 上传失败
         */
        upLoadError() {
            this.isSpinShow = false;
            this.$root.tip.isShow = true;
            this.$root.tip.content = '上传文件失败!';
            setTimeout(() => {
                this.$root.tip.isShow = false;
            }, 1500); 
        },
        /**
         * 上传中
         */
        uploadProess() {
            this.isSpinShow = true;
        },
        // formatError(res) {
        //     this.isSpinShow = false;
        //     this.$root.tip.isShow = true;
        //     this.$root.tip.content = '上传文件格式不对!';
        //     setTimeout(() => {
        //         this.$root.tip.isShow = false;
        //     }, 1500); 
        // },
        /**
         * 删除上传文件
         */
        deleteFile(item,index) {
            this.uploadData.splice(index,1);
        },
        /**
         * 得到操作数据
         */
        getTableData() {
            this.$resetAjax({
                type: 'GET',
                url:  '/NewA/Audit/filelist',
                data: {
                    p: this.currentPage,
                    cate: this.cateCode,
                },
                success: (res) => {
                    let data = res.data;
                    data.forEach(ele => {
                        ele.date = changeTime(Number(ele.time)*1000);
                        switch(ele.cate) {
                            case '1':
                                ele.cate_name = '运营';
                                break;
                            case '2':
                                ele.cate_name = '财务';
                                break;
                            case '3':
                                ele.cate_name = '其他';
                                break;
                            case '4':
                                ele.cate_name = '模板';
                                break;
                        }
                    });
                    this.tableData = data;
                    this.total = Number(res.count);
                }
            })
        },
        /**
         * 切换页码
         */
        changePage(index) {
            this.currentPage = index;
            this.getTableData();
        },
        /**
         * 新增请求
         */
        asyncOK() {
            if(this.uploadData.length === 0) {
                this.$root.tip.isShow = true;
                this.$root.tip.content = '上传文件不能为空!';
                setTimeout(() => {
                        this.$root.tip.isShow = false;
                }, 1500); 
                return false;
            }
            this.$resetAjax({
                type: 'POST',
                url:  '/NewA/Audit/fileadd',
                data: {
                    url: this.uploadData,
                    cate: this.formValidate.cate,
                    describe: this.formValidate.describe
                },
                success: (res) => {
                    if(res.errorcode === 100) {
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = `抱歉，${res.msg}`;
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                        }, 1500); 
                        return false; 
                    }
                    if(res.errorcode === 0) {
                        this.uploadData = [];
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '棒棒哒，提交成功';
                        setTimeout(() => {
                            this.isShow = false;
                            this.$root.tip.isShow = false;
                            this.currentPage = 1;
                            this.cateCode = '';
                            this.formValidate.describe = '';
                            this.getTableData();
                        }, 1500); 
                    }
                }
            })
        },
        /**
         * 删除请求
         */
        deleteQuery(id) {
            this.$resetAjax({
                type: 'POST',
                url:  '/NewA/Audit/filedel',
                data: {
                    id,
                },
                success: (res) => {
                    if(res.errorcode === 0) {
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '棒棒哒，删除成功!';
                        setTimeout(() => {
                                this.$root.tip.isShow = false;
                                this.getTableData();
                        }, 1500); 
                    }
                }
            })
        },
        /**
         * 下载请求
         */
        download(id) {
            location.href = `http://oa.xmvogue.com/index.php/NewA/Audit/download?id=${id}`;
        },
        /**
         * close新增弹窗
         */
        closeModal() {
            this.uploadData = [];
            this.formValidate.describe = '';
            this.isShow = false;
        },

    }
}
</script>
