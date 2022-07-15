<template>
    <div class="xzqNav-panel" v-if="visiable">
        <div class="xzqNav-header">
            <div class="xzqNav-title">行政区导航</div>
            <div class="icon-close" @click="closePlane"><i class="el-icon-close"></i></div>
        </div>
        <div class="xzqNav-main">
            <div class="xzqNav-main-title">省份：</div>
            <el-autocomplete
                class="xzqNav-search"
                v-model="state"
                :fetch-suggestions="querySearchAsync"
                placeholder="请点击下拉框选择省份"
                size="medium "
                @select="handleSelect"
            ></el-autocomplete>
        </div>
        <div class="xzqNav-context">
            <el-empty description="描述文字" v-show="empty"></el-empty>
            <div class="zxqNav-context-layer" v-for="value in xqResult" :key="value.code">
                <div class="xqNav-context-city">{{ value.cities }}</div>
                <ul class="xqNav-context-counties">
                    <li
                        class="xqNav-context-county"
                        v-for="(item, index) in value.childrens"
                        :key="index"
                        @click="queryGotoCounty(item.code)"
                    >
                        {{ item.counties }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
const option = {
    url: 'https://js.arcgis.com/4.18/init.js',
    css: 'https://js.arcgis.com/4.18/esri/themes/light/main.css',
};
export default {
    name: 'xzqNavigation',
    data() {
        return {
            empty:true,
            visiable: false,
            xzqResult: [],
            xqResult: [],
            state: '',
            polygonGraphic: null,
        };
    },
    methods: {
        closePlane() {
            this.visiable = false;
        },
        async loadAll() {
            const [QueryTask, Query, FeatureLayer] = await loadModules(
                ['esri/tasks/QueryTask', 'esri/tasks/support/Query', 'esri/layers/FeatureLayer'],
                option,
            );

            let countyLayerurl =
                'https://services3.arcgis.com/U26uBjSD32d7xvm2/ArcGIS/rest/services/xzq_County_Mecator/FeatureServer/3';
            let querCountyTask = new QueryTask({
                url: countyLayerurl,
            });
            let queryCounties = new Query();
            queryCounties.returnGeometry = false;
            queryCounties.outFields = ['*'];
            queryCounties.where = '1=1';

            let resultsCounties = await querCountyTask.execute(queryCounties);
            // 省
            let provinceArr = [];
            // 市
            let citiesArr = [];
            // 县
            let countiesArr = [];
            let objProvince = {};
            let objCities = {};
            let objCounties = {};
            resultsCounties.features.map((item) => {
                // 省去重
                if (!objProvince[item.attributes['省']]) {
                    provinceArr.push({
                        value: item.attributes['省'],
                        code: item.attributes['省代码'],
                        childrens: [],
                    });
                    objProvince[item.attributes['省']] = true;
                }
                // 市去重
                if (!objCities[item.attributes['市']]) {
                    citiesArr.push({
                        cities: item.attributes['市'],
                        code: item.attributes['市代码'],
                        provinceCode: item.attributes['省代码'],
                        childrens: [],
                    });
                    objCities[item.attributes['市']] = true;
                }
                // 县,区去重
                if (!objCounties[item.attributes['NAME']]) {
                    countiesArr.push({
                        counties: item.attributes['NAME'],
                        citiesCode: item.attributes['市代码'],
                        code: item.attributes.PAC,
                    });
                    objCounties[item.attributes['NAME']] = true;
                }
            });
            // 构造树形结构
            let obj = {};
            provinceArr.forEach((value1) => {
                citiesArr.forEach((value2) => {
                    countiesArr.forEach((value3) => {
                        if (value1.code == value2.provinceCode && value2.code == value3.citiesCode) {
                            value2.childrens.push({
                                counties: value3.counties,
                                code: value3.code,
                            });
                            if (!obj[value2.code]) {
                                value1.childrens.push(value2);
                                obj[value2.code] = true;
                            }
                        }
                    });
                });
            });
            this.xzqResult = provinceArr;
        },
        // 下拉框显示
        querySearchAsync(queryString, cb) {
            cb(this.xzqResult);
        },
        async queryProvince(result, url, zoom) {
            const [QueryTask, Query, Graphic] = await loadModules(
                ['esri/tasks/QueryTask', 'esri/tasks/support/Query', 'esri/Graphic'],
                option,
            );
            // symbol定义
            var sym = {
                type: 'simple-fill', // autocasts as new SimpleFillSymbol()
                // color: 'red',
                outline: {
                    // autocasts as new SimpleLineSymbol()
                    color: '#00FFFF',
                    width: '3px',
                },
            };
            let queryProvinceTask = new QueryTask({ url });
            var queryProvince = new Query();
            queryProvince.returnGeometry = true;
            queryProvince.outFields = ['*'];
            queryProvince.where = result;

            // When resolved, returns features and graphics that satisfy the query.
            let resultsProvince = await queryProvinceTask.execute(queryProvince);

            let g = resultsProvince.features[0].geometry;
            // 图层只允许存在一个
            if (this.polygonGraphic) {
                this.$store.state._defaultView.graphics.remove(this.polygonGraphic);
            }
            this.polygonGraphic = new Graphic({
                geometry: g,
                symbol: sym,
            });
            // 将查询到的geometry添加到地图中

            this.$store.state._defaultView.graphics.add(this.polygonGraphic);
            debugger;
            // 跳转并高亮
            this.$store.state._defaultView
                .goTo(
                    {
                        target: this.polygonGraphic,
                        zoom,
                    },
                    {
                        duration: 5000, // Duration of animation will be 5 seconds
                    },
                )
                .catch((error) => {
                    console.error(error);
                });
        },
        // 下拉选中时触发
        handleSelect(result) {
            let Result = this.xzqResult.filter((item) => {
                return item.value == result.value;
            });
            this.empty = false
            this.xqResult = Result[0].childrens;
            let url =
                ' https://services3.arcgis.com/U26uBjSD32d7xvm2/ArcGIS/rest/services/xzq_Province_Mecator/FeatureServer/4 ';
            let Str = `省 = '${result.value}'`;
            this.queryProvince(Str, url, 6);
        },
        queryGotoCounty(code) {
            let str = ` PAC = '${code}' `;
            let url =
                'https://services3.arcgis.com/U26uBjSD32d7xvm2/ArcGIS/rest/services/xzq_County_Mecator/FeatureServer/3';
            this.queryProvince(str, url, 11);
        },
    },
    mounted() {
        this.loadAll();
        this.$bus.$on('contorXzqNav', () => (this.visiable = true));
    },
};
</script>

<style scoped>
.xzqNav-panel {
    position: absolute !important;
    top: 5px;
    left: 5px;
    width: 380px;
    height: 480px;
    background-color: white;
    border: 1px solid rgba(0, 0, 0, 0.6);
    border-radius: 10px;
    z-index: 2;
    box-shadow: 0 16px 32px 0 rgba(48, 55, 66, 0.6);
}
.xzqNav-header {
    height: 36px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
.xzqNav-title {
    float: left;
    font-weight: 700;
    font-size: 16px;
    margin-left: 15px;
    line-height: 36px;
}
.icon-close {
    float: right;
    width: 24px;
    height: 24px;
    line-height: 36px;
}
.xzqNav-main {
    height: 42px;
}
.xzqNav-main-title {
    padding-left: 12px;
    float: left;
    line-height: 42px;
    font-size: 14px;
    font-weight: 700;
    margin-left: 5px;
}
.xzqNav-search {
    float: left;
    line-height: 42px;
}
.xzqNav-context {
    box-sizing: border-box;
    width: 380px;
    height: 390px;
    padding-left: 16px;
    overflow-y: scroll;
}
.zxqNav-context-layer {
    /* padding: 6px; */
    width: 100%;
}
.xqNav-context-city {
    font-size: 14px;
    font-weight: 700;
    height: 25px;
}
.xqNav-context-counties {
    display: flex;
    flex-wrap: wrap;
}
ul > .xqNav-context-county {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 50px;
    height: 25px;
}
ul > .xqNav-context-county:hover {
    cursor: pointer;
    color: rgb(36, 104, 222, 0.8);
}
/* 设置滚动条的样式 */
.xzqNav-context::-webkit-scrollbar {
    width: 5px;
}
/* 滚动槽 */
.xzqNav-context::-webkit-scrollbar-track {
    box-shadow: inset006pxrgba(0, 0, 0, 0.3);
    border-radius: 10px;
}
/* 滚动条滑块 */
.xzqNav-context::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: rgba(76, 89, 235, 0.8);
    box-shadow: inset006pxrgba(0, 0, 0, 0.5);
}
</style>