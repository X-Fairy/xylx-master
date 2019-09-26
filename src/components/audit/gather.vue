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
                <Button @click="daochuModal=true">导出列表</Button>
            </div>
        </div>
        <div class="table">
            <Table  :columns="columns" :data="tableData" border :height="tableHeight"></Table>
        </div>
        <Modal class="addModal" v-model="daochuModal" title="选择时间区间">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="开始时间" prop="startTime">
                    <DatePicker v-model='formValidate.startTime' type="month"  :options="options"  placeholder="请选择开始时间" ></DatePicker>
                </FormItem>
                <FormItem label="截至时间" prop="endTime">
                    <DatePicker v-model='formValidate.endTime' type="month" :options="options"  placeholder="请选择截至时间"></DatePicker>
                </FormItem>
                <FormItem>
                    <Button type="ghost" style="margin-right: 8px"  @click="daochuModal=false">确定</Button>
                    <Button type="primary" @click="handleSubmit('formValidate')">确定</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>


<script>

import {changeday} from  '@/assets/js/tool.js'

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
            // 是否显示导出数据弹出框
            daochuModal:false,
            // 表单数据
            formValidate:{
                startTime:'',
                endTime:''
            },
            ruleValidate: {
                startTime: [
                    { required: true, type: 'date', message: '时间不能为空', trigger: 'change' }
                ],
                endTime: [
                    { required: true, type: 'date', message: '时间不能为空', trigger: 'change' }
                ],
            },
            // 导出列表选择得时间
            dateArr:[]
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
                        this.tableData.push(res.data[i]);
                    }
                }
            })
        },
        //导出列表
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let arr=[];
                    let num='';
                    for(let i in this.formValidate){
                        num=changeday(Number(this.formValidate[i]));
                        arr.push(num);
                    }
                    let start=arr[0];
                    let end=arr[1];
                    this.getYearAndMonth(start, end);
                    let url='';
                    for(let i=0;i<this.dateArr.length;i++){
                        url+=('time[]='+this.dateArr[i]+'&');
                    }
                    location.href = `http://oa.xmvogue.com/index.php/NewA/Audit/daochu?${url}`;
                } else {
                   
                }
            })
        },
        getYearAndMonth(start, end) {
            var result = [];
            var starts = start.split('-');
            var ends = end.split('-');
            var staYear = parseInt(starts[0]);
            var staMon = parseInt(starts[1]);
            var endYear = parseInt(ends[0]);
            var endMon = parseInt(ends[1]);
            result.push(staYear+"-"+starts[1]);
            result.push(endYear+"-"+ends[1]);
            while (staYear <= endYear) {
                if (staYear === endYear) {
                    while (staMon < endMon) {
                        staMon++;
                        staMon = "0"+staMon;
                        result.push(staYear+"-"+staMon);
                    }
                    staYear++;
                } else {
                    staMon++;
                    if (staMon > 12) {
                        staMon = 1;
                        staYear++;
                    }
                    staMon = "0"+staMon;
                    result.push(staYear+"-"+staMon);
                }
            }
            result.splice(1,1);
            this.dateArr=result;
        }
        
    }
}

</script>






