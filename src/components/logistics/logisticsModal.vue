<template>
    <Modal :title="modalTitle" v-model="hasShow"  :mask-closable="false" @on-cancel="$emit('updateHasShow', false)">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="公司名称"  prop="name">
                <Input v-model="formValidate.name" type="number" placeholder="请输入公司名称..."  /> 
            </FormItem>
            <FormItem label="地址"  prop="address">
                <Input v-model="formValidate.address" type="number" placeholder="请输入公司地址..."  /> 
            </FormItem>
            <FormItem label="电话"  prop="tel">
                <Input v-model="formValidate.tel" type="number" placeholder="请输入电话..."  /> 
            </FormItem>
            <FormItem label="联系人"  prop="linkman">
                <Input v-model="formValidate.linkman" type="number" placeholder="请输入联系人..."  /> 
            </FormItem>
            <FormItem prop="坐标" label="coordinate">
                <Input v-model="formValidate.coordinate" type="number" placeholder="请输入坐标..."  /> 
            </FormItem>
            <FormItem prop="备注" label="remark">
                <Input v-model="formValidate.remark" type="number" placeholder="请输入备注..."  /> 
            </FormItem>
        </Form>
        <div class="modal_footer">
            <Button @click="$emit('asyncOK')">确定</Button>
        </div>
    </Modal>
</template>



 
 
 
 
 

<script>
export default {
    props: [
        // 模态框标题
        'modalTitle',
        // 是否显示模态框
        'hasShow',

    ]
}
</script>
