<template>
    <div class="top-bar">
        <div class="placeholder">
            <span class="back" v-if="back" @click="router.back()"><van-icon name="arrow-left" />返回</span>
        </div>
        <div>{{ title }}</div>
        <Popover v-model="showPopover" trigger="click" placement="bottom-end">
            <Grid square clickable :border="false" direction="horizontal" column-num="1" style="width: 118px">
                <ul class="options-box" style="
                                display: flex;
                                flex-direction: column;
                                justify-content: space-between;
                                padding-top: 2px;
                            ">
                    <li class="option" style="margin: 13px 17px 13px 17px" v-for="(item, index) in content" :key="index + item.option">
                        <img :src="item.icon" alt="" /><span style="margin-left: 12px">{{ item.option }}</span>
                    </li>
                </ul>
            </Grid>
            <template #reference>
                <div class="top-icon" v-if="content"></div>
                <div class="top-placeholder" v-if="!content"></div>
            </template>
        </Popover>
    </div>
</template>

<script lang="ts" setup>
    import { Popover, Grid, GridItem } from "vant";
    import { ref } from "vue-demi";
    import { useRouter } from "vue-router/composables";
    const router = useRouter();
    interface Props {
        title: string;
        content?: {
            option: string;
            icon: string;
        }[];
        back?: boolean;
    }

    const { title } = defineProps<Props>();
    const showPopover = ref(false);
    const actions = ref([
        // { text: "下载任务", icon: require("@/assets/images/top-bar/icon1.png") },
        // { text: "上传任务", icon: require("@/assets/images/top-bar/icon2.png") },
        // { text: "删除任务", icon: require("@/assets/images/top-bar/icon3.png") },
    ]);
</script>
<style lang="scss" scoped>
    .top-bar {
        width: 100vw;
        height: 54px;
        padding: 0 12px;
        display: flex;

        justify-content: space-between;
        align-items: center;

        font-weight: 400;
        font-size: 18px;
        line-height: 19px;
        color: #333;
        background-color: #fff;
        position: sticky;
        top: 0;

        .placeholder {
            width: 45px;
            height: 14.62px;
        }

        .top-icon {
            width: 30px;
            height: 14.62px;
            // background: url("@/assets/images/tasks/icon.png") no-repeat;
            background-size: contain;
            background-position: center;
        }

        .top-placeholder {
            width: 45px;
            height: 14.62px;
        }

        .options-box {
            width: 118px;
            height: 143.59px;
            display: block;
            background: #fff;
            filter: drop-shadow(0 3px 6px rgba(0, 0, 0, 0.16));
            padding: 17px 19px 14px 17px;

            .option {
                height: 40px !important;
            }
        }

        .back {
            font-family: "PingFang SC Medium";
            font-weight: 500;
            font-size: 14px;
            line-height: 19px;
            text-align: center;
            color: #333;
        }
    }
</style>
