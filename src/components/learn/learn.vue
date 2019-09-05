<template>
    <div class="learn">
        <Button @click="show = !show">Toggle</Button>
        <transition name="fade">
            <p v-if="show">hello</p>
        </transition>
    </div>
</template>


<script>
export default {
    data() {
        return {
            show: true,
        }
    }
}
</script>
