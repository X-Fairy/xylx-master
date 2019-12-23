<template>
    <div class="unsalable">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class="top">
            <FormItem label="仓位选择" prop="wrh">
                <Select v-model="formValidate.wrh" placeholder="主仓" >
                    <Option :value="item.id" v-for="item in list"  :key="item.id">{{item.name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="商品类别" prop="cls" >
                <Input v-model="formValidate.cls" placeholder="输入两位类别编码"  clearable></Input>
            </FormItem>
            <FormItem label="商品条码" prop="code">
                <Input v-model="formValidate.code" placeholder=""  clearable></Input>
            </FormItem>
            <FormItem label="滞销时间" prop="time">
                <Select v-model="formValidate.time" placeholder="一个月" >
                    <Option :value="item.num" v-for="item in timeData" :key="item.num">{{item.date}}</Option>
                </Select>
            </FormItem>
            <FormItem >
                <Button type="primary" @click="handleSubmit('formValidate')"    >查询</Button>
                <Button type="primary" @click="upload">导出列表</Button>
            </FormItem>
        </Form>
        <!-- 列表 -->
        <div class="table">
            <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
        <div class="footer">
            <!-- 分页  -->
            <Page  :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 加载进度 -->
        <spin v-if="spinShow"></spin>
    </div>
</template>
<script>
import {changeday} from "@/assets/js/tool.js"//时间戳
import spin from '../spin.vue'
export default{
    components:{
        changeday,
        spin
    },
    data(){ 
        return{
            //仓位选择
            list:[
                {id:'1000000',name:'主仓'},
                {id:'1000040',name:'国际仓'}
            ],
            // 时间选择
            timeData:[
                {num:'7',date:'一周'},
                {num:'30',date:'一个月'},
                {num:'90',date:'三个月'},
                {num:'180',date:'半年'},
            ],
            // 对时间进行限制,选择不到大于今天的时间
            options: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now();
                }
            },
            // 表单数据
            formValidate: {
                cls: '',
                code: '',
                wrh: '1000000',
                time: '30'
            },
            // 表单验证
            ruleValidate: {
                wrh: [
                    { required: true, message: '仓位不能为空', trigger: 'blur' }
                ],
                time: [
                    { required: true, message: '滞留时间不能为空', trigger: 'blur' }
                ],
                cls:[
                    { type: 'string', max: 2,min:2, message: '请输入两位数的商品类别', trigger: 'change' }
                ]
            },
            // 表格高度
            tableHeight:900,
            // 表头
            columns:[
                {
                    title: '商品条码',
                    key: 'CODE2'
                },
                {
                    title: '商品名称',
                    key: 'NAME'
                },
                {
                    title: '库存数量',
                    key: 'QTY'
                },
                {
                    title: '更新时间',
                    key: 'LASTTIME'
                },
            ],
            // 表格数据
            tableData:[],
            // 总页数
            total:0,
            // 当前页
            currentPage:1,
            // 每页多少条数据
            pageSize:20,
            // 是否显示加载进度
            spinShow:false
        }
    },
    mounted(){  
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
    computed: {
       
    },
    methods: {
        // 查询
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.currentPage=1;
                    this.unsalable();
                }else{
                   
                }
            })
        },
        // 发送查询请求
        unsalable(){
            this.spinShow=true;
            this.$resetAjax({
                url:'/NewA/Unsalable/index',
                type:'POST',
                data:{
                    p:this.currentPage,//页码
                    wrh:this.formValidate.wrh,//仓位
                    cls:this.formValidate.cls,//商品类别
                    code:this.formValidate.code,//商品条码
                    time:this.formValidate.time//时间
                },
                success:(res)=>{
                    this.tableData=res.data.list;
                    this.total=parseInt(res.data.count);
                    this.spinShow=false;
                }
            })
        },
        // 分页
        changePage(index){
            this.currentPage=index;
            this.unsalable();
        },
        // 导出
        upload(){
            if(this.tableData.length>0){
                location.href = `http://oa.xmvogue.com/index.php/NewA/Unsalable/download?cls=${this.formValidate.cls}&code=${this.formValidate.code}&time=${this.formValidate.time}&wrh=${this.formValidate.wrh}`
            }else{
                this.$Modal.warning({
                    title:'提示',
                    content:'暂无数据可以导出！'
                })                    
            }
        }
    }
}
</script>

