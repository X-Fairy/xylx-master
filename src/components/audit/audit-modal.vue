<template>
    <Modal title="缴款清单" v-model="hasShow" class="audit_pop" :mask-closable="false" @on-cancel="$emit('updateHasShow', false)" :key="'simily'">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="销售日期">
                <Input v-model="formValidate.sale_date" disabled /> 
            </FormItem>
            <FormItem label="缴款银行"  prop="bankModel" class="bank">
                <Select v-model="formValidate.bankModel" remote placeholder="请选择缴款银行" :key="'simily'">
                    <Option v-for="item in bankData" :value="item.id" :key="item.id">{{item.bank}}</Option>
                </Select>
            </FormItem>
            <FormItem prop="dateTime" label="到账时间">
                <DatePicker  v-model="formValidate.dateTime" :options="options2" type="datetime" placeholder="Select date and time" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem prop="monery" label="缴款金额">
                <Input v-model="formValidate.monery" type="number" placeholder="请输入缴款金额..."  /> 
            </FormItem>
            <FormItem prop="imgs">
                <Upload v-model="formValidate.imgs" style="display: inline-block;margin-left: 13px;margin-top:5px;" multiple action="/NewA/Audit/getimage" :on-success="uploadImage" :format="['jpg','jpeg','png']" :on-format-error="handleFormatError">
                    <Button type="ghost" icon="images" class="ghost" >上传单据</Button>
                </Upload>
                <Button class="look_image" icon="eye" v-if="isShowImageButton" @click="carouse=true">查看单据</Button>
            </FormItem>
        </Form>
        <!-- 查看图片轮播图 -->
        <div class="carouselcontent" v-if="carouse">
            <Icon type="ios-close-outline" class="close_icon" title="关闭弹窗" @click="carouse=false;"></Icon>
            <Carousel v-model="value1">
                <CarouselItem v-for="(item,index) in imgs" :key="index">
                    <div class="demo-carousel"><img :src="item" alt="加载图片..."></div>
                    <div class="bottom">
                        <!-- <p>照片名称:<span>{{item.name}}</span></p> -->
                        <Button title="点击删除当前这张图片" @click="deleteImage(item)">删除</Button>
                    </div>
                </CarouselItem>
            </Carousel>
        </div>
        <!-- 提示是否删除 -->
        <div class="outside" v-if="isDelete">
            <div class="delete">
                <p>确认删除</p>
                <div class="build">
                    <button type="close" @click="isDelete=false">取消</button>
                    <button type="checkmark"  @click="getDelete">确定</button>
                </div>
            </div>
        </div>
        <div class="modal_footer">
            <Button @click="$emit('asyncOK')">查账</Button>
        </div>
    </Modal>
</template>


<script>
export default {
    props: [
        'formValidate',
        'hasShow'
    ],

    data() {
        return {
            // 银行数据
            bankData: [],
            // 时间限制
            options2: {
                disabledDate (date) {
                    return date && date.valueOf() >= Date.now();
                }
            },
            // 表单验证
            ruleValidate: {
                bankModel: [
                    { required: true, message: '缴款银行不能为空', trigger: 'change' }
                ],
                monery: [
                    { required: true, message: '缴款金额不能为空', trigger: 'blur' }
                ],
                dateTime: [
                    { required: true, type:'date', message: '缴款时间不能为空', trigger: 'change' }
                ],
            },
            // 上传的单据：
            imgs:[],
            //  是否显示查看图片按钮
            isShowImageButton: true,
            //查看上传单据
            carouse:false,
            value1:0,
            // 是否显示删除框
            isDelete:false,
            // 要删除的图片数据
            deleteImageDate: {},
        }
    },

    created() {
        // 获取银行列表数据
        this.getBank();
    },


    methods: {
        /**
         *  获取银行列表数据
         */
        getBank() {
            this.$resetAjax({
                type: 'GET',
                url: '/NewA/Audit/getbank',
                success:(res) => {
                    res = res.sort(function(a, b) {
                        //return (b.sort + "").localeCompare((a.sort + "")); // 比较非数字类型
                        return a.bank <= b.bank ? -1 : 1; // 比较数字类型 升叙排序
                    });
                    this.bankData = res;
                }
            })
        },
        // 表单验证规则
        validateForm () {
            let flag = null;
            this.$refs['formValidate'].validate(valid => {
                if (valid) {
                    flag = true;
                } else {
                    flag = false;
                }
            })
            return flag
        },
        /*
        * 图片格式验证
        */ 
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式不正确',
                desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
            });
        },
         /*
        * 上传图片
        */ 
        uploadImage(res) {
            if(res.msg=="success") {
                this.$root.tip.isShow = true;
                this.$root.tip.content = '上传成功!';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 1500);
                this.imgs.push(res.data);
            } else{
                this.$root.tip.isShow = true;
                this.$root.tip.content = '上传失败!';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 1500);
            }
            if (this.imgs.length !== 0) {
                this.isShowImageButton = true;
            } else {
                this.isShowImageButton = false;
            }
            this.formValidate.imgs=this.imgs;
        },
        /**
        * 删除图片工作准备
        */
        deleteImage(item) {
            this.isDelete = true;
            this.deleteImageDate = item;
        },
        /**
        * 删除图片或文件
        */
        getDelete() {
            this.isDelete = true;
            let index = 0;
            this.imgs.forEach((ele, index) => {
                if (ele == this.deleteImageDate) {
                    index = index;
                }
            });
            this.imgs.splice(index,1);
            this.isDelete = false;
            this.$root.tip.isShow = true;
            this.$root.tip.content = '删除图片成功!';
            this.value1=0;
            setTimeout(() => {
                this.$root.tip.isShow = false;
            }, 1500);
            if (this.imgs.length == 0) {
                this.carouse = false;
                this.$root.tip.isShow = true;
                this.$root.tip.content = '暂无上传图片!';
                this.isShowImageButton = false;
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 1500);
            }
        },
    }
}
</script>


<style>
    .audit_pop .ivu-form-item-label{
        margin-top: 12px;
        color:#1d8c9f !important;
    }
    .audit_pop .ivu-form-item{
       margin-bottom: 8px;
    }
</style>
