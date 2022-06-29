<template>
    <div id="app">
        <el-container>
            <el-header>怀化市一张图</el-header>
            <el-container class="app-inner-container">
                <el-aside width="200px">菜单栏</el-aside>
                <el-main> <mapView /></el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import mapView from '../src/components/mapView';

export default {
    name: 'App',
    components: {
        mapView,
    },
};
</script>

<style>
.el-header {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    line-height: 60px;
}
.app-inner-container {
    height: 660px;
}
.el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
}
</style>
