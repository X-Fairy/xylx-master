<template>
    <div class="channel">
        <div class="channel_top">
            <span class="name">渠道管理&gt;&gt;</span> 
            <h4>
                <Button type="primary" @click="addChannel" class="add_channel">新增渠道</Button>
                <Button type="warning" @click="$router.push({path:'customer'})" class="go_back">返回客户列表</Button>
            </h4>
        </div>
        <div class="channel_contanier">
            <ul>
                <li v-for="item in sourceList" :key="item.cid" :value="item.cid">
                    <p class="name">渠道名称：</p>  
                    <div class="handle">
                        <p class="content_name">{{item.channels}}</p>
                        <div class="gomore" v-show="item.isShowMore == isShow">
                            <Button size="small" @click="editChannel(item)">编辑</Button>
                            <Button type="error" size="small" style="margin-left:10px;" @click="deleteChannel(item)">删除</Button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <!-- 渠道操作窗口 -->
        <div class="channel_modal" v-if="isChannel_modal">
            <div class="channel_content">
                <h3><p>{{title}}</p> <Icon type="close-circled" @click="isChannel_modal=false" class="close_icon" title="关闭弹窗"></Icon></h3>
                <ul>
                    <li>
                       <p>渠道名称：</p> <Input v-model="channels_name" placeholder="Enter something..." />
                    </li>
                </ul>
                <div class="channel_bottom">
                    <Button style="margin-right:5px;" @click="isChannel_modal=false">取消</Button>
                    <Button type="info" @click="channelHandle">确定</Button>
                </div>
            </div>
        </div>
        <!-- 提示框 -->
        <tip v-show="istip" :tipContent="tip"></tip>
         <!-- 提示是否删除 -->
        <div class="outside" v-if="isDelete">
            <div class="delete">
                <p>确认删除</p>
                <div class="build">
                    <button type="close" @click="isDelete=false">取消</button>
                    <button type="checkmark"  @click="getDelete(channel_id)">确定</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import tip from '../tip.vue'

export default {
    components: {
        tip,
    },
    data() {
        return {
            // 渠道数据列表
            sourceList: [],
            // 是否显示渠道窗口
            isChannel_modal: false,
            // 渠道窗口标题
            title: '新增渠道',
            // 渠道名称
            channels_name: '',
            // 是否显示提示框
            istip: false,
            // 提示框文本
            tip: '',
            // 该条渠道的Id
            channel_id: 0,
            // 是否显示删除提示框
            isDelete: false,
            // 显示渠道编辑删除操作
            isShow: '1'
        }
    },
    created() {
        // 得到渠道列表
        this.getSourceList();
    },

    methods: {
        /**
         * 得到渠道列表
         */
        getSourceList() {
            this.$resetAjax({
                type: 'POST',
                url: '/NewA/Public/getchannel',
                success: (res) => {
                    this.sourceList = JSON.parse(res).data;
                    this.sourceList.forEach(ele => {
                        if (ele.channels == '未知') {
                            ele.isShowMore = '2';
                        } else {
                            ele.isShowMore = '1'
                        }
                    });
                    console.log(this.sourceList)
                }
            })
        },
        /**
         * 新增渠道准备工作
         */
        addChannel() {
            this.channels_name = '';
            this.isChannel_modal = true;
            this.title = '新增渠道';
        },
        /**
         * 编辑渠道准备工作
         */
        editChannel(item) {
            this.isChannel_modal = true;
            this.title = '编辑渠道';
            this.channel_id = item.cid;
            this.channels_name = item.channels;
        },
        /**
         * 删除渠道准备工作
         */
        deleteChannel(item) {
            this.isDelete = true;
            this.channel_id = item.cid;
        },
        /**
         * 删除渠道请求
         */
        getDelete() {
            this.$resetAjax({
                type: 'POST',
                url: '/NewA/Customer/channeldel',
                data: {
                    id: this.channel_id,
                },
                success: (res) =>{
                    this.isDelete = false;
                    this.istip = true;
                    this.tip = '删除成功';
                    setTimeout(() => {
                        this.istip = false;
                        this.getSourceList();
                    }, 1500);
                }
            })
        },
        /**
         * 新增渠道请求
         */
        channelHandle() {
            if (this.title == '新增渠道') {
                this.$resetAjax({
                    type: 'POST',
                    url: '/NewA/Customer/channeladd',
                    data: {
                        channels : this.channels_name
                    },
                    success: (res) =>{
                        this.isChannel_modal = false;
                        this.istip = true;
                        this.tip = '新增成功';
                        setTimeout(() => {
                            this.istip = false;
                            this.getSourceList();
                        }, 1500);
                    }
                })
            } else{
                this.$resetAjax({
                    type: 'POST',
                    url: '/NewA/Customer/channeledit',
                    data: {
                        channels : this.channels_name,
                        cid: this.channel_id,
                    },
                    success: (res) =>{
                        this.isChannel_modal = false;
                        this.istip = true;
                        this.tip = '编辑成功';
                        setTimeout(() => {
                            this.istip = false;
                            this.getSourceList();
                        }, 1500);
                        this.channels_name = '';
                    }
                })
            }
        }
    }
}
</script>
