<script lang="ts">
export default {
    name: "DragEdit",
};
</script>
<script lang="ts" setup>
import { onMounted, ref, nextTick } from "vue";
import { getCurrentInstance, watch } from "vue-demi";

interface Props {
    data: any[]; //密封点列表,item中存在坐标位置信息
    edit?: boolean; //是否可编辑
    editId?: string; //可编辑密封点id
    imagePath: string; //背景图片路径
    drawLine: boolean;
}

const { imagePath, data, edit, editId, drawLine } = defineProps<Props>();

// 获取元素位置
function getElCoordinate(dom: HTMLDivElement) {
    return {
        top: dom.offsetTop,
        left: dom.offsetLeft,
        width: dom.offsetWidth,
        height: dom.offsetHeight,
    };
}

// 获取位置坐标 pos1：起始位置 pos2：结束位置
function getPos(pos1: any, pos2: any) {
    //分四种情况
    let x1, y1, x2, y2;
    x1 = pos1.left + pos1.width / 2;
    y1 = pos1.top;
    x2 = pos2.left + pos2.width / 2;
    y2 = pos2.top;
    return {
        start: { x: x1, y: y1 },
        end: { x: x2, y: y2 },
    };
}

// 箭头显示
const showLine = ref(false);
// 画线 item1：div元素-结束位置，item2：div元素-开始标签，line：html元素：画线
function moveLine(
    item1: HTMLDivElement,
    item2: HTMLDivElement,
    line: HTMLElement
) {
    const pos1 = getElCoordinate(item1); //获取箭头结束
    const pos2 = getElCoordinate(item2); //获取箭头开始
    const end = getPos(pos1, pos2).start;
    const start = getPos(pos1, pos2).end;
    line.setAttribute("x1", start.x);
    line.setAttribute("y1", start.y);
    line.setAttribute("x2", end.x);
    line.setAttribute("y2", end.y);
}

// 获取当前vue实例
const vm = getCurrentInstance();
let _mounted = false;

onMounted(() => {
    if (data?.length && drawLine) {
        nextTick(() => {
            for (let item of data) {
                moveLine(
                    (vm?.proxy?.$refs[item.id + `-1`] as any)?.[0],
                    (vm?.proxy?.$refs[item.id + `-2`] as any)?.[0],
                    (vm?.proxy?.$refs[item.id + `-l`] as any)?.[0]
                );
            }
            showLine.value = true;
        });
    }
    _mounted = true;
});
watch(
    () => data,
    () => {
        if (_mounted && drawLine) {
            nextTick(() => {
                for (let item of data) {
                    moveLine(
                        (vm?.proxy?.$refs[item.id + `-1`] as any)?.[0],
                        (vm?.proxy?.$refs[item.id + `-2`] as any)?.[0],
                        (vm?.proxy?.$refs[item.id + `-l`] as any)?.[0]
                    );
                }
            });
            showLine.value = true;
        }
    }
);
let _move = false;
let _x: number, _y: number;

// 通过鼠标移动当前密封点位置
function onMousedown(e: MouseEvent) {
    if (!edit) {
        return;
    }
    // 获取自定义属性item ---- 密封点id
    const itemId = (e.target as HTMLDivElement).getAttribute("item")!;
    // editId:当前可编辑密封点id
    if (editId && editId !== itemId) {
        return;
    }
    // itemtype   1:结束位置 2:开始位置
    const itemtype = (e.target as HTMLDivElement).getAttribute("itemtype")!;
    const [item1] = vm?.proxy?.$refs[itemId + `-1`] as HTMLDivElement[];
    const [item2] = vm?.proxy?.$refs[itemId + `-2`] as HTMLDivElement[];
    const [itemL] = vm?.proxy?.$refs[itemId + `-l`] as HTMLDivElement[];
    const item = itemtype === "1" ? item1 : item2;
    // const rects = item.getBoundingClientRect();
    _x = e.pageX - parseInt(item.style.left);
    _y = e.pageY - parseInt(item.style.top);
    _move = true;

    // 当前可编辑点位置变动
    // 当鼠标按下
    function mousemove(e: MouseEvent) {
        if (_move) {
            let x = e.pageX - _x; //移动时根据鼠标位置计算控件左上角的绝对位置
            let y = e.pageY - _y;
            item.style.left = x + "px";
            item.style.top = y + "px";
            moveLine(item1, item2, itemL);
        } else {
            document.removeEventListener("mousemove", mousemove);
            document.removeEventListener("mouseup", mouseup);
        }
    }
    // 当鼠标松开
    function mouseup(e: MouseEvent) {
        _move = false;
        document.removeEventListener("mousemove", mousemove);
        document.removeEventListener("mouseup", mouseup);
    }
    // 移除监听器
    document.addEventListener("mousemove", mousemove);
    document.addEventListener("mouseup", mouseup);
}
// 点击标签触发二层弹窗
const emits = defineEmits(["showNextPop"]);
const showNextPop = (zzmc: string, zzid: String) => {
    emits("showNextPop", zzmc, zzid);
};

// 获取密封点位置
function getMfdPos(itemId: string) {
    const [item1] = vm?.proxy?.$refs[itemId + `-1`] as HTMLDivElement[];
    const [item2] = vm?.proxy?.$refs[itemId + `-2`] as HTMLDivElement[];
    return {
        x1: parseInt(item1!.style.left),
        y1: parseInt(item1!.style.top),
        x2: parseInt(item2!.style.left),
        y2: parseInt(item2!.style.top),
    };
}

// 暴露方法
defineExpose({
    getMfdPos,
});
</script>
<template>
    <div class="drag-edit-wrap">
        <svg class="dew-svg">
            <defs>
                <marker
                    id="arrow"
                    markerUnits="strokeWidth"
                    markerWidth="12"
                    markerHeight="12"
                    viewBox="0 0 12 12"
                    refX="6"
                    refY="6"
                    orient="auto"
                >
                    <path
                        xmlns="http://www.w3.org/2000/svg"
                        d="M2,2 L10,6 L2,10 L6,6 L2,2"
                        style="fill: red"
                    />
                </marker>
            </defs>
        </svg>
        <!-- 密封点图片 -->
        <img class="dew-line-bg" :src="imagePath" alt="" />

        <template>
            <div v-for="item in data" :key="item.id">
                <!-- 结束点位 -->
                <div
                    class="dew-item1"
                    :ref="item.id + `-1`"
                    :style="{ left: `${item.x1}px`, top: `${item.y1}px` }"
                    :item="item.id"
                    itemtype="1"
                    @mousedown="onMousedown"
                ></div>
                <!-- 起始点位 -->
                <div
                    class="dew-item2"
                    :ref="item.id + `-2`"
                    :style="{ left: `${item.x2}px`, top: `${item.y2}px` }"
                >
                    <!-- 标签 -->
                    <div
                        v-if="item.kzh"
                        :class="
                            item.y1 > item.y2 ? 'dew-i-top' : 'dew-i-bottom'
                        "
                        :item="item.id"
                        itemtype="2"
                        @click="showNextPop(item.mc, item.id)"
                        @mousedown="onMousedown"
                    >
                        {{ item.kzh }}{{ item.lx }}
                    </div>
                    <div
                        v-else
                        :class="
                            item.y1 > item.y2 ? 'dew-i-top' : 'dew-i-bottom'
                        "
                        :item="item.id"
                        itemtype="2"
                        @click="showNextPop(item.mc, item.id)"
                        @mousedown="onMousedown"
                    >
                        {{ item.mc }}
                    </div>
                </div>
                <!-- 箭头 -->
                <svg class="dew-line-svg" v-show="showLine">
                    <line
                        class="dew-line"
                        :ref="item.id + `-l`"
                        xmlns="http://www.w3.org/2000/svg"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="0"
                        stroke="red"
                        stroke-width="2"
                        marker-end="url(#arrow)"
                    ></line>
                </svg>
            </div>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.drag-edit-wrap {
    position: relative;
    margin: 0;
    padding: 0;
    height: auto;
    width: auto;
    display: inline-block;

    img {
        width: 600px;
        height: auto;
    }
}

.dew-svg {
    position: absolute;
    left: 0;
    top: 0;
    overflow: visible;
    width: 100%;
    height: 100%;
    z-index: 0;
}

.dew-line-bg {
    position: relative;
    z-index: 1;
}

.dew-line {
    z-index: 2;
}

.dew-line-svg {
    position: absolute;
    left: 0;
    top: 0;
    overflow: visible;
    width: 100%;
    height: 100%;
    z-index: 2;
}

.dew-item1,
.dew-item2 {
    position: absolute;
    z-index: 3;
    user-select: none;
}

.dew-item1 {
    width: 10px;
    height: 10px;
    background-color: transparent;
    cursor: pointer;
}

.dew-item2 {
    background-color: transparent;
    white-space: nowrap;
    width: 10px;
    height: 10px;
    font-size: 12px;

    > div {
        background-color: white;
        border: 1px solid blue;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        padding: 0 2px;
        user-select: none;
        cursor: pointer;

        &.dew-i-top {
            top: auto;
            bottom: 0;
            transform: translate(-50%, 0);
        }

        &.dew-i-bottom {
            color: black;
            top: 0;
            bottom: auto;
            transform: translate(-50%, 0);
        }
    }
}
</style>
