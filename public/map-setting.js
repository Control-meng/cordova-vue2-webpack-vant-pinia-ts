window.mapConfig = {
    map: {
        id: "baseMap",
        events: [
            "singleclick",
            "pointermove",
            "pointermove-blank",
            "singleclick-blank",
        ],
    },
    view: {
        center: {
            coord: [120.15, 29],
        },
        zoom: 16,
        maxZoom: 18,
    },
    controls: [
        {
            name: "zoom",
            config: {
                zoomInTipLabel: "放大",
                zoomOutTipLabel: "缩小",
            },
        },
    ],
    baseLayer: [
        // {
        //     name: 'bd',
        //     source: {
        //         type: 'bdTileImage',
        //         intranet: false,
        //     },
        // },
        // 底层地图-天地图
        // {
        //     name: 'tdt_sl_base',
        //     source: {
        //         type: 'XYZ',
        //         url: 'http://t{0-7}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=59d3a78163c2741d6aa0cb12f77fa62a',
        //     },
        // },
        // //
        // {
        //     name: 'tdt_sl_txt',
        //     source: {
        //         type: 'XYZ',
        //         url: 'http://t{0-7}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=59d3a78163c2741d6aa0cb12f77fa62a',
        //     },
        // },
        // 天地图-影像
        {
            name: "tdt_yx_base",
            source: {
                type: "XYZ",
                url: "http://t{0-7}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=59d3a78163c2741d6aa0cb12f77fa62a",
            },
        },
        {
            name: "tdt_yx_txt",
            source: {
                type: "XYZ",
                url: "http://t{0-7}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=59d3a78163c2741d6aa0cb12f77fa62a",
            },
        },
    ],
};
