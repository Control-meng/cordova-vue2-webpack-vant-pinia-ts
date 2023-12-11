import dayjs from "dayjs";
import { Toast } from "vant";
import { v4 as uuidV4 } from "uuid";
import { ImagePreview } from "vant";
// import { useRouter } from "vue-router/composables";
// const router = useRouter();
// vue3 静态资源处理（图片）
export const getImageUrl = (name: string) => {
    return new URL(`@/assets/images/${name}`, import.meta.url).href;
};

// 浙里办顶部标题栏设置
// export async function //setTitle(name: string) {
//     try {
//         console.log("福安码");
//         let res =
//             window.ZWJSBridge &&
//             (await window.ZWJSBridge.//setTitle({
//                 title: name,
//             }));
//         console.log("福安码2");
//     } catch (error: any) {
//         if (error.errorCode == 3) {
//             // console.info(error.errorMessage);
//         } else {
//             console.error(error);
//         }
//     }
// }
export function nowSize(val: number, initialHeight = 812) {
    return val * (document.documentElement.clientHeight / initialHeight);
}
// 展示时间处理
export function getRealTime(timeString: string, format?: string) {
    let localTime = new Date(
        new Date(timeString).getTime() + new Date().getTimezoneOffset() * 60000
    );

    return format ? dayjs(localTime).format(format) : localTime;
}
// 获取时差 返回格式：xx 天 xx 小时  xx 分
export function calculateTimeDifference(start: string, end: string): string {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const diffMilliseconds = endDate.getTime() - startDate.getTime();
    const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    const remainingMinutes = diffMinutes % 60;
    const remainingHours = diffHours % 24;

    return `${diffDays}天${remainingHours}小时${remainingMinutes}分`;
}
// token刷新
export async function refreshTokenAndRetryRequest(
    request: () => Promise<any>,
    refreshRequest: () => Promise<any>
): Promise<Response> {
    try {
        const responseA = await request(); // 发起请求a
        console.log("aaa", responseA);
        if (responseA.status === 401) {
            // 请求a返回401状态码，执行重新登录请求b
            const responseB = await refreshRequest(); // 发起请求b
            if (responseB.status === 200) {
                // 请求b成功，重新进行请求a
                const retryResponseA = await request(); // 重新发起请求a
                return retryResponseA; // 返回重新请求a的结果
            } else {
                // 请求b失败，跳转到登录页
                // router.push({ name: "login" });
                Toast("");
            }
        }
        return responseA; // 返回请求a的结果
    } catch (error) {
        console.error("Error:", error);
        // 处理其他错误情况
        // ...
        throw error;
    }
}
// blob转dataurl
export async function blobToDataUrl(
    blob: Blob,
    mimeType: string
): Promise<string> {
    const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (typeof reader.result === "string") {
                resolve(reader.result);
            } else {
                reject(new Error("Failed to read Blob as Data URL."));
            }
        };
        reader.onerror = () => {
            reject(reader.error ?? new Error("Unknown error occurred."));
        };

        reader.readAsDataURL(blob);
    });
    // Ensure that the Data URL starts with the correct MIME type
    if (!dataUrl.startsWith(`data:${mimeType};`)) {
        throw new Error(`Failed to convert Blob to ${mimeType} Data URL.`);
    }
    return dataUrl;
}
// 将文件blob转换为vant的文件配置对象
export async function getVFile(
    request: Promise<Blob>,
    name?: string,
    mimeType?: string
) {
    try {
        let blob = await request;
        return {
            file: new File([blob], name ? name : uuidV4()),
            content: await blobToDataUrl(
                blob,
                mimeType ? mimeType : "image/png"
            ),
            message: "",
            status: "",
        };
    } catch (error) {
        console.error(error);
    }
}
// 获取File对象
async function getFile(request: Promise<Blob>, fileId: string, name?: string) {
    try {
        let blob = await request;
        return new File([blob], name ? name : uuidV4());
    } catch (error) {
        console.error(error);
    }
}
// 获取getFileDataUrl
async function getFileDataUrl(
    request: Promise<Blob>,
    fileId: string,
    mimeType?: string
) {
    try {
        let blob = await request;
        return await blobToDataUrl(blob, mimeType ? mimeType : "image/png");
    } catch (error) {
        console.log(error);
    }
}
export function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
}
export class VFile {
    content: string;
    file: File;
    message: string;
    status: string;
}
export function appendObjectToFormData(
    formData: FormData,
    data: any,
    parentKey?: string
) {
    if (data && typeof data === "object" && !(data instanceof File)) {
        Object.keys(data).forEach((key) => {
            const value = data[key];
            const propName = parentKey ? `${parentKey}.${key}` : key;

            if (value instanceof Date) {
                formData.append(propName, value.toISOString());
            } else if (value instanceof Array) {
                value.forEach((item, index) => {
                    const arrayKey = `${propName}[${index}]`;
                    appendObjectToFormData(formData, item, arrayKey);
                });
            } else if (value && typeof value === "object") {
                appendObjectToFormData(formData, value, propName);
            } else {
                formData.append(propName, value);
            }
        });
    } else {
        parentKey && formData.append(parentKey, data);
    }
}
export const previewImage = (files: any[]) => {
    if (files.length) {
        ImagePreview({
            images: files,
            closeable: true,
        });
    } else {
        Toast("无数据");
    }
};
