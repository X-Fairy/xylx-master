<template>
    <div class="areaData">
        <div class="title">
            <h2>门店销售数据统计表</h2>
        </div>
        <div class="search">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="日期" prop="date">
                    <DatePicker type="daterange" @on-change="changeTime" :options="options" v-model="formValidate.date" placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
                </FormItem>
                <!-- <FormItem label="区域" prop="area">
                    <Cascader :data="areaDatas" v-model="formValidate.area"  style="width: 200px" ></Cascader>
                </FormItem> -->
                <FormItem class="check">
                    <Button type="ghost" @click="judgeFull(formValidate)">查询</Button>
                </FormItem>
            </Form>
            <Button type="ghost" @click="$router.push({path: 'storeData'})" style="margin-top: -4%;margin-left: 90%;width: 100px;">查看图表详情</Button>
        </div>
        <div class="content" v-show="isLoadingPop==false">
           
                <!-- 所有门店 -->
                 <div class="table">
                    <Table border :row-class-name="rowClassName" :height="tableHeight" :columns="columns" :data="storesData" ></Table>                
                </div>
                
        </div>
        <!-- 最外部加载提示 -->
        <!-- <div class="demo-spin-col" span="8" v-if="spinShow">
            <Spin fix>
                <Icon type="load-c" size=120 class="demo-spin-icon-load"></Icon>
                <div style="font-size:22px;">Loading...</div>
            </Spin>
        </div> -->
        <!-- 提示框 -->
        <div class="tip" v-show="isShowTip">
            {{tipContent}}
        </div>
        <div class="loading_pop" v-show="isLoadingPop">
            <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1571638198436&di=6668ed954daacea3eee32bb340980b0f&imgtype=0&src=http%3A%2F%2Fimg.ui.cn%2Fdata%2Ffile%2F4%2F2%2F3%2F1814324.gif" alt="">
        </div>
    </div>
</template>
<script>
import {changeday} from  '@/assets/js/tool.js'                    // 转化时间为2019-10-09这样的格式  
    export default{
        data(){
            return{
                formValidate:{
                    date:[],
                    beginTime: new Date(new Date().format('yyyy-MM') + '-01'),
                    endTime: new Date(new Date().getTime()),
                    // area:''
                },
                stime: '',                                           // 开始日期
                etime: '',                                           // 结束日期
                // 表单认证
                ruleValidate:{
                    beginTime: [
                        { required: true, message: '起始时间不能为空。', trigger: 'blur', pattern: /.+/ }
                    ],
                    endTime: [
                        { required: true, message: '结束时间不能为空。', trigger: 'blur', pattern: /.+/ }
                    ],
                    date:[
                        {
                            type: 'array', 
                            required: true, 
                            fields: {
                                0: {required: true, message: '时间不能为空', trigger: 'change', pattern: /.+/},
                                1: {required: true, message: '时间不能为空', trigger: 'change', pattern: /.+/},
                            } 
                        },
                    ],
                    // area:[
                    //     { required: true, message: '区域不能为空', trigger: 'blur' }
                    // ]
                },
                // 时间限制
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now() - 86400000;
                    }
                },
                // 表格高度
                tableHeight: 1000,
                // 表头头部
                columns:[
                    {
                        title: '门店编码',
                        key: 'hdid',
                        align:'center',

                    },
                    {
                        title: '门店名称',
                        key: 'store_name',
                        align:'center'
                    },
                    {
                        title: '销售额（￥）',
                        key: 'realamt',
                        align:'center'
                    },
                    {
                        title: '销售数量（件）',
                        key: 'qty',
                        align:'center'
                    },
                    {
                        title: '客单价（￥）',
                        key: 'pct',
                        align:'center'
                    },
                    {
                        title: '件单价（￥）',
                        key: 'Unit_price',
                        align:'center'
                    },
                    {
                        title: '连带率（%）',
                        key: 'apr',
                        align:'center'
                    },
                    {
                        title: '退货率（%）',
                        key: 'returned',
                        align:'center'
                    },
                    {
                        title: '坪效',
                        key: 'xarea',
                        align:'center'
                    },
                    {
                        title: '人效',
                        key: 'xclerk',
                        align:'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('a', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px',
                                        color:'#fff'
                                    },
                                    on: {
                                        click: () => {
                                            console.log(params.row.hdid);
                                            this.hdid=params.row.hdid;
                                            let routeData= this.$router.resolve({ name: 'visualization', query: {store:this.hdid }});
                                            window.open(routeData.href, '_blank');
                                            // this.$router.push({path: 'visualization', query:{store:this.hdid}});
                                        }
                                    }
                                }, '查看详情'),
                               
                            ]);
                        }
                    }
                ],
                // 门店数据
                storesData:[],
                areaDatas:[],
                // 是否显示提示框
                isShowTip: false,
                // 提示语
                tipContent: '',
                // 数据加载提示
                // spinShow: true,
                // 门店编码
                hdid:'',
                // 是否显示正在加载中
                isLoadingPop:true
            }
        },
        mounted() {
            setTimeout(()=> {
                // 得到浏览器内容高度
                let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight- 160);
            },100)
            // 调整浏览器的时候
            $(window).on('resize', () => {
                let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight - 160);
            })
        },
        created(){
            // 获取当前默认选择时间及时间参数
            this.getDefaultDate();
            this.getStoreData()
        },
        methods:{
            // 控制表格样式
            rowClassName(row, index){
                if(index%2==0){
                return 'ivu-table-stripe-even';
                }
                else return 'ivu-table-stripe-odd';
            },
            /**
             * 时间选择判断
            */
            changeTime(date) {
                let startStr = date[0].slice(0,7);
                let endStr = date[1].slice(0,7);
                if(startStr !== endStr) {
                    this.isShowTip  = true;
                    this.tipContent = '预警，不能跨月选择时间';
                    setTimeout(() => {
                        this.isShowTip = false;
                        this.formValidate.date = [];
                    }, 1500);
                    return false;
                }
            },
            /**
            *  获取当前默认选择时间及时间参数
            */
            getDefaultDate() {
                let yesteday = this.formValidate.endTime;
                let startDate = this.formValidate.beginTime;

                this.formValidate.date= [startDate,yesteday];
            },
            // 获取门店数据
            getStoreData(){
                this.isLoadingPop=true;
                this.stime = changeday(this.formValidate.date[0]);
                this.etime = changeday(this.formValidate.date[1]);
                this.$resetAjax({
                    type: 'POST',
                    url: '/public/index.php?s=home/Manage/list',
                    // root: '',
                    root: 'http://bi.xmvogue.com/',
                    data: {
                        stime: this.stime ,          // 开始时间
                        etime: this.etime,          // 结束时间
                    },
                    success:(res) => {
                        this.isLoadingPop=false;
                        this.storesData=JSON.parse(res).data;
                        
                    }
                })
            },
            /**
             *  根据时间查询
            */
            judgeFull(formValidate) {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        // this.spinShow=false;
                        this.getStoreData();
                    } else {}
                })
            },
           
        }
    }
</script>