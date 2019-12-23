<template>
    <div id="mapLocation">
        <Table  class="enterTable" border :columns="columns" :data="tableData"></Table>
    </div>
</template>


<script>
import {getUrlParams} from  '@/assets/js/tool.js'
export default {
    data() {
        return {
            // 网址数据 
            urlParams:{},
            // 表头数据
            columns: [     
                 {
                    title: '排单详情表',
                    align: 'center',
                    children: [                        
                        {
                            title: '客户姓名',
                            align: 'center', 
                            key: 'name', 
                        },
                        {
                            title: '物流',
                            align: 'center', 
                            key: 'express',
                        },
                        {
                            title: '单号',
                            align: 'center', 
                            key: 'num',
                        },
                        {
                            title: '件数',
                            align: 'center', 
                            key: 'qty',
                        },
                        {
                            title: '是否包邮',
                            align: 'center', 
                            key: 'postflag',
                        }
                    ]
                },
            ],
            // 表格数据
            tableData: [],
            // 数据参数
            loading: '',
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
        },
        /**
         * 
         */
        getPrintData() {
            this.$resetAjax({
                type: 'GET',
                url:  '/NewA/Carlist/info',
                data: {
                    loading: this.loading   // 右侧表格数据
                },
                success: (res) => {
                   this.tableData = res.data;
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


