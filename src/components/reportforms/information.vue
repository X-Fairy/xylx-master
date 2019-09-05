<template>
    <div class="information">
        <!-- 筛选查询 -->
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
                <div class="part search_code">
                    <span class="item">部门：</span>
                    <div>
                        <Input v-model="num" placeholder="请输入部门" style="width: 180px;"/>
                        <!-- <Button slot="append" icon="ios-search" ></Button> -->
                    </div>
                </div>
                <div class="part">
                        <span class="item">人员：</span>
                        <Select  v-model="people"  multiple style="width: 200px" placeholder="请选择人员" @on-change="getpeople" label-in-value>
                            <Option v-for="item in lowlevelList" :value="item.userid" :key="item.userid" :label="item.user_name">{{item.user_name}}</Option>
                        </Select>
                        <!-- <Button slot="append" icon="ios-search" ></Button> -->
                    </div>
                <div class="part">
                    <span class="item">时间筛选：</span>
                    <!-- <DatePicker type="date" multiple  @on-clear="clearTime"></DatePicker> -->
                    <DatePicker type="datetimerange"  format="yyyy-MM-dd" style="width:200px" :options="options" v-model="dateRange" placeholder="请选择日期" @on-change="getDateRange" @on-clear="clearTime"></DatePicker>
                    <!-- <Button slot="append" icon="ios-search" style="margin-left: -4px;"></Button> -->
                </div>
            </div>
            <div class="right">
                <Button class="go_search" @click="peopleSearch">查询线索情况</Button>
                <Button class="go_search" @click="timeSearch">时间查询渠道数据</Button>
            </div>
        </div>
         <!-- 内容区 -->
         <div class="table">
            <Table border :height="tableHeight" :columns="columns" :data="tableData" v-if="isShow"></Table>
            <Table border :height="tableHeight" :columns="datecolumns" :data="dateData" v-else></Table>
        </div>
        <div class="footer" >
            <!-- 分页 -->
            <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 加载进度 -->
        <!-- <div class="demo-spin-col" v-if="spinShow">
            <Spin fix>
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div style="font-size:16px;color:#1d8c9f;">数据正在加载中,请稍等...</div>
            </Spin>
        </div> -->
    </div>
</template>
<script>
    import {changeday} from "@/assets/js/tool.js"//时间戳
    // 提示组件
    import tipModal from '../tip.vue'
    export default{
        components:{
            changeday,
            tipModal
    },
        data(){
            return {
                //选中的人员姓名
                user:[],
                //表格是否显示
                isShow:true,
                //输入的渠道
                channel:[],
                //渠道id
                channelId:[],
                //输入的部门
                num:'',
                //输入的人员
                people:[],
                //输入的时间范围
                dateRange:[],
                //人员id
                peopleId:[],
                // 渠道来源数据
                sourceList: [],
                //下级员工数据
                lowlevelList:[],
                // 对时间进行限制,选择不到大于今天的时间
                options: {
                    disabledDate (date) {
                        return date && date.valueOf() > Date.now();
                    }
                },
                //表格高度
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
                //日期查询数据表头
                datecolumns:[],
                //表格数据
                tableData:[],
                //日期查询表格数据
                dateData:[],
                //总页数
                total:0,
                //当前页数
                currentPage:1,
                //每页多少条数据
                pageSize:20,
                //是否显示加载进度
                spinShow:false,
                //总合计
                arr:{},
                
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
            // 数据查询
            statistics(){
                this.$resetAjax({
                    url:'/NewA/Customer/statistics',
                    type:'POST',
                    data:{
                        channel:this.channel,
                        people:this.peopleId
                    },
                    success:(res)=>{
                        var data=JSON.parse(res).data;
                        this.tableData=data;
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
                        if(this.channel.length==0&&this.peopleId>0){
                            this.isShow=true;
                            this.columns[0].title="姓名";
                            this.columns[0].key="user_name"
                            delete this.arr.channels;
                            this.arr['user_name']='总合计';
                        }else if(this.channel.length>0&&this.peopleId.length==0){
                            this.isShow=true;
                            this.columns[0].title="渠道";
                            this.columns[0].key="channels"
                            delete this.arr.user_name;
                            this.arr['channels']='总合计';
                        }else if((this.channel.length>0&&this.channel[0]=="全部选")&&this.peopleId.length>0){
                            this.isShow=false;
                            this.dateData=this.tableData;
                            delete this.arr.channels;
                            this.arr['user_name']='总合计';
                            this.datecolumns=[
                                    {
                                        title: '姓名',
                                        key: 'user_name',
                                        align: 'center',
                                        width: 100,
                                    },
                                    {
                                        title: '总客户数',
                                        key: 'total',
                                        align: 'center',
                                        width: 100,
                                    }
                                ];
                            if(this.dateData!==null){
                                console.log(this.dateData);
                                let channels=this.dateData[0].channel;
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
                                    this.datecolumns.push(item);
                                });
                            }else{
                                this.dateData=[];
                                console.log(this.channelId);
                                this.user.forEach(ele=>{
                                    let item={
                                        Acount: "0",
                                        Bcount: "0",
                                        Ccount: "0",
                                        Dcount: "0",
                                        Ecount: "0",
                                        Fcount: "0",
                                        channel: this.channelId,
                                        percent1: "0.00%",
                                        percent2: "0.00%",
                                        percent3: "0.00%",
                                        percent4: "0.00%",
                                        percent5: "0.00%",
                                        percent6: "0.00%",
                                        total: "0",
                                        user_name: ele
                                    }
                                    this.dateData.push(item);
                                })
                                this.channelId.forEach(ele => {
                                    let item={
                                        title: ele,
                                        key: 'channels',
                                        align: 'center',
                                        children: [
                                            {
                                                title: '数量',
                                                key: 'Acount',
                                                align: 'center',
                                                minWidth:100
                                            },
                                            {
                                                title: '占比',
                                                key: 'Acount',
                                                align: 'center',
                                                minWidth:100
                                            },
                                        ]
                                    };
                                    this.datecolumns.push(item);
                                });
                            }
                        }
                        // console.log(this.tableData);
                       
                    }
                })
            },
            /* 得到选择的渠道 */
            getSource(value){
                this.channelId=[];
                for(let i in value){
                    this.channelId.push(value[i].label);
                }
                if(this.channel.includes('all')){
                    this.channel.splice(0,1);
                    this.sourceList.forEach(ele=>{
                        this.channel.push(ele.cid);
                    })
                }
               
                    if(this.channel.includes("none")){
                        this.channel=['none'];
                    }
                this.statistics();
                
                
            },
            /* 得到选择的人员 */
            getpeople(value){
                this.user=[];
                this.peopleId=[];
                for(let i in value){
                    this.user.push(value[i].label);;
                    this.peopleId.push(value[i].value)
                }
                
                this.statistics();
            },
            /* 得到时间 */
            getDateRange(){
                console.log(this.dateRange);
                this.isShow=true;
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
                            people:this.peopleId,
                            time:this.dateRange,
                        },
                        success:(res)=>{
                            var data=JSON.parse(res).data;
                            this.tableData=data;
                        }
                    })
                }
            },
            /* 获取根据时间查询渠道数据 */
            datestatistics(){
                this.$resetAjax({
                        url:'/NewA/Customer/datestatistics',
                        type:'POST',
                        data:{
                            channel:this.channel,
                            time:this.dateRange
                        },
                        success:(res)=>{
                            this.dateData=JSON.parse(res).data;
                            
                            if(this.dateData!==null){
                                this.datecolumns=[
                                    {
                                        title: '时间',
                                        key: 'time',
                                        align: 'center',
                                        width: 150,
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
                                this.dateData.forEach(item=>{
                                    if(item.channel){
                                        var channels=item.channel;
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
                                        this.datecolumns.push(item);                                    
                                    });
                                    }
                                })
                                var obj = {};
                                this.datecolumns = this.datecolumns.reduce(function(item, next) {
                                    obj[next.title] ? '' : obj[next.title] = true && item.push(next);
                                    return item;
                                }, []);
                            }
                        }
                    })
            },
            /* 查询渠道数据表 */
            timeSearch(){
                if((this.dateRange[0]==""||this.dateRange[0]=="NaN-NaN-NaN")&&(this.dateRange[1]==""||this.dateRange[1]=="NaN-NaN-NaN")||this.channel.length==0){
                    this.$Modal.warning({
                        content: '渠道和时间不能为空！'
                    });
                }else{
                    this.isShow=false;
                    this.datestatistics();
                }
            },
            /* 查询线索跟进情况表 */
            peopleSearch(){
                if((this.dateRange[0]==""||this.dateRange[0]=="NaN-NaN-NaN")&&(this.dateRange[1]==""||this.dateRange[1]=="NaN-NaN-NaN")||this.peopleId.length==0){
                    this.$Modal.warning({
                        content: '人员和时间不能为空！'
                    });
                }else{
                    this.isShow=false;
                    this.$resetAjax({
                    url:'/NewA/Customer/datestatistics',
                    type:'POST',
                    data:{
                        people:this.peopleId,
                        time:this.dateRange
                    },
                    success:(res)=>{
                        this.dateData=JSON.parse(res).data;
                        if(this.dateData!==null){
                            this.datecolumns=[
                                {
                                    title: '姓名',
                                    key: 'user_name',
                                    align: 'center',
                                    width: 150,
                                    fixed: 'left'
                                },
                            ];
                            this.dateData.forEach(ele=>{
                                for(let i in ele){
                                    if(i.indexOf('time')!==-1){
                                        i=i.replace('time',"");
                                        var arr=[];
                                        arr.push(i);
                                        let item={
                                            title: arr[0],
                                            key: arr[0],
                                            align: 'center',
                                            children: [
                                                {
                                                    title: '分配数',
                                                    key: 'fenpei'+arr[0],
                                                    align: 'center',
                                                    minWidth:100
                                                },
                                                {
                                                    title: '跟进数',
                                                    key: 'genjin'+arr[0],
                                                    align: 'center',
                                                    minWidth:100
                                                },
                                            ]
                                        }
                                        this.datecolumns.push(item);
                                    }
                                        
                                }
                            })
                        var obj = {};
                        this.datecolumns = this.datecolumns.reduce(function(item, next) {
                            obj[next.title] ? '' : obj[next.title] = true && item.push(next);
                            return item;
                        }, []);
                        }
                        
                    }
                })
                }
            },
            /* 清空时间选择 */
            clearTime(){
                this.dateRange=[];
                this.statistics();
            },
            /* 切换当前页 */
            changePage(){}
        },
        
    }
</script>