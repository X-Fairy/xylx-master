<template>
    <div class="areaData">
        <div class="title">
            <h2>XXX区数据可视化平台</h2>
        </div>
        <div class="search">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="日期" prop="date">
                    <DatePicker type="daterange" :options="options" v-model="formValidate.date"  placement="bottom-end" placeholder="Select date" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem label="区域" prop="area">
                    <Cascader :data="data" v-model="formValidate.area"  style="width: 200px" ></Cascader>
                </FormItem>
                <FormItem class="check">
                    <Button type="ghost" @click="judgeFull(formValidate)">查询</Button>
                </FormItem>
            </Form>
        </div>
        <div class="content">
            <div class="left">
                <ul>
                    <li>
                        <p>销售Top10</p>
                    </li>
                    <li>
                        <p>滞销Top10</p>
                    </li>
                    <li>
                        <p>库存Top10</p>
                    </li>
                </ul>
            </div>
            <div class="center">
                <!-- <div class="total">
                    <div>
                        <p style="color: #9bdef0;font-size: 16px;">总销售额</p>
                        <h2 style="color: #00f1ff;margin-top: 10px;">666666.66</h2>
                    </div>
                </div> -->
                <div class="profile">
                    <img src="@/assets/images/area/3.png" alt="">
                </div>
                <div class="echart-one">
                    <p>销售额</p>
                </div>
            </div>
            <div class="right">
                <ul>
                    <li>
                        <p>品类结构</p>
                    </li>
                    <li></li>
                    <li></li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                formValidate:{
                    date:[],   //选择的时间
                    area:''    //选择的城市
                },
                // 表单认证
                ruleValidate:{
                    date:[
                        {
                            type: 'array', 
                            required: true, 
                            fields: {
                                0: {required: true, message: '时间不能为空', trigger: 'change', pattern: /.+/},
                                1: {required: true, message: '时间不能为空', trigger: 'change', pattern: /.+/},
                            } 
                        },
                    ],
                    area:[
                        { required: true, message: '区域不能为空', trigger: 'blur' }
                    ]
                },
                // 时间限制
                options: {
                    disabledDate(date) {
                        return date && date.valueOf() > Date.now() - 86400000;
                    }
                },
                // 区域数据
                data: [{
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'gugong',
                            label: '故宫'
                        },
                        {
                            value: 'tiantan',
                            label: '天坛'
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井'
                        }
                    ]
                }, {
                    value: 'jiangsu',
                    label: '江苏',
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',
                                }
                            ]
                        },
                        {
                            value: 'suzhou',
                            label: '苏州',
                            children: [
                                {
                                    value: 'zhuozhengyuan',
                                    label: '拙政园',
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                }
                            ]
                        }
                    ],
                }]
            }
        },
        methods:{
            /**
             *  查询
            */
            judgeFull(formValidate) {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        
                    } else {}
                })
            },
        }
    }
</script>