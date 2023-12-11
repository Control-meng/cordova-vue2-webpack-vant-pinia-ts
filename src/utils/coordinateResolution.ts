import { math } from "@dspacev-bundle/openlayers";
import { TotalStyle, Style } from "@suc/gnet-monch/types/style";
// 坐标转换
export function coordinateResolution(str: string): number[] {
    const regex = /(\d+(\.\d+)?)/g;
    const matches = str.match(regex);
    if (matches === null || matches.includes("0")) {
        return [120, 30];
    }
    return matches.map(Number);
}
// 根据距离获取坐标
interface Coordinate {
    longitude: number; // 经度
    latitude: number; // 纬度
}
function radians(degrees: number): number {
    return degrees * (Math.PI / 180);
}
// 计算新的坐标
export function projectCoordinates(
    initialLongitude: number,
    initialLatitude: number,
    distanceLongitude: number,
    distanceLatitude: number
): [number, number] {
    //  将初始经纬度坐标转换为弧度
    const initialLonRad = radians(initialLongitude);
    const initialLatRad = radians(initialLatitude);
    // 计算投影坐标系中的初始点坐标
    const originX = initialLonRad * 6378137.0;
    const originY =
        Math.log(Math.tan((initialLatRad + Math.PI / 2.0) / 2.0)) * 6378137.0;
    // 在经线方向上移动
    const projectedX = originX + distanceLongitude;
    // 在纬线方向上移动
    const projectedY = originY + distanceLatitude;
    // 将投影坐标系中的坐标转换回经纬度坐标
    const longitude = (projectedX / 6378137.0) * (180.0 / Math.PI);
    const latitude =
        (2.0 * Math.atan(Math.exp(projectedY / 6378137.0)) - Math.PI / 2.0) *
        (180.0 / Math.PI);

    return [longitude, latitude];
}
// 地图绘画样式
export function getStyle(index: number, text: string, fillColor?: string): any {
    return {
        fill: {
            color: fillColor || `transparent`
        },
        stroke: {
            width: 3,
            color: `rgba(45, 220, 197, 1)`
        },
        text: {
            text: "0" + (index + 1) + "" + text
        }
    };
}
export function metersToLongitude(meters: number, latitude: number): number {
    const longitudeDegree = 111.321 * Math.cos(latitude * (Math.PI / 180));
    const longitudeLength = meters / longitudeDegree;
    return longitudeLength;
}
// 单个点位图标样式
export class PointStyle {
    image = {
        icon: {
            anchor: [0.5, 1],
            src: ""
        }
    };
    constructor(src: string) {
        this.image.icon.src = src;
    }
}
