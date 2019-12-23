<template>
    <div class="crmuser">
        <div class="top">
            <h3>所属招商：<span>{{user}}</span></h3>
            <div class="right" style="margin-top: -10px;">
                <Button type="primary" @click="add" class="addstore">批量分配</Button>
                <button @click="$router.push({path:'customer'})" class="back">返回客户列表</button>
            </div>
        </div>
        <div class="contanier">
            <Table border  :columns="columns" :data="tableData" :height="tableHeight" @on-selection-change="getChangeSelect"></Table>
        </div>
        <div class="footer">
            <!-- 分页 -->
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 批量分配 --> 
        <Modal class="addModal" title="分配所属招商" v-model="isAttract" class-name="vertical-center-modal" @on-ok="asyncOK" :key="'mulity'" :mask-closable="false">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="选择招商" prop="lowerLeader">
                    <Select v-model="formValidate.lowerLeader"  :key="'mulity'">
                        <Option v-for="option in lowlevelList" :value="option.userid" :key="option.userid">{{option.user_name}}</Option>
                    </Select> 
                </FormItem>
                <FormItem class="btn"> 
                    <Button type="primary" @click="asyncOK('formValidate')">确定</Button>
                </FormItem>
            </Form>
            
         </Modal>
    </div>
</template>
<script>
    import {getUrlParams} from  '@/assets/js/tool.js'
    import {changeday} from  '@/assets/js/tool.js'
    export default {
        components:{
            changeday
        },
        data(){
            return {
                // 得到网址的参数对象
                urlParams:{},
                // 招商id
                userid:'',
                // 招商姓名
                user:'',
                /// 表格高度
                tableHeight: 900,
                columns:[
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center',
                        fixed:'left'
                    },
                    {
                        title: '姓名',
                        width: 110,
                        key: 'username',
                        fixed:'left'
                    },
                    {
                        title: '电话',
                        width: 130,
                        key: 'phone',
                        fixed:'left'
                    },
                    {
                        title: '来源',
                        width: 130,
                        key: 'channels'
                    },
                    // {
                    //     title: '标记',
                    //     key: 'sign',
                    //     render:(h,params)=>{
                    //         return h('div',{
                                
                                
                    //         },[
                    //             h('Icon',{
                    //                 props: {
                    //                     type: params.row.sign.indexOf('1') !== -1 ? 'ios-pricetags' : '',
                    //                 },
                    //                 style:{
                    //                     color: '#9d50c8',
                    //                     fontSize: '20px',
                    //                     marginRight: params.row.sign.indexOf('1') !== -1 ? '4px' : '',
                    //                 },
                    //             }),
                    //             h('Icon',{
                    //                 props: {
                    //                     type: params.row.sign.indexOf('2') !== -1 ? 'ios-pricetags' : '',
                    //                 },
                    //                 style:{
                    //                     color: '#f35a59',
                    //                     fontSize: '20px',
                    //                     marginRight: params.row.sign.indexOf('2') !== -1 ? '4px' : '',
                    //                 },
                    //             }),
                    //             h('Icon',{
                    //                 props: {
                    //                     type: params.row.sign.indexOf('3') !== -1 ? 'ios-pricetags' : '',
                    //                 },
                    //                 style:{
                    //                     color: '#169aff',
                    //                     fontSize: '20px',
                    //                     marginRight: params.row.sign.indexOf('3') !== -1 ? '4px' : '',
                    //                 },
                    //             }),
                    //             h('Icon',{
                    //                 props: {
                    //                     type: params.row.sign.indexOf('4') !== -1 ? 'ios-pricetags' : '',
                    //                 },
                    //                 style:{
                    //                     color: '#20b275',
                    //                     fontSize: '20px',
                    //                     marginRight: params.row.sign.indexOf('4') !== -1 ? '4px' : '',
                    //                 },
                    //             }),
                    //             h('Icon',{
                    //                 props: {
                    //                     type: params.row.sign.indexOf('5') !== -1 ? 'ios-pricetags' : '',
                    //                 },
                    //                 style:{
                    //                     color: '#f5c635',
                    //                     fontSize: '20px',
                    //                     marginRight: params.row.sign.indexOf('5') !== -1 ? '4px' : '',
                    //                 },
                    //             }),
                    //             h('Icon',{
                    //                 props: {
                    //                     type: params.row.sign.indexOf('6') !== -1 ? 'ios-pricetags' : '',
                    //                 },
                    //                 style:{
                    //                     color: '#fb9200',
                    //                     fontSize: '20px',
                    //                     marginRight: params.row.sign.indexOf('6') !== -1 ? '4px' : '',
                    //                 }
                    //             }),
                    //         ]
                    //         )
                    //     }
                    // },
                    {
                        title: '城市',
                        width: 170,
                        key: 'areaname',
                        render: (h, params) => {
                            let text = '';
                            if (params.row.areaname !== null) {
                                text = params.row.areaname;
                            } else if (params.row.address !== '') {
                                text = params.row.address;
                            }
                            return h('div', [
                                h('a', {
                                    style: {
                                        color: '#495060',
                                        fontSize: '12px',
                                    },
                                }, text),
                            ])
                        }
                    },
                    
                    // {
                    //     title:'跟进状态',
                    //     width: 90,
                    //     key:'clue',
                    //     render:(h, params) => {
                    //         return h('div', [
                    //             // 设置气泡式提醒
                    //             h('Tooltip',[
                    //                     // 设置icon
                    //                     h('div', 
                    //                         [
                    //                             h('icon', {
                    //                                 props: {
                    //                                 type: params.row.clue === '1' ? 'information-circled' : 'checkmark-round',
                    //                             },
                    //                             style: {
                    //                                 color: params.row.clue === '1' ? '#ed3f14' : '#1d8c9f',
                    //                                 fontSize: '20px'
                    //                             },
                    //                             domProps: {
                    //                                 title: params.row.clue === '1' ? '未跟进' :'已跟进'
                    //                             },
                    //                         })
                    //                     ])
                    //                 ]
                    //             )
                    //         ])
                    //     }
                    // },
                    {
                        title: '最新跟进摘要',
                        width: 430,
                        key: 'notes', 
                        render: (h, params) => {
                            let texts = params.row.notes;
                            if (params.row.notes !== null) {
                                if (params.row.notes.length > 40) {
                                    texts = params.row.notes.slice(0,40) + '...';
                                } else {
                                    texts = params.row.notes;
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
                                }, params.row.notes)
                                ])
                            ])
                        }
                    },
                    {
                        title: '录入时间',
                        width: 120,
                        key: 'insert_time',
                    },
                    {
                        title: '跟进时间',
                        width: 120,
                        key: 'last_time',
                    },
                    {
                        title: '下次跟进时间',
                        width: 120,
                        key: 'follow_up_time',
                    },
                    // {
                    //     title:'招商',
                    //     width: 75,
                    //     key:'user_name',
                    // },
                    {
                        title: '操作',
                        key: 'action',
                        width: 210,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    class: 'handle',
                                    style: {
                                        marginRight: '10px',
                                        cursor: 'pointer'
                                    },
                                    on: {
                                        click: () => {
                                            let routeData = this.$router.resolve({ name: 'customerstorelist', query: { name: params.row.username, id:params.row.id, phone: params.row.phone, channels: params.row.channels, has_store: params.row.status, intention: params.row.intention,isShow:1}});
                                            window.open(routeData.href, '_blank');
                                        }
                                    }
                                }, '门店'),
                                h('a', {
                                    class: 'handle',
                                    style: {
                                        marginRight: '10px',
                                        cursor: 'pointer'
                                    },
                                    on: {
                                        click: () => {
                                            let routeData2 = this.$router.resolve({ name: 'comeVisit', query: {isaim: 1, name: params.row.username, id:params.row.id, phone: params.row.phone, channels: params.row.channels, has_store: params.row.status, intention: params.row.intention,isShow:1} });
                                            window.open(routeData2.href, '_blank');
                                        }
                                    }
                                }, '来访'),
                                h('a', {
                                    class: 'handle',
                                    style: {
                                        marginRight: '10px',
                                        cursor: 'pointer'
                                    },
                                    on: {
                                        click: () => {
                                            let routeData3= this.$router.resolve({ name: 'customervisit', query: {isaim: 1, name: params.row.username, id:params.row.id, phone: params.row.phone, channels: params.row.channels, has_store: params.row.status, intention: params.row.intention,isShow:1} });
                                            
                                            window.open(routeData3.href, '_blank');
                                        }
                                    }
                                }, '跟进'),
                                h('a', [
                                    h('Poptip', {
                                        class: 'handle',
                                        props: {
                                            confirm: true,
                                            transfer: true,
                                            placement: 'top',
                                            title: '确定要分配吗 ?',
                                            type: 'error',
                                            size: 'small',
                                            width: '150',
                                            vModel: true
                                        },
                                    style: {
                                        marginRight: '10px',
                                        cursor: 'pointer'
                                    },
                                    on: {
                                        'on-ok': ()=>{
                                            // 确定认领
                                            this.isAttract=true;
                                            this.lowerLeaderId=[params.row.id];
                                        },
                                        'on-cancel': ()=>{
                                            // 取消认领
                                        }
                                    },
                                }, '分配'),
                                ]),
                            ]);
                        }
                    },
                    
                ],
                // 表格数据
                tableData:[],
                // 总页数
                total: 0,
                // 每页条数
                pageSize: 20,
                // 当前页
                currentPage:1,
                // 选择的数据
                selectionData:[],
                // 多选时所属招商弹窗是否显示 
                isAttract: false,
                // 所属招商弹窗下级选择得到的
                formValidate:{  
                    lowerLeader:'',
                },
                // 表单验证
                ruleValidate: {
                    lowerLeader: [
                        { required: true,message: '招商不能为空', trigger: 'change' },
                    ],
                },
                // 所属招商这行客户的id
                lowerLeaderId: [],
                // 下级数据
                lowlevelList: [],
            }
        },
        created() {
            // 得到网址的参数
            this.getUrlData();
            // 获取客户数据
            this.getlist();
            // 得到下级数据
            this.getlowlevelList();
        },
        // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
        mounted() {
            setTimeout(()=> {
                // 得到浏览器内容高度
                var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight- 280);
                this.errorHeight = windowHeight- 480;
            },100)
            // 调整浏览器的时候
            $(window).on('resize', () => {
                var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight - 280);
                this.errorHeight = windowHeight- 480;
            })
        },
        methods:{
            /**
            * 得到所有下级的数据
            */
            getlowlevelList() {
                this.$resetAjax({
                    url: '/NewA/Public/getnext',
                    type: 'POST',
                    success: (res) => {
                        this.lowlevelList = JSON.parse(res).data;
                    }
                })
            },
            /**
            *毫秒转成-- 年月日形式
            */ 
            changeday(num) {
                let date = new Date(num);
                let z = date.getFullYear() + '-',
                    b = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1)  : date.getMonth() + 1) + '-',
                    n = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) ;
                return z+b+n;
            },
            /**
             * 得到网址的参数
             */
            getUrlData:function(){
                this.urlParams = getUrlParams();
                this.userid=this.urlParams.userid
                if(this.urlParams.user){
                    this.user=this.urlParams.user;
                }else{
                    this.user='已离职'
                }
            },
            // 获取客户数据
            getlist(){
                this.$resetAjax({
                    url:'/NewA/Public/crmuser',
                    type:'GET',
                    data:{
                        userid:this.userid,
                        p:this.currentPage
                    },
                    success:(res)=>{
                        this.total = Number(JSON.parse(res).count);
                        this.tableData=JSON.parse(res).data;
                        // 得到意向并在表格里渲染出来
                        this.tableData.forEach(ele => {
                            // 预约回访时间:follow_up_time
                            switch(ele.follow_up_time) {
                                case null:
                                    ele.follow_up_time = '';
                                    break;
                                case '0': 
                                    ele.follow_up_time = '';
                                    break;
                                default:
                                    ele.follow_up_time = this.changeday(Number(ele.follow_up_time)*1000);
                            }
                            // 录入时间
                            switch(ele.insert_time) {
                                case null:
                                    ele.insert_time = '';
                                    break;
                                case '0': 
                                    ele.insert_time = '';
                                    break;
                                default:
                                    ele.insert_time = this.changeday(Number(ele.insert_time)*1000);
                            }
                            // 最近跟进时间:last_time
                            switch(ele.last_time) {
                                case null:
                                    ele.last_time = '';
                                    break;
                                case '0': 
                                    ele.last_time = '';
                                    break;
                                default:
                                    ele.last_time = this.changeday(Number(ele.last_time)*1000);
                            }
                        });
                    }
                })
            },
            /**
             * 得到多选项
             */
            getChangeSelect(selection) {
                this.selectionData=selection;
            },
            /* 点击批量分配按钮 */
            add(){
                if (this.selectionData.length !== 0) {
                    this.lowerLeader = this.selectionData[0].userid;
                    this.lowerLeaderId = this.selectionData.map(ele => {
                        return ele.id
                    });
                    this.isAttract=true;
                } else {
                    this.$Modal.warning({
                        title:'提示',
                        content:'批量分配前,请先勾选您要分配的客户!!!'
                    })
                }

            },
            /* 发送批量分配请求 */
            asyncOK(name){
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$resetAjax({
                            url: '/NewA/Public/distribution',
                            type: 'POST',
                            data: {
                                // 客户id   
                                id: this.lowerLeaderId,
                                // userid:  选中的下级的userid
                                userid: this.lowerLeader,
                            },
                            success: (res) => {
                                this.isRowAttract = false;
                                this.getlist();
                                this.$root.tip.isShow = true;
                                this.$root.tip.content = '分配成功';
                                setTimeout(() => {
                                    this.$root.tip.isShow = false;
                                }, 1000);
                            }
                        })
                    }
                })
            },
            /**
             * 改变页码
             */
             changePage(index) {
                this.currentPage = index;
                this.getlist();
            },
        }
    }
</script>