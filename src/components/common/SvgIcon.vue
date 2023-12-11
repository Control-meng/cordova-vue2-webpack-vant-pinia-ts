<script lang="ts" name="SvgIcon" setup>
    import { computed } from 'vue-demi';

    const props = defineProps<{
        svgName: string;
        svgClass?: string;
    }>();
    const iconName = computed(() => `#icon-${props.svgName}`);
    const iconClass = computed(() => (props.svgClass ? 'icon svg-icon ' + props.svgClass : 'icon svg-icon '));
</script>

<template>
    <svg :class="iconClass" aria-hidden="true">
        <use :xlink:href="iconName" />
    </svg>
</template>

<style lang="scss" scoped>
    .svg-icon {
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }
</style>
