
<template>
    <div id="printPage">
        <Table  class="enterTable" border :columns="columns" :data="tableData"></Table>
    </div>
</template>


<script>
import {getUrlParams} from  '@/assets/js/tool.js'
import {getNumBox} from "@/assets/js/tool.js"

export default {
    data() {
        return {
            // 网址数据 
            urlParams:{},
            // 装车司机
            driver: '无',
            //  跟车人员
            accompany: '无',
            // 表头数据
            columns: [     
                 {
                    title: '排单详情表',
                    align: 'center',
                    children: [    
                        {
                            title: 'Address',
                            align: 'center',
                            renderHeader: (h,params)=>{
                                return h('div',[
                                    h('strong',''),
                                    h('span', {
                                        style: {
                                            marginLeft: '15px',
                                            color: '#000',
                                            fontSize: '16px',
                                            marginTop: '10px',
                                            display: 'inline-block'
                                        },
                                    },`司机: 【 ${this.driver} 】`),
                                    h('span', {
                                        style: {
                                            marginLeft: '15px',
                                            color: '#000',
                                            fontSize: '16px',
                                            marginTop: '10px',
                                            display: 'inline-block'
                                        },
                                    },`跟车: 【 ${this.accompany} 】`),
                                
                                ])
                            },
                            children: [
                                 {
                                    title: '客户姓名',
                                    align: 'center', 
                                    key: 'name', 
                                    width: 280,
                                },
                                {
                                    title: '运费',
                                    align: 'center', 
                                    key: 'postflag',
                                    width: 100,
                                },
                                {
                                    title: '件数',
                                    align: 'center', 
                                    key: 'totle',
                                    width: 200,
                                    renderHeader: (h,params)=>{
                                        return h('div',[
                                            h('strong','件数'),
                                            h('span', {
                                                style: {
                                                    marginLeft: '15px',
                                                    color: '#000',
                                                    fontSize: '16px',
                                                    marginTop: '10px',
                                                    display: 'inline-block'
                                                },
                                            },`(总计: ${this.total}  件)`)
                                        ])
                                    },
                                },
                                {
                                    title: '地址',
                                    align: 'center', 
                                    key: 'address',
                                    width:300,
                                },
                                {
                                    title: '发货顺序',
                                    align: 'center', 
                                    key: '',
                                    width:190,
                                },
                            ]
                        },
                    ]
                },
            ],
            // 表格数据
            tableData: [],
            // 数据参数
            loading: '',
            // 数据总计
            total:'0'
        }
    },

    created() {
        // 得到网址的参数
        this.getUrlData();
    },
    mounted() {
        // 获取打印的数据
        this.getPrintData();
        
    },
    methods:{
        /**
         * 得到网址的参数
         */
        getUrlData() {
            this.urlParams = getUrlParams();
            this.loading = this.urlParams.loading;
            this.driver = this.urlParams.driver;
            this.accompany = this.urlParams.accompany;
        },
        /**
         * 获取打印的数据
         */
        getPrintData() {
            this.$resetAjax({
                type: 'GET',
                url:  '/NewA/Carlist/info',
                data: {
                    loading: this.loading   // 右侧表格数据
                },
                success: (res) => {
                    res.data.forEach(ele => {
                        if(ele.postflag == "否"){
                            ele.postflag = ""
                        } else{
                            ele.postflag = "付"
                        }
                    });
                   this.tableData = res.data;
                   this.total = getNumBox(res.data.map(ele => Number(ele.totle)))
                    // 直接打印数据
                    this.$nextTick(() => {
                        window.print()
                    })
                }
            })
        },
    },
 
        
}
</script>
