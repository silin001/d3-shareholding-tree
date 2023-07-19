
<template>
  <div class="EquityChart">
    <el-button type="primary" size="mini" @click="back">返回</el-button></el-button>
    
    <div id="penetrateChart"></div>
    <div class="bt-group">
      <el-button type="primary" size="mini" @click="saveImg">导出</el-button>
      <el-button type="primary" size="mini" @click="resetSvg">重置</el-button>
    </div>
  </div>
</template>
<script>
import * as $d3 from "d3";
import html2canvas from "html2canvas";
import { newSvgNode, createCanvasDownloadImg} from "./js/util";
import {
  config,
  DURATION,
  SYMBOLA_S_R,
  createRect,
  createArrow,
  diagonal,
} from "./js/treeConfig";
import {
  createCorporateName,
} from "./js/treeDataDom";
export default {
  components: {},
  props: {},
  data() {
    return {
      dialogData: {},
      naturalWidth: '',
      naturalHeight: '',
      scaleData: '',
      treeData: {},
      layoutTree: "",
      diagonalUp: "",
      diagonalDown: "",
      rootUp: "",
      rootDown: "",
      svg: "",
      svgW: document.body.clientHeight,
      svgH: document.body.clientWidth,
    };
  },
  created(){
    },
  mounted() {
    this.getTreeData()
  },
  methods: {
    getTreeData(){
      const {name, key} = this.$route.query
    //  const key = '91110108MA00HEYK8R'
    //  const name = '安智信成（北京）科技有限公司'
      const url = `/api/equityPenetrationAPI/GraphBase?searchKey=${key}&name=${name}`
      this.$axios.get(url).then(res => {
        console.log('-=-=-=',res.data)
        if (res.status === 200) {
          this.treeData = res.data
          this.init();
        }
      })
    },
    init() {
      this.layoutTree = $d3.tree()
        .nodeSize([config.dx, config.dy])
        .separation(() => 1);
      // 主图
      this.svg = $d3
        .select("#penetrateChart")
        .append("svg")
        .attr("viewBox", [-1200 / 2, -400 / 2, 1200, 600])
        .style("user-select", "none")
        .attr("id", "treeSvg")
        .call($d3.zoom()
            .scaleExtent(config.scaleExtent)
            .on("zoom", (e) => {
              this.scaleData = e.transform.k; // 缩放值
              // 设置缩放位置以及平移初始位置
              this.svg.attr(
                "transform",
                e.transform.translate(0, 0)
              );
            })
        )
        .on("dblclick.zoom", null)
        .append("g")
        .attr("id", "gSvg");
      this.formatTreeData();
    },
    formatTreeData() {
      let upTree = null, downTree = null;
      // 拷贝树的数据
      Object.keys(this.treeData).map((item) => {
        if (item === "parents") {
          upTree = JSON.parse(JSON.stringify(this.treeData));
          upTree.children = this.treeData[item];
          upTree.parents = null;
        } else if (item === "children") {
          downTree = JSON.parse(JSON.stringify(this.treeData));
          downTree.children = this.treeData[item];
          downTree.parents = null;
        }
      });
      // 使用$d3.hierarchy 返回新的数据结构，且设置x0,y0初始化起点坐标
      this.rootUp = $d3.hierarchy(upTree, (d) => d.children);
      this.rootUp.x0 = 0;
      this.rootUp.y0 = 0;
      this.rootDown = $d3.hierarchy(downTree, (d) => d.children);
      this.rootDown.x0 = 0;
      this.rootDown.y0 = 0;
      // 区分为上、下结构的数据
      let treeArr = [
        {
          data: this.rootUp,
          type: "up",
        },
        {
          data: this.rootDown,
          type: "down",
        },
      ];
      treeArr.map((item) => {
        if (item.data.children) {
          this.upDateData(item.data, item.type);
        }
      });
    },
    /*
     *  @param  {[Object]} source 第一次是初始源对象，后面是点击的对象
     *  @param  {[String]} showtype up表示向上 down表示向下
     */
    upDateData(source, showtype) {
      // 生成一个可重复使用的transition实例
      const myTransition = this.svg.transition().duration(DURATION);
      if (source.parents === null) {
        source.isOpen = !source.isOpen;
      }
      let nodes;
      if (showtype === "up") {
        nodes = this.layoutTree(this.rootUp).descendants();
      } else {
        nodes = this.layoutTree(this.rootDown).descendants();
      }
      let links = nodes.slice(1);
      nodes.forEach((d) => {
        d.y = d.depth * config.dy;
      });
      let node = this.svg
        .selectAll("g.node" + showtype)
        .data(nodes, (d) => d.id);

      let nodeEnter = node
        .enter()
        .append("g")
        .attr("class", (d) =>
          showtype === "up" && !d.depth ? "hide-node" : "node" + showtype
        )
        .attr("transform", (d) =>
          showtype === "up"? "translate(" + d.x + "," + -d.y + ")": "translate(" + d.x + "," + d.y + ")"
        )
        .attr("opacity", (d) =>
          showtype === "up" && !d.depth? this.rootDown.data.children.length? 0: 1: 1
        );

      const params = {
        source,
        nodeEnter,
        showtype,
      };
      // 创建svg相关dom
      createRect(params);
      createArrow(params);
      // 创建具体数据dom
      createCorporateName(params);
      // -----将节点转换更新到它们的最新位置
      let nodeUpdate = node
        .transition(myTransition)
        .attr("transform", (d) =>
          showtype === "up"? "translate(" + d.x + "," + -d.y + ")": "translate(" + d.x + "," + d.y + ")"
        );
      // -----将退出节点转换到父节点的新位置.
      let nodeExit = node
        .exit()
        .transition(myTransition)
        .attr("transform", () =>
          showtype === "up"? "translate(" + source.x + "," + -source.y + ")": "translate(" + source.x + "," + parseInt(source.y) + ")"
        )
        .remove();
      // 修改线条
      let link = this.svg
        .selectAll("path.link" + showtype)
        .data(links, (d) => d.data.id);
      // 在父级前的位置画线
      let linkEnter = link
        .enter()
        .insert("path", "g")
        .attr("class", "link" + showtype)
        .attr("marker-start", (d) => `url(#${showtype}resolved${d.data.type})`) // 根据箭头标记的id号标记箭头
        .attr("stroke", () => "#7A9EFF")
        .style("fill-opacity", 1)
        .attr("fill", "none")
        .attr("stroke-width", "1px")
        .attr("d", () => {
          let o = { x: source.x0, y: source.y0 };
          return diagonal(o, o, showtype);
        });
      let linkUpdate = linkEnter.merge(link);
      // 过渡更新位置.
      linkUpdate
        .transition(myTransition)
        .attr("d", (d) => diagonal(d, d.parent, showtype));
      // 将退出节点转换到父节点的新位置
      link
        .exit()
        .transition(myTransition)
        .attr("d", () => {
          let o = {
            x: source.x,
            y: source.y,
          };
          return diagonal(o, o, showtype);
        })
        .remove();
      // 隐藏旧位置方面过渡.
      nodes.forEach((d) => {
        d.x0 = d.x;
        d.y0 = d.y;
      });
    },
    saveImg() {
      // html2canvas(document.getElementById("penetrateChart")).then((canvas) => {
      //   const url = convertCanvasToImg(canvas);
      //   // 创建a标签，下载图片
      //   downloadImag(url, "股权结构图");
      // });
      const treeSvg = document.getElementById("treeSvg")
      const {newSvg, orgSvg } = newSvgNode(treeSvg, 'gSvg', this.scaleData)
      createCanvasDownloadImg(newSvg, orgSvg, '股权穿透图')
    },
    resetSvg() {
      $d3.select("#treeSvg").remove();
      setTimeout(() => {
        this.init();
      }, 1000);
    },
    back(){
      this.$router.back()
    }
  },
};
</script>

<style lang="less">
#treeSvg {
  width: 100%;
  height: 100%;
}
#gSvg {
  width: 100%;
  height: 100%;
  .circle {
    cursor: pointer;
  }
}
.EquityChart {
  #dialog,
  .tooltip {
    width: 300px;
    height: 200px;
    background: #ccc;
    color: #000;
    display: none;
    position: absolute;
  }
  .bt-group {
    position: fixed;
    z-index: 999;
    top: 20%;
    right: 15px;
  }
}
</style>
