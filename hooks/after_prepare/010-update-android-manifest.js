#!/usr/bin/env node

var fs = require("fs");
var path = require("path");

var fileExists = function (filePath) {
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
};

var root = process.cwd();
console.log(root);
var androidManifest;
var cordovaAndroid6Path = path.join(
    root,
    "platforms/android/AndroidManifest.xml"
);
var cordovaAndroid7Path = path.join(
    root,
    "platforms/android/app/src/main/AndroidManifest.xml"
);
if (fileExists(cordovaAndroid7Path)) {
    androidManifest = cordovaAndroid7Path;
} else if (fileExists(cordovaAndroid6Path)) {
    androidManifest = cordovaAndroid6Path;
} else {
    throw "Can't find AndroidManifest.xml";
}

var txt = fs.readFileSync(androidManifest, "utf8");
var lines = txt.split("\n");
var searchingFor = "<application";
var newManifest = [];
var largeHeap = 'android:largeHeap="true"';
var usesCleartextTraffic = 'android:usesCleartextTraffic="true"';
var requestLegacyExternalStorage =
    'android:requestLegacyExternalStorage="true"';
let map = {};
const an = /android:name=\"(.+?)\"/i;
lines.forEach(function (line) {
    if (line.includes("<uses-feature") || line.includes("<uses-permission")) {
        const e = an.exec(line);
        if (e[1] && !map[e[1]]) {
            map[e[1]] = true;
        } else {
            return;
        }
    }
    if (line.trim().indexOf(searchingFor) !== -1) {
        //查找<application
        if (
            line.trim().indexOf(largeHeap) >= 0 &&
            line.trim().indexOf(usesCleartextTraffic) >= 0 &&
            line.trim().indexOf(requestLegacyExternalStorage) >= 0
        ) {
            //largeHeap,usesCleartextTraffic,requestLegacyExternalStorage都存在则不修改
            newManifest.push(line);
        } else {
            var add = "";
            if (line.trim().indexOf(largeHeap) <= -1) {
                add = add + " " + largeHeap;
            }
            if (line.trim().indexOf(usesCleartextTraffic) <= -1) {
                add = add + " " + usesCleartextTraffic;
            }
            if (line.trim().indexOf(requestLegacyExternalStorage) <= -1) {
                add = add + " " + requestLegacyExternalStorage;
            }
            newManifest.push(
                line.replace("<application", "<application" + add)
            );
            console.log(
                "after_prepare_hoos: add largeHeap,usesCleartextTraffic,requestLegacyExternalStorage success"
            );
        }
    } else if (
        line.trim().indexOf("<uses-permission") !== -1 &&
        line.trim().indexOf("android.permission.CAMERA") !== -1 &&
        line.trim().indexOf("android:required") !== -1
    ) {
        newManifest.push(
            line
                .replace('android:required="false"', "")
                .replace("android:required='false'", "")
        );
        console.log(
            'after_prepare_hoos: remove CAMERA android:required="false" -> "" '
        );
    } else if (
        line.trim().indexOf("<uses-feature") !== -1 &&
        line.trim().indexOf("android.hardware.camera") !== -1 &&
        line.trim().indexOf("android:required") !== -1
    ) {
        newManifest.push(
            line
                .replace('android:required="true"', "")
                .replace("android:required='true'", "")
                .replace('android:required="false"', "")
                .replace("android:required='false'", "")
        );
        console.log(
            'after_prepare_hoos: replace android.hardware.camera android:required -> "" '
        );
    } else {
        newManifest.push(line);
    }
});

fs.writeFileSync(androidManifest, newManifest.join("\n"));
