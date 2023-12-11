<template>
    <transition v-if="isProd" :name="transitionName">
        <keep-alive :max="10">
            <router-view v-if="$route.meta?.keepAlive" :key="$route.meta?.key" />
            <router-view v-if="!$route.meta?.keepAlive" :key="$route.meta?.key" />
        </keep-alive>
    </transition>
    <transition v-else :name="transitionName">
        <router-view :key="$route.meta?.key" />
    </transition>
</template>

<script lang="ts" setup>
    import { computed, defineComponent } from 'vue-demi';
    import { useRouterStore } from './stores/router';

    const $routerStore = useRouterStore();
    const transitionName = computed(() => $routerStore.transitionName);
    const isProd = process.env.NODE_ENV === 'production';

</script>
