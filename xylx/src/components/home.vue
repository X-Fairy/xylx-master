<template>
    <div class="app-container">
        <!-- 头部 -->
        <Header v-on:style="open"></Header><!--修改-->
        <!-- 左边菜单 -->
        <NavBar />
        <!-- 右边内容 -->
        <div class="main-content" :class="isShow?'':'active'">
            <router-view />
        </div>
        <!-- 提示 -->
        <tip v-if="$root.tip.isShow" :tipContent="$root.tip.content"></tip>
       
    </div>
</template>

<script>
import NavBar from './nav_bar.vue'
import Header from './header.vue'
import tip from './tip.vue'

export default {
    data(){
        return {
           isShow:true/*修改*/
        }
    },
    components: {
        Header,
        NavBar,
        tip,
       
    },
    methods:{
        open:function(data){
            // console.log(data);
            this.isShow=data;
        }
    }
}
</script>

<style lang="less" scoped>
.app-container{
    width: 100%;
    height: 100%;
    margin: 0 auto;
    position: relative;
    // overflow: hidden;
    .main-content{
        margin-left: 200px;
        transition:margin-left 0.5s linear;
        height: 92%;
        top:60px;
        position:absolute;
        width:89.5%;
    }
    .active{
        margin-left:50px;
        transition: margin-left 0.5s linear;
        width:97.2%;
        border-left: 1px solid #dddddd;
    }
}
</style>



