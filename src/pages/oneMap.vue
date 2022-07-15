<template>
    <div class="w">
        <mapView />
        <catalogueTreeVue />
        <mapTool />
        <xzqNavigation />
    </div>
</template>

<script>
import catalogueTreeVue from '../components/catalogueTree';
import mapView from '../components/mapView';
import mapTool from '../components/mapTool';
import xzqNavigation from '../components/xzqNavigation';
export default {
    name: 'oneMap',
    components: {
        mapView,
        catalogueTreeVue,
        mapTool,
        xzqNavigation 
    },
};
</script>

<style>
.w {
    position: relative;
    height: 100%;
    width: 100%;
}
</style>