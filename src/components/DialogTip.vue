<template>
    <van-dialog v-model="show" class="dialog-box" @confirm="$emit('closeTip')">
        <div
            class="dialog-bg"
            :style="{
                backgroundImage: `url(${content.icon})`,
            }"
        ></div>
        <div class="dialog-tips">温馨提示</div>
        <div>{{ content.tip }}</div>
    </van-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue-demi";
import { Dialog } from "vant";
interface Props {
    content: {
        tip: string;
        icon: string;
    };
}
const show = ref(true);
const { content } = defineProps<Props>();
</script>
<style lang="scss" scoped>
::v-deep .van-dialog__footer {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    .van-dialog__confirm {
        width: 210px;
        height: 32px;
    }
    .van-button__content {
        margin: 0 auto;
        border-radius: 4px;
        background: linear-gradient(132.33deg, #0de8e9 0%, #5b82fc 100%);
        font-family: "PingFang SC";
        font-weight: 400;
        font-size: 14px;
        line-height: 15px;
        text-align: center;
        color: #fff;
    }
}
.dialog-box {
    width: 274px;
    height: 263px;
    background: #fff;
    display: flex;
    justify-content: center;
    padding-top: 16px;
    div {
        text-align: center;
        font-family: "PingFang SC";
        font-weight: 400;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        color: #999;
    }
    .dialog-bg {
        width: 168.6px;
        height: 115.04px;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
    }
    .dialog-tips {
        margin: 4.5px 0 12px 0;
        font-family: "PingFang SC Bold";
        font-weight: 700;
        font-size: 14px;
        line-height: 13px;
        text-align: center;
        color: #333;
    }
}
</style>
