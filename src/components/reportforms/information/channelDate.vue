<template>
        <div class="channels">
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
                    <span class="item">时间：</span>
                    <DatePicker type="datetimerange"  format="yyyy-MM-dd" style="width:200px" :options="options" v-model="dateRange" placeholder="请选择日期" @on-change="search"></DatePicker>
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
                //输入的人员
                channel:[],
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
            /* 得到选择的渠道 */
            getSource(value){
                if(this.channel.includes('all')){
                    let arr=[];
                    this.sourceList.map(ele=>{
                        arr.push(ele.cid);
                    })
                    this.channel=arr;
                }
                if(this.channel.includes("none")){
                    this.channel=['none'];
                }
                
                if(this.dateRange[0]!==""&&this.dateRange[0]!=="NaN-NaN-NaN"&&this.channel[0]!=="none"){
                    this.datestatistics();
                }
            },
            /* 根据时间删选 */
            search(){
                for(var i=0;i<this.dateRange.length;i++){
                    this.dateRange[i]=changeday(this.dateRange[i]);
                }
                if(this.channel[0]=="none"){
                    this.$Modal.warning({
                        content: '至少选中一个渠道！'
                    });
                }else if(this.channel.length==0){
                    this.$Modal.warning({
                        content: '渠道不能为空！'
                    });
                }else if(this.dateRange[0]!==""&&this.dateRange[0]!=="NaN-NaN-NaN" &&this.channel.length>0){
                    this.datestatistics();
                }
            },
            datestatistics(){
                this.$resetAjax({
                        url:'/NewA/Customer/datestatistics',
                        type:'POST',
                        data:{
                            channel:this.channel,
                            time:this.dateRange
                        },
                        success:(res)=>{
                            if(JSON.parse(res).data!==null){
                                this.tableData=JSON.parse(res).data;
                            }else{
                                this.tableData=[];
                            }                            
                            if(this.tableData!==null){
                                this.columns=[
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
                                this.tableData.forEach(item=>{
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
                                        this.columns.push(item);                                    
                                    });
                                    }
                                })
                                var obj = {};
                                this.columns = this.columns.reduce(function(item, next) {
                                    obj[next.title] ? '' : obj[next.title] = true && item.push(next);
                                    return item;
                                }, []);
                            }
                        }
                    })
            },
        }
    }
</script>