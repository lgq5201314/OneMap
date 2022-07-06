<template>
    <div>
        <div class="tool-panel">
            <ul class="tool">
                <li>
                    行政区导航
                    
                </li>
                <li><span>|</span></li>
                <li>
                    距离测量
                </li>
               <li><span>|</span></li>
                <li>
                    面积测量
                </li>
                <li><span>|</span></li>
                <li>
                    清除
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'mapTool',
};
</script>

<style>
.tool-panel .tool {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 303px;
    height: 40px;
    background: white;
    display: flex;
    
}
.tool-panel .tool li {
    flex-grow: 1;
    line-height: 40px;
    text-align: center;
}
.tool li:hover {
    background: grey;
    cursor:pointer
}
.tool-panel .tool span{
    display: block;
    line-height: 40px;
   
}
</style>