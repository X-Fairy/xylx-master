<template>
    <div class="storeStatement">
        <!-- 查询 -->
            <div class="top">
                <div class="top_left">
                    <div class="part" style="margin-right: 20px;">
                        <span class="item">门店编码：</span>
                        <Input v-model="code" placeholder="全部门店"  style="width: 280px"/>
                    </div>
                    <!-- <div class="part" style="margin-right: 20px;">
                        <span class="item">商品类别</span>
                        <Select v-model="category" style="width:280px">
                            <Option v-for="item in categoryList" :value="item.SCODE" :key="item.SCODE">{{ item.SNAME }}</Option>
                        </Select>
                    </div>  -->
                    <div class="part">
                        <span class="item">时间选择</span>
                        <DatePicker type="daterange" v-model="dateList"  placeholder="请选择时间区间"  style="width: 280px"></DatePicker>
                    </div>
                    <div class="part">
                        <span class="item">查询条数：</span>
                        <Select v-model="num" style="width:160px" @on-change="getnum(num)">
                            <Option v-for="item in numList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                </div>
                <div class="top_right">
                    <Button class="check" @click="search" style="margin-right: 20px;">查询</Button>
                    <button   @click="daochu" style="height: 32px;padding: 0 7px;margin-left: 30px;width: 120px;">导出门店报表
                        <span style="color: #fff;font-weight: 600;position: relative;">
                            <!-- 加载进度 -->
                            <Spin fix v-if="daochuShow" style="left: 10px;">
                                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                            </Spin>
                        </span>
                    </button>
                </div>
            </div>
        <div class="containers">
            <ul v-show='chardata.length>0'>
                <li>
                    <p class="color"></p>
                    <p>销售数量</p> 
                </li>
                <li>
                    <p class="color money"></p>
                    <p>金额</p> 
                </li>
            </ul>
            <div v-for="(item,index) in chardata" :key="index" :class="active==10? 'test2' : 'test1'" style="float: left;">
                <echart :options="item" :id='"charts" +index' :index="index"  style="height:420px;" :class="active==20? 'echarts2' : 'echarts1'" ></echart>
                <h3>{{category[index]}}</h3>
            </div>
        </div>
         <!-- 加载进度 -->
         <spin v-if="spinShow"></spin>
    </div>
</template>
<script>
import spin from '../spin.vue'
import {changeday} from "@/assets/js/tool.js"//时间戳
import echart from '@/components/echartscom.vue'
export default{
    components:{
        changeday,
        // 加载进度
        spin,
        echart
    },
    data(){
        return{
            // 输入的门店编码
            code:'',
            // 选中的时间
            dateList: [],
            // 查询条数
            num:10,
            className:'echarts1',
            numList: [
                {
                    label: '10',
                    value: 10
                },
                {
                    label: '20',
                    value: 20
                },
                
            ],
            // 表格高度
            // tableHeight:900,
            // 表格头部
            columns:[
                {
                    title: '门店编码',
                    key: 'CODE2'
                },
                {
                    title: '商品名称',
                    key: 'NAME'
                },
                {
                    title: '销售数量',
                    key: 'QTY'
                },
                {
                    title: '金额',
                    key: 'TOTAL'
                },
            ],
            // 是否显示加载进度条
            spinShow: false,
            // // 表格数据
            // tableData:[],
            dataList:[],
            // 柱状图数据
            chardata:[],
            // 商品分类
            category:[],
            // 判断class
            active:10,
            // 是否显示导出加载进度
            daochuShow:false,

        }
    },
    created(){
        this.newDate(30,true);
    },
    methods:{
        /* 获取最近一个月时间 */
        newDate(intervalDays,bolPastTime){
            let dateNow=new Date();
            let oneDayTime = 24 * 60 * 60 * 1000;
            let list = [];
            let lastDay;
            if(bolPastTime == true){
                lastDay = new Date(dateNow.getTime() - intervalDays * oneDayTime);
                list.push(changeday(lastDay));
                list.push(changeday(dateNow));
            }else{
                lastDay = new Date(dateNow.getTime() + intervalDays * oneDayTime);
                list.push(changeday(dateNow));
                list.push(changeday(lastDay));
            }
            this.dateList=list;
            
        },
        /* 查询 */
        search(){
            this.chardata=[];
            for(let i=0;i<this.dateList.length;i++){
                if(this.dateList[0]!==''){
                    this.dateList[i]=changeday(this.dateList[i]);
                }
            }
            if(this.num==10){
                this.active=10
            }else if(this.num==20){
                this.active=20
            }
           this.report();
        },
        /* 发送请求 */
        report(){
            this.spinShow = true;
            this.$resetAjax({
                type: 'post',
                url: '/NewA/Store/report',
                data: {
                    code: this.code,
                    time: this.dateList,
                    num: this.num
                },
                success:(res) => {
                    this.spinShow = false;
                    let data=JSON.parse(res).data;
                    this.dataList=data;
                    let arr=[];
                    this.dataList.forEach(item=>{
                        this.category.push(item.cate);
                        arr.push(item.data);
                    });
                    if(arr[0].length>0){
                        this.chardata=arr;
                    }else{
                        this.$Message.warning('暂无数据')
                    }
                }
            })
        },
        daochu(){
            this.daochuShow=true;
            for(let i=0;i<this.dateList.length;i++){
                if(this.dateList[0]!==''){
                    this.dateList[i]=changeday(this.dateList[i]);
                }else{
                    this.dateList=[]
                }
            }
            location.href = `http://oa.xmvogue.com/index.php/NewA/Store/daochu?code=${this.code}&time=${this.dateList}&num=${this.num}`;            
            setTimeout(() => {
                this.daochuShow=false;
            }, 13000);
        }
    }
}
</script>