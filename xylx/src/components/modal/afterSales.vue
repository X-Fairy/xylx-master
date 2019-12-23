<template>
    <!-- 查看图片轮播图 -->
    <div class="carouselcontent" v-if="carouse">
        <Icon type="ios-close-outline" class="close_icon" title="关闭弹窗" @click="carouse=false;"></Icon>
        <Carousel v-model="value1">
            <CarouselItem v-for="(item,index) in imageData" :key="index">
                <div class="demo-carousel"><img :src="item.imgUrl" alt="">123</div>
                <div class="bottom">
                    <p>名称:<span>{{goodName}}</span></p>
                    <Button @click="carouse=false;">确定</Button>
                </div>
            </CarouselItem>
        </Carousel>
    </div>
</template>
