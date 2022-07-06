<template>
    <div id="app">
        <el-container>
            <el-header>怀化市一张图</el-header>
            <el-container class="app-inner-container">
                <el-aside width="60px">
                    <el-menu
                        default-active="1-4-1"
                        class="el-menu-vertical-demo"
                        background-color="#545c64"
                        :collapse="true"
                        :router="true"
                    >
                        <el-menu-item index="/">
                            <i class="el-icon-menu"></i>
                            <span slot="title">首页大屏</span>
                        </el-menu-item>
                        <el-menu-item index="/oneMap">
                            <i class="el-icon-place"></i>
                            <span slot="title">一张图</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main> 
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'App',
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
    background-color:#545c64;
    color: #333;
    text-align: center;
}
.el-main {
    padding: 5px !important;
}
.el-menu-vertical-demo{
    width: 59px !important;
    height: 660px;
}
</style>
