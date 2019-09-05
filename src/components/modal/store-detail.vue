<template>
     <!-- 店铺详情 -->
    <div v-if="storeDetail" class="storeDetail">
        <div class="inner">
            <div class="inner_top">
                <div class="left">
                    <p>店名：<span>{{storeDetailData.NAME}}</span></p>
                </div>
                <Icon type="ios-close" @click="storeDetail=false" title="关闭弹窗"></Icon>
            </div>
            <Form class="store_form" ref="store">
                <FormItem label="门店编码：">
                    <Input v-model="storeDetailData.CODE" />
                </FormItem>
                <FormItem label="星级：">
                    <Input v-model="storeDetailData.CONTACTOR"/>
                </FormItem>
                <FormItem label="开业时间：">
                    <Input v-model="storeDetailData.ABC"/>
                </FormItem>
                <FormItem label="门店类型：">
                    <Input v-model="storeDetailData.PROPERTY" />
                </FormItem>
                <FormItem label="门店面积:">
                    <Input v-model="storeDetailData.XAREA"/>
                </FormItem>
                    
                <FormItem label="房租:">
                    <Input v-model="storeDetailData.RCHARGE"/>
                </FormItem>
                <FormItem label="货柜:">
                    <Input v-model="storeDetailData.COUNTER"/>
                </FormItem>
                    <FormItem label="装修保证金:">
                    <Input v-model="storeDetailData.PAMOUNT"/>
                </FormItem>
                    <FormItem label="首批货款:">
                    <Input v-model="storeDetailData.FPRODUCT"/>
                </FormItem>
                <FormItem label="合作物流:">
                    <Input v-model="storeDetailData.EXPRESS"/>
                </FormItem>
                    <FormItem label="所属督导:">
                    <Input v-model="storeDetailData.ENGINEER"/>
                </FormItem>
                <FormItem label="调换货:">
                    <Input v-model="storeDetailData.CHANGE"/>
                </FormItem>
                <FormItem label="所属客服:">
                    <Input v-model="storeDetailData.KEFU"/>
                </FormItem>
                <FormItem label="电话:">
                    <Input v-model="storeDetailData.PHONE"/>
                </FormItem>
                <FormItem label="地区：">
                    <Input v-model="storeDetailData.AREA"/>
                </FormItem>
                <FormItem label="门店地址：">
                    <Input type="textarea" v-model="storeDetailData.ADDRESS" />
                </FormItem>
                <FormItem label="备注:">
                    <Input type="textarea" v-model="storeDetailData.ANOTE"/>
                </FormItem>
            </Form>
            <div class="bottom">
                <Button type="error" class="cancel" @click="storeDetail=false">关闭</Button>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    props: {
        checkData: {
            type: Array,
            default: () =>　([])
        },

        depname: {
            type: String,
            default: ''
        },

        grow_title: {
            type: String,
            default: ''
        },

        grow_content: {
            type: String,
            default: ''
        },
    },

    created() {
        this.growForm = JSON.parse(JSON.stringify(this.checkData));
    },

    data() {
        return {
            growForm: []
        }
    },

    methods: {
        handleCheckAll ($event, value, index) {
            value.indeterminate = false;
            if (value.checkGrowForm.length === value.child.length) {
                value.child.forEach(ele => {
                    ele.checked = 0;
                })
                value.checkGrowForm = [];
            } else {
                value.child.forEach(ele => {
                    ele.checked = 1;
                });
                value.checkGrowForm = value.child.map(item => item.id);
            }
            
        },
        checkAllGroupChange (data, value) {
           if (data.length && data.length !== value.child.length) {
               value.indeterminate = true;
           } else {
               value.indeterminate = false;
           }
        },
        growquery() {
            // this.$emit('growquery', this.growForm);
            let c = [];
            this.growForm.forEach(item => {
                c = c.concat(item.checkGrowForm);
            })
            if (this.grow_title == '部门') {
                // 说明是对部门进行权限编辑请求
                this.$resetAjax({
                    type: 'POST',
                    url: '/NewA/Users/save_gnid_de',
                    data: {
                        // 部门参数
                        dept_name: this.grow_content,
                        gnid: c
                    },
                    success: (res) => {
                        // 关闭权限编辑框
                        this.$emit('close');
                        // 打开提醒框
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '部门权限修改成功';
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                            this.$emit('growquery', this.growForm);
                        }, 2000);
                    }
                })
            } else {
                //  说明是对职位进行权限编辑请求
                this.$resetAjax({
                    type: 'POST',
                    url: '/NewA/Users/save_gnid',
                    data: {
                        position: this.grow_content,
                        gnid: c
                    },
                    success: (res) => {
                        // 关闭权限编辑框
                        this.$emit('close');
                        // 打开提醒框
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '职位权限修改成功';
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                            this.$emit('growquery', this.growForm);
                        }, 2000);
                    }
                })
            }
        }
        
    }
}
</script>
