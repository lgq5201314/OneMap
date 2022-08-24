<template>
    <div class="homeScreen">
        <div id="SceneViewDiv"></div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
export default {
    name: 'homeScreen',
    mounted() {
        this._createSceneView()
    },
    methods: {
        async _createSceneView() {
            const [Map, SceneView, SceneLayer, WebScene] = await loadModules(
                [
                    'esri/Map',
                    'esri/views/SceneView',
                    "esri/layers/SceneLayer",
                    "esri/WebScene"
                ],
            );
            const scene = new WebScene({
                portalItem: { // autocasts as new PortalItem()
                    id: "f26c12e67cee46daba585b26c1431e7c"  // ID of the WebScene on arcgis.com
                }
            });
            // Create the SceneView
            const view = new SceneView({
                container: "SceneViewDiv",
                map: scene,
                camera: {
                    position: [114.1834, 22.2964, 30],
                    tilt: 88,
                    heading: 45
                }

            });

            console.log( view.environment.weather);
            view.environment.weather = { type: "cloudy" }
        }
    }

}
</script>

<style scoped>
.homeScreen,
#SceneViewDiv {
    position: relative;
    height: 100%;
    width: 100%;
}
</style>