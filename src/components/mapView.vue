<template>
    <div id="viewDiv"></div>
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
            const option = {
                url: 'https://js.arcgis.com/4.18/init.js',
                css: 'https://js.arcgis.com/4.18/esri/themes/light/main.css',
            };
            const [Map, MapView, Basemap, TileLayer, FeatureLayer, BasemapToggle, ScaleBar] = await loadModules(
                [
                    'esri/Map',
                    'esri/views/MapView',
                    'esri/Basemap',
                    'esri/layers/TileLayer',
                    'esri/layers/FeatureLayer',
                    'esri/widgets/BasemapToggle',
                    'esri/widgets/ScaleBar',
                ],
                option,
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
                zoom: 10,
                center: [110.00836433837888, 27.537837400758733],
            });
            view.ui.components = []; //将默认ui设置为空
            this.$store.commit('_saveView', view);
            // const f = new FeatureLayer({
            //     url: 'https://services3.arcgis.com/U26uBjSD32d7xvm2/arcgis/rest/services/xzq_City_Mecator/FeatureServer/2',
            // });
            // map.add(f);
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
                unit:'metric'
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

<style>
#viewDiv {
    position: relative;
    height: 100%;
    width: 100%;
}
</style>