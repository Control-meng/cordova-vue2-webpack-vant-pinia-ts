import { StatusBar } from "@awesome-cordova-plugins/status-bar";
import { MobileAccessibility } from "@ionic-native/mobile-accessibility";
import { Device } from "@awesome-cordova-plugins/device";
import vant, { Uploader } from "vant";

export function deviceReady() {
    let timer: null | any;
    return new Promise<void>((resolve, reject) => {
        timer = setTimeout(() => {
            timer = null;
            reject("初始化时间超过10秒,请检查项目是否正常!");
        }, 10000);
        document.addEventListener("deviceready", () => {
            if (timer) {
                clearTimeout(timer);
            }
            resolve();
        });
    });
}

export async function prepareApp() {
    if (window.cordova) {
        await deviceReady();
        MobileAccessibility.usePreferredTextZoom(false);
        if (Device.platform.toLowerCase() === "android") {
            // 控制标题栏时候覆盖
            StatusBar.overlaysWebView(false);
            StatusBar.backgroundColorByHexString("#fff"); // 设置状态栏背景颜色
            StatusBar.styleDefault(); //设置状态栏字体颜色为深色
            // StatusBar.styleLightContent(); // 设置状态栏字体颜色为浅色
        } else {
            StatusBar.styleDefault();
        }
    }
}
// 监听上传按钮点击事件
export function handleUpload(): void {}
