<template>
    <div class="customer" id="customer">
        <!-- 内容区 -->
        <div class="contanier">
            <div class="top">
                <div class="top_left">
                    <Button type="primary" @click="$router.push({path:'customeradd', query:{isaim:1}})" class="add_customer">新增客户</Button>
                    <Button type="primary" @click="loadCustomer" v-show="ifshow"  class="load_customer">导出客户</Button>
                </div>
                <!-- 上传文件 -->
                <div class="uploadwj">
                    <a href="http://oa.xmvogue.com/uploads/visits/uploadcustomer.xls" class="uploadmodel">下载文件模板</a>
                    <Icon type="ios-fastforward" style="margin:10px;"></Icon>
                    <Upload action="/NewA/Customer/uploadcustomer" :on-success="upLoadSuccess" class="upload_customer" >
                        <Button type="ghost" icon="ios-cloud-upload-outline" class="ghost">上传客户信息</Button> 
                    </Upload>
                </div>
            </div>
            <div class="content">
                 <!-- 查询 -->
                <Collapse v-model="value1" class="collapse_area" @on-change="getCollapse">
                    <Panel name="1">
                        多条件查询:
                    <div slot="content" class="choose">
                            <div class="search">
                                <div class="record">
                                    <p>姓名:</p>
                                    <Input v-model="searchParams.username" placeholder="请输入要查询的姓名" @on-enter="searchQuery"/>
                                    <Button slot="append" icon="ios-search" @click="searchQuery"></Button>
                                </div>
                                <div class="record">
                                    <p>号码:</p>
                                    <Input v-model="searchParams.phone" placeholder="请输入要查询的号码" @on-enter="searchQuery"/>
                                    <Button slot="append" icon="ios-search" @click="searchQuery"></Button>
                                </div>
                                <div class="record">
                                    <p>备注:</p>
                                    <Input v-model="searchParams.channel_notes" placeholder="请输入要查询的渠道" @on-enter="searchQuery"/>
                                    <Button slot="append" icon="ios-search" @click="searchQuery"></Button>
                                </div>
                            </div>
                            <div class="check_item">
                                <span class="title">门店:</span>
                                <CheckboxGroup v-model="searchParams.shopmodel" @on-change="getshop(searchParams.shopmodel)">
                                    <Checkbox :label="item.value" v-for="item in shopList" :key="item.value">{{item.label}}</Checkbox>
                                </CheckboxGroup>
                            </div>
                            <div class="check_item">
                                <span class="title channel_width">渠道:</span> 
                                <Checkbox style="margin-left: 5px; width:50px;"
                                    :indeterminate="indeterminate"
                                    :value="checkAll"
                                    @click.prevent.native="handleCheckAllChannel">全选
                                </Checkbox>
                                <CheckboxGroup v-model="searchParams.sourcemodel" @on-change="getsource">
                                    <Checkbox :label="item.cid" v-for="item in sourceList" :key="item.cid">{{item.channels}}</Checkbox>
                                    <Button type="warning" size="small" @click="channelNotes" v-show="ifshow" class="channel_run" title="点击进行渠道管理">渠道管理</Button>
                                </CheckboxGroup>
                            </div>
                            <div class="check_item">
                                <span class="title">标记:</span> 
                                <CheckboxGroup v-model="searchParams.signModel" @on-change="getSignModel(searchParams.signModel)">
                                    <Checkbox :label="item.value" v-for="item in signList" :key="item.value"><Icon type="ios-pricetags" :style="item.objectClass"></Icon></Checkbox>
                                </CheckboxGroup>
                            </div>
                            <div class="check_item">
                                <span class="title">推广:</span> 
                                <CheckboxGroup v-model="searchParams.extendId" @on-change="getExtendModel(searchParams.extendId)">
                                    <Checkbox :label="item.value" v-for="item in extendList" :key="item.value">{{item.label}}</Checkbox>
                                </CheckboxGroup>
                            </div>
                            <div class="check_item">
                                <span class="title">意向:</span>
                                <Checkbox style="margin-left: 10px; width:50px;"
                                        :indeterminate="purposIindeterminate"
                                    :value="purposeCheckAll"
                                    @click.prevent.native="handleCheckAllPurpose">全选
                                </Checkbox>
                                <CheckboxGroup v-model="searchParams.purposemodel" @on-change="getpurpose(searchParams.purposemodel)">
                                    <Checkbox :label="item.value" v-for="item in purposeList" :key="item.value">{{item.label}}</Checkbox>
                                </CheckboxGroup>
                            </div>
                    </div>
                    <div slot="content" class="choosedate part_one">
                        <div class="dateRight">
                            <div class="item">
                                <span class="title">下级:</span>
                                <Select v-model="searchParams.lowlevel" style="width:180px" placeholder="请选择下级" @on-change="getlowlevel(searchParams.lowlevel)">
                                    <Option value="1" key="01">全部</Option>
                                    <Option v-for="item in lowlevelList" :value="item.userid" :key="item.userid">{{ item.user_name}}</Option>
                                </Select>
                            </div>
                            <!-- 省份 -->
                            <div class="item">
                                <span class="title">选择省份:</span>
                                <Select v-model="searchParams.provincemodel" style="width:180px" placeholder="请选择省份" @on-change="getprovince(searchParams.provincemodel)">
                                    <Option value="" key="">全部</Option>
                                    <Option v-for="item in provinceList" :value="item.areaid" :key="item.areaid">{{ item.areaname }}</Option>
                                </Select>
                            </div>
                            <!-- 城市 -->
                            <div class="item">
                                <span class="title">选择城市:</span>
                                <Select v-model="searchParams.citymodel" style="width:180px" placeholder="请选择城市" @on-change="getcity(searchParams.citymodel)">
                                    <Option v-for="item in cityList" :value="item.areaid" :key="item.areaid">{{ item.areaname }}</Option>
                                </Select>
                            </div> 
                            <div class="item">
                            <!-- 联系天数 -->
                                <span class="title">成交周期:</span>
                                <Select v-model="searchParams.contime" style="width:180px" placeholder="请选择时间" @on-change="getcontime(searchParams.contime)">
                                    <Option value="" key="">全部</Option>
                                    <Option v-for="item in contimeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select> 
                            </div>
                        </div>
                    </div>
                    <div slot="content" class="choosedate">
                            <div class="dateRight">
                                <div class="item">
                                <!-- 录入时间 -->
                                    <span class="title">录入:</span>
                                    <DatePicker type="daterange" show-week-numbers placement="bottom-end" placeholder="Select date" style="width: 180px" @on-change="getSelectDate"></DatePicker>
                                </div>
                                <div class="item">
                                <!-- 选择天数 -->
                                    <span class="title">录入周期:</span>
                                    <Select v-model="searchParams.recently" style="width:180px" placeholder="请选择天数" @on-change="getrecently(searchParams.recently)">
                                        <Option value="" key="">全部</Option>
                                        <Option v-for="item in recentlyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select> 
                                </div>
                                <div class="item">
                                    <!-- 跟进状态 -->
                                    <span class="title">跟进状态:</span>
                                    <Select v-model="searchParams.clue" style="width:180px" placeholder="请选择跟进状态" @on-change="getClue(searchParams.clue)">
                                        <Option value="" key="">全部</Option>
                                        <Option v-for="item in clueList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select> 
                                </div>
                                <div class="item">
                                    <!-- 跟进时间 -->
                                    <span class="title">跟进时间:</span>
                                    <DatePicker type="daterange" show-week-numbers placement="bottom-end" placeholder="Select date" style="width: 180px" @on-change="getfollowdate"></DatePicker>
                                </div>
                                <div class="item">
                                    <!-- 回访时间 -->
                                    <span class="title">下次回访时间:</span>
                                    <DatePicker type="daterange" show-week-numbers placement="bottom-end" placeholder="Select date" style="width: 180px" @on-change="getvisitdate"></DatePicker>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </Collapse>
                <!-- 客户列表区 -->
                <div class="customer_list">
                    <!-- 客户数据 -->
                    <div class="table" :style="styleObject">
                        <button class="checkMore" @click="editLower">多项修改所属招商</button>
                        <button class="checkMore" style="margin-left: 20px;background: rgb(243, 90, 89);color: #fff;border-color: rgb(243, 90, 89);" @click="handleIntention" v-if="tableShow">批量修改意向度</button>
                        <button class="checkMore" style="margin-left: 20px;" @click="handlePubsea" v-if="tableShow">放入公海池</button>
                        <button class="checkMore" style="margin-left: 20px;" @click="handlePubclaim" v-else>批量认领</button>
                        <!-- <button class="checkMore searchD" style="margin-left: 20px;" @click="searchD">查看D类客户</button> -->
                        <button class="checkMore searchD" style="margin-left: 20px;" @click="searchVisit">已来访列表</button>
                        <Upload action="/NewA/Public/uploadmarks" :on-success="uploadmarks" v-show="uploadmarksShow" style="width: 100px;display:inline-block;margin-left: 20px;">
                            <Button type="ghost" icon="ios-cloud-upload-outline" class="ghost">上传信息</Button> 
                        </Upload>
                        <button class="checkMore" style="float: right;background: #1596ad;color: #fff;" @click="handleAll">返回客户列表</button>
                        <button class="checkMore" style="float: right;margin-right: 20px;" @click="handlePubseas">查看公海池客户列表</button>
                        <button class="checkMore" style="float: right;margin-right: 20px;" v-if="showList" @click="hasShow=true">查询</button>
                        
                        <Table   border :row-class-name="mydefineRow" :columns="columns" :data="tableData" :height="tableHeight" @on-selection-change="getChangeSelect" v-if="tableShow"></Table>
                        <Table  border  :columns="column" :data="pubseaData" :height="tableHeight" @on-selection-change="getChangeSelect" v-else></Table>
                        <!-- <Button @click="handleSelectAll(true)" style="margin-top: 20px;">设置全选</Button>
                        <Button @click="handleSelectAll(false)" style="margin-top: 20px;">取消全选</Button> -->
                    </div>
                    <div class="footer">
                        <!-- 分页 -->
                        <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="searchParams.currentPage" show-elevator show-total v-if="tableShow"></Page>
                        <Page :total="total" :page-size="pageSize" @on-change="pubseaChangePage" :current="searchParams.currentPage" show-elevator show-total v-else></Page>
                    </div>
                </div>
            </div>
        </div>
        <!-- 客户信息导入后提示弹窗 -->
        <Modal title="客户信息导入提示" v-model="isUpload" class-name="vertical-center-modal uploadModal" :mask-closable="false">
            <p style="font-size: 14px;color:#000;">上传成功:  <span style="color:#1596ad"> {{uploadNum}}</span> 条</p>
            <p style="font-size: 14px;color:#000;">上传失败:  <span style="color:#1596ad"> {{errorNum}}</span> 条</p>
            <p style="font-size: 14px;color:#000;">失败原因:  <span style="color:#1596ad"> 客户电话为空或者客户数据重复上传</span></p>
            <p style="font-size: 15px;color:#000;margin-top:10px;color:#1596ad;">上传失败数据:</p>
            <div class="errorarea">
                <Table  border :height="errorHeight" :columns="errorColumns" :data="errorData" v-show="uploadList"></Table>
            </div>
        </Modal>
        <!-- 客户信息导入后提示弹窗 -->
        <Modal title="客户信息导入提示" v-model="isUploadMarks" class-name="vertical-center-modal " :mask-closable="false">
            <p style="font-size: 14px;color:#000;">匹配成功:  <span style="color:#1596ad"> {{num}}</span> 条</p>
            <p style="font-size: 14px;color:#000;">上传成功:  <span style="color:#1596ad"> {{uploadNum}}</span> 条</p>
            <p style="font-size: 14px;color:#000;">上传失败:  <span style="color:#1596ad"> {{errorNum}}</span> 条</p>
            <p style="font-size: 15px;color:#000;margin-top:10px;color:#1596ad;">匹配失败数据:{{data}}</p>
        </Modal>
        <!-- 提示是否删除弹窗 -->
        <div class="outside" v-if="isDelete">
            <div class="delete">
                <p>确认删除</p>
                <div class="build">
                    <Icon type="close" @click="isDelete=false"></Icon>
                    <Icon type="checkmark"  @click="getDeleteCustomer(customerId)"></Icon>
                </div>
            </div>
        </div>
        <!-- 客户标记弹窗 -->
        <div class="sign_modal" v-if="isSign_modal">
            <div class="sign_content">
                <h3><p>编辑标记</p> <Icon type="close-circled" @click="isSign_modal=false" class="close_icon" title="关闭弹窗"></Icon></h3>
                <CheckboxGroup v-model="signmodel" @on-change="getsign(signmodel)" style="padding-left: 25px;">
                    <Checkbox :label="item.value" v-for="item in signList" :key="item.value"><Icon type="ios-pricetags" :style="item.objectClass"></Icon></Checkbox>
                </CheckboxGroup>
                <div class="sign_bottom">
                    <Button style="margin-right:5px;" @click="isSign_modal=false">取消</Button>
                    <Button type="info" @click="signHandle" style="display:none;">确定</Button>
                </div>
            </div>
        </div>
        <!-- 客户推广弹窗 -->
        <div class="sign_modal" v-if="extend_modal">
            <div class="sign_content">
                <h3><p>编辑推广</p> <Icon type="close-circled" @click="extend_modal=false" class="close_icon" title="关闭弹窗"></Icon></h3>
                <RadioGroup v-model="extend" style="padding-left: 25px;" @on-change="getextend(extend)">
                    <Radio :label="item.label" v-for="item in extendList" :key="item.value" style="margin-right: 20px;"></Radio>
                </RadioGroup>
                <div class="sign_bottom">
                    <Button style="margin-right:5px;" @click="clear">清空</Button>
                    <Button type="info" @click="extendHandle" >确定</Button>
                </div>
            </div>
        </div>
        <!-- 全选所属招商弹窗 filterable-->
        <Modal title="多个修改所属招商" class="addModal" v-model="isAttract" class-name="vertical-center-modal" @on-ok="asyncOK" :key="'mulity'" :mask-closable="false">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="选择招商" prop="lowerLeader">
                    <Select v-model="formValidate.lowerLeader"  :key="'mulity'">
                        <Option v-for="option in lowlevelList" :value="option.userid" :key="option.userid">{{option.user_name}}</Option>
                    </Select> 
                </FormItem>
                <FormItem class="btn"> 
                    <Button type="primary" @click="asyncOK('formValidate')">确定</Button>
                </FormItem>
            </Form>
            <!-- <Select v-model="lowerLeader"  :key="'mulity'">
                <Option v-for="option in lowlevelList" :value="option.userid" :key="option.userid">{{option.user_name}}</Option>
            </Select>  -->
        </Modal>
        <!-- 单选所属招商弹窗 -->
        <Modal title="单个修改所属招商" v-model="isRowAttract" class-name="vertical-center-modal" @on-ok="asynRowcOK" :key="'simily'" :mask-closable="false">
            <Select v-model="lowerLeader" :key="'simily'">
                <Option v-for="(option,index) in lowlevelList" :value="option.userid" :key="index">{{option.user_name}}</Option>
            </Select> 
        </Modal>
        <Modal title="所属招商客户" v-model="hasShow" :mask-closable="false" class="userModal">
            <Form ref="userDate" :model="userDate" :rules="ruleValidate" :label-width="80">
                <FormItem label="招商ID" prop="userid">
                    <Input v-model="userDate.userid" /> 
                </FormItem>
            </Form>
            <div class="modal_footer">
                <Button @click="userSearch(userDate)">查询</Button>
            </div>
        </Modal>
       <!-- 修改意向度弹窗 -->
       <Modal v-model="intentionModal"  @on-ok="editIntentionQuery" @on-cancel="intentionModal = false" :title="titleName" class="addModal">
            <Form ref="formValidateIntention" :model="formValidateIntention" :rules="ruleValidateIntention" :label-width="90">
                <FormItem label="修改意向度" prop="modelIntention">
                    <Select v-model="formValidate.modelIntention" style="width:470px" placeholder="请选择意向度" @on-change="getIntention">
                        <Option v-for="item in purposeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="editIntentionQuery('formValidateIntention')" style="float: right;">确定</Button>
                </FormItem>
            </Form>
        </Modal>
        <!-- 修改地址 -->
        <Modal title="修改客户地址" v-model="addressShow" :mask-closable="false" class="userModal">
            <Form ref="addressData" :model="addressData"  :label-width="80">
               <FormItem label="开店省份" prop="openProvice" class="pro"> 
                    <Select v-model="addressData.openProvice"  @on-change="getNextProvice(addressData.openProvice)" filterable clearable>
                        <Option v-for="item in openProviceList" :value="item.areaid" :key="item.areaid">{{item.areaname}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="开店城市" prop="openCity">
                    <Select v-model="addressData.openCity"  @on-change="getOpenCity(addressData.openCity)" filterable clearable>
                        <Option v-for="item in openCityList" :value="item.areaid" :key="item.areaid">{{item.areaname}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="详细地址" prop="address">
                    <Input v-model="addressData.address" placeholder="请输入客户的详细地址" style="width:410px;" />
                </FormItem>
            </Form>
            <div class="modal_footer">
                <Button @click="addressUpdate">提交</Button>
            </div>
        </Modal>
    </div>
</template>


<script>
import tipModal from '../tip.vue'
import bus from '@/assets/js/eventBus.js'
export default {
    components: {
        tipModal
    },

    data() {
        return {
            addressShow:false,
            addressId:'',
            // 修改客户地址
            addressData:{
                // 开店省份
                openProvice: '',
                // 开店城市
                openCity: '',
                // 客户的详细地址
                address: '',
            },
            // 开店省份数据
            openProviceList: [],
            // 开店城市数据
            openCityList: [],
            // 是否显示上传列表
            uploadmarksShow:false,
            uploadList:false,
            // 是否显示根据招商查找客户数据
            hasShow:false,
            // 输入的招商
            userDate:{
                userid:''
            },
            ruleValidate: {
                userid: [
                    { required: true, message: '招商ID不能为空', trigger: 'change' }
                ]
            },
            // 是否显示列表弹出框
            modalShow:false,
            // 列表弹出框的数据
            listinitData:[],
            // 列表弹出框的表头
            initColumns:[],
            /* 控制跳转页面时，按钮的显示隐藏 */
            // isShow:false,
            //控制客户列表和公海池列表显示隐藏
            tableShow:true,
            /****************************客户列表数据*********************************** */
            indeterminate: true,
            checkAll: false,
            checkAllGroup: [],
            // 多选项的数据
            selectionData: [],
            // 是否显示导入成功提示
            isUpload: false,
            isUploadMarks:false,
            // 成功导入条数
            uploadNum: 0,
            // 匹配成功
            num:0,
            // 失败导入条数
            errorNum: 0,
            // 上传失败的表头
            errorColumns: [
                {
                    title: '姓名',
                    key: 'username'
                },
                {
                    title: '电话',
                    key: 'phone'
                },
                {
                    title: '来源',
                    key: 'channel_notes'
                },
                {
                    title: '城市',
                    key: 'address',
                },
            ],
            // 上传失败的表格高度
            errorHeight: 300,
            // 上传失败的数据
            errorData: [],
            data:'',
            // 表格高度
            tableHeight: 900,
            value1: '0',
            // 样式
            styleObject: {
                top: '0px'
            },
            // 多选时所属招商弹窗是否显示 
            isAttract: false,
             // 所属招商弹窗下级选择得到的
             formValidate:{  
                lowerLeader:'',
            },
            // 表单验证
            ruleValidate: {
                lowerLeader: [
                    { required: true,message: '招商不能为空', trigger: 'change' },
                ],
            },
            // 单选时所属招商弹窗是否显示 
            isRowAttract: false,
            // 所属招商弹窗下级选择得到的
            lowerLeader:'',
            // 所属招商这行客户的id
            lowerLeaderId: [],
            // 单行点击客户的id
            rowid: '',
            // 是否显示客户标记窗口
            isSign_modal: false,
            // 标记选定
            signmodel: '',
            // 标记数据
            signList:[                
                {
                    value: '1',
                    label: '',
                    objectClass: {
                        color: '#9d50c8',
                    }
                },
                 {
                    value: '2',
                    label: '',
                    objectClass: {
                        color: '#f35a59',
                    }
                },
                {
                    value: '3',
                    label: '',
                    objectClass: {
                        color: '#169aff',
                    }
                },
                {
                    value: '4',
                    label: '',
                    objectClass: {
                        color: '#20b275',
                    }
                },
                {
                    value: '5',
                    label: '',
                    objectClass: {
                        color: '#f5c635',
                    }
                },
                {
                    value: '6',
                    label: '',
                    objectClass: {
                        color: '#fb9200',
                    }
                },
                {
                    value: '7',
                    label: '',
                    objectClass: {
                        color: '#7f2c27',
                    }
                },
                {
                    value: '8',
                    label: '',
                    objectClass: {
                        color: '#1bf945',
                    }
                },
                {
                    value: '9',
                    label: '',
                    objectClass: {
                        color: '#045c5d',
                    }
                },
                {
                    value: '10',
                    label: '',
                    objectClass: {
                        color: '#e9aaa0',
                    }
                },
                
            ],
            // 是否显示编辑推广弹框
            extend_modal:false,
            // 选的推广
            extend:'',
            // 推广对应的id
            extendId:'',
            // 推广数据
            extendList:[
                {
                    value: '1',
                    label: '百度',
                },
                {
                    value: '2',
                    label: '搜狗',
                },
                {
                    value: '3',
                    label: '好搜',
                },
                {
                    value: '4',
                    label: '神马',
                },
                {
                    value: '5',
                    label: '百度品专',
                },
                {
                    value: '6',
                    label: 'SEO',
                },
            ],
            // 当前单元格客户的id
            signId: '',
            // 总页数
            total: 0,
            // 每页条数
            pageSize: 20,
            // 是否显示删除框
            isDelete: false,
            // 省份列表
            provinceList: [],
            // 城市列表
            cityList: [],
            // 是否有门店数据
            shopList: [
                {
                    value: 0,
                    label: '无',
                },
                {
                    value: 1,
                    label: '有',
                },
                {
                    value: 2,
                    label: '有意向店面',
                },
            ],
            // 选择联系时间的数据
            contimeList: [
                {
                    value: 1,
                    label: '最近3天',
                },
                {
                    value: 2,
                    label: '4到7天',
                },
                {
                    value: 3,
                    label: '8到20天',
                },
                {
                    value: 4,
                    label: '大于20天',
                }
            ],
            // 选择天数的数据
            recentlyList: [
                {
                    value: 7,
                    label: '最近7天',
                },
                {
                    value: 15,
                    label: '最近15天',
                },
                {
                    value: 30,
                    label: '最近30天',
                }
            ],
            // 意向度数据
            purposeList: [
                {
                    value: '1',
                    label: 'A(对我们品牌有直接兴趣的客户)'
                },
                {
                    value: '2',
                    label: 'B(对我们行业有直接兴趣的客户)'
                },
                {
                    value: '3',
                    label: 'C(对投资开店有直接兴趣的客户)'
                },
                {
                    value: '4',
                    label: 'D(无效客户)'
                },
                {
                    value: '5',
                    label: '待定:未接，不接，暂时无法联系上的，拒接小于三次的'
                }
            ],
            // 是否显示渠道管理功能
            ifshow: false,
            // 下级数据
            lowlevelList: [],
            // 渠道增删改窗口数据
            channel_modal: {
                title: '渠道详情',
            },
            // 渠道来源数据
            sourceList: [],
            // 选中当前行客户的id
            customerId: '',
            // 跟进状态数据
            clueList: [
                {
                    value: 2,
                    label: '已跟进',
                },
                {
                    value: 1,
                    label: '未跟进',
                },
            ],
            // 客户数据
            tableData: [],
            // CRM主页固定搜索
            //公海池客户数据
            pubseaData:[],
            //公海池列表表头
            column:[
                {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    fixed: 'left'
                },
                {
                    title: '姓名',
                    width: 120,
                    key: 'username',
                    fixed: 'left'
                },
                {
                    title: '电话',
                    width: 120,
                    key: 'phone',
                    fixed: 'left'
                },                
                {
                    title: '城市',
                    key: 'areaname',
                    width: 150,
                    fixed: 'left',
                    render: (h, params) => {
                        let text = '';
                        if (params.row.areaname !== null) {
                            text = params.row.areaname+params.row.address;
                        } else if (params.row.address !== '') {
                            text = params.row.address;
                        }
                        return h('div', [
                            h('a', {
                                style: {
                                    color: '#495060',
                                    fontSize: '12px',
                                },
                                domProps: {
                                    title: '点击编辑客户地址'
                                },
                                on: {
                                    click: () => {
                                        if(params.row.provinceid!==null){
                                            this.addressData.openProvice=params.row.provinceid;
                                        };
                                        this.getCitys(this.addressData.openProvice);  
                                        if(params.row.cityid!==null){
                                            this.addressData.openCity=params.row.cityid;
                                        }                                                                            
                                        this.addressData.address=params.row.address;
                                        this.addressId = params.row.id;
                                        this.addressShow=true;
                                    }
                                }
                            }, text),
                        ])
                    }
                },               
               
                {
                    title: '最新跟进摘要',
                    width: 530,
                    key: 'notes', 
                    render: (h, params) => {
                        let texts = params.row.notes;
                        if (params.row.notes !== null) {
                            if (params.row.notes.length > 40) {
                                texts = params.row.notes.slice(0,40) + '...';
                            } else {
                                texts = params.row.notes;
                            }
                        }
                        return h('div', [
                            h('Tooltip', {
                                props: {
                                    placement: 'top',
                                    transfer: true
                                }
                            }, [texts, h('span', {
                                slot: 'content',
                                style: {
                                    whiteSpace: 'normal'
                                }
                            }, params.row.notes)
                            ])
                        ])
                    }
                },
                // {
                //     title:'招商',
                //     width: 75,
                //     key:'user_name',
                // },
                {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                class: 'handle',
                                style: {
                                    marginRight: '10px',
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        let routeData = this.$router.resolve({ name: 'customerstorelist', query: {name: params.row.username, id:params.row.id, phone: params.row.phone, channels: params.row.channels, has_store: params.row.status, intention: params.row.intention,isShow:1} });
                                        window.open(routeData.href, '_blank');
                                        
                                        
                                    }
                                }
                            }, '门店'),
                            h('a', {
                                class: 'handle',
                                style: {
                                    marginRight: '10px',
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        let routeData2 = this.$router.resolve({ name: 'comeVisit', query: {isaim: 1, name: params.row.username, id:params.row.id, phone: params.row.phone, channels: params.row.channels, has_store: params.row.status, intention: params.row.intention,isShow:1} });
                                        window.open(routeData2.href, '_blank');
                                    }
                                }
                            }, '来访'),
                             h('a', {
                                class: 'handle',
                                style: {
                                    marginRight: '10px',
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        let routeData3= this.$router.resolve({ name: 'customervisit', query: {isaim: 1, name: params.row.username, id:params.row.id, phone: params.row.phone, channels: params.row.channels, has_store: params.row.status, intention: params.row.intention,isShow:1} });
                                        
                                        window.open(routeData3.href, '_blank');
                                    }
                                }
                            }, '跟进'),
                            h('a', [
                                h('Poptip', {
                                    class: 'handle',
                                    props: {
                                        confirm: true,
                                        transfer: true,
                                        placement: 'top',
                                        title: '确定要认领吗 ?',
                                        type: 'error',
                                        size: 'small',
                                        width: '150',
                                        vModel: true
                                    },
                                style: {
                                    marginRight: '10px',
                                    cursor: 'pointer'
                                },
                                on: {
                                    'on-ok': ()=>{
                                        // 确定认领
                                        this.arrId=[params.row.id];
                                        this.getPubclaim();
                                    },
                                    'on-cancel': ()=>{
                                        // 取消认领
                                    }
                                },
                            }, '认领'),
                            ]),
                            // h('a', {
                            //     class: 'handle',
                            //     props: {
                            //             confirm: true,
                            //             transfer: true,
                            //             placement: 'top',
                            //             title: '确定要认领吗 ?',
                            //             type: 'error',
                            //             size: 'small',
                            //             width: '150',
                            //             vModel: true
                            //         },
                            //     style: {
                            //         marginRight: '10px',
                            //         cursor: 'pointer'
                            //     },
                            //     on: {
                            //         'on-ok': ()=>{
                            //             // 确定认领
                            //             this.arrId=[params.row.id];
                            //             this.getPubclaim();
                            //         },
                            //         'on-cancel': ()=>{
                            //             // 取消认领
                            //         }
                            //     },
                            //     // on: {
                            //     //     click: () => {
                            //     //         this.arrId=[params.row.id];
                            //     //         this.getPubclaim();
                            //     //     }
                            //     // }
                            // }, '认领'),
                        ]);
                    }
                },
                {
                    title: '来源',
                    width: 120,
                    key: 'channels',
                    
                },
                {
                    title: '录入时间',
                    width: 130,
                    key: 'insert_time',
                },
                {
                    title: '跟进时间',
                    width: 130,
                    key: 'last_time',
                },
                {
                    title: '下次跟进时间',
                    width: 160,
                    key: 'follow_up_time',
                },
                
                {
                    title:'推广',
                    width: 120,
                    key:'marks',
                    
                    render: (h, params) => {
                        return h('div',{
                            style:{
                               cursor: 'pointer',
                               width: '100%',
                                height: '20px',
                            },
                            domProps: {
                                title: '点击编辑客户推广'
                            },
                            on: {
                                click: () => {
                                    // 当前单元格客户的id
                                    this.signId = params.row.id;
                                    this.extend_modal = true;
                                    
                                }
                            }
                        },params.row.marks)
                    }
                },
            ],
            searchParams: {
                currentPage: 1,
                // 搜索时客户名称关键词
                username: '',
                // 搜索时客户渠道备注关键词
                channel_notes: '',
                // 默认选中是否有门店
                shopmodel: [],
                // 默认选中哪个渠道来源
                sourcemodel:[],
                signModel: [],
                extendId:[],
                // 默认选中哪个意向
                purposemodel: [],
                // 选中哪个下级 
                lowlevel: '',
                // 默认选中哪个省份
                provincemodel: '',
                // 默认选中哪个城市
                citymodel: '',
                // 得到选择哪个天数
                recently: 0,
                // 得到选择哪个联系时间
                contime: 0,
                // 选择录入时间得到的数组
                selectDate: [],
                // 选择跟进时间得到的数组
                followdate: [],
                // 选择预约回访时间得到的数组
                visitdate: [],
                // 跟进状态
                clue: '',
                // 录入时间排序
                order_ins: '',
                // 跟进时间排序
                order_las: '',
                // 预约回访时间排序
                order_fol: '',
                // 搜索时客户电话关键词
                phone: '',
            },
            //认领ID数组
            arrId:[],
            // 意向全选
            purposeCheckAll:false,
            // 意向不全选的图标
            purposIindeterminate:true,
            // 是否显示查看
            showList:false,
            // 推广
            searchExtendId:[],
            // 是否弹出修改意向度的弹框
            intentionModal:false,
            // 选择的意向度
            formValidateIntention:{
                modelIntention:'',
            },
            ruleValidateIntention: {
                modelIntention: [
                    { required: true,  message: '意向度不能为空', trigger: 'change' }
                ],
            },
            // 客户姓名
            titleName:''
        }
    },
    // 灵活性表头
    computed: {
        columns() {
            let arr = [
                 {
                    type: 'selection',
                    width: 60,
                    align: 'center',
                    fixed: 'left'
                },
                {
                    title: '姓名',
                    width: 120,
                    key: 'username',
                    fixed: 'left'
                },
                {
                    title: '电话',
                    width: 130,
                    fixed: 'left',
                    key: 'phone'
                },
                {
                    title: '城市',
                    key: 'areaname',
                    width: 150,
                    fixed: 'left',
                    render: (h, params) => {
                        let text = '';
                        if (params.row.areaname !== null) {
                            text = params.row.areaname+params.row.address;
                        } else if (params.row.address !== '') {
                            text = params.row.address;
                        }
                        return h('div', [
                            h('a', {
                                style: {
                                    color: '#495060',
                                    fontSize: '12px',
                                },
                                domProps: {
                                    title: '点击编辑客户地址'
                                },
                                on: {
                                    click: () => {
                                        if(params.row.provinceid!==null){
                                            this.addressData.openProvice=params.row.provinceid;
                                        };
                                        this.getCitys(this.addressData.openProvice);  
                                        if(params.row.cityid!==null){
                                            this.addressData.openCity=params.row.cityid;
                                        }                                                                            
                                        this.addressData.address=params.row.address;
                                        this.addressId = params.row.id;
                                        this.addressShow=true;
                                    }
                                }
                            }, text),
                        ])
                    }
                },                               
                {
                    title: '标记',
                    width: 80,
                    fixed: 'left',
                    key: 'sign',
                    render:(h,params)=>{
                        return h('div',{
                            style:{
                               cursor: 'pointer'
                            },
                            domProps: {
                                title: '点击编辑客户标记'
                            },
                            on: {
                                click: () => {
                                    // 当前单元格客户的id
                                    this.signId = params.row.id;
                                    this.isSign_modal = true;
                                    this.entrustUpdate(params.row.sign);
                                }
                            }
                        },[
                            h('Icon',{
                                props: {
                                    type: params.row.sign.indexOf('1') !== -1 ? 'ios-pricetags' : '',
                                },
                                style:{
                                    color: '#9d50c8',
                                    fontSize: '20px',
                                    marginRight: params.row.sign.indexOf('1') !== -1 ? '4px' : '',
                                },
                            }),
                            h('Icon',{
                                props: {
                                    type: params.row.sign.indexOf('2') !== -1 ? 'ios-pricetags' : '',
                                },
                                style:{
                                    color: '#f35a59',
                                    fontSize: '20px',
                                    marginRight: params.row.sign.indexOf('2') !== -1 ? '4px' : '',
                                },
                            }),
                            h('Icon',{
                                props: {
                                    type: params.row.sign.indexOf('3') !== -1 ? 'ios-pricetags' : '',
                                },
                                style:{
                                    color: '#169aff',
                                    fontSize: '20px',
                                    marginRight: params.row.sign.indexOf('3') !== -1 ? '4px' : '',
                                },
                            }),
                            h('Icon',{
                                props: {
                                    type: params.row.sign.indexOf('4') !== -1 ? 'ios-pricetags' : '',
                                },
                                style:{
                                    color: '#20b275',
                                    fontSize: '20px',
                                    marginRight: params.row.sign.indexOf('4') !== -1 ? '4px' : '',
                                },
                            }),
                            h('Icon',{
                                props: {
                                    type: params.row.sign.indexOf('5') !== -1 ? 'ios-pricetags' : '',
                                },
                                style:{
                                    color: '#f5c635',
                                    fontSize: '20px',
                                    marginRight: params.row.sign.indexOf('5') !== -1 ? '4px' : '',
                                },
                            }),
                            h('Icon',{
                                props: {
                                    type: params.row.sign.indexOf('6') !== -1 ? 'ios-pricetags' : '',
                                },
                                style:{
                                    color: '#fb9200',
                                    fontSize: '20px',
                                    marginRight: params.row.sign.indexOf('6') !== -1 ? '4px' : '',
                                }
                            }),
                            h('Icon',{
                                props: {
                                    type: params.row.sign.indexOf('7') !== -1 ? 'ios-pricetags' : '',
                                },
                                style:{
                                    color: '#7f2c27',
                                    fontSize: '20px',
                                    marginRight: params.row.sign.indexOf('7') !== -1 ? '4px' : '',
                                }
                            }),
                            h('Icon',{
                                props: {
                                    type: params.row.sign.indexOf('8') !== -1 ? 'ios-pricetags' : '',
                                },
                                style:{
                                    color: '#1bf945',
                                    fontSize: '20px',
                                    marginRight: params.row.sign.indexOf('8') !== -1 ? '4px' : '',
                                }
                            }),
                            h('Icon',{
                                props: {
                                    type: params.row.sign.indexOf('9') !== -1 ? 'ios-pricetags' : '',
                                },
                                style:{
                                    color: '#045c5d',
                                    fontSize: '20px',
                                    marginRight: params.row.sign.indexOf('9') !== -1 ? '4px' : '',
                                }
                            }),
                            h('Icon',{
                                props: {
                                    type: params.row.sign.indexOf('10') !== -1 ? 'ios-pricetags' : '',
                                },
                                style:{
                                    color: '#e9aaa0',
                                    fontSize: '20px',
                                    marginRight: params.row.sign.indexOf('10') !== -1 ? '4px' : '',
                                }
                            }),
                        ]
                        )
                    }
                }, 
                {
                    title:'跟进状态',
                    width: 100,
                    key:'clue',
                    render:(h, params) => {
                        return h('div', [
                            // 设置气泡式提醒
                            h('Tooltip',[
                                    // 设置icon
                                    h('div', 
                                        [
                                            h('icon', {
                                                props: {
                                                type: params.row.clue === '1' ? 'information-circled' : 'checkmark-round',
                                            },
                                            style: {
                                                color: params.row.clue === '1' ? '#ed3f14' : '#1d8c9f',
                                                fontSize: '20px'
                                            },
                                            domProps: {
                                                title: params.row.clue === '1' ? '未跟进' :'已跟进'
                                            },
                                        })
                                    ])
                                ]
                            )
                        ])
                    }
                },
                {
                    title: '最新跟进摘要',
                    width: 400,
                    key: 'notes', 
                    render: (h, params) => {
                        let texts = params.row.notes;
                        if (params.row.notes !== null) {
                            if (params.row.notes.length > 40) {
                                texts = params.row.notes.slice(0,40) + '...';
                            } else {
                                texts = params.row.notes;
                            }
                        }
                        return h('div', [
                            h('Tooltip', {
                                props: {
                                    placement: 'top',
                                    transfer: true
                                }
                            }, [texts, h('span', {
                                slot: 'content',
                                style: {
                                    whiteSpace: 'normal'
                                }
                            }, params.row.notes)
                            ])
                        ])
                    }
                },
                {
                    title:'招商',
                    width: 75,
                    key:'user_name',
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                props: {
                                    type: 'success',
                                    size: 'small'
                                },
                                style: {
                                    color: '#495060',
                                    fontSize: '12px'
                                },
                                domProps: {
                                    title: '点击编辑所属招商'
                                },
                                on: {
                                    click: () => {
                                        // 让单选招商弹窗显示
                                        this.isRowAttract = true;
                                        // 所属招商这行客户的id
                                        this.rowid = params.row.id;
                                        // 得到招商详情
                                        this.lowerLeader = params.row.userid;
                                        // this.getlowerLeaderDetail(params.row)
                                    }
                                }
                            }, params.row.user_name),
                        ])
                    }
                },
                {
                    title: '操作',
                    key: 'action',
                    width: 200,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            // h('Button', {
                            //     props: {
                            //         size: 'small'
                            //     },
                            //     style: {
                            //         marginRight: '10px'
                            //     },
                            //     on: {
                            //         click: () => {
                            //            this.$router.push({path: 'customeradd',query:{isaim: 3, data:params.row}})
                            //         }
                            //     }
                            // }, '详情'),
                            h('a', {
                                class: 'handle',
                                style: {
                                    marginRight: '10px',
                                    cursor: 'pointer'
                                },
                                
                                on: {
                                    click: () => {
                                        let routeData = this.$router.resolve({ name: 'customerstorelist', query: {isShow:2, name: params.row.username, id:params.row.id, phone: params.row.phone, channels: params.row.channels, has_store: params.row.status, intention: params.row.intention} });
                                        window.open(routeData.href, '_blank');
                                    //  window.open(`http://oa.xmvogue.com/index.php/NewA/Index/main#/customerstorelist?name=${params.row.username}&id=${params.row.id}`,'_blank')
                                    //    this.$router.push({path: 'customerstorelist', query:{name: params.row.username, id:params.row.id, phone: params.row.phone, channels: params.row.channels, has_store: params.row.status, intention: params.row.intention}})
                                    }
                                }
                            }, '门店'),
                            h('a', {
                                class: 'handle',
                                style: {
                                    marginRight: '10px',
                                    cursor: 'pointer'
                                },
                                
                                on: {
                                    click: () => {
                                    //  window.open(`http://oa.xmvogue.com/index.php/NewA/Index/main#/comeVisit?isaim=1&name=${params.row.username}&id=${params.row.id}`,'_blank')
                                        let routeData2 = this.$router.resolve({ name: 'comeVisit', query: {isShow:2,isaim: 1, name: params.row.username, id:params.row.id, phone: params.row.phone, channels: params.row.channels, has_store: params.row.status, intention: params.row.intention} });
                                        window.open(routeData2.href, '_blank');
                                    //    this.$router.push({path: 'comeVisit', query:{isaim: 1, name: params.row.username, id:params.row.id, phone: params.row.phone, channels: params.row.channels, has_store: params.row.status, intention: params.row.intention}})
                                    }
                                }
                            }, '来访'),
                             h('a', {
                                class: 'handle',
                                style: {
                                    marginRight: '10px',
                                    cursor: 'pointer'
                                },
                                
                                on: {
                                    click: () => {
                                        let routeData3= this.$router.resolve({ name: 'customervisit', query: {isShow:2,isaim: 1, name: params.row.username, id:params.row.id, phone: params.row.phone, channels: params.row.channels, has_store: params.row.status, intention: params.row.intention} });
                                        window.open(routeData3.href, '_blank');
                                        // window.open(`http://oa.xmvogue.com/index.php/NewA/Index/main#/customervisit?isaim=1&name=${params.row.username}&id=${params.row.id}`,'_blank')
                                        //this.$router.push({path: 'customervisit', query:{isaim: 1, name: params.row.username, id:params.row.id, phone: params.row.phone, channels: params.row.channels, has_store: params.row.status, intention: params.row.intention}})
                                    }
                                }
                            }, '跟进'),
                            h('a', {
                                class: 'handle',
                                style: {
                                    marginRight: '10px',
                                    cursor: 'pointer'
                                },
                                
                                on: {
                                    click: () => {
                                        let routeData4= this.$router.resolve({ name: 'customeradd', query: { isShow:2,isaim: 2, name: params.row.username, id:params.row.id, phone: params.row.phone, channels: params.row.channels, has_store: params.row.status, intention: params.row.intention} });
                                        window.open(routeData4.href, '_blank');
                                        // window.open(`http://oa.xmvogue.com/index.php/NewA/Index/main#/customeradd?isaim=1&name=${params.row.username}&id=${params.row.id}`,'_blank')
                                        // this.$router.push({path: 'customeradd', query:{isaim: 2, name: params.row.username, id:params.row.id, phone: params.row.phone, channels: params.row.channels, has_store: params.row.status, intention: params.row.intention}})
                                    }
                                }
                            }, '编辑'),
                            // h('Button', {
                            //     props: {
                            //         type: 'error',
                            //         size: 'small'
                            //     },
                            //     style: {
                            //         marginRight: '10px'
                            //     },
                            //     on: {
                            //         click: () => {
                            //             this.isDelete = true;
                            //             this.customerId = params.row.id;
                            //         }
                            //     }
                            // }, '删除'),
                        ]);
                    },
                    
                },
                {
                    title: '来源',
                    width: 120,
                    key: 'channels',
                    // fixed: 'left'
                },
                {
                    title: '意向度',
                    width:100,
                    key: 'intention', 
                    // fixed: 'left',
                    render: (h, params) => {
                        return h('div', [
                            h('a', {
                                class: 'handle',
                                style: {
                                    color: '#495060',
                                    fontSize: '12px',
                                },
                                domProps: {
                                    title: '点击修改意向度'
                                },
                                on: {
                                    click: () => {
                                        this.intentionModal=true;
                                        this.rowid = params.row.id;
                                        this.titleName=params.row.username;
                                        this.formValidateIntention.modelIntention=params.row.intention;
                                    }
                                }
                            }, params.row.intention),
                        ])
                    }
                },
                {
                    title: '录入时间',
                    key: 'insert_time',
                    width: 130,
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','录入时间'),
                            h('Icon',{
                                props:{
                                    type: 'arrow-up-a'
                                },
                                style: {
                                    marginLeft: '5px'
                                },
                                on: {
                                    click:() => {
                                        // 向前找时间
                                        this.searchParams.order_ins = 1;
                                        this.searchParams.order_las = '';
                                        this.searchParams.order_fol = '';
                                        this.getCustomerList();
                                    }
                                }
                            }),
                            h('Icon',{
                                props:{
                                    type: 'arrow-down-a'
                                },
                                style: {
                                    marginLeft: '5px'
                                },
                                on: {
                                    click:() => {
                                        this.searchParams.order_ins = 2;
                                        this.searchParams.order_las = '';
                                        this.searchParams.order_fol = '';
                                        this.getCustomerList();
                                    }
                                }
                            })
                        ])
                    }
                },
                {
                    title: '跟进时间',
                    width: 130,
                    key: 'last_time',
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','跟进时间'),
                            h('Icon',{
                                props:{
                                    type: 'arrow-up-a'
                                },
                                style: {
                                    marginLeft: '5px'
                                },
                                on: {
                                    click:() => {
                                        // 向前找时间
                                        this.searchParams.order_las = 1;
                                        this.searchParams.order_ins = '';
                                        this.searchParams.order_fol = '';
                                        this.getCustomerList();
                                    }
                                }
                            }),
                            h('Icon',{
                                props:{
                                    type: 'arrow-down-a'
                                },
                                style: {
                                    marginLeft: '5px'
                                },
                                on: {
                                    click:() => {
                                        this.searchParams.order_las = 2;
                                        this.searchParams.order_ins = '';
                                        this.searchParams.order_fol = '';
                                        this.getCustomerList();
                                    }
                                }
                            })
                        ])
                    }
                },
                {
                    title: '下次跟进时间',
                    width: 160,
                    key: 'follow_up_time',
                    renderHeader: (h,params)=>{
                        return h('div',[
                            h('strong','下次跟进时间'),
                            h('Icon',{
                                props:{
                                    type: 'arrow-up-a'
                                },
                                style: {
                                    marginLeft: '5px'
                                },
                                on: {
                                    click:() => {
                                        // 向前找时间
                                        this.searchParams.order_las = '';
                                       this.searchParams.order_ins = '';
                                        this.searchParams.order_fol = 1;
                                        this.getCustomerList();
                                    }
                                }
                            }),
                            h('Icon',{
                                props:{
                                    type: 'arrow-down-a'
                                },
                                style: {
                                    marginLeft: '29px'
                                },
                                on: {
                                    click:() => {
                                        this.searchParams.order_las = '';
                                        this.searchParams.order_ins = '';
                                        this.searchParams.order_fol = 2;
                                        this.getCustomerList();
                                    }
                                }
                            })
                        ])
                    }
                },
                
                {
                    title:'推广',
                    width: 120,
                    key:'marks',
                    // fixed:'left',
                    render: (h, params) => {
                        return h('div',{
                            style:{
                               cursor: 'pointer',
                               width: '100%',
                                height: '20px',
                            },
                            domProps: {
                                title: '点击编辑客户推广'
                            },
                            on: {
                                click: () => {
                                    // 当前单元格客户的id
                                    this.signId = params.row.id;
                                    this.extend_modal = true;
                                    // this.entrustUpdate(params.row.sign);
                                }
                            }
                        },params.row.marks)
                    }
                },
            ];
            // 根据是否要显示金额来动态的显示表头的销售金额这一列
            // let item3 = {
            //     title: '意向度',
            //     width:75,
            //     key: 'intention', 
            //     fixed: 'left',
            //     render: (h, params) => {
            //         return h('div', [
            //             h('a', {
            //                 class: 'handle',
            //                 style: {
            //                     color: '#495060',
            //                     fontSize: '12px',
            //                 },
            //                 domProps: {
            //                     title: '点击修改意向度'
            //                 },
            //                 on: {
            //                     click: () => {
            //                         this.intentionModal=true;
            //                         this.rowid = params.row.id;
            //                     }
            //                 }
            //             }, params.row.intention),
            //         ])
            //     }
            // };
            let item4 =  {
                title: '门店',
                width: 70,
                key: 'status',
                render: (h, params) => {
                    return h('div', [
                        h('a', {
                            class: 'handle',
                            style: {
                                color: '#495060',
                                fontSize: '12px',
                            },
                            domProps: {
                                title: '点击查看门店详情'
                            },
                            on: {
                                click: () => {
                                    let routeData5 = this.$router.resolve({ name: 'customerstorelist', query: { isShow:2, name: params.row.username, id:params.row.id, phone: params.row.phone, channels: params.row.channels, has_store: params.row.status, intention: params.row.intention} });
                                    window.open(routeData5.href, '_blank');
                                    // window.open(`http://oa.xmvogue.com/index.php/NewA/Index/main#/customerstorelist?name=${params.row.username}&id=${params.row.id}`,'_blank')
                                    // this.$router.push({path: 'customerstorelist', query:{name: params.row.username, id:params.row.id, phone: params.row.phone, channels: params.row.channels, has_store: params.row.status, intention: params.row.intention}})
                                }
                            }
                        }, params.row.status),
                    ])
                }
            };
            // this.searchParams.purposemodel.length !== 0 && arr.splice(4,0, item3)
            this.searchParams.shopmodel.length !== 0 && arr.splice(4,0,item4);
            return arr;
        }
    },



    created() {
        // this.styleObject.top = '260px';
        // 得到客户列表数据
        this.getCustomerList();
        // 得到渠道来源数据
        this.getSourceList();
        // 获取省份
        this.getProvinces();
        // 得到下级数据
        this.getlowlevelList();
    },
     // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 350);
            this.errorHeight = windowHeight- 480;
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 350);
            this.errorHeight = windowHeight- 480;
        })
        bus.$on('eventName', () => { 
            this.getCustomerList();
        })
    },

    methods: { 
         /**
          * 得到哪个开店省份
          */
        getNextProvice(openProvice) {
            this.addressData.openProvice = openProvice;
            this.addressData.openCity='';
            this.getCitys(this.addressData.openProvice);
        },
        /**
          * 得到哪个开店城市
          */
        getOpenCity(openCity) {
            this.addressData.openCity = openCity;
        },
        // 修改城市
        addressUpdate() {
            this.$resetAjax({
                url: '/NewA/Customer/update',
                type: 'POST',
                data: {
                    id: Number(this.addressId),                        
                    // 开店省
                    provinceid: this.addressData.openProvice,
                    // 开店城市
                    cityid: this.addressData.openCity,
                    // 客户的详细地址
                    address: this.addressData.address
                },
                success: (res) => {
                    let result=JSON.parse(res);
                    if(result.errorcode==0){
                        this.addressShow=false;
                        this.$Message.success('修改成功！');
                        this.getCustomerList();                        
                    }else if(result.errorcode==100){
                        this.addressShow=false;
                        this.$Message.error('修改失败,该客户不属于您');
                    }
                }
            })
        },
        /* 判断当前行的数据，添加样式 */
        mydefineRow(row, index) { 
            if(row.tips==1){                
                return 'demo-table-info-row';
            }
            let sign=row.sign[0];
            console.log(sign);
            switch(sign){
                case '1':
                    return 'demo-table-color1-row';
                    break;
                case '2':
                    return 'demo-table-color2-row';
                    break;
                case '3':
                    return 'demo-table-color3-row';
                    break;
                case '4':
                    return 'demo-table-color4-row';
                    break;
                case '5':
                    return 'demo-table-color5-row';
                    break;
                case '6':
                    return 'demo-table-color6-row';
                    break;
                case '7':
                    return 'demo-table-color7-row';
                    break;
                case '8':
                    return 'demo-table-color8-row';
                    break;
                case '9':
                    return 'demo-table-color9-row';
                    break;
                case '10':
                    return 'demo-table-color10-row';
                    break;
                default:
                    return '';
            }            
            return '';
            
        },       
        /**
         * 上传客户信息成功
         */
        upLoadSuccess(res) {
            if(res.errorcode==1){
                this.$root.tip.isShow = true;
                this.$root.tip.content = '上传的不是Excel文件';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 2500); 
            }else{
                this.isUpload = true;
                this.uploadNum = res.num;
                this.errorNum = res.errorArr.length;
                if(res.errorArr.length>0){
                    this.uploadList=true
                    this.errorData = res.errorArr;
                }else{
                    this.uploadList=false;
                }
            }
        },
        /* 上传列表文件 */
        uploadmarks(res){
            if(res.errorcode==1){
                this.$root.tip.isShow = true;
                this.$root.tip.content = '上传的不是Excel文件';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 2500); 
            }else{
                this.isUploadMarks = true;
                this.num=res.num;
                this.uploadNum = res. snum;
                this.errorNum = res.enum;
                this.data=res.data;
            }
        },
        
        /**
         * 得到客户数据列表
         */
        getCustomerList() {
            this.$resetAjax({
                type: 'GET',
                url: '/NewA/Customer/getlist',
                data: {
                    // 姓名检索
                    username: this.searchParams.username,
                    // 号码检索
                    phone: this.searchParams.phone,
                    // 渠道备注检索
                    channel_notes: this.searchParams.channel_notes,
                    // 省份检索
                    proid: this.searchParams.provincemodel,
                    // 城市检索
                    city: this.searchParams.citymodel,
                    // 渠道筛选
                    channel: this.searchParams.sourcemodel,
                    // 意向度
                    intention: this.searchParams.purposemodel,
                    // 是否有门店
                    has_shop: this.searchParams.shopmodel,
                    // 客户标志
                    sign: this.searchParams.signModel,
                    // 推广
                    marks:this.searchParams.extendId,
                    // 录入时间
                    insert_time: this.searchParams.selectDate,
                    // 最近跟进时间:
                    last_time: this.searchParams.followdate,
                    // 预约回访时间:
                    follow_up_time : this.searchParams.visitdate,
                    // 第几页
                    p: this.searchParams.currentPage,
                    // 录入时间排序
                    order_ins: this.searchParams.order_ins,
                    // 跟进状态
                    clue: this.searchParams.clue,
                    // 跟进时间排序
                    order_las: this.searchParams.order_las,
                    // 预约回访时间排序
                    order_fol: this.searchParams.order_fol,
                    // 选择天数
                    recently: this.searchParams.recently,
                    // 联系时间
                    contime: this.searchParams.contime,
                    // 下级
                    uid: this.searchParams.lowlevel

                },
                success: (res) => {
                    this.tableData = JSON.parse(res).data;                   
                    this.total = Number(JSON.parse(res).count);
                    if(JSON.parse(res).uploadmarks===1){
                        this.uploadmarksShow=true
                    }else{
                        this.uploadmarksShow=false
                    }
                    if(JSON.parse(res).uploadmarks===1){
                        this.showList=true
                    }else{
                        this.showList=false
                    }
                    // 渠道管理权限设置
                    if (JSON.parse(res).ifshow == 2) {
                        this.ifshow = false;
                    } else {
                        this.ifshow = true;
                    }
                    // 得到意向并在表格里渲染出来
                    this.tableData.forEach(ele => {
                        // 预约回访时间:follow_up_time
                        switch(ele.follow_up_time) {
                            case null:
                                ele.follow_up_time = '';
                                break;
                            case '0': 
                                ele.follow_up_time = '';
                                break;
                            default:
                                ele.follow_up_time = this.changeday(Number(ele.follow_up_time)*1000);
                        }
                        // 录入时间
                        switch(ele.insert_time) {
                            case null:
                                ele.insert_time = '';
                                break;
                            case '0': 
                                ele.insert_time = '';
                                break;
                            default:
                                ele.insert_time = this.changeday(Number(ele.insert_time)*1000);
                        }
                        // 最近跟进时间:last_time
                        switch(ele.last_time) {
                            case null:
                                ele.last_time = '';
                                break;
                            case '0': 
                                ele.last_time = '';
                                break;
                            default:
                                ele.last_time = this.changeday(Number(ele.last_time)*1000);
                        }
                        // 意向分析
                        switch(ele.intention) {
                            case '1':
                                ele.intention = 'A';
                                break;
                            case '2':
                                ele.intention = 'B';
                                break;
                            case '3':
                                ele.intention = 'C';
                                break;
                            case '4':
                                ele.intention = 'D';
                                break;
                            default: 
                                ele.intention = '待定';
                        }
                        // 门店分析 
                        switch(ele.status) {
                            case '1':
                                ele.status = '有';
                                break;
                            case '2':
                                ele.status = '有意向店面';
                                break;
                            default:
                                ele.status = '无';
                        }
                        // 推广
                        switch(ele.marks) {
                            case '1':
                                ele.marks = '百度';
                                break;
                            case '2':
                                ele.marks = '搜狗';
                                break;
                            case '3':
                                ele.marks = '好搜';
                                break;
                            case '4':
                                ele.marks = '神马';
                                break;
                            case '5':
                                ele.marks = '百度品专';
                                break;
                            case '6':
                                ele.marks = 'seo';
                                break;
                            default:
                                ele.marks = '';
                        }
                        
                    });
                }
            })
        },
        /**
         * 折叠面板变化表格展示top也变化
         */
        getCollapse() {
            this.styleObject.top = '260px';
            if(this.value1.length == 1) {
                this.styleObject.top = '0px';
                var windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight- 280);
            } else {
                this.styleObject.top = '345px';
                let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
                this.tableHeight = (windowHeight- 580);
            }
        },
        /**
         * 渠道管理
         */
        channelNotes() {
            // 跳转到渠道管理页面
            this.$router.push({path: 'channel'})
        },
        /**
         * 得到渠道来源数据
         */
        getSourceList() {
            this.$resetAjax({
                type: 'POST',
                url: '/NewA/Public/getchannel',
                success: (res) => {
                    this.sourceList = JSON.parse(res).data;
                }
            })
        },
        /**
         * 渠道管理全选
         */
        handleCheckAllChannel() {
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;
            if (this.checkAll) {
                this.getCustomerList();
                this.searchParams.sourcemodel =  this.sourceList.map(item => item.cid);
            } else {
                this.searchParams.sourcemodel = [];
            }
        },
        /* 意向全选 */
        handleCheckAllPurpose(){
             if (this.purposIindeterminate) {
                this.purposeCheckAll = false;
            } else {
                this.purposeCheckAll = !this.purposeCheckAll;
            }
            this.purposIindeterminate = false;
            if (this.purposeCheckAll) {
                
                this.searchParams.purposemodel =  this.purposeList.map(item => item.value);
                this.getCustomerList();
            } else {
                this.searchParams.purposemodel = [];
            }
        },
        /**
         * 筛选前获取省份数据
         */
        getProvinces() {
            this.$resetAjax({
                url: '/NewA/Public/getprovinces',
                type: 'POST',
                async: false,
                success: (res) => {
                    this.provinceList = JSON.parse(res).data;
                    this.openProviceList = JSON.parse(res).data;
                }
            })
        },
        /**
         * 筛选时间得到选择的天数
         */
        getrecently(recently) {
            this.searchParams.currentPage = 1;
            this.searchParams.recently = recently;
            if(this.tableShow==true){
                this.getCustomerList();
            }else{
                this.getPubseas();
            }
        },
        /**
         * 单行选择时选择时所属弹窗里招商详情
         */
        getlowerLeaderDetail (data) {
            // 所属招商的id
            this.lowerLeader = data.userid;
        },
        /**
         * 得到多选项
         */
        getChangeSelect(selection) {
            this.selectionData = selection;
        },
        /**
         * 多选修改所属招商
         */
        editLower() {
            if (this.selectionData.length !== 0) {
                this.lowerLeader = this.selectionData[0].userid;
                this.lowerLeaderId = this.selectionData.map(ele => {
                    return ele.id
                });
                this.isAttract = true;
            } else {
                this.$root.tip.isShow = true;
                this.$root.tip.content = '修改招商前,请先勾选您要更改的客户招商!!!';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 2500);
            }
        },
        /* 放入公海池 */
        handlePubsea(){
            if(this.selectionData.length!==0){
                this.$Modal.confirm({
                    content: '是否确定将选择的客户放入公海池？',
                    onOk:()=>{
                        let arr=this.selectionData.map(ele => {
                            return ele.id
                        });
                        this.$resetAjax({
                            url:'/NewA/Customer/pubsea',
                            type:'POST',
                            data:{
                                id:arr
                            },
                            success:(res)=>{
                                if(JSON.parse(res).msg=="success"){
                                    this.getCustomerList();
                                    this.$root.tip.isShow = true;
                                    this.$root.tip.content = '加入成功';
                                    setTimeout(() => {
                                        this.$root.tip.isShow = false;
                                    }, 1500);
                                }
                            }
                        })
                    },
                });
            }else{
                this.$root.tip.isShow = true;
                this.$root.tip.content = '加入公海池前,请先勾选您要加入的客户!!!';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 3000);
            }
        },
        /* 认领操作 */
        handlePubclaim(){
            if(this.selectionData.length!==0){
                this.$Modal.confirm({
                    content: '是否批量认领客户？',
                    onOk:()=>{
                        this.arrId=this.selectionData.map(ele => {
                            return ele.id
                        });
                        this.getPubclaim();
                    }
                });
            }else {
                this.$root.tip.isShow = true;
                this.$root.tip.content = '认领前,请先勾选您要认领的客户!!!';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 3000);
            }
        },
         /* 发送认领请求 */
        getPubclaim(){
            this.$resetAjax({
                url:'/NewA/Customer/pubclaim',
                type:'POST',
                data:{
                    id:this.arrId
                },
                success:(res)=>{
                    if(JSON.parse(res).msg=="success"){
                        this.getPubseas();
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '认领成功';
                        setTimeout(() => {
                            this.$root.tip.isShow = false;
                        }, 1500);
                    }
                }
            })
        },
        /* 显示公海池客户列表 */
        handlePubseas(){
            this.tableShow=false;
            this.searchParams.currentPage;
            this.getPubseas();
            
        },
        /* 获取公海池客户列表 */
        getPubseas(){
            this.$resetAjax({
                type: 'GET',
                url: '/NewA/Customer/getlist',
                data: {
                    // 姓名检索
                    username: this.searchParams.username,
                    // 号码检索
                    phone: this.searchParams.phone,
                    // 渠道备注检索
                    channel_notes: this.searchParams.channel_notes,
                    // 省份检索
                    proid: this.searchParams.provincemodel,
                    // 城市检索
                    city: this.searchParams.citymodel,
                    // 渠道筛选
                    channel: this.searchParams.sourcemodel,
                    // 意向度
                    intention: this.searchParams.purposemodel,
                    // 是否有门店
                    has_shop: this.searchParams.shopmodel,
                    // 客户标志
                    sign: this.searchParams.signModel,
                    // 推广
                    marks:this.searchParams.extendId,
                    // 录入时间
                    insert_time: this.searchParams.selectDate,
                    // 最近跟进时间:
                    last_time: this.searchParams.followdate,
                    // 预约回访时间:
                    follow_up_time : this.searchParams.visitdate,
                    // 第几页
                    p: this.searchParams.currentPage,
                    // 录入时间排序
                    order_ins: this.searchParams.order_ins,
                    // 跟进状态
                    clue: this.searchParams.clue,
                    // 跟进时间排序
                    order_las: this.searchParams.order_las,
                    // 预约回访时间排序
                    order_fol: this.searchParams.order_fol,
                    // 选择天数
                    recently: this.searchParams.recently,
                    // 联系时间
                    contime: this.searchParams.contime,
                    // 下级
                    uid: this.searchParams.lowlevel,
                    // 公海池
                    chi:'1'

                },
                success:(res)=>{
                    this.pubseaData = JSON.parse(res).data;
                    this.total = Number(JSON.parse(res).count);
                     // 得到意向并在表格里渲染出来
                     this.pubseaData.forEach(ele => {
                        // 预约回访时间:follow_up_time
                        switch(ele.follow_up_time) {
                            case null:
                                ele.follow_up_time = '';
                                break;
                            case '0': 
                                ele.follow_up_time = '';
                                break;
                            default:
                                ele.follow_up_time = this.changeday(Number(ele.follow_up_time)*1000);
                        }
                        // 录入时间
                        switch(ele.insert_time) {
                            case null:
                                ele.insert_time = '';
                                break;
                            case '0': 
                                ele.insert_time = '';
                                break;
                            default:
                                ele.insert_time = this.changeday(Number(ele.insert_time)*1000);
                        }
                        // 最近跟进时间:last_time
                        switch(ele.last_time) {
                            case null:
                                ele.last_time = '';
                                break;
                            case '0': 
                                ele.last_time = '';
                                break;
                            default:
                                ele.last_time = this.changeday(Number(ele.last_time)*1000);
                        }
                        // 意向分析
                        switch(ele.intention) {
                            case '1':
                                ele.intention = 'A';
                                break;
                            case '2':
                                ele.intention = 'B';
                                break;
                            case '3':
                                ele.intention = 'C';
                                break;
                            case '4':
                                ele.intention = 'D';
                                break;
                            default: 
                                ele.intention = '待定';
                        }
                        // 门店分析 
                        switch(ele.status) {
                            case '1':
                                ele.status = '有';
                                break;
                            case '2':
                                ele.status = '有意向店面';
                                break;
                            default:
                                ele.status = '无';
                        }
                        // 推广
                        switch(ele.marks) {
                            case '1':
                                ele.marks = '百度';
                                break;
                            case '2':
                                ele.marks = '搜狗';
                                break;
                            case '3':
                                ele.marks = '好搜';
                                break;
                            case '4':
                                ele.marks = '神马';
                                break;
                            case '5':
                                ele.marks = '百度品专';
                                break;
                            case '6':
                                ele.marks = 'seo';
                                break;
                            default:
                                ele.marks = '';
                        }
                    });
                }

            })
        },
        /* 返回所有客户列表 */
        handleAll(){
            this.tableShow=true;
            this.searchParams.currentPage = 1;
            this.getCustomerList();
        },
        /**
         * 多选所属弹窗里选择得到下级
         */
        getlowerLeader(lowerLeader) {
            this.lowerLeader = lowerLeader;
        },
        /**
         * 单选所属弹窗里选择得到下级
         */
        getRowlowerLeader(lowerLeader) {
            this.lowerLeader = lowerLeader;
        },
        /**
         * 单选所属弹窗里选择下级提交请求
         */
        asynRowcOK() {
            let arr = [];
            arr.push(this.rowid);
            this.$resetAjax({
                url: '/NewA/Public/distribution',
                type: 'POST',
                data: {
                    // 客户id   
                    id: arr,
                    // userid:  选中的下级的userid
                    userid: this.lowerLeader,
                },
                success: (res) => {
                    this.isRowAttract = false;
                    this.getCustomerList();
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = '修改成功';
                    setTimeout(() => {
                        this.$root.tip.isShow = false;
                    }, 1000);
                }
            })
        },
        /**
         * 多选所属弹窗里选择下级提交请求
         */
        asyncOK(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$resetAjax({
                        url: '/NewA/Public/distribution',
                        type: 'POST',
                        data: {
                            // 客户id   
                            id: this.lowerLeaderId,
                            // userid:  选中的下级的userid
                            userid: this.formValidate.lowerLeader,

                        },
                        success: (res) => {
                            this.isAttract = false;
                            if(this.tableShow==true){
                                this.getCustomerList();
                            }else{
                                this.getPubseas();
                            }
                            this.lowerLeaderId = [];
                            this.lowerLeader = '';
                            this.$root.tip.isShow = true;
                            this.$root.tip.content = '修改成功';
                            setTimeout(() => {
                                this.$root.tip.isShow = false;
                            }, 1000);
                        }
                    })
                }
            })   
        },
        /**
         * 得到所有下级的数据
         */
        getlowlevelList() {
            this.$resetAjax({
                url: '/NewA/Public/getnext',
                type: 'POST',
                success: (res) => {
                    this.lowlevelList = JSON.parse(res).data;
                }
            })
        },
        /**
         * 得到哪个下级 
         */
        getlowlevel(lowlevel) {
            this.searchParams.currentPage = 1;
            if(lowlevel == "1"){
                this.searchParams.lowlevel= '1';
            } else {
                this.searchParams.lowlevel = lowlevel;
            }
            this.getCustomerList();
        },
        /**
         * 筛选时间得到选择的天数
         */
        getcontime(contime) {
            this.searchParams.currentPage = 1;
            this.searchParams.contime = contime;
            if(this.tableShow==true){
                this.getCustomerList();
            }else{
                this.getPubseas();
            }
        },
        /**
         * 筛选前获取城市数据
         */
        getCitys(provincemodel) {
            this.$resetAjax({
                url: '/NewA/Public/getcity',
                type: 'POST',
                async: false,
                data: {
                    areaId:provincemodel,
                },
                success: (res) => {
                    this.addressData.openCity= JSON.parse(res).data[0].areaid;
                    this.openCityList=this.cityList = JSON.parse(res).data;
                    this.searchParams.citymodel = this.cityList[0].areaId;
                    
                }
            })
        },
        /**
         * 筛选上面的渠道选择来得到客户列表数据，不是表头上的
         */
        getsource(data) {
            this.currentPage = 1;
            if (data.length === this.sourceList.length) {
                    this.indeterminate = false;
                    this.checkAll = true;
                } else if (data.length > 0) {
                    this.indeterminate = true;
                    this.checkAll = false;
                } else {
                    this.indeterminate = false;
                    this.checkAll = false;
                }
                if(this.tableShow==true){
                    this.getCustomerList();
                }else{
                    this.getPubseas();
                }
        },
        /**
         * 选择得到默认意向
         */
         getpurpose(purposemodel) {            
            this.searchParams.currentPage = 1;
            this.searchParams.purposemodel = purposemodel;
            if (purposemodel.length === this.purposeList.length) {
                    this.purposIindeterminate = false;
                    this.purposeCheckAll = true;
                } else if (purposemodel.length > 0) {
                    this.purposIindeterminate = true;
                    this.purposeCheckAll = false;
                } else {
                    this.purposIindeterminate = false;
                    this.purposeCheckAll = false;
                }
                if(this.tableShow==true){
                    this.getCustomerList();
                }else{
                    this.getPubseas();
                }
        },
        /**
         * 搜索请求
         */
        searchQuery() {
            this.searchParams.currentPage = 1;
            this.searchParams.provincemodel = '';
            if(this.tableShow==true){
                this.getCustomerList();
            }else{
                this.getPubseas();
            }
            
        },
        /**
         * 得到客户标志详情
         */
        entrustUpdate(sign) {
            if (sign[0] == '') {
                sign.splice(0,1)
            }
            this.signmodel = sign;
        },
        getSignModel(signModel) {
            
            this.searchParams.currentPage = 1;
            this.searchParams.signModel = signModel.sort();
            if(this.tableShow==true){
                this.getCustomerList();
            }else{
                this.getPubseas();
            }
        },
        // 得到推广
        getExtendModel(extend){
            this.searchParams.extendId=extend;
            this.searchParams.currentPage = 1;
            if(this.tableShow==true){
                this.getCustomerList();
            }else{
                this.getPubseas();
            }
            
        },
        /**
         * 选择得到哪个标志详情
         */
        getsign(signmodel) {
            if (signmodel.length !==0) {
                signmodel = signmodel[signmodel.length - 1]
            }
            this.signmodel = [signmodel];
            this.signHandle();
            
        },
        /**
         * 编辑客户标记
         */
        signHandle() {
            this.$resetAjax({
                type: 'POST',
                url: '/NewA/Public/updatesign',
                data: {
                    id: this.signId,
                    sign: this.signmodel
                },
                success: (res) =>{
                    this.isSign_modal = false;
                    this.getCustomerList();
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = '客户标志编辑成功';
                    setTimeout(() => {
                        this.$root.tip.isShow = false;
                    }, 1000);
                }
            })
        },
        /* 选择的推广 */
        getextend(extend){
            this.extendList.forEach(ele=>{
                if(ele.label==extend){
                    this.extendId=ele.value
                }
            })
        },
        // 清空选择的推广
        clear(){
            this.extendId='';
            this.extendHandle();
        },
        extendHandle(){
            this.$resetAjax({
                url:'/NewA/Public/marks',
                type:'POST',
                data:{
                    id:this.signId,
                    marks:this.extendId
                },
                success:(res)=>{
                    this.extend_modal = false;
                    if(this.tableShow==true){
                        this.getCustomerList();
                    }else{
                        this.getPubseas();
                    }
                    let errorcode=JSON.parse(res).errorcode;
                    switch (errorcode) {
                        case 0:
                            this.$root.tip.isShow = true;
                            this.$root.tip.content = "编辑成功";
                            setTimeout(() => {
                                this.$root.tip.isShow = false;
                            }, 2000);
                            break;
                        case 1:
                            this.$root.tip.isShow = true;
                            this.$root.tip.content = "编辑失败";
                            setTimeout(() => {
                                this.$root.tip.isShow = false;
                            }, 2000);
                            break;
                        case 2:
                            this.$root.tip.isShow = true;
                            this.$root.tip.content = "没有权限";
                            setTimeout(() => {
                                this.$root.tip.isShow = false;
                            }, 2000);
                            break;
                        default:
                            break;
                    }
                }
            })
        },
        /**
         * 改变页码
         */
        changePage(index) {
            this.searchParams.currentPage = index;
            this.getCustomerList();
        },
        /* 公海池客户列表改变页码 */
        pubseaChangePage(index){
            this.searchParams.currentPage = index;
            this.getPubseas();

        },
        /**
         * 选择得到选中省份的id
         */
        getprovince(provincemodel) {
            this.searchParams.provincemodel = provincemodel;
            this.searchParams.currentPage = 1;
           
            if (this.searchParams.purposemodel == '') {
                if(this.tableShow==true){
                    this.getCustomerList();
                }else{
                    this.getPubseas();
                }
            } else {
                this.getCitys(this.searchParams.provincemodel);
                if(this.tableShow==true){
                    this.getCustomerList();
                }else{
                    this.getPubseas();
                }
            }
             this.getCitys(this.searchParams.provincemodel);
        },
        /**
         * 选择得到选中城市的id
         */
        getcity(citymodel) {
            this.searchParams.citymodel = citymodel;
            this.searchParams.currentPage = 1;
            if(this.tableShow==true){
                this.getCustomerList();
            }else{
                this.getPubseas();
            }
        },
        /**
         * 选择得到是否有门店
         */
        getshop(shopmodel) {
            this.searchParams.shopmodel = shopmodel;
            this.searchParams.currentPage = 1;
            if(this.tableShow==true){
                this.getCustomerList();
            }else{
                this.getPubseas();
            }
            
        },
     
        /**
         * 录入时间选择得到时间
         */
        getSelectDate(selectDate, value2) {
            this.searchParams.currentPage = 1;
            this.searchParams.selectDate = selectDate;
            if(this.tableShow==true){
                this.getCustomerList();
            }else{
                this.getPubseas();
            }
        },
         /**
         * 跟进状态选择得到状态
         */
        getClue(clue) {
            this.searchParams.currentPage = 1;
            this.searchParams.clue = clue;
            if(this.tableShow==true){
                this.getCustomerList();
            }else{
                this.getPubseas();
            }
        },
        /**
         * 跟进时间选择得到时间
         */
        getfollowdate(followdate, value2) {
            this.searchParams.currentPage = 1;
            this.searchParams.followdate = followdate;
            if(this.tableShow==true){
                this.getCustomerList();
            }else{
                this.getPubseas();
            }
        },
        /**
         * 预约回访时间选择得到时间
         */
        getvisitdate(visitdate, value2) {
            this.searchParams.currentPage = 1;
            this.searchParams.visitdate = visitdate;
            if(this.tableShow==true){
                this.getCustomerList();
            }else{
                this.getPubseas();
            }
        },
        /**
        *毫秒转成-- 年月日形式
        */ 
        changeday(num) {
            let date = new Date(num);
            let z = date.getFullYear() + '-',
                b = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1)  : date.getMonth() + 1) + '-',
                n = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) ;
            return z+b+n;
        },
        /**
         * 删除客户
         */
        getDeleteCustomer(customerId) {
            this.$resetAjax({
                type: 'POST',
                url: '/NewA/Customer/delete',
                data: {
                    cid: customerId
                },
                success: (res) =>{
                    this.isDelete = false;
                    this.$root.tip.isShow = true;
                    this.$root.tip.content = "删除成功";
                    setTimeout(() => {
                        this.$root.tip.isShow = false;
                        this.getCustomerList();
                    }, 2000);
                }
            })
        },
        /**
         * 导出客户
         */
        loadCustomer() {
            var a = this.searchParams.sourcemodel.join(',');
            var b = this.searchParams.purposemodel.join(',');
            var c = this.searchParams.shopmodel.join(',');
            var d = this.searchParams.signModel.join(',');
            var e = this.searchParams.selectDate.join(',');
            var f = this.searchParams.followdate.join(',');
            var g = this.searchParams.visitdate.join(',');
            var h = this.searchParams.extendId.join(',');
            location.href = `/NewA/Customer/download?username=${this.searchParams.username}&phone=${this.searchParams.phone}&channel_notes=${this.searchParams.channel_notes}&proid=${this.searchParams.provincemodel}&city=${this.searchParams.citymodel}&channel=${a}&intention=${b}&has_shop=${c}&sign=${d}&insert_time=${e}&last_time=${f}&follow_up_time=${g}&marks=${h}&order_ins=${this.searchParams.order_ins}&clue=${this.searchParams.clue}&order_las=${this.searchParams.order_las}&order_fol=${this.searchParams.order_fol}&recently=${this.searchParams.recently}&contime=${this.searchParams.contime}&uid=${this.searchParams.lowlevel}`
        },
        /* 根据招商查找客户 */
        userSearch(userDate){
            this.$refs['userDate'].validate((valid) => {
                if (valid) {
                    this.$resetAjax({
                        url:'/NewA/Public/crmuser',
                        type:'GET',
                        data:{
                            userid:this.userDate.userid
                        },
                        success:(res)=>{
                            switch (JSON.parse(res).errorcode) {
                                case 100:
                                    let routeData = this.$router.resolve({ name: 'crmuserlist',query: {isShow:1,userid:this.userDate.userid,user:JSON.parse(res).user}});
                                    window.open(routeData.href, '_blank');
                                    break;
                                case 200:
                                    this.$Modal.warning({
                                        title:'提示',
                                        content: '该招商暂无客户数据'
                                    });
                                    break;
                                case 300:
                                    let data = this.$router.resolve({ name: 'crmuserlist',query: {isShow:1,userid:this.userDate.userid,user:JSON.parse(res).user}});
                                    
                                    window.open(data.href, '_blank');
                                    break;
                                case 400:
                                    this.$Modal.warning({
                                        title:'提示',
                                        content: '招商id输入错误，或该招商不存在！'
                                    });
                                    break;
                            }
                        }
                    })
                }
            })
        },       
        searchVisit(){
            this.tableShow=true;
            this.$resetAjax({
                type: 'GET',
                url: '/NewA/Customer/getlist',
                data: {
                    // 姓名检索
                    username: this.searchParams.username,
                    // 号码检索
                    phone: this.searchParams.phone,
                    // 渠道备注检索
                    channel_notes: this.searchParams.channel_notes,
                    // 省份检索
                    proid: this.searchParams.provincemodel,
                    // 城市检索
                    city: this.searchParams.citymodel,
                    // 渠道筛选
                    channel: this.searchParams.sourcemodel,
                    // 意向度
                    intention: this.searchParams.purposemodel,
                    // 是否有门店
                    has_shop: this.searchParams.shopmodel,
                    // 客户标志
                    sign: this.searchParams.signModel,
                    // 推广
                    marks:this.searchParams.extendId,
                    // 录入时间
                    insert_time: this.searchParams.selectDate,
                    // 最近跟进时间:
                    last_time: this.searchParams.followdate,
                    // 预约回访时间:
                    follow_up_time : this.searchParams.visitdate,
                    // 第几页
                    p: this.searchParams.currentPage,
                    // 录入时间排序
                    order_ins: this.searchParams.order_ins,
                    // 跟进状态
                    clue: this.searchParams.clue,
                    // 跟进时间排序
                    order_las: this.searchParams.order_las,
                    // 预约回访时间排序
                    order_fol: this.searchParams.order_fol,
                    // 选择天数
                    recently: this.searchParams.recently,
                    // 联系时间
                    contime: this.searchParams.contime,
                    // 下级
                    uid: this.searchParams.lowlevel,
                    // 已来访
                    visit:'1'

                },
                success: (res) => {
                    this.tableData = JSON.parse(res).data;
                    this.total = Number(JSON.parse(res).count);
                    if(JSON.parse(res).show===1){
                        this.showList=true
                    }else{
                        this.showList=false
                    }
                    // 渠道管理权限设置
                    if (JSON.parse(res).ifshow == 2) {
                        this.ifshow = false;
                    } else {
                        this.ifshow = true;
                    }
                    // 得到意向并在表格里渲染出来
                    this.tableData.forEach(ele => {
                        // 预约回访时间:follow_up_time
                        switch(ele.follow_up_time) {
                            case null:
                                ele.follow_up_time = '';
                                break;
                            case '0': 
                                ele.follow_up_time = '';
                                break;
                            default:
                                ele.follow_up_time = this.changeday(Number(ele.follow_up_time)*1000);
                        }
                        // 录入时间
                        switch(ele.insert_time) {
                            case null:
                                ele.insert_time = '';
                                break;
                            case '0': 
                                ele.insert_time = '';
                                break;
                            default:
                                ele.insert_time = this.changeday(Number(ele.insert_time)*1000);
                        }
                        // 最近跟进时间:last_time
                        switch(ele.last_time) {
                            case null:
                                ele.last_time = '';
                                break;
                            case '0': 
                                ele.last_time = '';
                                break;
                            default:
                                ele.last_time = this.changeday(Number(ele.last_time)*1000);
                        }
                        // 意向分析
                        switch(ele.intention) {
                            case '1':
                                ele.intention = 'A';
                                break;
                            case '2':
                                ele.intention = 'B';
                                break;
                            case '3':
                                ele.intention = 'C';
                                break;
                            case '4':
                                ele.intention = 'D';
                                break;
                            default: 
                                ele.intention = '待定';
                        }
                        // 门店分析 
                        switch(ele.status) {
                            case '1':
                                ele.status = '有';
                                break;
                            case '2':
                                ele.status = '有意向店面';
                                break;
                            default:
                                ele.status = '无';
                        }
                        // 推广
                        switch(ele.marks) {
                            case '1':
                                ele.marks = '百度';
                                break;
                            case '2':
                                ele.marks = '搜狗';
                                break;
                            case '3':
                                ele.marks = '好搜';
                                break;
                            case '4':
                                ele.marks = '神马';
                                break;
                            case '5':
                                ele.marks = '百度品专';
                                break;
                            case '6':
                                ele.marks = 'seo';
                                break;
                            default:
                                ele.marks = '';
                        }
                    });
                    
                }
            })
        },
        /**
         * 编辑意向度时选择到哪个意向度
         */
         getIntention(data) {
            this.formValidateIntention.modelIntention = data;
           
        },
        /**
         * 提交修改意向度请求
         */
         editIntentionQuery(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$resetAjax({
                        type: 'POST',
                        url: '/NewA/Customer/update_intention',
                        data: {
                            id: this.rowid,
                            intention: this.formValidate.modelIntention
                        },
                        success: (res) =>{
                            this.intentionModal = false;
                            this.$Message.success('修改成功！');
                            this.getCustomerList();
                        }
                    })
                }
            })
            
        },
        // 批量修改客户意向度
        handleIntention(){
            if(this.selectionData.length!==0){
                this.$Modal.confirm({
                    content: '是否批量修改客户意向度？',
                    onOk:()=>{
                        this.titleName='批量修改客户意向度'
                        this.intentionModal=true;
                        this.rowid=this.selectionData.map(ele => {
                            return ele.id
                        });
                    }
                });
            }else {
                this.$root.tip.isShow = true;
                this.$root.tip.content = '修改前,请先勾选您要修改的客户!!!';
                setTimeout(() => {
                    this.$root.tip.isShow = false;
                }, 3000);
            }
        },
    }
}
</script>


