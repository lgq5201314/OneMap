<template>
  <div class="w">
    <mapView/>
    <catalogueTreeVue/>
    <mapTool/>
  </div>
</template>

<script>
import catalogueTreeVue from '../components/catalogueTree';
import mapView from '../components/mapView';
import mapTool from '../components/mapTool';
export default {
    name:'oneMap',
     components: {
        mapView,
        catalogueTreeVue,
        mapTool
    },
}
</script>

<style>
.w{
   position: relative;
   height: 100%;
   width: 100%;
}
</style>