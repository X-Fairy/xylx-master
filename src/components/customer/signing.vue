<template>
    <div class="signing">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class="signForm">
            <FormItem label="客户ID" prop="id">
                <Input v-model="formValidate.id"></Input>
            </FormItem>
            <FormItem label="交易编号" prop="number">
                <Input v-model="formValidate.number"></Input>
            </FormItem>
            <FormItem label="合同分类" prop="type">
                <RadioGroup v-model="formValidate.type">
                    <Radio label="1">意向金</Radio>
                    <Radio label="2">合同</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="目前总到款" prop="totalMoney">
                <Input v-model="formValidate.totalMoney" placeholder="请输入总到款"></Input>
            </FormItem>
            <FormItem label="签单时间" prop="date">
                <DatePicker type="date" placeholder="请选择签单时间" v-model="formValidate.date"></DatePicker>
            </FormItem>
            <FormItem label="客户姓名" prop="name">
                <Input v-model="formValidate.name" placeholder="请输入客户姓名"></Input>
            </FormItem>
            <FormItem label="客户地址" prop="address">
                <Input v-model="formValidate.address" type="textarea" :autosize="{minRows: 1,maxRows: 5}" placeholder="请输入客户地址"></Input>
            </FormItem>
            <FormItem label="关键词" prop="key">
                <Input v-model="formValidate.key" placeholder="请输入关键词"></Input>
            </FormItem>
            <FormItem label="客户来源" prop="source">
                <Select v-model="formValidate.source" placeholder="请选择客户来源">
                    <Option value="1">53</Option>
                    <Option value="2">404</Option>
                </Select>
            </FormItem>
            <FormItem label="联系时间" prop="contactdate">
                <DatePicker type="date" placeholder="请选择签单时间" v-model="formValidate.contactdate"></DatePicker>
            </FormItem>
            <FormItem label="联系方式" prop="phone">
                <Input v-model="formValidate.phone" placeholder="请输入联系方式"></Input>
            </FormItem>
            <FormItem label="年房租" prop="rent">
                <Input v-model="formValidate.rent" placeholder="请输入年房租"></Input>
            </FormItem>
            <FormItem label="贷款">
                <Row>
                    <Col span="11">
                        <FormItem prop="dianmian" label="店面大小">
                            <Input v-model="formValidate.dianmian"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem prop="reality" label="实到">
                            <Input v-model="formValidate.reality"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="装修款">
                <Row>
                    <Col span="11">
                        <FormItem prop="huogui" label="货柜">
                            <Input v-model="formValidate.huogui"></Input>
                        </FormItem>
                    </Col>
                    <Col span="11">
                        <FormItem prop="yajin"  label="装修押金">
                            <Input v-model="formValidate.yajin"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </FormItem>
            <FormItem label="履约金" prop="lvyuejin">
                <Input v-model="formValidate.lvyuejin" placeholder="请输入履约金"></Input>
            </FormItem>
            <FormItem label="加盟费/管理费" prop="jiameng">
                <Input v-model="formValidate.jiameng" placeholder="请输入加盟费/管理费"></Input>
            </FormItem>
            <FormItem label="本月总业绩" prop="zongyeji">
                <Input v-model="formValidate.zongyeji" placeholder="请输入本月总业绩"></Input>
            </FormItem>
            <FormItem label="公司配货/自选货" prop="peihuo">
                <Input v-model="formValidate.peihuo"></Input>
            </FormItem>
            <FormItem label="政策赠送" prop="zengsong">
                <Input v-model="formValidate.zengsong" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
            </FormItem>
            <FormItem label="备注" prop="beizhu">
                <Input v-model="formValidate.beizhu" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
            </FormItem>
            <FormItem>
                <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
                <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
    export default{
        data(){
            return{
                formValidate: {
                    id:'',
                    number:'',
                    type:'',
                    totalMoney:'',
                    data:'',
                    name: '',
                    address:'',
                    key:'',
                    source:'',
                    contactdate:'',
                    phone:'',
                    rent:'',
                    dianmian:'',
                    dianmian:'',
                    reality:'',
                    huogui:'',
                    yajin:'',
                    lvyuejin:'',
                    jiameng:'',
                    zongyeji:'',
                    peihuo:'',
                    zengsong:'',
                    beizhu:''
                },
                ruleValidate: {
                    type:[
                        {required: true, message: '请选择合同分类', trigger: 'change'}
                    ],
                    date: [
                        { required: true, type: 'date', message: '签单时间不能为空', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '客户姓名不能为空', trigger: 'change' }
                    ],
                    address: [
                        { required: true, message: '客户地址不能为空', trigger: 'change' }
                    ],
                    source: [
                        { required: true, message: '客户来源不能为空', trigger: 'change' }
                    ],
                    totalMoney: [
                        { required: true,message: '年房租不能为空', trigger: 'change' },
                    ],
                    dianmian:[
                        { required: true,message: '店面大小不能为空', trigger: 'change' },
                    ]
                }
            }
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        }
    }
</script>