<template>
    <div class="gather">
        <div class="top">
            <div class="left">
                <span class="date">选择时间</span>
                <div>
                    <DatePicker :value="date" type="month" :options="options" @on-change="getTime"  placeholder="请选择时间" style="width: 200px"></DatePicker>
                    <Button slot="append" icon="ios-search" @click="search"></Button>
                </div>
            </div>
            <div class="right">
                
            </div>
        </div>
        <div class="table">
            <Table  :columns="columns" :data="tableData" border :height="tableHeight"></Table>
        </div>
        
    </div>
</template>


<script>

import {changeTime} from  '@/assets/js/tool.js'

export default {
    data() { 
        return {
            date:'',
            options: {
                disabledDate (date) {
                    return date && date.valueOf() >= Date.now();
                }
            },
            // 表头信息
            columns: [
                {
                    title: '门店编号',
                    align: 'center',
                    key: 'store_code',
                    width:100,
                    fixed: 'left'
                },
                {
                    title: ' 门店名称',
                    align: 'center',
                    key: 'name',
                    width:170,
                    fixed: 'left'
                },
                {
                    title: '期初未存现金',
                    align: 'center',
                    width:120,
                    key: 'qcwcxj'
                },
                {
                    title: ' 本期销售额',
                    width:120,
                    align: 'center',
                    key: 'bqxse' 
                },
                {
                    title: '本期已存现金',
                    width:120,
                    align: 'center',
                    key: 'bqycxj'
                },
                
                {
                    title: '本期鼎付通',
                    width:120,
                    align: 'center',
                    key: 'bqdft'
                },
                {
                    title: '本期其他支出',
                    width:120,
                    align: 'center',
                    key: 'bqqtzc' ,
                },
                {
                    title: '会员卡',
                    width:120,
                    align: 'center',
                    key: 'hyk'
                },
                {
                    title: '本期应收现金',
                    width:130,
                    align: 'center',
                    key: 'bqysxj'
                },
                {
                    title: '减其他支出后销售额',
                    align: 'center',
                    width:150,
                    key: 'jqtxse'
                },
                {
                    title: '减其他支出和会员卡后应收现金',
                    align: 'center',
                    width:210,
                    key: 'jqtysxj'
                },
                {
                    title: '期末未存现金',
                    align: 'center',
                    width:130,
                    key: 'qmwcxj'
                },
            ],
            // 表格数据
            tableData: [],
            // 表格高度
            tableHeight: 900,
        }
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

    created() {
       
    },


    methods: {
        
        /**
         *  选择时间
         */
        getTime(value) {
            this.date=value;
        },
        search(){
            this.tableData=[];
            this.getgather();
        },
        /* 发送请求 */
        getgather() {
            this.$resetAjax({
                type: 'GET',
                url: '/NewA/Audit/report',
                data: {
                    p: this.currentPage,
                    time: this.date
                },
                success:(res) => {
                    for(let i in res.data){
                        if(res.data[i].qcwcxj==""){
                            res.data[i].qcwcxj="0.00"
                        }
                        if(typeof(res.data[i].qmwcxj)=="undefined"){
                            res.data[i].qmwcxj="0.00";
                        }
                        console.log(res.data[i].qmwcxj);
                        this.tableData.push(res.data[i]);
                    }
                    // this.total = Number(res.count);
                }
            })
        },
        
        
        
    }
}

</script>






