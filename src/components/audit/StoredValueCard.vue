<template>
    <div class="stored">
        <div class="top">
            <div class="left">
                <span class="title">门店</span>
                <Select v-model="store" style="width:300px">
                    <Option v-for="item in storeList" :value="item.CODE" :key="item.CODE"><p class="item"><span class="itemStyle">店名</span> {{ item.NAME  }} </p><span class="itemStyle two">编码</span>{{item.CODE}}</Option>
                </Select>
                <Button slot="append" icon="ios-search" @click="changeStore"></Button>
                <Button type="primary" @click="addcard" class="add">新增储值卡</Button>
            </div>
            <div class="right">
                <div style="margin-right: 50px;">
                    <DatePicker class="month" :value="date" type="month" :options="options" placeholder="请选择时间" style="width: 150px" @on-change="getTime"></DatePicker>
                    <Button slot="append"  @click="searchGather">汇总查询</Button>
                </div>
                
<!--                 
                <Button  @click="tableShow=false"  class="storeGather">门店汇总</Button> -->
                <!-- <span class="title">日期</span>
                <DatePicker :value="dateRange" type="daterange" :options="options" @on-change="getSelectTime" placeholder="请选择时间区间..." style="width: 200px"></DatePicker> -->
            </div>
        </div>
        <div class="middle">
            <p title="点击填写金额" @click='amountShow=true'  style="cursor: pointer;background: #1596ad;color: #fff;height: 33px;line-height: 26px;">
                <!-- <span class="icon-cash" >
                    <svg t="1565318408334" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="851" width="18" height="18"><path d="M398.222222 222.151111a29.724444 29.724444 0 0 0 24.604445 12.8h161.564444a29.724444 29.724444 0 0 0 23.466667-11.235555l68.266666-87.893334a27.591111 27.591111 0 0 0 5.12-24.035555 28.444444 28.444444 0 0 0-16.071111-18.915556A396.515556 396.515556 0 0 0 501.902222 56.888889a337.635556 337.635556 0 0 0-154.453333 34.844444 28.444444 28.444444 0 0 0-14.222222 18.062223 28.444444 28.444444 0 0 0 4.124444 22.186666z m207.644445-91.022222l-36.408889 46.933333h-130.844445l-32.711111-48.924444a352.142222 352.142222 0 0 1 200.391111 1.991111z m21.191111 157.44l-5.973334-2.844445H388.693333l-5.973333 2.844445C367.36 295.822222 8.391111 475.022222 80.782222 752.497778c0.995556 8.817778 30.72 212.195556 409.315556 214.186666h24.035555c384 0 413.582222-205.368889 414.008889-210.915555 73.813333-280.462222-285.297778-459.662222-300.657778-467.2zM873.244444 745.955556c-0.995556 6.826667-29.297778 164.408889-355.555555 165.546666-352.568889 6.826667-379.733333-158.72-381.297778-168.96C79.075556 521.955556 358.684444 363.804444 402.488889 340.48h205.226667c43.946667 23.466667 323.697778 181.333333 265.528888 405.475556zM608.711111 445.297778l-103.68 100.551111-103.537778-100.551111a30.008889 30.008889 0 0 0-41.528889 0 28.444444 28.444444 0 0 0 0 40.248889l93.44 90.737777h-49.635555a28.444444 28.444444 0 1 0 0 56.888889h72.96v45.368889h-73.528889a30.72 30.72 0 1 0 0 61.44h73.528889v61.724445a29.44 29.44 0 0 0 58.737778 0V739.555556h72.96a30.72 30.72 0 1 0 0-61.44h-72.96v-44.942223h73.528889a28.444444 28.444444 0 1 0 0-56.888889h-52.337778l93.44-90.737777a28.444444 28.444444 0 0 0 0-40.248889 29.866667 29.866667 0 0 0-41.386667 0z" p-id="852" fill="#d81e06"></path></svg>
                </span> -->
                启用时期初未存现金
                <span class="cash" style="color:#fff;">￥{{unsave}}</span> 
            </p>
            <p title="应收现金总额" >
                <span class="icon-cash">
                    <svg t="1565318408334" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="851" width="18" height="18"><path d="M398.222222 222.151111a29.724444 29.724444 0 0 0 24.604445 12.8h161.564444a29.724444 29.724444 0 0 0 23.466667-11.235555l68.266666-87.893334a27.591111 27.591111 0 0 0 5.12-24.035555 28.444444 28.444444 0 0 0-16.071111-18.915556A396.515556 396.515556 0 0 0 501.902222 56.888889a337.635556 337.635556 0 0 0-154.453333 34.844444 28.444444 28.444444 0 0 0-14.222222 18.062223 28.444444 28.444444 0 0 0 4.124444 22.186666z m207.644445-91.022222l-36.408889 46.933333h-130.844445l-32.711111-48.924444a352.142222 352.142222 0 0 1 200.391111 1.991111z m21.191111 157.44l-5.973334-2.844445H388.693333l-5.973333 2.844445C367.36 295.822222 8.391111 475.022222 80.782222 752.497778c0.995556 8.817778 30.72 212.195556 409.315556 214.186666h24.035555c384 0 413.582222-205.368889 414.008889-210.915555 73.813333-280.462222-285.297778-459.662222-300.657778-467.2zM873.244444 745.955556c-0.995556 6.826667-29.297778 164.408889-355.555555 165.546666-352.568889 6.826667-379.733333-158.72-381.297778-168.96C79.075556 521.955556 358.684444 363.804444 402.488889 340.48h205.226667c43.946667 23.466667 323.697778 181.333333 265.528888 405.475556zM608.711111 445.297778l-103.68 100.551111-103.537778-100.551111a30.008889 30.008889 0 0 0-41.528889 0 28.444444 28.444444 0 0 0 0 40.248889l93.44 90.737777h-49.635555a28.444444 28.444444 0 1 0 0 56.888889h72.96v45.368889h-73.528889a30.72 30.72 0 1 0 0 61.44h73.528889v61.724445a29.44 29.44 0 0 0 58.737778 0V739.555556h72.96a30.72 30.72 0 1 0 0-61.44h-72.96v-44.942223h73.528889a28.444444 28.444444 0 1 0 0-56.888889h-52.337778l93.44-90.737777a28.444444 28.444444 0 0 0 0-40.248889 29.866667 29.866667 0 0 0-41.386667 0z" p-id="852" fill="#d81e06"></path></svg>
                </span>
                应存现金
                <span class="cash">￥{{yincun}}</span> 
            </p>
            <p title=" 实存现金总额" >
                <span class="icon-cash">
                    <svg t="1565319518123" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1525" width="18" height="18"><path d="M 528.384 559.104 c -12.288 -4.096 -26.624 -4.096 -36.864 -10.24 s -20.48 -20.48 -22.528 -30.72 c -2.048 -8.192 10.24 -22.528 18.432 -26.624 c 12.288 -4.096 26.624 0 38.912 4.096 c 6.144 2.048 10.24 14.336 16.384 18.432 c 8.192 4.096 18.432 6.144 24.576 4.096 c 6.144 -4.096 10.24 -12.288 14.336 -18.432 c -2.048 -6.144 -2.048 -10.24 -4.096 -12.288 c -22.528 -22.528 -43.008 -45.056 -65.536 -65.536 c -4.096 -2.048 -14.336 -2.048 -20.48 2.048 c -18.432 16.384 -36.864 30.72 -53.248 49.152 c -30.72 36.864 -20.48 90.112 24.576 110.592 c 18.432 8.192 38.912 10.24 57.344 20.48 c 10.24 6.144 22.528 18.432 24.576 30.72 c 2.048 10.24 -6.144 24.576 -16.384 32.768 c -18.432 16.384 -45.056 6.144 -63.488 -16.384 c -8.192 -10.24 -22.528 -12.288 -34.816 -18.432 c -2.048 14.336 -8.192 32.768 -2.048 38.912 c 20.48 22.528 45.056 43.008 67.584 61.44 c 4.096 4.096 18.432 -2.048 24.576 -6.144 c 10.24 -6.144 16.384 -16.384 26.624 -22.528 c 32.768 -18.432 45.056 -47.104 40.96 -83.968 c -4.096 -34.816 -28.672 -53.248 -59.392 -61.44 Z" fill="#1296db" p-id="1526"></path><path d="M 501.76 0 C 225.28 0 0 225.28 0 501.76 S 225.28 1003.52 501.76 1003.52 S 1003.52 778.24 1003.52 501.76 S 778.24 0 501.76 0 Z m -100.352 200.704 c 32.768 -2.048 69.632 0 104.448 0 c 32.768 0 63.488 -2.048 96.256 0 c 34.816 2.048 43.008 16.384 24.576 45.056 c -6.144 10.24 -16.384 20.48 -20.48 32.768 c -12.288 24.576 -30.72 32.768 -57.344 30.72 c -18.432 -2.048 -38.912 -4.096 -57.344 0 c -59.392 12.288 -90.112 -20.48 -112.64 -67.584 c -12.288 -24.576 -6.144 -38.912 22.528 -40.96 Z m 352.256 610.304 c -86.016 2.048 -169.984 0 -253.952 0 H 258.048 c -61.44 0 -83.968 -22.528 -75.776 -81.92 c 20.48 -151.552 102.4 -268.288 217.088 -364.544 c 10.24 -8.192 26.624 -10.24 40.96 -10.24 c 34.816 -2.048 69.632 2.048 102.4 -2.048 c 34.816 -2.048 63.488 8.192 86.016 30.72 c 90.112 88.064 159.744 186.368 186.368 313.344 c 2.048 14.336 4.096 28.672 4.096 43.008 c 2.048 49.152 -16.384 69.632 -65.536 71.68 Z" fill="#1296db" p-id="1527"></path></svg>
                </span>
                实存现金
                <span class="cash">￥{{shicun}}</span> 
            </p>
            <p title="未存现金总额" >
                <span class="icon-cash">
                    <svg t="1565319638039" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1856" width="18" height="18"><path d="M513.15 641.988c168.465 0 327.328 73.28 435.855 201.055 17.151 20.15 14.863 49.97-5.208 67.902-8.204 7.333-19.016 11.374-30.437 11.374-14.296 0-27.943-6.08-37.444-16.681C784.2 798.782 651.521 737.444 511.991 737.444c-140.53 0-273.215 61.351-364.031 168.317-9.165 10.763-22.292 16.942-36.014 16.942-11.251 0-22.12-4.175-30.606-11.759-10.123-8.6-16.111-20.257-16.981-32.942-0.847-12.384 3.298-24.35 11.671-33.693 110.402-128.613 269.695-202.321 437.12-202.321z m273.223-246.564c-43.766 0-80.734-37.845-80.734-82.638V192.105c0-44.798 36.969-82.646 80.734-82.646 43.763 0 80.734 37.848 80.734 82.646v120.683c0 45.566-36.216 82.636-80.734 82.636z m-547.906 0c-43.761 0-80.731-37.845-80.731-82.638V192.105c0-44.798 36.97-82.646 80.731-82.646 43.771 0 80.746 37.848 80.746 82.646v120.683c0 44.791-36.975 82.636-80.746 82.636z" fill="#d4237a" p-id="1857"></path></svg>
                </span>
                    未存现金
                <span class="cash">￥{{weicun}}</span>
            </p>
        </div>
        <div class="table">
            <Table  :columns="columns" :data="tableData" border :height="tableHeight" v-if='tableShow'></Table>
            <!-- 门店汇总列表 -->
            <Table  :columns="gathercolumns" :data="gatherData" border :height="tableHeight" v-else></Table>
        </div>
        <!-- 分页 -->
        <div class="footer">
            <Page v-if='tableShow' :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
        </div>
        <!-- 全局查看图片轮播图 -->
        <div class="carouselcontent" v-if="gloadCarouse">
            <Icon type="ios-close-outline" class="close_icon" title="关闭弹窗" @click="gloadCarouse=false;"></Icon>
            <Carousel v-model="value">
                <CarouselItem v-for="(item,index) in lookImgs" :key="index">
                    <div class="demo-carousel"><img :src="item.url" alt="加载图片..."></div>
                    <div class="bottom">
                        <Button @click="gloadCarouse=false;">确定</Button>
                    </div>
                </CarouselItem>
            </Carousel>
        </div>
        <!-- 添加储值卡 -->
        <Modal v-model="addModal" :title="title"  cancel-text ok-text="关闭" class="addModal">
            <Form ref="cardForm" :model="cardForm" :rules="ruleValidate" :label-width="120"> 
                <FormItem label="门店编码" prop="store" :label-width="120"> 
                    <input v-model="cardForm.store" type="text" readonly style="width: 360px;height:32px;margin-left:15px;">
                </FormItem> 
                <FormItem label="储值卡现金充值 " prop="recharge" :label-width="120"> 
                    <Input v-model="cardForm.recharge" placeholder="请输入储值卡现金充值" clearable></Input> 
                </FormItem> 
                <FormItem label="储值卡赠送金额" prop="give" :label-width="120"> 
                    <Input v-model="cardForm.give" placeholder="请输入储值卡赠送金额" clearable></Input> 
                </FormItem>
                <FormItem label="应存现金" prop="payable"> 
                    <Input  v-model="cardForm.payable" placeholder="请输入应存现金" clearable></Input> 
                </FormItem>
                <FormItem label="实存现金" prop="actual"> 
                    <Input v-model="cardForm.actual" placeholder="请输入实存现金" clearable></Input>
                </FormItem>
                <FormItem label="销售日期" prop="date">
                    <DatePicker type="date" v-model="cardForm.date"  placeholder="请选择销售日期" style="width: 390px"></DatePicker>
                </FormItem> 
                <FormItem label="上传图片" prop="url" class="images"> 
                    <Upload v-model="cardForm.url" multiple action="/NewA/Audit/getimage" :on-success="uploadImage" :format="['jpg','jpeg','png']" :on-format-error="handleFormatError">
                        <Button type="ghost" icon="images" class="ghost" >上传图片</Button>
                    </Upload>
                    <Button class="look_image" icon="eye" v-if="isShowImageButton" @click="carouse=true">查看上传图片</Button>                    
                </FormItem>
                <FormItem class="btn"> 
                    <Button type="primary" @click="handleSubmit('cardForm')">提交</Button>
                    <Button type="ghost" @click="handleReset('cardForm')" style="margin-left: 8px">重置</Button>
                </FormItem>
            </Form>
            <!-- 局部查看图片轮播图 -->
            <div class="imgs" v-if="carouse">
                <Icon type="ios-close-outline" class="close_icon" title="关闭弹窗" @click="carouse=false;"></Icon>
                <Carousel v-model="value1">
                    <CarouselItem v-for="(item,index) in lookImgs" :key="index">
                        <div class="demo-carousel"><img :src="item.url || item" alt="加载图片..."></div>
                        <div class="bottom">
                            <Button title="点击删除当前这张图片" @click="deleteImg(item)">删除</Button>
                        </div>
                    </CarouselItem>
                </Carousel>
            </div>
        </Modal>
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
        <!--输入金额  -->
        <Modal v-model="amountShow" title="启用时期初未存现金" >
            <span>金额：</span>
            <Input v-model="money" placeholder="输入金额" style="width: 300px;margin: auto;"  type="number" ></Input>
            <div slot="footer">
                <Button  @click="amountShow=false" style="display: inline-block">取消</Button>
                <Button type="primary" @click="amount" >确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    // 引用时间
    import {changeday} from "@/assets/js/tool.js"//时间戳
    export default{
        components:{
            changeday,
        },
        data(){
            return {
                // 直营门店数据
                storeList: [],
                // 选中哪个直营门店
                store: '11373',
                // 新增储值卡弹出框是否显示
                addModal:false,
                // 弹出框标题：
                title:'',
                // 表单数据
                cardForm: { 
                    store: '', 
                    date: '', 
                    recharge: '', 
                    give: '', 
                    payable: '', 
                    actual:'',
                    url:[]
                }, 
                // 表单验证
                ruleValidate: {
                    date: [
                        { required: true, type: 'date',message: '销售日期不能为空', trigger: 'change' },
                    ],
                    recharge: [
                        { required: true, message: '储值卡现金充值不能为空', trigger: 'change' }
                    ],
                    payable: [
                        { required: true, message: '应存现金不能为空', trigger: 'change' }
                    ],
                    give: [
                        { required: true, message: '储值卡赠送金额不能为空', trigger: 'change' }
                    ],
                    actual: [
                        { required: true, message: '实存现金不能为空', trigger: 'change' }
                    ],
                },
                // 是否显示查看图片按钮
                isShowImageButton:false,
                // 表格头部
                columns:[
                    {
                        title: '销售日期',
                        align: 'center',
                        key: 'sale_date',
                    },
                    {
                        title: ' 储值卡现金充值',
                        align: 'center',
                        key: 'recharge'
                    },
                    {
                        title: ' 储存卡赠送金额',
                        align: 'center',
                        key: 'give',
                    },
                    {
                        title: '应存现金',
                        align: 'center',
                        key: 'cash_payable'
                    },
                    {
                        title: '实存现金',
                        align: 'center',
                        key: 'cash_actual' ,
                        render: (h, {row}) => {
                            return h('div', [
                                h('span', {
                                style: {
                                    color: row.jiaokuan == row.cash_pay ? '#495060' : 'red'
                                }
                                }, row.cash_actual),
                            ]);
                        }
                    },
                    
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, {row}) => {
                            return h('div', [
                                // h('span', {
                                //     class: 'contributions',
                                //     on: {
                                //         click: () => {
                                            
                                //         }
                                //     }
                                // }, '缴款'),
                                h('span', {
                                    class: 'contributions',
                                    style:{
                                        marginLeft:'10px',
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteId=row.id;
                                            this.getImage();
                                            if(this.lookImgs.length>0){
                                                this.gloadCarouse=true;
                                                this.value=0;
                                            }else{
                                                this.gloadCarouse=false;
                                            }
                                        }
                                    }
                                }, '查看图片'),
                                h('span', {
                                    class: 'contributions',
                                    style:{
                                        marginLeft:'10px',
                                    },
                                    on: {
                                        click: () => {
                                            this.addModal=true;
                                            this.title='修改';
                                            this.cardForm=row;
                                            this.deleteId=row.id;
                                            this.cardForm.store=this.store;
                                            this.cardForm.actual=row.cash_actual;
                                            this.cardForm.date=row.sale_date;
                                            this.cardForm.payable=row.cash_payable;
                                            this.getImage();
                                        }
                                    }
                                }, '编辑'),
                                h('span', [
                                    h('Poptip', {
                                        class: 'contributions',
                                        props: {
                                            confirm: true,
                                            transfer: true,
                                            placement: 'top',
                                            title: '确定要删除吗 ?',
                                            type: 'error',
                                            size: 'small',
                                            width: '150',
                                            vModel: true
                                        },
                                        style: {
                                            marginLeft:'10px',
                                            cursor: 'pointer'
                                        },
                                        on: {
                                            'on-ok': ()=>{
                                                // 确定删除;
                                                this.deleteId=row.id;
                                                this.delete()
                                            },
                                            'on-cancel': ()=>{
                                                // 取消认领
                                            }
                                        },
                                    }, '删除'),
                                ]),
                            ]);
                        }
                    }
                ],
                // 表格数据
                tableData:[],
                // 表格高度
                tableHeight:900,
                // 数据总条数
                total:0,
                // 当前第几页
                currentPage:1,
                // 每页多少条数据
                pageSize:20,
                // 是否查看看全局图片弹出框
                gloadCarouse:false,
                value:0,
                // 是否显示图片弹出框
                carouse:false,
                value1:0,
                // 图片列表
                lookImgs:[],
                // 删除当前行的id
                deleteId:'',
                // 是否显示删除框
                isDelete:false,
                // 要删除的图片数据
                deleteImage: {},
                // 是否显示输入金额弹出框
                amountShow:false,
                // 输入的金额
                money:0,
                // 应存现金总额
                yincun: 0,
                //  实存现金总额
                shicun: 0,
                // 未存现金总额
                weicun: 0,
                //  启用时期初未存金额
                unsave:0,
                // 是否显示门店汇总列表
                tableShow:true,
                // 选择汇总时间
                date:'',
                // 时间限制
                options: {
                    disabledDate (date) {
                        return date && date.valueOf() >= Date.now();
                    }
                },
                // 门店汇总表头
                gathercolumns: [
                    {
                        title: '门店编号',
                        align: 'center',
                        key: 'CODE',
                    },
                    {
                        title: ' 门店名称',
                        align: 'center',
                        key: 'NAME',
                    },
                    {
                        title: '期初储值卡未存现金',
                        align: 'center',
                        key:'qcwcje'
                    },
                    {
                        title: ' 本期储值卡充值金额',
                        align: 'center',
                        key: 'bqczje' 
                    },
                    {
                        title: '本期储值卡赠送金额',
                        align: 'center',
                        key: 'bqzsje'
                    },
                    
                    {
                        title: '本期储值卡实存金额',
                        align: 'center',
                        key: 'bqscje'
                    },
                    {
                        title: '期末储值卡未存现金',
                        align: 'center',
                        key: 'qmwcje' ,
                    },
                ],
                // 门店汇总数据
                gatherData:[]
            }
        },
        created(){
            this.getStoreList();
            this.getCardlist();
        },
        methods:{
             /**
             * 得到门店数据
             */
            getStoreList() {
                this.$resetAjax({
                    type: 'GET',
                    url: '/NewA/Audit/get_store',
                    success:(res) => {
                        this.storeList = res;
                    }
                })
            },
            /**
             * 选中到哪个直营门店
             */
            changeStore() {
                this.tableShow=true;  
                this.currentPage = 1;
                this.getCardlist();
            },
            /* 获取数据 */
            getCardlist(){
                this.yincun=0;
                this.shicun=0;
                this.$resetAjax({
                    url:'/NewA/Audit/cardlist',
                    type:'get',
                    data:{
                        p:this.currentPage,
                        store:this.store
                    },
                    success:(res)=>{
                        this.tableData=res.data;
                        this.total=Number(res.count);
                        this.unsave=Number(res.unsave);
                        this.tableData.forEach(ele=>{
                            this.yincun+=Number(ele.cash_payable);
                            this.shicun+=Number(ele.cash_actual);
                        });
                        this.weicun=this.unsave+this.yincun-this.shicun;
                    }
                })
            },
             /**
            *  选择时间
            */
            getTime(value) {
                this.date=value;
            },
            /* 获取门店汇总数据 */
            searchGather(){
                if(this.date==''){
                    $('.month').addClass('error');
                }else{
                    $('.month').removeClass('error');
                    this.tableShow=false;
                    this.$resetAjax({
                        url:'/NewA/Audit/cardreport',
                        type:'get',
                        data:{
                            time:this.date
                        },
                        success:(res)=>{
                            this.gatherData=res.data;
                            this.gatherData.forEach(ele=>{
                                if(typeof(ele.bqczje)==='undefined'){
                                    ele.bqczje='0.00'
                                }
                                if(typeof(ele.bqscje)==='undefined'){
                                    ele.bqscje='0.00'
                                }
                                if(typeof(ele.bqzsje)==='undefined'){
                                    ele.bqzsje='0.00'
                                }
                                if(typeof(ele.qcwcje)==='undefined'){
                                    ele.qcwcje='0.00'
                                }
                                if(typeof(ele.qmwcje)==='undefined'){
                                    ele.qmwcje='0.00'
                                }
                            })
                        }
                    })
                }
               
            },
            /* 新增储值卡 */
            addcard(){
                this.addModal=true;
                this.title='新增';
                this.isShowImageButton=false;
                this.carouse=false;
                this.cardForm={ 
                    store: this.store, 
                }
            },
            // 提交表单
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if(this.title=='新增'){
                            this.$resetAjax({
                                url:'/NewA/Audit/addcard',
                                type:'POST',
                                data:{
                                    store:this.cardForm.store,
                                    sale_date:changeday(this.cardForm.date),
                                    recharge:this.cardForm.recharge,
                                    give:this.cardForm.give,
                                    cash_payable:this.cardForm.payable,
                                    cash_actual:this.cardForm.actual,
                                    url:this.cardForm.url
                                },
                                success:(res)=>{
                                    this.cardForm=[];
                                    this.addModal=false;
                                    if(res.msg=="success") {
                                        this.$Message.success('新增成功');
                                        this.tableShow=true;
                                        this.getCardlist();
                                    } else{
                                        this.$Message.error('新增失败')
                                    }
                                }
                            })
                        }else if(this.title=='修改'){
                            this.$resetAjax({
                                url:'/NewA/Audit/editcard',
                                type:'POST',
                                data:{
                                    id:this.deleteId,
                                    sale_date:changeday(this.cardForm.date),
                                    recharge:this.cardForm.recharge,
                                    give:this.cardForm.give,
                                    cash_payable:this.cardForm.payable,
                                    cash_actual:this.cardForm.actual,
                                    url:this.cardForm.url
                                },
                                success:(res)=>{
                                    this.tableShow=true;
                                    this.cardForm=[];
                                    this.addModal=false;
                                    if(res.msg=="success") {
                                        this.$Message.success('修改成功')
                                        this.getCardlist();
                                    } else{
                                        this.$Message.error('修改失败')
                                    }
                                }
                            })
                        }
                    } 
                })
            },
            // 表单重置
            handleReset (name) {
                this.$refs[name].resetFields();
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
            // 上传图片
            uploadImage(res){
                if (this.lookImgs.length !== 0) {
                    this.isShowImageButton = true;
                } else {
                    this.isShowImageButton = false;
                }
                if(res.msg=="success") {
                    this.$Message.success('上传成功')
                    this.lookImgs.push(res.data);
                } else{
                    this.$Message.error('上传失败')
                }
                if(this.title=='新增'){
                    this.cardForm.url=this.lookImgs;
                }else if(this.title=='修改'){
                    this.cardForm.url=this.lookImgs;
                    for(let i=0;i<this.cardForm.url.length;i++){
                        if(typeof(this.cardForm.url[i])==='string'){
                            let obj={};
                            obj['url']=this.cardForm.url[i];
                            this.cardForm.url[i]=obj
                        }
                    }
                }
            },
            /**
            * 删除图片工作准备
            */
            deleteImg(item) {
                this.isDelete = true;
                this.deleteImage = item;
            },
            /**
            * 删除图片或文件
            */
            getDelete() {
                this.isDelete = true;
                this.lookImgs.forEach((ele, index) => {
                    if (ele == this.deleteImage) {
                        this.lookImgs.splice(index,1);
                    }
                });
                this.isDelete = false;
                this.$Message.success('删除成功')
                this.value1=0;
                this.cardForm.url=this.lookImgs;
                if (this.lookImgs.length == 0) {
                    this.carouse = false;
                    this.$Message.warning('暂无上传图片')
                    this.isShowImageButton = false;
                }
            },
            /* 查看图片 */
            getImage(){
                this.$resetAjax({
                    url:'/NewA/Audit/getinfo',
                    type:'post',
                    data:{
                        id:this.deleteId
                    },
                    success:(res)=>{
                        this.lookImgs=res.data;
                        if(this.lookImgs.length>0){
                            this.isShowImageButton=true;
                        }else{
                            this.isShowImageButton=false;
                            this.$Message.warning('暂无图片');
                            this.carouse=false;        
                        }
                    }
                }) 
            },
            ///* 删除当前行 */
            delete(){
                this.$resetAjax({
                    url:'/NewA/Audit/delcard',
                    type:'POST',
                    data:{
                        id:this.deleteId
                    },
                    success:(res)=>{
                        this.getCardlist();
                        if(res.errorcode==0){
                            this.$Message.success('删除成功')
                        }else{
                            this.$Message.error('删除失败')
                        }
                    }
                })
            },
            /*分页查询*/
            changePage(index){
                this.currentPage=index;
                this.getCardlist();
            },
            ///* 手动输入金额 */
            amount(){
                this.$resetAjax({
                    url:'/NewA/Audit/cardunsave',
                    type:'post',
                    data:{
                        store: this.store,
                        money:this.money
                    },
                    success:(res)=>{
                        if(res.errorcode==0){
                            this.amountShow=false;
                            this.getCardlist();
                            this.$Message.success('填写成功！')
                        }
                    }
                })
            }
        }
    }
</script>