<template>
    <div class="page-list">
        <Loading v-show="listConfig.loading && !listData.length" class="loading" size="24px" color="#0094ff" vertical>数据加载中...</Loading>
        <PullRefresh class="pull-refresh-box" v-model="listConfig.isRefresh" @refresh="emits('onRefresh')" :pull-distance="listConfig.pullDistance" :disabled="notAllowPullRefresh">
            <Empty v-show="!listData.length && !listConfig.loading" class="custom-empty" description="暂无数据" />
            <template v-show="listData.length">
                <List ref="customList" class="custom-list" v-model="listConfig.loading" :finished="listConfig.finished" :finished-text="listConfig.finishedtext" @load="onload" :offset="listConfig.offset">
                    <!-- <slot name="listItem"> -->
                    <slot> </slot>
                </List>
            </template>
        </PullRefresh>

    </div>
</template>

<script lang="ts" setup>
    import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue-demi';
    import { Empty, Search, List, Loading, PullRefresh } from 'vant';
    import { ListConfig } from '@/utils/appLongListPage'
    const props = defineProps<{
        listConfig: ListConfig,
        listData: any
    }>()
    const emits = defineEmits(['onRefresh', 'onLoad'])
    function onload() {
        emits('onLoad')
    }
    const customList = ref<any>()
    const notAllowPullRefresh = ref(false)
    onMounted(() => {
        nextTick(() => {
            const listElement = customList.value?.$el;
            if (listElement) {
                listElement.addEventListener('scroll', (e: any) => {
                    if (e.target.scrollTop >= props.listConfig.pullDistance) {
                        notAllowPullRefresh.value = true;
                    } else {
                        notAllowPullRefresh.value = false;
                    }
                });
            }
        })
    })
    onUnmounted(() => {
        //     const listElement = customList.value?.$el;
        //     listElement.removeEventListener('scroll')
    })

</script>
<script lang="ts">
    export default {
        name: '',
    };
</script>
<style lang="scss">
    .page-list {
        height: 100%;
        overflow-y: scroll;

        &::-webkit-scrollbar {
            display: none;
        }

        .loading {
            height: 100%;
            justify-content: center;
        }

        .pull-refresh-box {
            height: 100%;



            .custom-empty {
                width: 100%;
                height: 100%;
                margin-top: 6px;
                background-color: transparent;
            }

            .custom-list {
                height: 100%;
                width: 100%;
                overflow-y: scroll;

                &::-webkit-scrollbar {
                    display: none;
                }

                // padding: 0 16px;
            }
        }




    }
</style>
