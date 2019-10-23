<template>
    <div class="goodorder">
       <!-- 头部 -->
       <div class="top">
           <h2>商品名称: <span>{{name}}</span></h2>
           <div class="top_right">
                <div class="search_code">
                    <span class="item">订单条码</span>
                    <div>
                        <Input v-model="code2" placeholder="请输入订单条码" @on-enter="getGoodOrder"/>
                        <Button slot="append" icon="ios-search" @click="getGoodOrder"></Button>
                    </div>
                </div>
                <Button class="operational" title="点击查看操作记录" @click="$router.push({path: 'operational'})">取消尾数操作记录</Button>
             </div>
       </div>
       <!-- 内容区 -->
       <div class="table">
            <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </div>
         <p @click="login">6564154564</p>
    </div>
   
</template>


<script>
import tipModal from '../tip.vue'

export default {
    components: {
        tipModal
    },

    data() {
        return {
            // 订单条码
            code2: '',
            // 尾数的数量
            weishu: '',
            // 取消尾数的文字说明
            cancel_text: '',
            // 内容数据
            tableData: [],
            // 商品名称
            name: '请先在右侧输入订单条码查询以便得到商品名',
            // 表格高度
            tableHeight: 1500,
            // 表头数据
            columns: [
                {
                    title: '订单号',
                    key: 'NUM',
                },
                {
                    title: '订货数量',
                    key: 'QTY'
                },
                {
                    title: '到货数量',
                    key: 'ACVQTY'
                },
                {
                    title: '尾数',
                    key: 'WEISHU',
                    render: (h, params) => {
                        return h('Input', {
                            props: {
                                type: 'text',
                                value: params.row.WEISHU,
                            },
                            on: {
                                'on-blur': (event) => {
                                    this.weishu =  event.target.value;
                                },
                            },
                        })
                    }
                },
                {
                    title: '理由',
                    // key: '取消尾数',
                    render: (h, {row}) => {
                       return h('Input', {
                            props: {
                                type: 'text',
                                value: '取消尾数',
                            },
                            on: {
                                'on-blur': (event) => {
                                    this.cancel_text =  event.target.value;
                                },
                            },
                        })
                    }
                },
                 {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                class: 'cancel',
                                props: {
                                    type: 'success',
                                    size: 'small',
                                },
                                on: {
                                    click: () => {
                                        if (params.row.cancel) {
                                            this.$root.tip.isShow = true;
                                            this.$root.tip.content = '抱歉,已取消尾数过,不能再重复取消了呢！';
                                            setTimeout(() => {
                                                this.$root.tip.isShow = false;
                                            }, 3000);
                                        } else {
                                            this.cancelQuery(params.row);
                                        }
                                    }
                                }
                            }, '取消尾数'),
                            h('icon', {
                                props: {
                                    type: params.row.cancel ?'checkmark-round  ' : '',
                                    size: 'small',
                                },
                                 domProps: {
                                    title: params.row.cancel ? '取消尾数成功' : ''
                               },
                                on: {
                                   
                                }
                            }, '取消尾数'),
                        ]);
                    }
                }
            ]
        }
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

    methods: {
        login() {
            this.$resetAjax({
            url: '/NewA/Miandenglu/index',
            type: 'POST',
            success:(res)=>{
                console.log(res)
                },
            })
        },
        /**
         * 获取订单数据
         */
        getGoodOrder() {
            this.$resetAjax({
                type: 'POST',
                url: '/NewA/CancelOrder/getcancelorder',
                data: {
                    // 订单条码
                    code2: this.code2
                },
                success: (res) => {
                    this.tableData = res.data;
                    this.name = res.name;
                }
            }) 
        },
        /**
         * 取消尾数提交
         */
        cancelQuery(data) {
            console.log(data)
            this.$resetAjax({
                type: 'POST',
                url: '/NewA/CancelOrder/getweishu',
                data: {
                    // 订单条码
                    code2: this.code2,
                    // 订单号
                    NUM: data.NUM,
                    // 尾数
                    WEISHU: this.weishu.length == 0 ? data.WEISHU : this.weishu,
                    // 理由
                    cancelreason: this.cancel_text.length == 0 ? '取消尾数' : this.cancel_text,
                },
                success: (res) => {
                    if (res.num > 0) {
                        this.$Modal.success({
                            title: '提示',
                            content: `单号: ${res.num}`
                        });
                       this.tableData[data._index].iscan = true;
                        
                    } else {
                         this.$Modal.error({
                            title: '提示',
                            content: `取消尾数失败`
                        });
                         this.tableData[data._index].iscan = false;
                    }
                }
            }) 
        }
    }
}
</script>
