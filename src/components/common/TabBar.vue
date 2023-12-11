<template>
    <Tabbar v-model="active" active-color="#0C0F18" :border="false" route @change="(index) => { emits('change', index) }">
        <TabbarItem v-for="tab, index in props.tabs" :key="index" :to="tab.to">
            <span>{{ tab.title }}</span>
            <template #icon="props">
                <img :src="props.active ? tab.activeIcon : tab.icon" />
            </template>
        </TabbarItem>
    </Tabbar>
</template>
<script lang='ts' setup>
    import { ref } from 'vue-demi'
    import { Button, Dialog, Tabbar, TabbarItem } from "vant";
    import { RawLocation } from "vue-router";
    const props = defineProps<{
        tabs: {
            title: string,
            icon: string,
            activeIcon: string,
            to: RawLocation,
        }[]
    }>()
    const emits = defineEmits(['change'])
    let active = ref(0);
</script>
<script lang='ts'>
    export default {
        name: ""
    }
</script>
<style lang="scss" scoped></style>
