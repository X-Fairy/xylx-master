<template>
        <div class="channel_people">
            <div class="top">
                <div class="left">
                    <div class="part">
                        <span class="item">渠道：</span>
                        <Select v-model="channel"  style="width:300px" multiple @on-change="getSource" placeholder="请选择渠道" label-in-value>
                            <Option value="all" key="55">全选</Option>
                            <Option value="none" key="100">全不选</Option>
                            <Option v-for="item in sourceList" :value="item.cid" :key="item.cid" :label="item.channels">{{ item.channels }}</Option>
                        </Select>
                    </div>
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
                <div class="right">
                        <!-- <Button class="go_search" @click="search">查询</Button> -->
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
                //输入的渠道,包含渠道名称和渠道id
                channel:[],
                //输入的渠道名称：
                channels:[],
                //人员列表
                lowlevelList:[],
                //输入的人员
                people:[],
                //表格的高度
                tableHeight:900,
                //表格头部
                columns:[],
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
                //默认显示的数据
                user:[],
                //总合计项
                arr:[]
                
            }
        },
        created(){
            // 得到渠道来源数据
            this.getSourceList();
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
                        channel:this.channel,
                        people:this.people
                    },
                    success:(res)=>{
                        var data=JSON.parse(res).data;
                        this.tableData=data;
                        this.columns=[
                            {
                                title: '姓名',
                                key: 'user_name',
                                align: 'center',
                                width: 100,
                                fixed: 'left'
                            },
                            {
                                title: '总客户数',
                                key: 'total',
                                align: 'center',
                                width: 100,
                                fixed: 'left'
                            }
                        ];
                        let channels=this.tableData[0].channel;
                        channels.forEach(ele => {
                            let item={
                                title: ele.channels,
                                key: 'channels',
                                align: 'center',
                                children: [
                                    {
                                        title: '数量',
                                        key: 'count'+ele.cid,
                                        align: 'center',
                                        minWidth:100
                                    },
                                    {
                                        title: '占比',
                                        key: 'percent'+ele.cid,
                                        align: 'center',
                                        minWidth:100
                                    },
                                ]
                            };
                            this.columns.push(item);
                        });
                        this.total();
                    }
                })
                
            },
            /* 根据选择的渠道获取列表数据 */
            getSource(value){
                this.channels=[];
                for(let i in value){
                    this.channels.push(value[i].label);
                }
                if(this.channel.includes('all')){
                    this.channel.splice(0,1);
                    this.sourceList.forEach(ele=>{
                        this.channel.push(ele.cid);
                    })
                }
                if(this.channel.includes("none")){
                    this.channel=['none'];
                    this.tableData=[];
                    this.columns=[];
                }
                if(this.channel[0]!=="none"&&this.channel.length>0&&this.people.length>0){
                    this.statistics()
                }
                
            },
            /* 根据选择的人员查询数据 */
            getpeople(value){
                this.user=[];
                for(let i in value){
                    this.user.push(value[i].label);
                }
                if(this.people.includes('all')){
                    this.people.splice(0,1);
                    this.lowlevelList.forEach(ele=>{
                        this.people.push(ele.userid);
                    })
                }
                if(this.people.includes("none")){
                    this.people=['none'];
                    this.tableData=[];
                }
                if(this.channel[0]!=="none"&&this.channel.length>0&&this.people.length>0&&this.people[0]!=="none"){
                    this.statistics()
                }
            },
            /* 根据时间删选数据 */
            getDateRange(){
                for(var i=0;i<this.dateRange.length;i++){
                    this.dateRange[i]=changeday(this.dateRange[i]);
                }
                if(this.dateRange[0]==""||this.dateRange[0]=="NaN-NaN-NaN"){
                    this.statistics();
                }
                else if(this.people.length>0&&this.channel.length>0){
                    this.$resetAjax({
                        url:'/NewA/Customer/statistics',
                        type:'POST',
                        data:{
                            channel:this.channel,
                            people:this.people,
                            time:this.dateRange,
                        },
                        success:(res)=>{
                            var data=JSON.parse(res).data;
                            this.tableData=data;
                            this.columns=[
                                {
                                    title: '姓名',
                                    key: 'user_name',
                                    align: 'center',
                                    width: 100,
                                    fixed: 'left'
                                },
                                {
                                    title: '总客户数',
                                    key: 'total',
                                    align: 'center',
                                    width: 100,
                                    fixed: 'left'
                                }
                            ];
                            let channels=this.tableData[0].channel;
                            channels.forEach(ele => {
                                let item={
                                    title: ele.channels,
                                    key: 'channels',
                                    align: 'center',
                                    children: [
                                        {
                                            title: '数量',
                                            key: 'count'+ele.cid,
                                            align: 'center',
                                            minWidth:100
                                        },
                                        {
                                            title: '占比',
                                            key: 'percent'+ele.cid,
                                            align: 'center',
                                            minWidth:100
                                        },
                                    ]
                                };
                                this.columns.push(item);
                            });
                            this.total();
                        }
                    })
                }else{
                    this.$Modal.warning({
                        content: '渠道和人员不能为空！'
                    });
                }
            },
            clearTime(){
                this.dateRange=[];
                this.statistics;
            },
            /* 表格总合计 */
            total(){
                let pTotal=0,t=0;
                let arr={
                    user_name:'总合计',
                    total:pTotal,
                }
                this.arr=arr;
                this.tableData.forEach(ele=>{
                    if(typeof ele.total=='undefined'){
                        ele['total']=0;
                    }
                    pTotal+=parseInt(ele.total);
                    this.arr.total=pTotal;
                    for(let i in ele.channel){
                        i=ele.channel[i].cid;
                        if(typeof ele['count'+i]=='undefined'){
                            ele['count'+i]=0;
                        }
                        if(typeof ele['percent'+i] == "undefined"){
                            ele['percent'+i]='0.00%';
                        }
                        t+=parseInt(ele['count'+i]);
                        this.arr['count'+i]=t;
                        this.arr['percent'+i]= (pTotal==0 ? "0.00%" : Number(t/pTotal*100).toFixed(2)+"%");
                    }

                })
                
                // this.tableData.push(this.arr)
            }
        }
    }
    </script>