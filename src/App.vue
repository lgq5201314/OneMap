<template>
    <div id="app">
        <el-container>
            <el-header>Header</el-header>
            <el-container>
                <el-aside width="200px">Aside</el-aside>
                <el-main>Main</el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'App',
    components: {},
};
</script>

<style>
.el-header {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    line-height: 60px;
}
.el-aside {
    background-color: #d3dce6;
    color: #333;
    text-align: center;
     line-height: 620px;
}
.el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    line-height: 620px;
}
</style>
