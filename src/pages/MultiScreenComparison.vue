<template>
    <div class="MultiSC">
        <div class="colum-multisc">
            <span class="row-multisc" id="viewSpan1"></span>
            <span class="row-multisc" id="viewSpan2"></span>
        </div>
        <div class="colum-multisc">
            <span class="row-multisc" id="viewSpan3"></span>
            <span class="row-multisc" id="viewSpan4"></span>
        </div>
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
            const [Map, MapView, watchUtils] = await loadModules(
                ['esri/Map', 'esri/views/MapView', 'esri/core/watchUtils'],
                
            );

            const map1 = new Map({});
            const view1 = new MapView({
                container: 'viewSpan1',
                zoom: 2,
                map: map1,
                center: [96.63259442614239, 29.344800895997665],
                constraints: {
                    maxZoom: 4,
                    minZoom: 2,
                },
            });
            const layer1 = this.$store.state._defaultView.map.findLayerById('37917');
            map1.add(layer1);

            const map2 = new Map({});
            const view2 = new MapView({
                container: 'viewSpan2',
                map: map2,
                zoom: 2,
                extent: {
                    spatialReference: {
                        wkid: 102100,
                    },
                    xmax: 1.078642114113292e7,
                    xmin: 1.0739575610141763e7,
                    ymax: 3434354.1777849747,
                    ymin: 3403445.7862031814,
                },
            });
            const layer2 = this.$store.state._defaultView.map.findLayerById('37918');
            map2.add(layer2);

            const map3 = new Map({});
            const view3 = new MapView({
                container: 'viewSpan3',
                map: map3,
                zoom: 2,
                extent: {
                    spatialReference: {
                        wkid: 102100,
                    },
                    xmax: 1.078642114113292e7,
                    xmin: 1.0739575610141763e7,
                    ymax: 3434354.1777849747,
                    ymin: 3403445.7862031814,
                },
            });
            const layer3 = this.$store.state._defaultView.map.findLayerById('37919');
            map3.add(layer3);

            const map4 = new Map({});
            const view4 = new MapView({
                container: 'viewSpan4',
                map: map4,
                zoom: 2,
                extent: {
                    spatialReference: {
                        wkid: 102100,
                    },
                    xmax: 1.078642114113292e7,
                    xmin: 1.0739575610141763e7,
                    ymax: 3434354.1777849747,
                    ymin: 3403445.7862031814,
                },
            });
            const layer4 = this.$store.state._defaultView.map.findLayerById('37920');
            map4.add(layer4);

            view1.ui.components = [];
            view2.ui.components = [];
            view3.ui.components = [];
            view4.ui.components = [];

            // view1.on("click",e =>{
            //     console.log(e.x,e.y);
            //     let a = view1.toMap({x:e.x,y:e.y})
            //     console.log(a);
            // })
            watchUtils.whenTrue(view1, 'stationary', () => {
                if (view1.center) {
                    view2
                        .goTo({
                            center: [view1.center.longitude, view1.center.latitude],
                            zoom: view1.zoom,
                        })
                        .catch(function (error) {
                            console.error(error);
                        });
                    view3
                        .goTo({
                            center: [view1.center.longitude, view1.center.latitude],
                            zoom: view1.zoom,
                        })
                        .catch(function (error) {
                            console.error(error);
                        });
                    view4
                        .goTo({
                            center: [view1.center.longitude, view1.center.latitude],
                            zoom: view1.zoom,
                        })
                        .catch(function (error) {
                            console.error(error);
                        });
                }
            });
        },
    },
};
</script>

<style scoped>
.MultiSC {
    height: 100%;
}
.colum-multisc {
    margin-bottom: 2px;
    height: 50%;
    display: flex;
    justify-content: space-between;
}
.row-multisc {
    position: relative;
    border: 1px solid black;
    width: 50%;
    margin-left: 2px;
}
</style>