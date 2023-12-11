import { common as axios } from "@/utils/api";
import { plainToInstance } from "class-transformer";

/**
 * @cusController
 * @cusDefinePackageName com.sucsoft.radiation.safety.assessment.web
 * @cusDefineClassName OverWriteController
 */
export class OverWriteController {
    $_abortCtrlMap = new Map<string, AbortController>();

    $_getSignal(scope: string) {
        const abortCtrl = this.$_abortCtrlMap.get(scope);
        if (abortCtrl) {
            abortCtrl.abort();
            this.$_abortCtrlMap.delete(scope);
        }
        const temp = new AbortController();
        this.$_abortCtrlMap.set(scope, temp);
        return temp.signal;
    }

    /**
     * @NomosDefinePath /api/radiation/safety/company/file
     * @NomosDefinePathActions ["WEB"]
     * @NomosDefineRequestMethod GET
     * @NomosDefineRequestType json
     * @NomosDefineMethodName download
     * @NomosDefineParameters [{"name":"fileId","type":{"family":"string"},"required":true,"isRequestBody":false,"description":"主键"}]
     * @NomosDefineSuccessResponse void
     * @NomosDefineDescription "[监管端-文件]文件下载"
     * @NomosDefinePathStyle NORMAL
     */
    download(fileId: string, fileName: string) {
        const url = "/api/radiation/safety/company/file";
        return axios
            .get<any>(url, { params: { fileId }, responseType: "blob" })
            .then(({ data }) => {
                const url = URL.createObjectURL(
                    new Blob([data], { type: "application/pdf" })
                ); //创建新的URL表示指定的blob对象
                const a = document.createElement("a"); //创建a标签
                a.style.display = "none";
                a.href = url; // 指定下载链接
                a.download = fileName; //指定下载文件名
                a.click(); //触发下载
                URL.revokeObjectURL(a.href); //释放URL对象
                return;
            });
    }
    /**
     * @NomosDefinePath /api/radiation/safety/service-station/online-trainings/{id}/video
     * @NomosDefinePathActions []
     * @NomosDefineRequestMethod GET
     * @NomosDefineRequestType json
     * @NomosDefineMethodName getVideo
     * @NomosDefineParameters [{"name":"id","type":{"family":"string"},"required":true,"isRequestBody":false,"description":"线上培训ID"}]
     * @NomosDefineSuccessResponse org.springframework.http.ResponseEntity<org.springframework.core.io.Resource>
     * @NomosDefineDescription "[线上培训]获取视频"
     * @NomosDefinePathStyle NORMAL
     */
    getVideo(id: string): Promise<any> {
        const url = `/api/radiation/safety/service-station/online-trainings/${id}/video`;
        return axios
            .get<any>(url, { params: { id } })
            .then(({ data }) => data);
    }
}

export const overWriteController = new OverWriteController();
