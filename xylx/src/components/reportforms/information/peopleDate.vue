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
            /* 获取选中的人员 */
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
                }
                
                // console.log(this.dateRange);
                if(this.people.length>0&&this.dateRange[0]!==""&&this.dateRange[0]!=="NaN-NaN-NaN"){
                    this.datestatistics();
                }
            },
            /* 根据时间删选 */
            search(){
                for(var i=0;i<this.dateRange.length;i++){
                    this.dateRange[i]=changeday(this.dateRange[i]);
                }
                if(this.people.length==0){
                    this.$Modal.warning({
                        content: '人员不能为空！'
                    });
                }else if(this.people.length>0&&this.dateRange[0]!==""&&this.dateRange[0]!=="NaN-NaN-NaN"){
                    this.datestatistics();
                }
            },
            datestatistics(){
                this.$resetAjax({
                    url:'/NewA/Customer/datestatistics',
                    type:'POST',
                    data:{
                        people:this.people,
                        time:this.dateRange
                    },
                    success:(res)=>{
                        this.tableData=JSON.parse(res).data;
                        this.columns=[
                            {
                                title: '姓名',
                                key: 'user_name',
                                align: 'center',
                                width: 150,
                                fixed: 'left'
                            },
                        ];
                        this.tableData.forEach(ele=>{
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
                                    this.columns.push(item);
                                }
                                    
                            }
                        })
                        var obj = {};
                        this.columns = this.columns.reduce(function(item, next) {
                            obj[next.title] ? '' : obj[next.title] = true && item.push(next);
                            return item;
                        }, []);
                        
                    }
                })
            },
        }
    }
</script>