<template>
    <div class="cus-filter-box">
        <DropdownMenu ref="cusFilter" class="cus-filter" :active-color="activeColor" :overlay="overlay">
            <DropdownItem v-for="item, index in filterItems" v-model="item.bindValue" :key="index" :title="item.title" :options="item.options" :title-class="item.cusTitle ? 'rmdf-icon' : ''"
                @open="test(item)" @click="select(item)" @close="close(item)" @change="(value) => selectedChange(item, value)">
                <template #title v-if="item.cusTitle">
                    <slot :name="item.cusTitle" :title="item.title"></slot>
                </template>
                <template v-if="item.cusFilter">
                    <slot :name="item.cusFilter"></slot>
                </template>
                <template v-if="!item.cusFilter && item.type == 'date'">
                    <!-- <slot :name="item.cusFilter"></slot> -->
                    <!-- 时间 -->
                    <!-- <Calendar v-model="viewdate" type="range" @confirm="onConfirm" :min-date="new Date('2010-01-01')" :max-date="new Date()" /> -->
                </template>
                <template v-if="!item.cusFilter && item.type == 'area'">
                    <slot :name="item.cusFilter"></slot>
                </template>
                <template v-if="!item.cusFilter && item.type == 'date'">
                    <slot :name="item.cusFilter"></slot>
                </template>
            </DropdownItem>
        </DropdownMenu>
        <!-- 地区 -->
        <Popup v-model="viewarea" class="cus-popup" position="bottom" round>
            <Area value="110101" title="所属地区" :area-list="areaList" :columns-placeholder="['请选择', '请选择', '请选择']" @confirm="selectedArea" @cancel="bindValues.viewarea = false" />
        </Popup>

        <!-- 自定义 -->
        <Popup v-model="bindValues.viewcus" class="" position="bottom" closeable round>
            <slot name="cus"></slot>
        </Popup>
        <!-- 筛选合集 -->
        <Popup v-model="bindValues.viewall" class="" position="bottom" closeable round>
            <slot name="all"></slot>
        </Popup>
        <slot name="cus-pop"></slot>
    </div>
</template>
<script lang='ts' setup>
    import { ref, watch } from 'vue-demi'
    import { Search, DropdownItem, DropdownMenu, Area, Popup, Calendar } from 'vant';
    import { areaList } from '@vant/area-data';
    import { v4 as uuidV4 } from 'uuid';
    import { bind } from 'lodash';

    const { filterItems, overlay, activeColor, dateType } = withDefaults(defineProps<{
        filterItems: FilterItem[],
        overlay?: boolean,
        activeColor?: string,
        dateType: 'single' | 'multiple' | 'range'
    }>(), {
        overlay: false,
        activeColor: "#3296FA",
        dateType: 'single'
    })
    const viewdate = ref(false)
    const viewarea = ref(false)
    // 自定义事件
    const emits = defineEmits(['select', 'change', 'areaConfirm', 'dateConfirm', 'open', 'close'])
    //特定类型的value开关
    const bindValues = ref<{ [key: string]: boolean }>({
        viewcus: false,
        viewall: false
    })
    const cusFilter = ref()



    // 根据props获取开关
    function getBindValues() {
        filterItems.map(item => {
            bindValues.value[`view${item.type}`] = false
        })
    }
    getBindValues()
    // 地区确认
    function selectedArea(area: { code: string, name: string }[]) {
        // bindValues.value.viewarea = false
        viewarea.value = false
        emits('areaConfirm', area)
    }
    // 时间确认
    function onConfirm(date: Date[]) {
        console.log('时间确认')
        const [start, end] = date;
        viewdate.value = false
        emits('dateConfirm', date)
    }
    // 选择常规选项
    function select(item: FilterItem) {
        emits('select', item)
    }
    // 选中状态改变
    function selectedChange(item: FilterItem, value: any) {
        console.log('selectedChange', item, value)
        let option;
        item.options?.map(it => {
            it.value == value && (item.titleBind && (item.title = it.text), option = it)
        });
        emits('change', item, option)
    }
    function close(item: FilterItem) {
        emits('close', item)
    }
    function test(item: any) {
        console.log('open', item)
        emits('open', item)
        // item.type === 'normal' && (viewdate.value = true)
        item.type === 'date' && (viewdate.value = true, console.log(333))
        item.type === 'area' && (viewarea.value = true)
    }
</script>
<script lang='ts'>
    export interface FilterItem {
        name?: string;
        type?: "normal" | "date" | "area" | "cus" | undefined;
        title?: string;
        bindValue: any;
        cusTitle?: string;//自定义标题
        cusFilter?: string;//自定义筛选主体
        formatter?: string;// type 为date 时,时间格式
        titleBind?: boolean; //标题是否根据选项变动而切换
        minDate?: Date;//type为date时可选 minDate
        maxDate?: Date;//type为date时可选 maxDate
        options?: {
            id?: string;
            text: string;
            value?: string;
            icon?: string;
        }[];
    }
    export default {
        name: ""
    }

</script>
<style lang="scss" scoped>
    .cus-filter {
        height: 40px;
        position: relative;
        // box-shadow: 0 0 6px 0px #aaa;
        z-index: 1;

        // :deep(.van-popup) {
        //     border-radius: 0 0 10px 10px;
        // }

        :deep(.van-dropdown-menu__bar) {
            height: 100%;
            box-shadow: 0 2px 5px rgba(100, 101, 102, .12); // box-shadow: none;

        }

        // 覆写title右边小图标
        :deep(.cus-vanclass-filter) {
            display: flex;

            &::after {
                content: '';
                position: relative;
                display: inline-block;
                height: 20px;
                width: 20px;
                // background: url(@/assets/images/mine/icon1.png) no-repeat;
                background-size: center;
                transform: rotate(0);
                opacity: 1;
                margin-top: 0;
                border: none;
            }
        }

        // 覆写title右边小图标
        :deep(.rmdf-icon) {
            display: flex;

            &::after {
                content: '';
                position: relative;
                display: none;
            }
        }
    }
</style>
