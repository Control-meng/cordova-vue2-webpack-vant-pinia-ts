# zlfa-app-supervise

套壳app方案：cordova+ionic+vue2+ts,前端框架基于vue-cli脚手架进行搭建，采用引入vue-demi，使用组合式api方式进行编写，基本上开箱即用

# 相关文档
- [设计图](https://codesign.qq.com/app/design/2bzpZvleDk9kAaV/board?team_id=dDyopjDxV3jVe1g)
- [vant2](https://youzan.github.io/vant/#/zh-CN/)
- [pinia](https://pinia.vuejs.org/)
- [vueuse](https://vueuse.org/)
- [设计稿](https://codesign.qq.com/app/design/2bzpZvleDk9kAaV/board?team_id=dDyopjDxV3jVe1g)
- [浙政钉开放api](https://open.dingtalk.com/document/)

## 第三方常用指令
- [热键绑定v-hotkey](https://github.com/Dafrok/v-hotkey)
- [空白处点击联动V-Click-Outside](https://github.com/ndelvalle/v-click-outside)
- [复制到粘贴板V-Clipboard](https://github.com/euvl/v-clipboard)
- [跳转滚动Vue-ScrollTo](https://github.com/rigor789/vue-scrollTo)
- [图片懒加载Vue-Lazyload](https://github.com/hilongjw/vue-lazyload)
- [文字截取Vue-Clampy](https://github.com/clampy-js/vue-clampy)
- [点击波纹效果Vue-Ripple-Directive](https://github.com/PygmySlowLoris/vue-ripple-directive)
- [自动聚焦v-focus](#)
- 
## 运行
- 下载依赖`yarn install`
- 浏览器运行
  - `yarn serve`
- 打包
  - 打包网页端:`yarn build`
  - 打包app:
    - 构建cordova目录(生成`www`目录)
      - 开发时构建：`yarn cordova-dev`或者`yarn cordova-dev:watch`
      - 生产时构建:`yarn cordova-prod`
    - 添加安卓或者苹果`platforms`
      - 添加安卓:`yarn cordova:add:android`
      - 添加苹果:`cordova:add:ios`
    - 打包app(二选一):
      - `cordova build android --release --buildConfig` 
      - `cordova build android --release --buildConfig=build.json -- --gradleArg=-PcdvBuildMultipleApks=true`
## 调试
### 有线
- 调试手机开启开发者模式,开启usb调试
- 手机链接电脑,并选择文件传输模式
- 终端开启调试监听:`yarn cordova-dev:watch`
- 另开终端,将调试app打包并安装到手机`yarn cordova:android`
- 打开`edege`浏览器打开`edge://inspect`
- 找到对应的应用即可看到请求信息进行调试
### 无线
- 使用插件`vconsole`
- 安装`vconsole`依赖包,创建vconsole实例即可
```ts
// 简易使用
// main.ts
import VConsole from "vconsole";
if (process.env.NODE_ENV === "development" && window.cordova) {
    new VConsole();
}


