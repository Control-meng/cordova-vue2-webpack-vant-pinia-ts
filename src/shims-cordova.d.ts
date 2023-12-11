import cordova from "cordova";
import Core from "@vue/runtime-core";
import Expec from "suc-cordova-expec/www/suc_expec_plugin";

declare global {
    interface Window {
        $app: any;
        QRScanner: any;
        Expec: any;
        body: HTMLBodyElement;
    }
}
