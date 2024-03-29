import vue from "vue";
import VueRouter from "vue-router";
import oneMap from '../pages/oneMap';
import homeScreen from "../pages/homeScreen"
import MultiScreenComparison from "../pages/MultiScreenComparison"
import swipeComparison from "../pages/swipeComparison"
// 使用插件
vue.use(VueRouter);
// 配置路由
export default new VueRouter({
    routes:[
        {
            path:'/',
            component:homeScreen
        },
        {
            path:'/oneMap',
            component:oneMap
        },
        {
            path:'/MultiScreenComparison',
            component:MultiScreenComparison
        },
        {
            path:'/MultiScreenComparison',
            component:MultiScreenComparison
        },
        {
            path:'/swipeComparison',
            component:swipeComparison
        }
    ]
})