<template>
    <div class="collapse-card-box">
        <div class="collapse-card" v-for="collapseData, index in archiveCardInfo" :key="collapseData.title">
            <Collapse v-model="keyValues[index]" accordion v-if="collapseData['collapseDataItems'].length">
                <CollapseItem :title="collapseData.title" :name="collapseData.title">
                    <template #icon v-if="collapseData.icon">
                        <img class="first-icon" :src="collapseData.icon" alt="">
                    </template>
                    <Cell v-for="collapseItem, index in collapseData.collapseDataItems" :key="index" :title="collapseItem.title" is-link @click="router.push({ name: collapseItem.to })">
                        <template #icon v-if="collapseItem.icon">
                            <img class="second-icon" :src="collapseItem.icon" alt="">
                        </template>
                    </Cell>
                </CollapseItem>
            </Collapse>
            <Cell v-else :title="collapseData.title" is-link @click="router.push({ name: collapseData.to })">
                <template #icon v-if="collapseData.icon">
                    <img class="first-icon" :src="collapseData.icon" alt="">
                </template>
            </Cell>
        </div>
    </div>
</template>
<script  lang='ts' setup>
    import { ref, reactive, onMounted } from 'vue-demi';
    import { CollapseItem, Collapse, Cell } from 'vant';
    import { useRouter } from 'vue-router/composables';
    // archiveCardInfo
    import { CollapseDataItem, CollapseCardData, } from '@/views/archives/data';

    const router = useRouter()
    const { archiveCardInfo } = defineProps<{
        archiveCardInfo: CollapseCardData[]
    }>()
    const keyValues = ref(archiveCardInfo.map(item => item.title))
    function pageJump(collapseItem: {
        title: string;
        icon?: string;
        to: string;
        info?: any;
    }) {
        router.push({ name: collapseItem.to, params: { info: collapseItem.info } })
    }
</script>
<script lang='ts'>
    export default {
        name: ""
    }
</script>
<style lang="scss" scoped>
    .collapse-card-box {
        .collapse-card {
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 12px;

            :deep(.van-cell) {
                align-items: center;
            }

            :deep(.van-collapse-item__content) {
                padding: 0;
            }



            .first-icon {
                height: 18px;
                width: 18px;
                margin-right: 6px;
            }

            .second-icon {
                height: 14px;
                width: 14px;
                margin-right: 6px;
                margin-left: 12px;
            }
        }
    }
</style>
