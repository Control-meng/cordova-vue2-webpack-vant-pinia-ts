<template>
    <div>
        <div>props->data:{{ data }}</div>
        <div>props->defaultData:{{ text }}</div>
        <div>computed->props:{{ dataC }}</div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue-demi';

const props = withDefaults(
    defineProps<{
        data: number,
        text?: string
    }>(),
    {
        text: '1',
    },
);
const emit = defineEmits<{
    (e: 'test'): void
}>();
setTimeout(() => emit('test'), 10000);
const dataC = computed(() => 'data' + props.data);
</script>
<script lang="ts">
export default {
    name: 'TestSetup',
};
</script>
