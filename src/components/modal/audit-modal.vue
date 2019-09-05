<template>

    <div class="audit_pop">
        <Modal title="缴款清单" class="audit_pop" :mask-closable="false">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="销售日期">
                    <Input v-model="formValidate.sale_date" disabled /> 
                </FormItem>
                <FormItem label="缴款银行"  prop="bankModel" class="bank">
                    <Select v-model="formValidate.bankModel" filterable remote placeholder="请选择缴款银行">
                        <Option v-for="item in bankData" :value="item.id" :key="item.id">{{item.bank}}</Option>
                    </Select>
                </FormItem>
                <FormItem prop="dateTime" label="查账日期">
                    <DatePicker  v-model="formValidate.dateTime" :options="options2" type="datetime" placeholder="Select date and time" style="width: 200px"></DatePicker>
                </FormItem>
                <FormItem prop="monery" label="缴款金额">
                    <Input v-model="formValidate.monery" type="number" placeholder="请输入缴款金额..."  /> 
                </FormItem>
            </Form>
            <div class="modal_footer">
                <Button @click="$emit(asyncOK)">查账</Button>
            </div>
        </Modal>
    </div>
</template>


<script>
export default {
    props: {
        formValidate: {
            // 缴款时间
            dateTime: '',
            // 选择哪个银行
            bankModel: '',
            // 缴款金额
            monery: '',
            // 销售日期
            sale_date: '',
        },
        checkData: {
            type: Array,
            default: () =>　([])
        },
        

    },
    data() {
        return {
            bankData: [],
            
        }
    },

    created() {
        this.bankData = this.checkData;
    },
}
</script>
