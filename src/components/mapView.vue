<template>
    <div c>
        <div id="viewDiv"></div>
        <div class="transfor23d">3D</div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
export default {
    name: 'mapView',
    data() {
        return {
            props: {
                label: 'name',
                children: 'zones',
            },
            count: 1,
        };
    },
    methods: {
        async _createMapView() {
            const [Map, MapView, Basemap, TileLayer, BasemapToggle, ScaleBar] = await loadModules(
                [
                    'esri/Map',
                    'esri/views/MapView',
                    'esri/Basemap',
                    'esri/layers/TileLayer',
                    'esri/widgets/BasemapToggle',
                    'esri/widgets/ScaleBar',
                ],
            );
            const basemap = new Basemap({
                baseLayers: [
                    new TileLayer({
                        url: 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/',
                        title: 'Basemap',
                    }),
                ],
                title: 'basemap',
                id: 'basemap',
            });
            const map = new Map({
                basemap,
            });
            const view = new MapView({
                container: 'viewDiv',
                map: map,
                zoom: 5,
                extent: {
                    spatialReference: {
                        wkid: 102100,
                    },
                    xmax: 12718976.9077,
                    xmin: 12110014.4544,
                    ymax: 3520103.8329,
                    ymin: 2831969.5243,
                },
            });
            window.mapview = view;
            // this.__proto__.__proto__.$mapView = view 
            view.ui.components = []; //将默认ui设置为空
            //地图控件
            let basemapToggle = new BasemapToggle({
                view: view, // The view that provides access to the map's "streets-vector" basemap
                nextBasemap: 'hybrid', // Allows for toggling to the "hybrid" basemap
                container: document.createElement('div'),
            });
            view.ui.add(basemapToggle, {
                position: 'bottom-right',
            });
            //比例尺
            let scaleBar = new ScaleBar({
                view: view,
                unit: 'metric',
            });
            // Add widget to the bottom left corner of the view
            view.ui.add(scaleBar, {
                position: 'bottom-left',
            });
        },
    },
    mounted() {
        this._createMapView();
    },
};
</script>

<style scoped>
#viewDiv {
    position: relative;
    height: 640px;
    width: 100%;
}
.transfor23d{
    position: absolute;
    width: 40px;
    height: 40px;
    bottom: 120px;
    right: 20px;
    background-color: #fff;
    font-size: 20px;
    line-height: 40px;
    text-align: center;
}
</style>