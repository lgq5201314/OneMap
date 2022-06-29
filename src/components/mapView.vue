<template>
    <div id="viewDiv"></div>
</template>

<script>
import { loadModules } from 'esri-loader';

export default {
    name: 'mapView',
    methods: {
        async _createMapView() {
            const option = {
                url: 'https://js.arcgis.com/4.19/init.js',
                css: 'https://js.arcgis.com/4.19/esri/themes/light/main.css',
            };
            const [Map, MapView, Basemap, TileLayer] = await loadModules(
                ['esri/Map', 'esri/views/MapView', 'esri/Basemap', 'esri/layers/TileLayer'],
                option,
            );

            // let basemap = new Basemap({
            //     baseLayers: [
            //         new TileLayer({
            //             url: 'http://map.geoq.cn/arcgiis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer',
            //             title: 'Basemap',
            //         }),
            //     ],
            //     title: 'basemap',
            //     id: 'basemap',
            // });

            let map = new Map({
                basemap: 'osm',
            });
            let view = new MapView({
                container: 'viewDiv',
                map: map,
                zoom: 10,
                center: [110.00836433837888, 27.537837400758733],
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