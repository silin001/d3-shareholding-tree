<template>
  <div class="EquityChart full">
    <div id="penetrateChart" class="full"></div>
    <div id="dialogBox" v-show="isShowDialog" :style="{...dialogStyle}">
      <div>名称：{{ dialogData.name }}</div>
      <div>认缴金额：{{ dialogData.money }}</div>
      <div>实际控股：{{ dialogData.scale }}</div>
    </div>
    <div class="bt-group">
      <button class="save" @click="saveImg">下载</button>
      <button class="reset" @click="resetSvg">重置</button>
    </div>
  </div>
</template>
<script>
import * as $d3 from "d3";
import html2canvas from "html2canvas";
import { treeData } from "./js/treeData";
import { convertCanvasToImg, downloadImag, debounce } from "./js/util";
import {
  config,
  DURATION,
  SYMBOLA_S_R,
  createRect,
  createCircle,
  createArrow,
  diagonal,
  collapse,
} from "./js/treeConfig";
import {
  createSharesScale,
  createCorporateName,
  createMoney,
} from "./js/treeDataDom";
export default {
  components: {},
  props: {},
  data() {
    return {
      isShowDialog: false,
      dialogStyle: {
        top: 0,
        left: 0
      },
      dialogData: {
        name: '测试',
      },
      treeData: treeData,
      layoutTree: "",
      diagonalUp: "",
      diagonalDown: "",
      rootUp: "",
      rootDown: "",
      svg: "",
      gAll: "",
      svgW: document.body.clientHeight,
      svgH: document.body.clientWidth,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.layoutTree = $d3.tree()
        .nodeSize([config.dx, config.dy])
        .separation(() => 1);
      // 主图
      this.svg = $d3
        .select("#penetrateChart")
        .append("svg")
        .attr("viewBox", [-1200 / 2, -500 / 2, 1200, 800])
        .style("user-select", "none")
        .attr("id", "treeSvg")
        .call($d3.zoom()
            .scaleExtent(config.scaleExtent)
            .on("zoom", (e) => {
              // 设置缩放位置以及平移初始位置
              this.isShowDialog = false
              this.svg.attr(
                "transform",
                // e.transform.translate(this.svgW / 2, this.svgH / 2)
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
          item.data.children.forEach(collapse);
          this.upDateData(item.data, item.type);
        }
      });
    },
    // +-号内容
    createCircleText({ nodeEnter, showtype }) {
      nodeEnter
        .append("svg:text")
        .attr("class", "circle")
        .attr("x", 0)
        .attr("y", (d) =>
          d.depth? showtype === "up"? -(SYMBOLA_S_R / 2 + config.rectHeight / 2): config.rectHeight + 5: 0
        )
        .attr("text-anchor", "middle")
        .attr("fill", "#fff")
        .style("font-size", 16)
        .style("font-family", "微软雅黑")
        .text((d) => {
          return d._children ? "+" : "";
        })
        .on("click", (e, d) => {
          this.btnClick(d, showtype);
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
      createRect(params, this.rectMouseenterHandler,this);
      // createRect(params, debounce(this.rectMouseenterHandler),this);
      createCircle(params);
      this.createCircleText(params);
      createArrow(params);
      // 创建具体数据dom
      createSharesScale(params);
      createCorporateName(params);
      createMoney(params);
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
    btnClick(source, showType) {
      this.isShowDialog = false
      // 不是起点才能点
      if (source.depth) {
        if (source.children) {
          source._children = source.children;
          source.children = null;
        } else {
          source.children = source._children;
          source._children = null;
        }
        this.upDateData(source, showType);
      }
    },
    rectMouseenterHandler(e,d){
      const svg = document.querySelector(`rect[id="${d.id}"]`);
      const rect = svg.getBoundingClientRect(); // 获取边界矩形
      const {top,right,bottom} = rect
      this.isShowDialog = true
      if(d.data.type==='1'){
         // 上游
        this.dialogStyle.top = bottom + 'px'
        this.dialogStyle.left = right  +'px'
      }else{
         // 下游
         this.dialogStyle.top = top - 122 + 'px'
        this.dialogStyle.left = right  +'px'
      }
      this.dialogData = d.data
    },

    resetSvg() {
      $d3.select("#treeSvg").remove();
      setTimeout(() => {
        this.init();
      }, 1000);
    },
    saveImg() {
      html2canvas(document.getElementById("penetrateChart")).then((canvas) => {
        const url = convertCanvasToImg(canvas);
        // 创建a标签，下载图片
        downloadImag(url, "股权结构图");
      });
    },
  },
};
</script>

<style lang="less">
#treeSvg {
  width: 95%;
  height: 100%;
  // border: 1px solid;
}
#gSvg {
  width: 100%;
  height: 100%;
  .circle {
    cursor: pointer;
  }
}
.EquityChart {
  #dialogBox,
  .tooltip {
    position: fixed;
    width: 170px;
    height: 100px;
    border: 1px solid red;
    background: #ccc;
    color: #000;
    padding: 10px;
    border-radius: 5px;
  }
  .bt-group {
    position: fixed;
    z-index: 999;
    top: 50%;
    right: 15px;
    button {
      cursor: pointer;
      border: 0;
      width: 88px;
      height: 50px;
      display: block;
      font-size: 14px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
    }
    .save {
      background: #7a9eff;
      color: rgba(255, 255, 255, 1);
    }
    .reset {
      margin-top: 8px;
      color: #7a9eff;
      background: white;
      border: 1px solid #7a9eff;
    }
  }
}
</style>
