<script lang="ts"  setup>
    import { onMounted, onUnmounted } from 'vue-demi';
    import { useRoute } from 'vue-router/composables';
    import { NavBar, } from "vant";
    import { useRouter } from 'vue-router/composables';
    const router = useRouter()
    const route = useRoute();
    const props = withDefaults(defineProps<{
        title?: string,
        leftArrow?: boolean,
        leftText?: string;
        leftRouter?: string
        rightText?: string
        showHeader?: boolean
        bgColor?: string;
    }>(), {
        showHeader: true
    })

    const emits = defineEmits<{
        (e: 'page:beforeout'): void;
        (e: 'page:beforein'): void;
        (e: 'clickLeft'): void
    }>();
    emits('page:beforein');
    const onClickLeft = () => {
        props.leftRouter ? router.push(props.leftRouter.includes('/') ? { path: props.leftRouter } : { name: props.leftRouter }) : emits('clickLeft')
    }
    const createTime = +new Date();

    onMounted(() => {
        let loadDurTime = +new Date() - createTime;
        // 加载时长
        route.meta!.loadTime = loadDurTime / 1000;
    });

    onUnmounted(() => {
        emits('page:beforeout');
        let pageInfo = getWindowConfig()
        document.getElementById('RootPage')!.style.height = (pageInfo.pageHeight - 46) + 'px'
    });
    function getWindowConfig() {
        let windowWidth = window.innerWidth;
        let windowHeight = window.innerHeight;
        if (typeof windowWidth !== 'number') {
            if (document.compatMode === 'CSS1Compat') {
                windowWidth = document.documentElement.clientWidth;
                windowHeight = document.documentElement.clientHeight;
            } else {
                windowWidth = document.body.clientWidth;
                windowHeight = window.body.clientHeight;
            }
        }
        return {
            pageWidth: windowWidth,
            pageHeight: windowHeight
        }
    }


</script>

<template>
    <div class="root-page" id="RootPage" :style="{ backgroundColor: bgColor }">
        <NavBar v-if="showHeader" class="cus-navbar" :title="title" :left-arrow="leftArrow" :left-text="leftText" @click-left="onClickLeft" :right-text="rightText" />
        <div :class="[showHeader ? 'hasNav' : 'noNav']">
            <slot></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .root-page {
        width: 100%;
        height: 100vh;
        background: #efeef3;
        overflow: hidden;

        ::-webkit-scrollbar {
            display: none;
        }

        :deep(.van-nav-bar__title) {
            font-size: 16px;
            font-weight: 600;
            font-family: 'PingFang SC';
        }

        :deep(.van-nav-bar__left, .van-nav-bar__right) {
            font-size: 14px;
        }

        :deep(.van-nav-bar__arrow) {
            font-size: 16px;
        }

        :deep(.van-dropdown-menu__title) {
            font-size: 15px;
        }

        $navbar-height: 46px;
        $hasNav-height: calc(100% - $navbar-height);

        .hasNav {
            height: $hasNav-height;
            // background-color: #fff;
        }

        .noNav {
            height: 100%;
        }

        .cus-navbar {
            height: $navbar-height;
            // box-shadow: 0 0 3px rgba($color: #aaa, $alpha: 0.2);
        }
    }
</style>
