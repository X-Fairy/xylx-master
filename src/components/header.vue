<template>
    <div class="header-container">
        <!-- logo -->
        <div class="header_left">
            <img src="@/assets/images/logo.jpg" alt="" class="logo">
            <Icon type="navicon" @click="close" class="close" title="关闭导航栏"></Icon>
        </div>
        <!-- 功能 -->
        <ul>
            <li @click="getAdministration" :class="{selected:currentLi == 1}">常用功能</li>
            <li @click="getTotalTable" :class="{selected:currentLi == 2}">统计报表</li>
            <li @click="goOld" :class="{selected:currentLi == 3}">OA系统</li>
        </ul>
        <!-- 信息 -->
        <div class="header_right">
            <a>
                <Icon type="ios-bell-outline" class="icon"></Icon>
            </a>
            <img :src="$root.userData.iconUrl" alt="">
            <p>您好！<span>{{$root.userData.name}}</span></p>
            <a class="sign-out" href="http://oa.xmvogue.com/index.php/NewA/Index/logout">退出登录</a>
        </div>
    </div>
</template>

<script>
import bus from '@/assets/js/eventBus.js'

export default {
    props: ["message", 'mes'],
    data(){
        return {
            // 当前点击是哪个li
            currentLi:1,
            // 是否显示一部份导航栏
            isShow: true,
            // 是否显示管理系统
            isAdministration: true,
        }
    },
   
    methods:{
        /**
         * 是否关闭一部份导航栏
        */  
        close(){
            this.isShow = !this.isShow;
            bus.$emit("userDefinedEvent", this.isShow);
            this.$emit("style", this.isShow);
            // console.log(this.width);
        },
         /**
         * 跳转到之前的OA系统
        */ 
        goOld() {
            this.currentLi = 3;
            window.open('http://oa.xmvogue.com/index.php/Home/Index/main');
        },
        /**
         * 显示
        */ 
        getAdministration() {
            this.currentLi = 1;
            this.isAdministration = true;
            if(this.currentLi==2){
                this.isAdministration=false;
            }
            // console.log(this.isAdministration)
            bus.$emit("customEvent", this.isAdministration);
        },
        getTotalTable() {
            this.currentLi = 2;
            this.isAdministration = false;
            // console.log(this.isAdministration); 
            bus.$emit("customEvent",this.isAdministration);
        },
    },
}
</script>

<style lang="less" scoped>
.header-container{
    z-index: 100;
    height:60px;
    background-color:#1d8c9f;
    -webkit-box-shadow: 0 0 35px 0 rgba(154,161,171,.15);
    box-shadow: 0 0 35px 0 rgba(154,161,171,.15);
    padding: 0 40px;
    position: fixed;
    width: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    
    .header_left{
        display: flex;
        justify-content: flex-start;
        .close{
            font-size: 44px;
            color:#fff;
            margin: 0 70px 0 20px;
            cursor: pointer;
        }
        img.logo{
            height: 40px;
            width: 40px;
        }
    }
    ul{
        display: flex;
        justify-content: flex-start;
        font-size: 14px;
        color: #fff;
        height: 58px;
        align-items: center;
        li{
            cursor: pointer;
            width: 100px;
            padding: 5px;
            text-align: center;
            border-left: 1px solid #cccc;
            margin-right: 30px;
            &:hover,&.selected{
                color:#1d8c9f;
                background-color: #fff;
            }
        }
    }
    .header_right{
        position: absolute;
        right: 50px;
        bottom: 15px;
        height: 60px;
        color: #fff;
        text-align: center;
        .icon{
           font-size: 22px;
           vertical-align:middle;
        }
        img{
            position: relative;
            top: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }
        .badge {
            color: #fff;
            padding: .25em .4em;
            font-size: 75%;
            font-weight: 700;
            text-align: center;
            white-space: nowrap;
            vertical-align: baseline;
            position: relative;
            top:-10px;
            left:-10px;
        }
        .rounded-circle {
            border-radius: 50%!important;
        }

        .badge-danger {
            background-color: white;
            color: #1d8c9f;
        }
        p,a{
            display:inline-block;
            color:white;
            width: 100px;
            border-right:1px solid rgba(250, 249, 249, 0.3);
            font: 13px tahoma,arial,宋体;
        }
    }
    
}
</style>

