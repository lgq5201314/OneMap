<template>
    <div class="tool-panel">
        <ul class="tool" @click="handleTool">
            <li>行政区导航</li>

            <li>目录树管理</li>
            <li>
                <el-dropdown @command="mapMeasure">
                    <span class="el-dropdown-link"> 地图测量<i class="el-icon-arrow-down el-icon--right"></i> </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="面积测量">面积测量</el-dropdown-item>
                        <el-dropdown-item command="长度测量">长度测量</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </li>
            <li>
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link"> 更多功能<i class="el-icon-arrow-down el-icon--right"></i> </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="空间查询"><i class="el-icon-camera"></i>空间查询</el-dropdown-item>
                        <el-dropdown-item command="多屏对比">多屏对比</el-dropdown-item>
                        <el-dropdown-item command="卷帘分析">卷帘分析</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </li>

            <li>清除</li>
        </ul>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
export default {
    name: 'mapTool',
    data() {
        return {};
    },
    methods: {
        handleTool(e) {
            let value = e.target.innerText;
            switch (value) {
                case '行政区导航':
                    this.$bus.$emit('contorXzqNav');
                    break;
                case '目录树管理':
                    this.$bus.$emit('contorTree');
                    break;

                case '清除':
                    break;
            }
        },
        handleCommand(command) {
            switch (command) {
                case '空间查询':
                    this.spatialQuery();
                    break;
                case '多屏对比':
                    this.$router.push({ path: '/MultiScreenComparison' });
                    break;
                case '卷帘分析':
                    this.$router.push({ path: '/swipeComparison' });
                    break;
            }
        },
        async mapMeasure(command) {
            debugger;
            const [
                Graphic,
                GraphicsLayer,
                SketchViewModel,
                GeometryService,
                AreasAndLengthsParameters,
                LengthsParameters,
            ] = await loadModules(
                [
                    'esri/Graphic',
                    'esri/layers/GraphicsLayer',
                    'esri/widgets/Sketch/SketchViewModel',
                    'esri/tasks/GeometryService',
                    'esri/tasks/support/AreasAndLengthsParameters',
                    'esri/tasks/support/LengthsParameters',
                ],
            );
            let _this = this;
            let view = window.mapview;
            // 几何图层
            const glayer = new GraphicsLayer({
                id: 'MeasureArcDis',
                elevationInfo: 'on-the-ground',
            });
            view.map.add(glayer);
            // 面样式
            let polygonSymbol = {
                type: 'simple-fill',
                color: [110, 70, 150, 0.8],
                outline: {
                    color: [50, 50, 50],
                    width: 2,
                },
            };
            // 线样式
            let polylineSymbol = {
                type: 'simple-fill',
                color: [110, 70, 150, 0.8],
                outline: {
                    color: [50, 50, 50],
                    width: 2,
                },
            };
            // 画笔
            var sketchVM = new SketchViewModel({
                layer: glayer,
                updateOnGraphicClick: false,
                view,
                polygonSymbol,
            });
            // 几何服务
            const gService = new GeometryService({
                url: 'https://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer',
            });

            if (command == '面积测量') {
                // 面积参数
                const areasAndlength = new AreasAndLengthsParameters();
                areasAndlength.areaUnit = 'square-kilometers';
                areasAndlength.calculationType = 'preserve-shape';
                areasAndlength.lengthUnit = 'kilometers';
                sketchVM.create('polygon');
                // Listen to sketchViewModel's create event.
                sketchVM.on('create', function (event) {
                    if (event.state == 'complete') {
                        areasAndlength.polygons = [event.graphic.geometry];
                        gService
                            .areasAndLengths(areasAndlength)
                            .then((results) => {
                                console.log(results.areas);
                                gService.labelPoints(areasAndlength.polygons).then(function (labelPoints) {
                                    var graphics = labelPoints.map(function (labelPoint, i) {
                                        var textSymbol = {
                                            type: 'text', // autocasts as new TextSymbol()
                                            color: 'white',
                                            haloColor: 'black',
                                            haloSize: '1px',
                                            text: results.areas,
                                            xoffset: 3,
                                            yoffset: 3,
                                            font: {
                                                // autocast as new Font()
                                                size: 12,
                                                family: 'sans-serif',
                                                weight: 'bolder',
                                            },
                                        };
                                        var labelPointGraphic = new Graphic({
                                            geometry: labelPoint,
                                            symbol: textSymbol,
                                        });
                                        return labelPointGraphic;
                                    });

                                    // add the labels to the map
                                    view.graphics.addMany(graphics);
                                });
                            })
                            .catch((e) => {
                                _this.$message('服务请求失败!');
                            });
                    }
                });
            } else if (command == '长度测量') {
                const lengthParam = new LengthsParameters();
                sketchVM.create('polyline');
                sketchVM.on('create', function (event) {
                    if (event.state == 'complete') {
                        debugger;

                        lengthParam.geodesic = false;
                        lengthParam.polylines = [event.graphic.geometry];
                        gService
                            .lengths(lengthParam)
                            .then((result) => {
                                console.log(result);
                            })
                            .catch((e) => {
                                _this.$message(e.message);
                            });
                    }
                });
            }
        },
        async spatialQuery() {
            const [Graphic, GraphicsLayer, SketchViewModel] = await loadModules(
                ['esri/Graphic', 'esri/layers/GraphicsLayer', 'esri/widgets/Sketch/SketchViewModel'],
            );
            let _this = this;
            const view = window.mapview
            const glayer = new GraphicsLayer({
                id: 'svmPolygon',
                elevationInfo: 'on-the-ground',
            });
            let polygonSymbol = {
                type: 'simple-fill',
                color: [110, 70, 150, 0.8],
                outline: {
                    color: [50, 50, 50],
                    width: 2,
                },
            };
            view.map.add(glayer);
            var sketchVM = new SketchViewModel({
                layer: glayer,
                updateOnGraphicClick: false,
                view,
                polygonSymbol,
            });
            sketchVM.create('polygon');
            // Listen to sketchViewModel's create event.
            sketchVM.on('create', function (event) {
                if (event.state == 'complete') {
                    let sketchGeometry = event.graphic.geometry;
                    _this.queryTrainstation(sketchGeometry, view);
                }
            });
        },
        queryTrainstation(geometry, view) {
            let _this = this;
            const ftlayer = view.map.findLayerById('37916');
            if (!ftlayer) {
                this.$message({
                    message: '请添加要素图层进行查询！',
                    type: 'warning',
                });
                let svmlayer = view.map.findLayerById('svmPolygon');
                view.map.remove(svmlayer);
                return;
            }
            const query = ftlayer.createQuery();
            query.geometry = geometry;
            query.returnGeometry = true;
            query.spatialRelationship = 'intersects';
            ftlayer
                .queryFeatures(query)
                .then(function (FeatureSet) {
                    if (FeatureSet.features.length > 0) {
                        _this.creatftLayerByClient(FeatureSet, view);
                        _this.buildTableData(FeatureSet);
                    } else {
                        this.$message('选择的地块没有数据！');
                    }
                })
                .catch((error) => {
                    console.log(error);
                    this.$message('空间查询失败！');
                });
        },
        // 从客户端构建FeatureLayer
        async creatftLayerByClient(FeatureSet, view) {
            const [FeatureLayer] = await loadModules(['esri/layers/FeatureLayer']);
            let svmlayer = view.map.findLayerById('svmPolygon');
            let ftlayer = view.map.findLayerById('initResultLayer');
            if (ftlayer) {
                // 清除上一次绘制查询的结果
                view.map.removeMany([ftlayer, svmlayer]);
            }
            let graphics = [];
            FeatureSet.features.forEach((element, index) => {
                graphics.push({
                    geometry: {
                        type: 'point',
                        x: element.geometry.x,
                        y: element.geometry.y,
                        spatialReference: {
                            wkid: 102100,
                        },
                    },
                    attributes: {
                        ObjectID: index + 1,
                        city: element.attributes['市'],
                        type: element.attributes['性质'],
                        province: element.attributes['省'],
                        name: element.attributes['站名'],
                        address: element.attributes['车站地'],
                        Ownership: element.attributes['铁路局'],
                    },
                });
            });
            const popupTemplate = {
                title: '权属单位：{province}{city}{Ownership}',
                content: [
                    {
                        type: 'fields',
                        fieldInfos: [
                            {
                                fieldName: 'name',
                                label: '站点名',
                            },
                            {
                                fieldName: 'address',
                                label: '地址',
                            },
                            {
                                fieldName: 'type',
                                label: '性质',
                            },
                        ],
                    },
                ],
            };
            const layer = new FeatureLayer({
                source: graphics, // array of graphics objects
                id: 'initResultLayer',
                objectIdField: 'ObjectID',
                // spatialReference: { wkid: 102100 },
                fields: [
                    {
                        name: 'ObjectID',
                        type: 'oid',
                    },
                    {
                        name: 'city',
                        type: 'string',
                    },
                    {
                        name: 'type',
                        type: 'string',
                    },
                    {
                        name: 'city',
                        type: 'string',
                    },
                    {
                        name: 'province',
                        type: 'string',
                    },
                    {
                        name: 'name',
                        type: 'string',
                    },
                    {
                        name: 'address',
                        type: 'string',
                    },
                    {
                        name: 'Ownership',
                        type: 'string',
                    },
                ],

                popupTemplate,
                renderer: {
                    // overrides the layer's default renderer
                    type: 'simple',
                    symbol: {
                        type: 'simple-marker', // autocasts as new SimpleMarkerSymbol()
                        size: 20,
                        path: 'M913.45 846.22L838 791.77v-527.8c0-71.21-50.58-121.8-121.79-121.8h-406c-71.21 0-121.79 50.59-121.79 121.8v527.79l-73.57 54.45c-10.17 10.17-10.17 20.34 0 30.52 0 5.09 5.09 5.09 10.18 5.09 5.08 0 10.17 0 15.26-5.09l129.33-84.97c2.31 1.16 51.82-1.15 487.19 0l121.05 84.97c5.09 5.09 10.17 5.09 15.26 5.09s10.17 0 15.26-5.09c10.16-10.17 10.16-20.34 5.07-30.51zM308.04 703.79c-30.53 0-50.87-25.44-50.87-50.87 0-30.52 25.44-50.87 50.87-50.87 30.52 0 50.86 25.43 50.86 50.87 5.09 30.52-20.34 50.87-50.86 50.87z m76.3-178.04c-71.22 0-127.17-10.27-127.17-71.31V322.1c-0.02-61.03 52.92-99.71 115.08-99.2 6.97 3.33 262.75 0.48 304.76 1.27 31.78-0.75 89.08 41.97 89.01 97.93v96.84c0 55.95-55.95 106.82-127.16 106.82H384.34z m335.91 178.04c-30.53 0-50.87-25.44-50.87-50.87 0-30.52 25.44-50.87 50.87-50.87 30.51 0 50.86 25.43 50.86 50.87 0.01 30.52-20.34 50.87-50.86 50.87z',
                        outline: null,
                    },
                },
            });
            view.map.add(layer);
        },
        // 构建表格数据
        buildTableData(FeatureSet) { },
    },
};
</script>

<style scoped>
.tool-panel .tool {
    font-size: 14px;
    font-weight: 600;
    position: absolute;
    top: 10px;
    right: 10px;
    width: 380px;
    height: 40px;
    background: rgb(194, 210, 236);
    display: flex;
    border-radius: 5px;
}

.tool-panel .tool li {
    flex-grow: 1;
    line-height: 40px;
    text-align: center;
}

.tool li:hover {
    border-radius: 2px;
    background: rgb(252, 252, 252);
    cursor: pointer;
    color: #409eff;
}

.tool-panel .tool span {
    display: block;
    line-height: 40px;
}

.el-dropdown-link {
    color: black;
    font-size: 14px;
}

.el-dropdown-link:hover {
    color: #409eff;
}

.el-icon-arrow-down {
    font-size: 12px;
}
</style>