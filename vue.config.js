const webpack = require("webpack");
const { config, version } = require("./package");
const WebpackNotifierPlugin = require("webpack-notifier");
const path = require("path");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
// const pxtovw = require("postcss-px-to-viewport");

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
    publicPath: "./",
    parallel: true,
    transpileDependencies: true,
    configureWebpack: {
        devtool: process.env.NODE_ENV === "production" ? false : "source-map",
        plugins: [
            // new WebpackNotifierPlugin({
            //     alwaysNotify: true
            // }),
            // new BundleAnalyzerPlugin({
            // 	analyzerPort: 6543
            // })
        ],
    },
    css: {
        loaderOptions: {
            css: {},
            // postcss: {
            //     plugins: [
            // require("autoprefixer"),
            // require("postcss-px-to-viewport")({
            //     unitToConvert: "px", // 需要转换的单位，默认为"px"
            //     viewportWidth: 375, // 设计稿的视口宽度
            //     unitPrecision: 1, // 单位转换后保留的精度
            //     propList: ["*", "!font-size"], // 能转化为vw的属性列表,!font-size表示font-size后面的单位不会被转换
            //     viewportUnit: "vw", // 希望使用的视口单位
            //     fontViewportUnit: "vw", // 字体使用的视口单位
            //     // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
            //     // 下面配置表示类名中含有'keep-px'都不会被转换
            //     selectorBlackList: ["keep-px"],
            //     minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
            //     mediaQuery: false, // 媒体查询里的单位是否需要转换单位
            //     replace: true, //  是否直接更换属性值，而不添加备用属性
            //     exclude: [/node_modules/], // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
            //     include: [/src/], // 如果设置了include，那将只有匹配到的文件才会被转换
            //     landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件 @media (orientation: landscape)
            //     landscapeUnit: "vw", // 横屏时使用的单位
            //     landscapeWidth: 1338, // 横屏时使用的视口宽度
            // }),
            //     ],
            // },
        },
    },
    devServer: {
        proxy: {
            "^/authox": {
                target: "http://waterloo.radiationsafety-dev.svc.cluster.hz:32287",
                changeOrigin: true,
                pathRewrite: {
                    "^/authox": "",
                },
            },
            // 赋码
            "^/code": {
                target: "http://waterloo.radiationsafety-dev.svc.cluster.hz:32287",
                changeOrigin: true,
                pathRewrite: {
                    "^/code": "",
                },
            },
            //
            "^/api": {
                target: "http://waterloo.radiationsafety-dev.svc.cluster.hz:32287", // 胡泽宇
                changeOrigin: true,
            },
            //服务超市、知识库
            "/service": {
                target: "http://waterloo.radiationsafety-dev.svc.cluster.hz:32287", // 胡泽宇
                changeOrigin: true,
                pathRewrite: (path) => path.replace(/^\/service/, ""),
            },
            // 辐射源
            "/fsy": {
                // target: " http://121.40.98.68:4027",
                target: "http://waterloo.radiationsafety-dev.svc.cluster.hz:32287", // 胡泽宇 //最新waterloo 地址
                changeOrigin: true,
                pathRewrite: (path) => path.replace(/^\/fsy/, ""),
            },
            "^/gnet": {
                target: "http://gnet.bjljg-bjljg.svc.cluster.hz:32136/",
                changeOrigin: true,
                pathRewrite: {
                    "^/gnet": "",
                },
            },
        },
    },
    // configureWebpack: {
    //     // devtool: false,
    //     name: "false",
    //     optimization: {
    //         splitChunks: {
    //             chunks: "async",
    //             minSize: 1000,
    //             minChunks: 1,
    //             maxAsyncRequests: 10,
    //             maxInitialRequests: 5,
    //             automaticNameDelimiter: "~",
    //             name: true,
    //             cacheGroups: {
    //                 vendors: {
    //                     test: /[\\/]node_modules[\\/]/,
    //                     priority: -10,
    //                 },
    //                 default: {
    //                     minChunks: 1,
    //                     priority: -20,
    //                     reuseExistingChunk: true,
    //                 },
    //                 dll: {
    //                     test: /[\\/]node_modules[\\/](vue|vue-router|vuex|iview)[\\/]/,
    //                     name: "dll",
    //                     chunks: "all",
    //                 },
    //             },
    //         },
    //     },
    //     plugins: [
    //         new CompressionWebpackPlugin({
    //             test: new RegExp(
    //                 "\\.(" + productionGzipExtensions.join("|") + ")$"
    //             ),
    //             threshold: 10240,
    //             deleteOriginalAssets: false,
    //         }),
    //         new WebpackNotifierPlugin({ alwaysNotify: true }),
    //         new webpack.ProvidePlugin({
    //             jQuery: "jquery",
    //             $: "jquery",
    //         }),
    //     ],
    // },
};
