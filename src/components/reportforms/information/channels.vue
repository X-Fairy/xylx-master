<template>
        <div class="channels">
            <div class="top">
                <div class="part">
                    <span class="item">人员：</span>
                    <Select  v-model="people"  multiple style="width: 200px" placeholder="请选择人员" @on-change="getpeople" label-in-value>
                        <Option value="all" key="55">全选</Option>
                        <Option value="none" key="100">全不选</Option>
                        <Option v-for="item in lowlevelList" :value="item.userid" :key="item.userid" :label="item.user_name">{{item.user_name}}</Option>
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
                //人员列表
                lowlevelList:[],
                //输入的人员
                people:[],
                //表格的高度
                tableHeight:900,
                //表格头部
                columns:[
                    {
                        title: '姓名',
                        key: 'user_name',
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
            // 得到下级数据
            this.getlowlevelList();
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
            // 数据查询
            statistics(){
                this.$resetAjax({
                    url:'/NewA/Customer/statistics',
                    type:'POST',
                    data:{
                        people:this.peopleId
                    },
                    success:(res)=>{
                        var data=JSON.parse(res).data;
                        this.tableData=data;
                        this.total();
                   
                    }
                })
            },
            /* 跟进选择的人员查询数据 */
            getpeople(value){
                this.user=[];
                this.peopleId=[];
                for(let i in value){
                    this.user.push(value[i].label);;
                    this.peopleId.push(value[i].value)
                }
                if(this.people.includes('all')){
                    this.people.splice(0,1);
                    this.lowlevelList.forEach(ele=>{
                        this.people.push(ele.userid);
                    })
                }
                if(this.people.includes("none")){
                    this.people=['none'];
                }
                this.statistics();
            },
            /* 根据时间删选 */
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
                            people:this.peopleId,
                            time:this.dateRange,
                        },
                        success:(res)=>{
                            var data=JSON.parse(res).data;
                            this.tableData=data;
                            this.total();
                        }
                    })
                }
            },
            /* 清空时间 */
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
                        user_name:'总合计',
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