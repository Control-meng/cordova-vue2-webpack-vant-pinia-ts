import { math } from "@dspacev-bundle/openlayers";
import { ref } from "vue-demi";
import { TotalStyle, Style } from "@suc/gnet-monch/types/style";
import { PathInerface } from "@suc/gnet-monch/types/olMulPath";
import { v4 as uuidV4 } from "uuid";
import {
    ClusterPointInterface,
    ClusterCoordsPoint,
} from "@suc/gnet-monch/types/olCluster";
import { StyleLike } from "ol/style/Style";
import { OlVectorSource } from "@suc/gnet-monch";
import { FeatureUrlFunction } from "ol/featureloader";

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
//
class Grid implements PathInerface {
    constructor(
        index: number,
        coords: number[][][],
        text: string,
        fillColor?: string
    ) {
        // this.name = '区域' + index + 1;
        this.coords = coords;
        this.style = getStyle(index, text, fillColor);
    }
    id: string = uuidV4();
    type: string = "Polygon";
    // name: string = "区域";
    coords: number[][][] = [];
    style: any;
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
            color: fillColor || `transparent`,
        },
        stroke: {
            width: 3,
            color: `rgba(45, 220, 197, 1)`,
        },
        text: {
            text: "0" + (index + 1) + "" + text,
        },
    };
}
export function metersToLongitude(meters: number, latitude: number): number {
    const longitudeDegree = 111.321 * Math.cos(latitude * (Math.PI / 180));
    const longitudeLength = meters / longitudeDegree;
    return longitudeLength;
}
//
// 单个点位图标样式
export class PointStyle {
    image = {
        icon: {
            anchor: [0.5, 1],
            src: "",
        },
    };
    constructor(src: string) {
        this.image.icon.src = src;
    }
}
export const translateType = <T>(data: T): ClusterCoordsPoint => {
    return data as ClusterCoordsPoint;
};
// 获取坐标
export function getLocation(): Promise<{
    latitude: number;
    longitude: number;
}> {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    const latitude: number = position.coords.latitude;
                    const longitude: number = position.coords.longitude;
                    resolve({ latitude, longitude });
                },
                (error: GeolocationPositionError) => {
                    reject(error);
                }
            );
        } else {
            reject(new Error("抱歉，您的浏览器不支持地理定位。"));
        }
    });
}
// 错误处理
export function handleError(error: GeolocationPositionError): void {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("用户拒绝了地理位置请求。");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("无法获取当前位置信息。");
            break;
        case error.TIMEOUT:
            alert("获取地理位置超时。");
            break;
        default:
            alert("发生未知错误。");
            break;
    }
}
// 实时获取坐标
let watchId: number | null = null;
export function startWatchingLocation(): Promise<{
    id: string;
    type: string;
    name: string;
    coords: number[];
    radius: number;
    style: {
        fill: {
            color: string;
        };
        stroke: {
            color: string;
            width: number;
        };
    };
}> {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            watchId = navigator.geolocation.watchPosition(
                (position: GeolocationPosition) => {
                    const latitude: number = position.coords.latitude;
                    const longitude: number = position.coords.longitude;
                    const point = {
                        id: "cur_position",
                        type: "Circle",
                        name: `我的位置`,
                        coords: [latitude, longitude],
                        radius: 50000,
                        style: {
                            fill: {
                                color: "red",
                            },
                            stroke: {
                                color: "rgba(255, 0, 0, 0.5)",
                                width: 5,
                            },
                        },
                    };
                    resolve(point);
                },
                (error: GeolocationPositionError) => {
                    reject(error);
                }
            );
        } else {
            reject(new Error("抱歉，您的浏览器不支持地理定位。"));
        }
    });
}
// 停止坐标监听
export function stopWatchingLocation(): void {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}
// 点位绘画的预设点
export class PresetPoint {
    constructor(coord: number[]) {
        this.coords = coord;
    }
    "id": string = "preset";
    "coords": number[] = [120, 30];
    "icon": any = {
        image: {
            icon: {
                anchor: [0.5, 1],
                src: new URL(
                    `@/assets/images/Fuan/onlineMonitoring/mobileSource/icon3.png`,
                    import.meta.url
                ).href,
            },
        },
    };
}
// 遮罩
export interface ReverseShade {
    layerStyle: StyleLike;
    projection: string;
    extent: number[];
    jsonType: string;
    jsonUrl: string;
    dissolve: boolean;
}
// 矢量边框
export interface VectorBorder {
    style: StyleLike;
    source: {
        format?: string;
        local?: boolean;
        url?: string | FeatureUrlFunction;
    };
}
