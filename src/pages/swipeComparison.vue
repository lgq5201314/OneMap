<template>
    <div class="swipeAnalysis">
        <div id="viewDiv"></div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';

export default {
    name: 'MultiScreenComparison',
    components: {},
    mounted() {
        this._initMap();
    },
    methods: {
        async _initMap() {
            const [Map, MapView,TileLayer,LayerList,Swipe,Expand] = await loadModules(
                [
                    'esri/Map',
                    'esri/views/MapView',
                    'esri/layers/TileLayer',
                    'esri/widgets/LayerList',
                    'esri/widgets/Swipe',
                    'esri/widgets/Expand',
                ],
                
            );

            const map = new Map({
                basemap: 'satellite',
            });

            const infrared = new TileLayer({
                url: 'https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/WV03_Kilauea_20180519_ShortwaveInfrared/MapServer',
                maxScale: 3000,
            });
            map.add(infrared);

            const nearInfrared = new TileLayer({
                url: 'https://tiles.arcgis.com/tiles/P3ePLMYs2RVChkJx/arcgis/rest/services/WV03_Kilauea_20180519_NearInfrared/MapServer',
                maxScale: 3000,
            });
            map.add(nearInfrared);

            const view = new MapView({
                container: 'viewDiv',
                map: map,
                zoom: 14,
                center: [-154.88, 19.46], // longitude, latitude
                constraints: {
                    maxZoom: 17,
                    minZoom: 8,
                },
            });

            // create a layerlist and expand widget and add to the view
            const layerList = new LayerList({
                view: view,
            });
            const llExpand = new Expand({
                view: view,
                content: layerList,
                expanded: false,
            });
            view.ui.add(llExpand, 'top-right');

            // create a new Swipe widget
            const swipe = new Swipe({
                leadingLayers: [infrared],
                trailingLayers: [nearInfrared],
                position: 35, // set position of widget to 35%
                view: view,
            });

            // add the widget to the view
            view.ui.add(swipe);
        },
    },
};
</script>

<style scoped>
#viewDiv{
    height: 700px;
}
</style>