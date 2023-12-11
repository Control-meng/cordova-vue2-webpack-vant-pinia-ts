<template>
    <RootPage>
        <textarea ref="textArea" class="cus-text-area">1 2 3 4 5 6 7 8 9</textarea>
        <p id="log">sasdasd</p>
    </RootPage>
</template>
<script lang='ts' setup>
    import { ref, onMounted } from 'vue-demi'
    import { Filter as CusFilter, RootPage, FilterItem, } from '@/components'
    import { Icon } from 'vant'
    const textArea = ref<HTMLElement | null>(null)
    onMounted(() => {
        // const textarea = document.querySelector("textarea");
        const log = document.getElementById("log");

        // textarea!.onscroll = logScroll;

        function logScroll(e: any) {
            log!.textContent = `Scroll position: ${e.target.scrollTop}`;
        }
        // document.querySelector('.cus-text-area')!.onscroll = logScroll
        textArea.value!.onscroll = logScroll
    })
</script>
<script lang='ts'>
    export default {
        name: ""
    }
</script>
<style lang="scss" scoped>
    textarea {
        width: 4rem;
        height: 8rem;
        font-size: 3rem;
    }
</style>
