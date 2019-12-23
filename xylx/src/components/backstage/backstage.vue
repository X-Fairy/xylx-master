<template>
    <div class="backstagePage">
        <div class="contanier">
            <div class="search">
                <Input v-model="keyword" placeholder="请输入要搜索的内容..." @on-enter="searchStaff" style="border-right: 0;"/>
                <Button slot="append" icon="ios-search" @click="searchStaff" style="margin-left: -3px;"></Button>
            </div>
                <!-- 客户列表区 -->
            <div class="staff">
                <div class="getdetail">
                    <!-- zTree树 -->
                    <Tree :data="zTree" @on-select-change="getdetail"></Tree>
                </div>
                <div class="table">
                    <Table border :height="tableHeight"  :columns="columns" :data="tableData"></Table>
                </div>
            </div>
                <div class="footer" >
                    <!-- 分页 -->
                    <Page :total="total" :page-size="pageSize" @on-change="changePage" :current="currentPage" show-elevator show-total></Page>
                </div>
        </div>
        <!-- 编辑框 -->
        <div v-if="isShow" class="pop">
            <div class="inner">
                <h3>姓名: <span>{{staffForm.staffName}}</span></h3>
                <Form class="staff-form" ref="staff" :model="staffForm" :label-width="90">
                    <!-- 职位 -->
                    <FormItem label="职位">
                        <Input v-model="staffForm.currentPosition" placeholder="请输入职位名称" />
                        <!-- <Select v-model="currentPosition" filterable >
                            <Option value="''" key="''">不选</Option>
                            <Option v-for="item in positionList" :value="item.position" :key="item.id">{{item.position}}</Option>
                        </Select>  -->
                    </FormItem>
                    <!-- 子部门（组） -->
                    <FormItem label="子部门(组)">
                        <Input v-model="staffForm.subDep" placeholder="请输入子部门" />
                    </FormItem>
                    <!-- 海鼎编码 -->
                    <FormItem label="海鼎编码">
                        <Input v-model="staffForm.hdId" placeholder="请输入海鼎编码" />
                    </FormItem>
                    <!-- 上级 -->
                    <FormItem label="上级">
                        <Select v-model="leader" filterable class="manage_leader">
                            <Option value="''" key="''">不选</Option>
                            <Option v-for="option in options1" :value="option.userid" :key="option.userid">{{option.user_name}}</Option>
                        </Select> 
                    </FormItem>
                    <!-- 地区 -->
                    <FormItem label="管理地区">
                         <Select v-model="staffForm.address" multiple filterable class="manage_area" @on-change="getAddress(staffForm.address)">
                            <Option value="" key="">不选</Option>
                            <Option v-for="option in addressList" :value="option.CODE" :key="option.CODE">{{option.NAME}}</Option>
                        </Select> 
                    </FormItem>
                </Form>
                <div class="bottom">
                    <Button class="cancel" @click="isShow=false">取消</Button>
                     <Button type="error" @click="editQuery">确认</Button>
                </div>
            </div>
        </div>
        <!-- 职位权限管理框 -->
        <JobModal v-if="isShowGrowp" :checkData="growForm" :depname="depname" :grow_title="grow_title" :grow_content="grow_content" @close="isShowGrowp=false" @growquery="growquery" />
        <!-- 加载进度 -->
        <div class="demo-spin-col" v-if="spinShow">
            <Spin fix>
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div style="font-size:16px;color:#1d8c9f;">数据正在加载中,请稍等...</div>
            </Spin>
        </div>
    </div>
</template>


<script>
import tipModal from '../tip.vue'
import JobModal from '@/components/modal/backstage-job';
import { posix } from 'path';
export default {
    components: {
        // 引入提示框组件
        tipModal,
        // 引入权限管理弹框组件
        JobModal
    }, 

    data() {
        return {
            growPowerData: [],
            // 表格高度
            tableHeight: 700,
            // 是否显示加载进度条
            spinShow: true,
            // 是否支持搜索
            filterable: true,
            // 得到上级的名称
            leader: '',
            // 得到上级的id
            userid: '',
            // 是否显示回访页面
            visitpage: false,
            backstage: false,
            applytable: false,
            // 更新数据是否出现 
            isRenew: false,
            // 是否显示权限管理框
            isShowGrowp: false,
            // 查看是部门权限还是职位权限的名称
            grow_title: '',
            // 职位权限管理框数据
            growForm: [],
            // 是否弹出删除提示框
            isDelete: false,
            // 当前选中哪个li
            currentIndex: 5,
            // 查询员工
            keyword: '',
            // 用户名
            userName: '',
            // 用户头像
            userHeader: '',
            // 部门列表
            depTypeList: [],
            // 员工数据
            tableData: [],
            // 页面总娄
            total: 0,
            // 每页条数
            pageSize: 13,
            // 表格高度
            tableHeight: 900,
            // 当前页码
            currentPage: 1,
            // 是否显示编辑框
            isShow: false,
            // 编辑框里的内容
            staffForm: {
                // 员工当前职位
                currentPosition: '',
                // 员工姓名
                staffName: '',
                // 子部门
                subDep: '',
                // 地区
                address: [],
                // 海鼎编码
                hdId: '',
            },
            // 所有职位数据
            positionList: [],
            // 管理地区的数据
            addressList: [],
            // 员工id
            staffId: [],
            // zTree
            zTree: [
                {
                    title: '',
                    expand: true,
                    children: [
                        {
                            title: '',
                            expand: true,
                        },
                    ]
                }
            ],
            // 权限框内容
            grow_content: '',
            // 姓名
            depname: '',
            // 上级数据
            options1: [],
            // 表头内容
            columns: [
                {
                    title: '姓名',
                    key: 'user_name'
                },
                {
                    title: '部门',
                    key: 'department',
                    width: 220,
                    render: (h, params) => {
                        return h('div', 
                            {
                                class: 'edit',
                                 style: {
                                    cursor: 'pointer'
                                },
                                domProps: {
                                    title: '点击编辑部门权限'
                                },
                                 on: {
                                    click: () => {
                                        // 得到部门权限数据
                                        this.getDEpartMentPower(params.row)
                                    }
                                }
                            },[
                            h('span', {
                                style: {
                                    color: '#495060',
                                    fontSize: '12px'
                                },
                               
                            },params.row.department)
                        ])
                    }
                },
                {
                    title: '本周日报提交次数',
                    key: 'reportnum',
                    render: (h, params) => {
                        return h('div', 
                            {
                                class: 'edit',
                                style: {
                                    cursor: 'pointer'
                                },
                                domProps: {
                                    title: '点击查看日报详情'
                                },
                                on: {
                                    click: () => {
                                        // 查看日报
                                        this.$router.push({path: 'daily', query: {user_id: params.row.userid, user_name: params.row.user_name}})
                                    }
                                }
                            },
                            [h('span', {
                                style: {
                                    color: '#495060',
                                    fontSize: '12px'
                                },
                                
                            }, params.row.reportnum),
                        ])
                    }
                },
                {
                    title: '子部门组',
                    key: 'sub_dep'
                },
                {
                    title: '上级',
                    key: 'fname'
                },
                {
                    title: '职位',
                    key: 'position',
                    render: (h, params) => {
                        let text = params.row.position;
                        switch(text) {
                            case "''":
                                text = '';
                                break;
                            default: 
                                text = params.row.position;
                        }
                        return h('div', 
                            {
                                class: 'edit',
                                domProps: {
                                    title: '点击编辑职位权限'
                                },
                                style: {
                                    cursor: 'pointer'
                                },
                                 on: {
                                    click: () => {
                                        this.getPositionPower(params.row)
                                    }
                                }
                            } ,
                            [h('span', {
                                style: {
                                    color: '#495060',
                                    fontSize: '12px'
                                },
                               
                            }, text),
                        ])
                    }
                },
                {
                    title: '管理地区',
                    key: 'area',
                    render: (h, {row}) => {
                        // 后台返回的地区数据字符串切割成数组
                        let areaArr = (row.area || '').split(','),
                            areaStrArr = [];
                        this.addressList.forEach(item => {
                            // 如果后台返回的数组里的成员包含有地区的id,就把这个地区的名称push到areaStrArr这个数组里
                            areaArr.includes(item.CODE) && areaStrArr.push(item.NAME);
                        });
                        // 数组拼接成字符串
                        let areaStr = areaStrArr.join(',');
                        // 然后把这个地区名称的渲染成列表里
                        return h('div', areaStr);
                    }
                },
                {
                    title: '海鼎编码',
                    key: 'hdcode'
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    render: (h, params) => {
                        return h('div',{
                                domProps: {
                                    title: '编辑'
                                },
                                class: 'edit',
                                style: {
                                    cursor: 'pointer'
                                },
                                on: {
                                    click: () => {
                                        // 得到员工详情
                                        // 获取上级列表
                                        this.getuserlist();
                                        this.isShow = true;
                                        this.getStaffDetail(params.row);
                                    }
                                }
                            } ,
                            [
                            h('Icon', {
                                props: {
                                    type: 'edit',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '10px',
                                    cursor: 'pointer',
                                    fontSize:'16px',
                                    cursor: 'pointer',
                                    padding:'5px'
                                },
                                domProps:{
                                    title:'编辑'
                                },
                                
                            }, '编辑'),
                        ]);
                    }
                }
            ],
        }
    },

    // 在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
    mounted() {
        setTimeout(()=> {
            // 得到浏览器内容高度
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight- 278);
        },100)
        // 调整浏览器的时候
        $(window).on('resize', () => {
            let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
            this.tableHeight = (windowHeight - 278);
        })
    },
    
    created() {
        // 更新部门
        this.get_department();
        // 获得地区列表
        this.getaddressList();
        // 获取部门列表
        this.getDepartList();
        // 获取员工列表
        this.getStaffList();
        // 获取职位列表
        this.getPositionData();
        
    },

    methods: {
        /**
         *  更新部门
         */
        get_department() {
            this.$resetAjax({
                type: 'POST',
                url: '/NewA/users/get_department',
                success:(res) => {}
            })
        },
        /**
         *  获取部门列表
         */
        getDepartList() {
            this.$resetAjax({
                type: 'POST',
                url: '/NewA/Public/getdeptlist',
                success:(res) => {
                    this.zTree = this.dgZtree([JSON.parse(res).data]);
                }
            })
        },
        /**
         *  得到地区数据
         */
        getaddressList() {
            this.$resetAjax({
                type: 'POST',
                url: '/NewA/Public/getpv',
                success:(res) => {
                    this.addressList = JSON.parse(res).data;
                }
            })
        },
        /**
         * 转化ztree数据；数据递归处理
         * @param {Array} data 需要转换的数据
         */
        dgZtree(data) {
            data.forEach(item => {
                // title转化
                item.title = item.dept_name;
                // 当前节点是否要展开
                item.expand = false;
                // 是否选中当前节点
                item.selected = false;
                // 如果当前节点有子节点，再次把子节点进行递归处理；数据判断，子节点数据是数组，防止报错
                if (item.children instanceof Array && item.children.length) {
                    this.dgZtree(item.children);
                }
            })
            return data;
        },
        /**
         *  获取职位列表数据
         */
        getPositionData() {
            this.$resetAjax({
                type: 'GET',
                url: '/NewA/Users/get_zhiwei',
                success:(res) => {
                    this.positionList = JSON.parse(res).data;
                }
            })
        },
        /**
         *  获取员工列表
         */
        getStaffList() {
            let data = {
                p: this.currentPage,
                did: this.dep,
                keyword: this.keyword
            };
            this.$resetAjax({
                type: 'GET',
                url: '/NewA/Users/index',
                data,
                success: (res) => {
                    this.spinShow = false;
                    this.tableData = JSON.parse(res).data.list;
                    this.total = Number(JSON.parse(res).data.count);
                }
            })
        },
        /**
         *  搜索员工
         */
        searchStaff() {
            this.currentPage = 1;
            this.spinShow = true;
            this.getStaffList();
        },
        /**
         *  得到员工部分详情
         */
        getStaffDetail(res) {
            
            this.staffForm.currentPosition = res.position;
            console.log(this.currentPosition)
            this.staffId = res.userid;
            this.staffForm.subDep = res.sub_dep;
            this.staffForm.staffName = res.user_name;
            this.staffForm.address = (res.area || '').split(",");
            this.staffForm.hdId = res.hdcode;
            // 因为关闭了弹窗，所以要重置数据 
            this.leader = ''; 
            this.options1.forEach(ele => {
                if (res.fid == ele.userid) {
                    this.leader = ele.userid;
                } 
            });
        },
        /**
         *  选择地区得到地区的id组成的数组
         */
        getAddress(address){
            // 查看是否有不选地区的选项
            let  unselect = this.staffForm.address.includes('');
            // 说明有不选，this.staffForm.address 为[''];
            if ( unselect) {
                this.staffForm.address = [''];
            } else {
                // 如果没有不选，选项的数据为地区的id
                this.staffForm.address = address;
            }
        },
        /**
         *  切换页面
         */
        changePage(index) {
            this.spinShow = true;
            this.currentPage = index;
            this.getStaffList();
        },
        /**
         * 对员工职业，管理地区，海鼎编辑等进行编辑请求
         */
        editQuery() {
            this.$resetAjax({
                type: 'POST',
                url:'/NewA/Users/update',
                data: {
                    id: this.staffId,
                    data: {
                        "sub_dep": this.staffForm.subDep,
                        "area": this.staffForm.address,
                        'hdcode': this.staffForm.hdId,
                        'fid': this.leader,
                    },
                    position: this.staffForm.currentPosition,   // 职位
                },
                success:(res) => {
                    if (JSON.parse(res).errorcode == '0') {
                        this.isShow = false;
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '修改成功';
                    } else if (JSON.parse(res).errorcode == '2'){
                        this.isShow = false;
                        this.$root.tip.isShow = true;
                        this.$root.tip.content = '修改失败,因为该人员已是您的下级';
                    }
                    setTimeout(() => {
                        this.$root.tip.isShow = false;
                    }, 2000);
                    this.getStaffList();
                    this.leader = '';
                }
            })
        },
        /**
         *  获取员工节点的数据
         */
        getdetail(data) {
            this.dep = data[0].dept_id;
            this.currentPage = 1;
            this.getStaffList( this.currentPage,this.dep,this.keyword);
            this.spinShow = true;
        },
        /**
         * 得到职位权限
         */
        getPositionPower(row) {
            // 得到职位
            this.grow_content = row.position;
            // 得到员工姓名
            this.depname = row.user_name;
            this.grow_title = '职位';
            // 如果
            if (this.grow_content.length !== 0) {
                this.$resetAjax({
                    url: '/NewA/Users/get_gnid',
                    type: 'POST',
                    data: {
                        // 当前这个员工的职位
                        position: this.grow_content,
                    },
                    success: (res) => {
                        this.transformData(res);
                    }
                })
            }
        },
        /**
         *  得到部门权限数据
         */
        getDEpartMentPower(data) {
            this.depname = data.user_name;
            this.grow_title = '部门';
            this.grow_content = data.department;
            this.$resetAjax({
                url: '/NewA/Users/get_gnid_de',
                type: 'POST',
                data: {
                    dept_name: data.department
                },
                success: (res) => {
                    this.transformData(res);
                }
            })
        },
        /*
         *  转换数据
         */
        transformData(res) {
            let result = JSON.parse(res); // {Index: {…}, Caiwu: {…}, Xingzheng: {…}, Tongji: {…}, Chenlie: {…}, …}
            this.growPowerData = result;
            // 把从后台得到的数据转换成数组arrs
            let  arrs = []; // [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
            let  _checks = {};
            for (let i in result) {
                let checkItem = result[i].child.filter(item => item.checked === 1);
                arrs.push({
                    // 标题
                    title: i,
                    // 勾选内容的数据
                    child: result[i].child,
                    checkGrowForm: checkItem.map(item => item.id),
                    indeterminate: (checkItem.length > 0 && checkItem.length !== result[i].child.length)
                });
            };
            // 职位权限管理数据
            this.growForm = arrs;
            // 让编辑权限的弹窗显示
            this.isShowGrowp = true;
        },
        /*
         *  对权限管理编辑请求
         */
        growquery() {
            this.getStaffList();
        },
        /*
        *  得到所有上级的数据
        */ 
        getuserlist() {
            this.$resetAjax({
                url: '/NewA/Public/getuserlist',
                type: 'POST',
                async: false,
                success: (res) => {
                    this.options1 = JSON.parse(res);
                }
            })
        },
       
    }


}






</script>
