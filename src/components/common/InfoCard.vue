<script setup lang="ts">
    import { ref, onMounted } from 'vue-demi';
    import { Sticky } from 'vant';
    const { title, bgcolor } = withDefaults(defineProps<{
        title: string;
        bgcolor?: string;
        sticky?: boolean
    }>(), {
        sticky: false
    })
    const infoCardContainer = ref(null)
    onMounted(() => {
    })
</script>

<template>
    <div class="info-card" ref="infoCardContainer">
        <div :style="{ background: bgcolor }" class="title-box" :class="sticky ? 'stickying' : ''">
            <div class="title">
                <i></i><span>{{ title }}</span>
                <slot name="leftIcon"></slot>
            </div>
            <div class="history">
                <slot name="titleRight"></slot>
            </div>
        </div>

        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
    .info-card {
        .title-box {
            display: flex;
            justify-content: space-between;
            padding: 0 16px;

            &.stickying {
                position: sticky;
                top: 0px;
                background-color: #fff;
                z-index: 100;
            }

            .title {
                height: 56px;
                line-height: 56px;
                font-family: 'Source Han Sans SC Bold';
                font-weight: 700;
                font-size: 16px;
                text-align: left;
                display: flex;
                align-items: center;
                color: #1f1f1f;

                i {
                    display: block;
                    width: 4px;
                    height: 16px;
                    border-radius: 2px;
                    background: #3489ff;
                    margin-right: 7px;
                }
            }

            .history {
                display: flex;
                align-items: center;
                font-family: 'Source Han Sans SC';
                font-weight: 400;
                font-size: 14px;
                line-height: 20px;
                text-align: left;
                color: #3489ff;

                &>img {
                    margin-right: 8px;
                }
            }
        }
    }
</style>
