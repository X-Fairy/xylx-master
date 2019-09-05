<template>
    <div class="directlyStores">
        <div class="directlyStores_left">
            <p class="top"><span class="round"></span>门店列表</p>
            <!-- 表格 -->
            <Card class="table">
                <Table size="small" @on-row-click="rowClick"  :columns="columns" :data="tableData" :height="tableHeight"></Table>
            </Card>
        </div>
        <div class="directlyStores_right">
            <p class="top"><span class="round"></span>门店详情</p>
            <Card class="right_area">
                <div class="area_top">
                    <div class="area_select">
                        <span class="area_item">选择时间</span>
                        <DatePicker type="date" v-model="selectDate" :options="options1" placeholder="Select date" style="width: 160px" @on-change="changeDate"></DatePicker>
                    </div>
                </div>
                <!-- 详情内容区 -->
                <div class="area_middle">
                    <Form ref="storevalidate" :model="storevalidate" :rules="ruleValidate" :label-width="80">
                        <div class="form_item storeInfo">
                            <FormItem label="门店名称" prop="store_name">
                                <Input v-model="storevalidate.store_name" disabled />
                            </FormItem> 
                            <FormItem label="门店编码" prop="store_code">
                                <Input v-model="storevalidate.store_code" disabled />
                            </FormItem> 
                        </div> 
                        <!-- 营业额总计 -->
                        <div class="form_item saleAddSum">
                            <FormItem label="营业额" prop="sale_amt ">
                                <Input type="number" v-model="storevalidate.sale_amt" :disabled="saleSum == saleAddSum" />
                            </FormItem>
                            <span class="operator"> = </span>
                            <FormItem label="鼎富通" prop="mob_pay">
                                <Input type="number" v-model="storevalidate.mob_pay" :disabled="saleSum == saleAddSum" />
                            </FormItem> 
                            <span class="operator"> + </span>
                            <FormItem label="储值卡" prop="account_pay"> 
                                <Input type="number" v-model="storevalidate.account_pay" :disabled="saleSum == saleAddSum" />
                            </FormItem>
                            <span class="operator"> + </span>
                            <FormItem label="现金" prop="cash_pay">
                                <Input type="number" v-model="storevalidate.cash_pay" :disabled="saleSum == saleAddSum" />
                            </FormItem> 
                        </div>
                        <!-- 库存总计 -->
                        <div class="form_item">
                            <FormItem label="库存" prop="stock_amt">
                                <Input type="number" v-model="storevalidate.stock_amt" :disabled="stockSum == stockAddSum" />
                            </FormItem>
                            <span class="stock"> = </span> 
                            <FormItem label="上一天库存" prop="last_stock_amt">
                                <Input type="number" v-model="storevalidate.last_stock_amt" :disabled="stockSum == stockAddSum"/>
                            </FormItem>
                            <span class="stock"> + </span> 
                             <FormItem label="出库" prop="receive_amt">
                                <Input type="number" v-model="storevalidate.receive_amt" :disabled="stockSum == stockAddSum"/>
                            </FormItem>
                            <span class="stock"> + </span> 
                            <FormItem label="调拨" prop="store_allocate">
                                <Input type="number" v-model="storevalidate.store_allocate" :disabled="stockSum == stockAddSum"/>
                            </FormItem>
                             <span class="stock"> - </span> 
                        </div>
                         <!-- 库存总计 -->
                        <div class="form_item">
                            <FormItem label="物料" prop="material_amt">
                                <Input type="number" v-model="storevalidate.material_amt" :disabled="stockSum == stockAddSum"/>
                            </FormItem>
                            <span class="stock"> - </span>
                            <FormItem label="退货" prop="return_amt">
                                <Input type="number" v-model="storevalidate.return_amt" :disabled="stockSum == stockAddSum"/>
                            </FormItem>
                            <span class="stock"> - </span>
                           <FormItem label="损耗" prop="loss_amt">
                                <Input type="number" v-model="storevalidate.loss_amt" :disabled="stockSum == stockAddSum"/>
                            </FormItem>
                            <span class="stock"> - </span>
                            <FormItem label="活动" prop="promotion_amt">
                                <Input type="number" v-model="storevalidate.promotion_amt" :disabled="stockSum == stockAddSum"/>
                            </FormItem>
                            <span class="stock"> - </span>
                        </div>
                         <!-- 库存总计 -->
                        <div class="form_item stock_amt">
                             <FormItem label="销售成本" prop="cost_amt">
                                <Input type="number" v-model="storevalidate.cost_amt" :disabled="stockSum == stockAddSum"/>
                            </FormItem>
                            <span class="stock"> - </span>
                             <FormItem label="出样试用装" prop="trial_amt">
                                <Input type="number" v-model="storevalidate.trial_amt" :disabled="stockSum == stockAddSum" />
                            </FormItem>
                            <span class="stock"> - </span>
                            <FormItem label="盘点差异" prop="check_difference">
                                <Input type="number" v-model="storevalidate.check_difference"  @on-change="changeStock" />
                            </FormItem>
                            <span class="stock"> - </span>
                            <FormItem label="其他" prop="other_amt"> 
                                <Input type="number" v-model="storevalidate.other_amt" @on-change="changeStock" />
                            </FormItem>
                        </div>
                        <div class="form_item mpeb">
                            <FormItem label="成本" prop="mob_pay">
                                <Input type="number" v-model="storevalidate.mob_pay" />
                            </FormItem>
                            <FormItem label="盘盈" prop="panyin"> 
                                <Input type="number" v-model="storevalidate.panyin" />
                            </FormItem>
                            <FormItem label="支出" prop="expend_amt"> 
                                <Input type="number" v-model="storevalidate.expend_amt"/>
                            </FormItem>
                            <FormItem label="余额" prop="balance"> 
                                <Input type="number" v-model="storevalidate.balance" />
                            </FormItem> 
                        </div>
                        <div class="form_item memo">
                            <FormItem label="备注" prop="memo" style="width: 100%;">
                                <Input v-model="storevalidate.memo" :maxlength="50" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="please enter something..." />
                                <span>50字数以内</span>
                            </FormItem>
                        </div>
                        <div class="handle form_item"  v-if="isShow">
                            <Button class="submit" @click="handleSubmit">提交</Button>
                            <Button class="reset" @click="handleReset" style="margin-left: 8px">重置</Button>
                        </div>
                    </Form>
                </div>
            </Card>
        </div>
    </div>
</template>


<script>

import {changeday} from  '@/assets/js/tool.js'
import tipModal from '../tip.vue'

export default {
    components: {
        tipModal
    },
    data() {
        return{
            // 门店表头数据
            columns: [
                {
                    title: '门店编码',
                    key: 'CODE',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                height: '48px',
                                lineHeight: '48px'
                            },
                            domProps: {
                                title: '单击当前行查看门店详情',
                            },
                            on: {
                                click: () => {}
                            }
                        }, params.row.CODE);
                    }
                },
                {
                    title: '门店名称',
                    key: 'NAME',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', {
                            style: {
                                height: '48px',
                                lineHeight: '48px'
                            },
                            domProps: {
                                title: '单击当前行查看门店详情',
                            },
                            on: {
                                click: () => {}
                            }
                        }, params.row.NAME);
                    }
                }
                  
            ],
            // 门店列表数据
            tableData: [],
            // 表格高度
            tableHeight: 700,
            // 时间快捷选择数据
            options1: {
                disabledDate (date) {
                    return date && date.valueOf() > Date.now() - 86400000;
                },
                shortcuts: [
                    {
                        text: 'Yesterday',
                        value () {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            return date;
                        },
                        onClick: (picker) => {}
                    },
                    {
                        text: 'One week',
                        value () {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            return date;
                        },
                        onClick: (picker) => {}
                    }
                ]
            },
            // 选择时间
            selectDate: this.yesterday,
            // 昨天的时间
            yesterday: '',
            // 门店详情数据
            storevalidate: {},
            // 门店验证
            ruleValidate: {
                // expenditure: [
                //     { required: true, message: '支出金额不能为空哦', trigger: 'blur' }
                // ],
                // balance: [
                //     { required: true, message: '余额不能为空哦', trigger: 'blur' }
                // ],
            },
            // 门店详情要的参数
            code: '',
            // 门店详情点击时传过去的数据
            storeData: {},
            // 得到鼎富通加现金加储值卡的总和
            saleAddSum: 0, 
            // 营业额总和
            saleSum: 0,
            // 库存总和
            stockSum: 0,
            // 一系列加起来的库存和 例如 出库、损耗等等
            stockAddSum: 0,
            // 是否显示修改和重置功能
            isShow: true,

        }
    },
    
    mounted() {
        // 把时间默认选中到昨天
        let yesDate = new Date();
        this.yesterday = changeday(yesDate.setTime(yesDate.getTime() - 3600 * 1000 * 24));
        this.selectDate = this.yesterday;
        setTimeout(()=> {
            // 得到浏览器内容高度
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 220);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 220);
        })
    },

    created() {
        // 得到门店数据
        this.getStoreData();
       
    },


    methods: {
        /**
         * 得到门店数据
         */
        getStoreData() {
            this.$resetAjax({
                type: 'POST',
                url:  '/NewA/Directsales/getstorelist',
                success: (res) => {
                    this.tableData = res.data;
                    this.code = res.data[0].CODE;
                    // 得到第一个门店的门店编码
                    this.storeData.CODE = res.data[0].CODE;
                    // 右侧默认得到第一个门店的详情
                    this.$resetAjax({
                        type: 'POST',
                        url:  '/NewA/Directsales/get_info',
                        data: {
                            code: this.code,
                            time: this.yesterday
                        },
                        success: (res) => {
                            // 默认显示第一个门店信息
                            $('.ivu-table-row').eq(0).find('td').addClass('td-click');
                            let result = res.data;
                            // 查看是否有编辑和重置功能
                            if(res.errorcode == '1') {
                                this.isShow = false;
                            } else {
                                this.isShow = true;
                            }
                            // 说明有门店详情数据
                            if (result.length !== 0) {
                                this.storevalidate = res.data[0];
                                // 得到鼎富通加现金加储值卡的总和
                                var a = Number(this.storevalidate.mob_pay) * 100 ;
                                var b = Number(this.storevalidate.cash_pay) * 100 ;
                                var c = Number(this.storevalidate.account_pay) * 100;
                                this.addSum = (a + b + c) / 100;
                                // 营业额总金额
                                this.saleSum = Number(this.storevalidate.sale_amt);
                                // 出库+上一天库存等等加起来的总和
                                var d = Number(this.storevalidate.last_stock_amt) * 100,
                                    e = Number(this.storevalidate.receive_amt) * 100,
                                    f = Number(this.storevalidate.store_allocate) * 100,
                                    g = Number(this.storevalidate.material_amt) * 100,
                                    h = Number(this.storevalidate.return_amt) * 100,
                                    i = Number(this.storevalidate.cost_amt) * 100,
                                    j = Number(this.storevalidate.promotion_amt) * 100,
                                    k = Number(this.storevalidate.trial_amt) * 100,
                                    l = Number(this.storevalidate.loss_amt) * 100,
                                    m = Number(this.storevalidate.check_difference) * 100,
                                    n = Number(this.storevalidate.other_amt) * 100;
                                
                                this.stockAddSum = (d + e + f - g - h - i - j - k - l - m - n) / 100; 
                                // 库存总数
                                this.storevalidate.stock_amt = this.stockSum = Number(this.storevalidate.stock_amt );
                            } else {
                                this.storevalidate = {
                                    store_name: this.tableData[0].NAME,    // 门店名称
                                    store_code: this.tableData[0].CODE,   // 编码
                                    sale_amt: 0,            // 营业额
                                    mob_pay: 0,             // 鼎富通
                                    account_pay: 0,         // 储值卡
                                    cash_pay: 0,            // 现金
                                    stock_amt: 0,           // 库存
                                    last_stock_amt: 0,      // 上一天库存
                                    receive_amt: 0,         // 出库
                                    store_allocate: 0,      // 调拨
                                    material_amt: 0,        // 物料
                                    return_amt: 0,          // 退货
                                    cost_amt: 0,            // 销售成本
                                    promotion_amt: 0,       // 活动
                                    trial_amt: 0,           // 出样试用装
                                    loss_amt: 0,            // 损耗
                                    check_difference: 0,    // 盘点差异
                                    other_amt: 0,           // 其他
                                    panyin: 0,              // 盘盈
                                    expend_amt: 0,          // 支出
                                    balance: 0,             // 余额
                                    memo: '',               // 备注
                                }
                            }
                        }
                    })
                }
            })
        },
        /**
         * 库存加法数据变化，库存总数也跟着变化
         */
        changeStock(event) {
            var d = Number(this.storevalidate.last_stock_amt) * 100,
                e = Number(this.storevalidate.receive_amt) * 100,
                f = Number(this.storevalidate.store_allocate) * 100,
                g = Number(this.storevalidate.material_amt) * 100,
                h = Number(this.storevalidate.return_amt) * 100,
                i = Number(this.storevalidate.cost_amt) * 100,
                j = Number(this.storevalidate.promotion_amt) * 100,
                k = Number(this.storevalidate.trial_amt) * 100,
                l = Number(this.storevalidate.loss_amt) * 100,
                m = Number(this.storevalidate.check_difference) * 100,
                n = Number(this.storevalidate.other_amt) * 100;
            this.storevalidate.stock_amt = (d + e + f - g - h - i - j - k - l - m - n) / 100; 
        },
        /**
         * 单击数据
         */
        rowClick(data, index) {
            // 点击单行背景颜色变化
            let trNodes = $('.ivu-table-row td');
            trNodes.removeClass('td-click');
            $('.ivu-table-row').eq(index).find('td').addClass('td-click');
            $('.area_middle').fadeOut(500);    //淡入
            $('.area_middle').fadeIn(500);    //淡入
            // 获取当前门店详情数据
            this.code = data.CODE;
            this.storeData = data;
            this.storeDetail();
        },
        /**
         * 选择时间
         */
        changeDate(data) {
            // 如果有第一个直营门店数据，时间变化时，右边详情设置为第一个门店详情。
            if (this.tableData[0]) {
                this.storeData = this.tableData[0];
            }
            this.selectDate = data;
            this.storeDetail();
        },
        /**
         * 获取当前点击的门店的详情数据
         */
        storeDetail() {
            // 转换时间格式
            if (typeof this.storeData == 'object') {
                this.selectDate = changeday(+new Date(String(this.selectDate)))
            }
            this.$resetAjax({
                type: 'POST',
                url:  '/NewA/Directsales/get_info',
                data: {
                    code: this.code,
                    time: this.selectDate
                },
                success: (res) => {
                    // 查看是否有编辑和重置功能
                    if(res.errorcode == '1') {
                        this.isShow = false;
                    } else {
                        this.isShow = true;
                    }
                   let result = res.data;
                   // 说明有门店详情数据
                    if (result.length !== 0) {
                        this.storevalidate = res.data[0];
                        this.storevalidate.store_code = this.storeData.CODE;
                        // 得到鼎富通加现金加储值卡的总和
                        var a = Number(this.storevalidate.mob_pay) * 100 ;
                        var b = Number(this.storevalidate.cash_pay) * 100 ;
                        var c = Number(this.storevalidate.account_pay) * 100;
                        this.saleAddSum = (a + b + c) / 100;
                        // 营业额总金额
                        this.saleSum = Number(this.storevalidate.sale_amt);
                        // 出库+上一天库存等等加起来的总和
                        var d = Number(this.storevalidate.last_stock_amt) * 100,
                            e = Number(this.storevalidate.receive_amt) * 100,
                            f = Number(this.storevalidate.store_allocate) * 100,
                            g = Number(this.storevalidate.material_amt) * 100,
                            h = Number(this.storevalidate.return_amt) * 100,
                            i = Number(this.storevalidate.cost_amt) * 100,
                            j = Number(this.storevalidate.promotion_amt) * 100,
                            k = Number(this.storevalidate.trial_amt) * 100,
                            l = Number(this.storevalidate.loss_amt) * 100,
                            m = Number(this.storevalidate.check_difference) * 100,
                            n = Number(this.storevalidate.other_amt) * 100;
                        this.stockAddSum = (d + e + f - g - h - i - j - k - l - m - n) / 100; 
                        // 库存总数
                        this.stockSum = Number(this.storevalidate.stock_amt );
                    } else {
                        this.storevalidate = {
                            store_name: this.storeData.NAME,  // 门店名称
                            store_code: this.storeData.CODE,  // 编码
                            sale_amt: 0,            // 营业额
                            mob_pay: 0,             // 鼎富通
                            account_pay: 0,         // 储值卡
                            cash_pay: 0,            // 现金
                            stock_amt: 0,           // 库存
                            last_stock_amt: 0,      // 上一天库存
                            receive_amt: 0,         // 出库
                            store_allocate: 0,      // 调拨
                            material_amt: 0,        // 物料
                            return_amt: 0,          // 退货
                            cost_amt: 0,            // 销售成本
                            promotion_amt: 0,       // 活动
                            trial_amt: 0,           // 出样试用装
                            loss_amt: 0,            // 损耗
                            check_difference: 0,    // 盘点差异
                            other_amt: 0,           // 其他
                            panyin: 0,              // 盘盈
                            expend_amt: 0,          // 支出
                            balance: 0,             // 余额
                            memo: '',               // 备注
                        }
                    }
                }
            })
        },
        /**
         * 重置表单
         */
        handleReset() {
            this.storevalidate.balance = 0;
            this.storevalidate.expend_amt = 0;
            this.storevalidate.memo = '';
        },
        /**
         * 提交表单准备工作
         */
        handleSubmit() {
            this.$refs.storevalidate.validate((valid) => {
                if (valid) {
                    // 得到鼎富通加现金加储值卡的总和
                    var a = Number(this.storevalidate.mob_pay) * 100 ;
                    var b = Number(this.storevalidate.cash_pay) * 100 ;
                    var c = Number(this.storevalidate.account_pay) * 100;
                    this.saleAddSum = (a + b + c) / 100;
                    // 营业额总金额
                    this.saleSum = Number(this.storevalidate.sale_amt);
                    console.log(this.saleAddSum, this.saleSum)
                    // 出库+上一天库存等等加起来的总和
                    var d = Number(this.storevalidate.last_stock_amt) * 100,
                        e = Number(this.storevalidate.receive_amt) * 100,
                        f = Number(this.storevalidate.store_allocate) * 100,
                        g = Number(this.storevalidate.material_amt) * 100,
                        h = Number(this.storevalidate.return_amt) * 100,
                        i = Number(this.storevalidate.cost_amt) * 100,
                        j = Number(this.storevalidate.promotion_amt) * 100,
                        k = Number(this.storevalidate.trial_amt) * 100,
                        l = Number(this.storevalidate.loss_amt) * 100,
                        m = Number(this.storevalidate.check_difference) * 100,
                        n = Number(this.storevalidate.other_amt) * 100;
                    this.stockAddSum = (d + e + f - g - h - i - j - k - l - m - n) / 100; 
                    // 库存总数
                    this.stockSum = this.storevalidate.stock_amt;
                    // 如果两个等式都成立的话去编辑请求
                    if (Number(this.saleSum) == Number(this.saleAddSum) && Number(this.stockAddSum) == Number(this.stockSum)) {
                        this.editQuery();
                    } else if (Number(this.saleSum) == Number(this.saleAddSum) || Number(this.stockAddSum) !== Number(this.stockSum)) {
                        this.instance('error' )
                    } else if (Number(this.saleSum) !== Number(this.saleAddSum) || Number(this.stockAddSum) !== Number(this.stockSum)) {
                        this.instance('warning' )
                    }
                    
                }
            })
        },
        /**
         * 编辑提交请求
         */
        editQuery() {
            // 转换选择到的时间
            this.selectDate = changeday(+new Date(String(this.selectDate)))
            this.$resetAjax({
                type: 'POST',
                url:  '/NewA/Directsales/setdata',
                data: {
                    code: this.storeData.CODE,                              //门店编码
                    time: this.selectDate,                                  //时间
                    expend_amt: this.storevalidate.expend_amt,              //支出
                    balance: this.storevalidate.balance,                    //余额
                    memo: this.storevalidate.memo,                          //备注
                    sale_amt: this.storevalidate.sale_amt,                 //营业额
                    mob_pay: this.storevalidate.mob_pay,                   //鼎付通
                    cash_pay: this.storevalidate.cash_pay,                 //现金
                    account_pay: this.storevalidate.account_pay,           //会员卡支付
                    stock_amt: this.storevalidate.stock_amt,               //库存
                    receive_amt: this.storevalidate.receive_amt,           //出库
                    store_allocate: this.storevalidate.store_allocate,     //调拨
                    material_amt: this.storevalidate.material_amt,         //物料
                    return_amt: this.storevalidate.return_amt,             //退货
                    loss_amt: this.storevalidate.loss_amt,                 //耗损
                    promotion_amt: this.storevalidate.promotion_amt,       //活动
                    cost_amt: this.storevalidate.cost_amt,                 //配送价成本
                    trial_amt: this.storevalidate.trial_amt,               //出样试用装
                    check_difference: this.storevalidate.check_difference, //盘点差异
                    other_amt: this.storevalidate.other_amt,                //其他

                },
                success: (res) => {
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = '修改成功,棒棒哒！';
                    setTimeout(() => {
                        this.$root.tip.isShow = false;
                    }, 2500);
                }
            })
        },
        /**
         * 提示
         */
        instance(type) {
            switch (type) {
                case 'info':
                    this.$Modal.info({
                        title: title,
                        content: content
                    });
                    break;
                case 'success':
                    this.$Modal.success({
                        title: title,
                        content: content
                    });
                    break;
                case 'warning':
                    this.$Modal.warning({
                        title: '提示',
                        content: '抱歉, 营业额对应的数据等式两边要相等！',
                    });
                    break;
                case 'error':
                    this.$Modal.error({
                        title:  '提示',
                        content: '抱歉, 库存对应的数据等式两边要相等！'
                    });
                    break;
            }
        }
    }
}
</script>
