<style scoped>
    .expand-row{
        margin-bottom: 16px;
    }
</style>
<template>
    <div title="124564154">
        <Row class="expand-row">
            <i-Col span="8">
                <p class="expand-key">编码</p>
                <p class="expand-value">{{ row.CODE }}</p>
            </i-Col>
            <i-Col span="8">
                <p class="expand-key">店名</p>
                <p class="expand-value">{{ row.NAME }}</p>
            </i-Col>
            <i-Col span="8">
                <p class="expand-key">金额</p>
                <p class="expand-value">{{ row.TOTAL }}</p>
            </i-Col>
        </Row>
        <Row>
            <i-Col span="8">
                <p class="expand-key">是否赠送</p>
                <p class="expand-value">{{ row.ISGIFT }}</p>
            </i-Col>
            <i-Col span="8">
                <p class="expand-key">合作物流</p>
                <p class="expand-value">{{ row.logistics }}</p>
            </i-Col>
            <i-Col span="8">
                <p class="expand-key">时间</p>
                <p class="expand-value" style="padding-left: 26px;">{{ row.TIME12 }}</p>
            </i-Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>