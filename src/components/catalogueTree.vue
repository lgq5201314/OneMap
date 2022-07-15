<template>
    <div class="tree-panel" v-show="visiable">
        <div class="tree-content">
            <div class="tree-title">目录树管理</div>
            <div class="icon-close"><i class="el-icon-close" @click="closePlane"></i></div>
        </div>
        <el-tree
            ref="tree"
            :data="data"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[2, 9]"
            :check-strictly="true"
            :default-checked-keys="arr"
            @check-change="loadLayer"
            highlight-current
        >
        </el-tree>
    </div>
</template>

<script>
import { loadModules } from 'esri-loader';
import axios from 'axios';
const option = {
    url: 'https://js.arcgis.com/4.18/init.js',
    css: 'https://js.arcgis.com/4.18/esri/themes/light/main.css',
};
export default {
    name: 'catalogueTree',
    data() {
        return {
            data: [],
            arr: [],
            defaultProps: {
                label: 'label',
                children: 'children',
            },
            visiable: false,
            arrLayer: [],
        };
    },
    mounted() {
        this.$bus.$on('contorTree', () => {
            this.visiable = true;
            this.loadTree();
        });
    },
    methods: {
        recursionData(respose, Layer) {
            respose.data.children.forEach((element) => {
                if (element.children) {
                    this.recursionData();
                }
                debugger;
                const layer = new Layer({
                    url: element.layerurl,
                    id: element.layerid,
                    visible: false,
                });
                this.arrLayer.push(layer);
            });
        },
        async loadTree() {
            if (this.data.length > 0) {
                return;
            }
            let Map = this.$store.state._defaultView.map;
            const [TileLayer, MapImageLayer] = await loadModules(
                ['esri/layers/TileLayer', 'esri/layers/MapImageLayer'],
                option,
            );
            let respose = await axios.get('data.json');

            this.data = respose.data.data;

            // if (this.data.type == 'tile') {
            //     this.recursionData(respose, TileLayer);
            // } else if (respose.data.type == 'dynamic') {
            //     this.recursionData(respose, MapImageLayer);
            // }

            // Map.addMany(this.arrLayer);
        },

        async loadLayer(node, checked) {
            if (node.children) {
                return;
            }
            const [TileLayer, MapImageLayer,FeatureLayer] = await loadModules(
                ['esri/layers/TileLayer', 'esri/layers/MapImageLayer',"esri/layers/FeatureLayer"],
                option,
            );
            // let checkedNode = this.$refs.tree.getCheckedNodes(true);
            // let id = node.layerid;
            // debugger;
            // this.$store.state._defaultView.components = [];
            // let layer = this.$store.state._defaultView.map.findLayerById(id);
            // checked ? (layer.visible = true && this.arr.push(node.id)) : (layer.visible = false);
            let layerurl = node.layerurl;

            if (checked) {
                switch (node.type) {
                    case 'tile':
                        let Tlayer = new TileLayer({ url: layerurl, id: node.layerid });
                        this.$store.state._defaultView.map.add(Tlayer);
                        break;
                    case 'feature':
                        let Flayer = new FeatureLayer({ url: layerurl, id: node.layerid });
                        this.$store.state._defaultView.map.add(Flayer);
                }
            } else {
                let layer = this.$store.state._defaultView.map.findLayerById(node.layerid);
                this.$store.state._defaultView.map.remove(layer);
            }
        },
        closePlane() {
            this.visiable = false;
        },
    },
};
</script>
    
<style scoped>
.tree-panel {
    box-sizing: border-box;
    position: absolute;
    height: 315px;
    width: 200px;
    top: 10px;
    left: 10px;
    background-color: white !important;
    border: 1px solid rgb(35, 48, 45, 0.5);
    border-radius: 10px;
}
.tree-title {
    float: left;
    font-weight: 700;
    font-size: 16px;
    color: rgb(14, 135, 72);
}
.tree-content {
    padding-left: 7px;
    position: relative;
    height: 24px;
    border-bottom: 1px solid black;
}
.icon-close {
    float: right;
    width: 24px;
    height: 24px;
    line-height: 24px;
}
.el-icon-close {
    font-size: 16px;
}
.el-icon-close:hover {
    color: blue;
}
el-tree {
    height: 280px;
    background-color: white !important;
}
</style>