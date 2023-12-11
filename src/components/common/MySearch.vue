<script setup lang="ts">
    import { ref } from 'vue-demi';
    import { Search } from 'vant';
    // 常、变量
    let value = ref('');
    const placeholder = `\ue610  搜索`;

    const emit = defineEmits(['searchData']);

    const searchData = (value: string) => {
        emit('searchData', value);
    };
</script>
<script lang="ts">
    export default {
        name: 'MySearch',
    };
</script>
<template>
    <Search class="iconfont top-search" v-model="value" @change="searchData(value)" :placeholder="placeholder" input-align="center" />
</template>

<style lang="scss" scoped>
    ::v-deep i.van-icon-search:before {
        content: '';
    }
</style>
