<template>
        <div class="people">
            <div class="top">
                <div class="part">
                    <span class="item">渠道：</span>
                    <Select v-model="channel"  style="width:300px" multiple @on-change="getSource" placeholder="请选择渠道" label-in-value>
                        <Option value="all" key="55">全选</Option>
                        <Option value="none" key="100">全不选</Option>
                        <Option v-for="item in sourceList" :value="item.cid" :key="item.cid" :label="item.channels">{{ item.channels }}</Option>
                    </Select>
                </div>
                <div class="part">
                    <span class="item">时间筛选：</span>
                    <DatePicker type="datetimerange"  format="yyyy-MM-dd" style="width:200px" :options="options" v-model="dateRange" placeholder="请选择日期" @on-change="getDateRange" @on-clear="clearTime"></DatePicker>
                </div>
            </div>
             <!-- 内容区 -->
            <div class="table">
                <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
            </div>
        </div>
</template>
<script>
    import {changeday} from "@/assets/js/tool.js"//时间戳
    export default{
        components:{
            changeday
        },
        data(){
            return{
                // 渠道来源数据
                sourceList: [],
                //输入的渠道
                channel:[],
                //表格的高度
                tableHeight:900,
                //表格头部
                columns:[
                    {
                        title: '渠道',
                        key: 'channels',
                        align: 'center',
                    },
                    {
                        title: '总客户数',
                        key: 'total',
                        align: 'center',
                    },
                    {
                        title: "A类客户",
                        key: 'intention',
                        align: 'center',
                        children: [
                            {
                                title: '数量',
                                key: 'Acount',
                                align: 'center'
                            },
                            {
                                title: '占比',
                                key: 'percent1',
                                align: 'center'
                            },
                        ]
                    },
                    {
                        title: "B类客户",
                        key: 'intention',
                        align: 'center',
                        children: [
                            {
                                title: '数量',
                                key: 'Bcount',
                                align: 'center'
                            },
                            {
                                title: '占比',
                                key: 'percent2',
                                align: 'center'
                            },
                        ]
                    },
                    {
                        title: "C类客户",
                        key: 'intention',
                        align: 'center',
                        children: [
                            {
                                title: '数量',
                                key: 'Ccount',
                                align: 'center'
                            },
                            {
                                title: '占比',
                                key: 'percent3',
                                align: 'center'
                            },
                        ]
                    },
                    {
                        title: "D类客户",
                        key: 'intention',
                        align: 'center',
                        children: [
                            {
                                title: '数量',
                                key: 'Dcount',
                                align: 'center'
                            },
                            {
                                title: '占比',
                                key: 'percent4',
                                align: 'center'
                            },
                        ]
                    },
                    {
                        title: "待定类客户",
                        key: 'intention',
                        align: 'center',
                        children: [
                            {
                                title: '数量',
                                key: 'Ecount',
                                align: 'center'
                            },
                            {
                                title: '占比',
                                key: 'percent5',
                                align: 'center'
                            },
                        ]
                    },
                    
                    {
                        title: "无跟进",
                        key: 'intention',
                        align: 'center',
                        children: [
                            {
                                title: '数量',
                                key: 'Fcount',
                                align: 'center'
                            },
                            {
                                title: '占比',
                                key: 'percent6',
                                align: 'center'
                            },
                        ]
                    }
                    
                ],
                //表格数据
                tableData:[],
                // 对时间进行限制,选择不到大于今天的时间
                options: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                //输入的时间范围
                dateRange:[],
            }
        },
        created(){
            // 得到渠道来源数据
            this.getSourceList();
        },
        mounted() {
            setTimeout(()=> {
                // 得到浏览器内容高度
                var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight- 240);
            },100)
            // 调整浏览器的时候
            $(window).on('resize', () => {
                var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight - 240);
            })
        },
        methods:{
            /**
             * 渠道来源数据
             */
             getSourceList() {
                this.$resetAjax({
                    type: 'POST',
                    url: '/NewA/Public/getchannel',
                    success: (res) => {
                        this.sourceList = JSON.parse(res).data;
                    }
                })
            },
             // 发送请求，数据查询
            statistics(){
                this.$resetAjax({
                    url:'/NewA/Customer/statistics',
                    type:'POST',
                    data:{
                        channel:this.channel
                    },
                    success:(res)=>{
                        var data=JSON.parse(res).data;
                        if(data!==null){
                            this.tableData=data;
                            this.total();
                        }else{
                            this.tableData=[];
                        }                       
                    }
                })
            },
            /* 得到选择的渠道 */
            getSource(value){                
                if(this.channel.includes('all')){
                    let arr=[];
                    this.sourceList.map((ele)=>{
                        arr.push(ele.cid)
                    })
                    this.channel=arr;            
                }
                if(this.channel.includes("none")){
                    this.channel=['none'];
                }
                this.statistics();
            },
            /* 得到时间 */
            getDateRange(){
                for(var i=0;i<this.dateRange.length;i++){
                    this.dateRange[i]=changeday(this.dateRange[i]);
                }
                if(this.dateRange[0]=="NaN-NaN-NaN"&&this.dateRange[1]=="NaN-NaN-NaN"){
                    this.statistics()
                }else{
                    this.$resetAjax({
                        url:'/NewA/Customer/statistics',
                        type:'POST',
                        data:{
                            channel:this.channel,
                            time:this.dateRange,
                        },
                        success:(res)=>{
                            var data=JSON.parse(res).data;                            
                            if(data!==null){
                                this.tableData=data;
                                this.total();
                            }
                        }
                    })
                }
            },
            clearTime(){
                this.dateRange=[];
                this.statistics;
            },
            /* 表格总合计 */
            total(){
                if(this.tableData!==null){
                    let pTotal=0,at=0,bt=0,ct=0,dt=0,et=0,ft=0,t1=0,t2=0,t3=0,t4=0,t5=0,t6=0;
                    this.tableData.forEach(ele=>{
                        if(typeof ele.total=='undefined'){
                            ele['total']=0;
                        }
                        if(typeof ele.Bcount=='undefined'){
                            ele['Bcount']=0;
                        }
                        if(typeof ele.Acount == "undefined"){
                            ele['Acount']=0;
                        }
                        if(typeof ele.Ccount == "undefined"){
                            ele['Ccount']=0;
                        }
                        if(typeof ele.Dcount == "undefined"){
                            ele['Dcount']=0;
                        }
                        if(typeof ele.Ecount == "undefined"){
                            ele['Ecount']=0;
                        }
                        if(typeof ele.Fcount == "undefined"){
                            ele['Fcount']=0;
                        }
                        if(typeof ele.percent1 == "undefined"){
                            ele['percent1']='0.00%';
                        }
                        if(typeof ele.percent2 == "undefined"){
                            ele['percent2']='0.00%';
                        }
                        if(typeof ele.percent3 == "undefined"){
                            ele['percent3']='0.00%';
                        }
                        if(typeof ele.percent4 == "undefined"){
                            ele['percent4']='0.00%';
                        }
                        if(typeof ele.percent5 == "undefined"){
                            ele['percent5']='0.00%';
                        }
                        if(typeof ele.percent6 == "undefined"){
                            ele['percent6']='0.00%';
                        }
                        pTotal+=parseInt(ele.total);
                        at+=parseInt(ele.Acount);
                        bt+=parseInt(ele.Bcount);
                        ct+=parseInt(ele.Ccount);
                        dt+=parseInt(ele.Dcount);
                        et+=parseInt(ele.Ecount);
                        ft+=parseInt(ele.Fcount);
                    })
                    let arr={
                        channels:'总合计',
                        total:pTotal,
                        Acount: at,
                        Bcount: bt,
                        Ccount: ct,
                        Dcount: dt,
                        Ecount: et,
                        Fcount: ft,
                        percent1: pTotal==0 ? "0.00%" : (Number(at/pTotal*100).toFixed(2)+"%"),
                        percent2: pTotal==0 ? "0.00%" : Number(bt/pTotal*100).toFixed(2)+"%",
                        percent3: pTotal==0 ? "0.00%" : Number(ct/pTotal*100).toFixed(2)+"%",
                        percent4: pTotal==0 ? "0.00%" : Number(dt/pTotal*100).toFixed(2)+"%",
                        percent5: pTotal==0 ? "0.00%" : Number(et/pTotal*100).toFixed(2)+"%",
                        percent6: pTotal==0 ? "0.00%" : Number(ft/pTotal*100).toFixed(2)+"%",
                    }
                    this.arr=arr;
                    this.tableData.push(this.arr)
                }
            }
        }
    }
    </script>