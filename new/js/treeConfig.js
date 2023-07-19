
export const config = {
  // 节点的矩形框宽度
  rectWidth: 170,
  // 节点的矩形框高度
  rectHeight: 60,
  // rectHeight: 70,
  // 节点的横向距离
  dx: 200,
  // 节点的纵向距离
  dy: 150,
  // svg缩放范围
  scaleExtent: [0.3, 5],
  idIndex: 1

};

export const originDiamonds = {
  w: 170
}
export const hasChildNodeArr = []
// 展开收起节点过渡时间
export const DURATION = 700;
// btn按钮圆的半径（加减按钮）
export const SYMBOLA_S_R = 9;
// 公司
export const COMPANY = "0";
// 人
export const PERSON = "1";

// 创建矩形
export const createRect = ({ nodeEnter, showtype }, rectHandler, context) => {
  nodeEnter
    .append("rect")
    .attr("type", (d) => d.id)
    .attr("id", (d) => {
      d.id = showtype + ++config.idIndex
      return d.id
    })
    .attr("width", (d) =>
      d.depth ? config.rectWidth : originDiamonds.w
    )
    .attr("height", (d) =>
      d.depth ? d.type === COMPANY ? config.rectHeight : config.rectHeight - 10 : 30
    )
    .attr("x", (d) =>
      d.depth ? -config.rectWidth / 2 : -originDiamonds.w / 2
    )
    .attr("y", (d) =>
      d.depth ? (showtype === "up" ? -config.rectHeight / 2 + 10 : 0) : -15
    )
    .attr("stroke", (d) =>
      d.data.type === COMPANY || !d.depth ? "#7A9EFF" : "#7A9EFF"
    )
    .attr("stroke-width", 1)
    .attr("rx", 5)
    .attr("ry", 5)
    .style("fill", (d) => {
      if (d.data.type === COMPANY || !d.depth) {
        return d._children ? "#fff" : d.depth ? "#fff" : "#7A9EFF";
      } else if (d.data.type === PERSON || !d.depth) {
        return d._children ? "#fff" : d.depth ? "#fff" : "#7A9EFF";
      }
    })
  if (!rectHandler) {
    return
  }
  nodeEnter.on("mouseenter", rectHandler)
    .on("mouseout", (e, d) => { 
      context.isShowDialog = false
    })
}


// 有子节数据时创建圆按钮
export const createCircle = ({ nodeEnter, showtype }) => {
  nodeEnter
    .append("circle")
    .attr("type", (d) => d.id)
    .attr("r", (d) =>
      d.depth ? hasChildNodeArr.indexOf(d) === -1 ? 0 : SYMBOLA_S_R : 0
    )
    .attr("cy", (d) =>
      d.depth ? showtype === "up" ? -(SYMBOLA_S_R + config.rectHeight / 2) : config.rectHeight : 0
    )
    .attr("cx", 0)
    .attr("fill", (d) => (d.children ? "#7A9EFF" : "#7A9EFF"))
    .attr("stroke", (d) => (d._children || d.children ? "#7A9EFF" : ""))
}


/*
* 绘制箭头
* @param  {string} markerUnits [设置为strokeWidth箭头会随着线的粗细发生变化]
* @param {string} viewBox 坐标系的区域
* @param {number} markerWidth,markerHeight 标识的大小
* @param {string} orient 绘制方向，可设定为：auto（自动确认方向）和 角度值
* @param {number} stroke-width 箭头宽度
* @param {string} d 箭头的路径
* @param {string} fill 箭头颜色
* @param {string} id resolved0表示公司 resolved1表示个人
* 直接用一个marker达不到两种颜色都展示的效果
*/
export const createArrow = ({ nodeEnter, showtype }) => {
  nodeEnter
    .append("marker")
    .attr("id", showtype + "resolved0")
    .attr("markerUnits", "strokeWidth")
    .attr("markerUnits", "userSpaceOnUse")
    .attr("viewBox", "0 -5 10 10")
    .attr("markerWidth", 12)
    .attr("markerHeight", 12)
    .attr("orient", "90")
    .attr("refX", () => (showtype === "up" ? "-5" : "15"))
    .attr("stroke-width", 2)
    .attr("fill", "#7a9eff")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#7a9eff");

  nodeEnter
    .append("marker")
    .attr("id", showtype + "resolved1")
    .attr("markerUnits", "strokeWidth")
    .attr("markerUnits", "userSpaceOnUse")
    .attr("viewBox", "0 -5 10 10")
    .attr("markerWidth", 12)
    .attr("markerHeight", 12)
    .attr("orient", "90")
    .attr("refX", () => (showtype === "up" ? "-8" : "15"))
    .attr("stroke-width", 2)
    .attr("fill", "#7a9eff")
    .append("path")
    .attr("d", "M0,-5L10,0L0,5")
    .attr("fill", "#7A9EFF");
}

// 绘制直线
export const diagonal = (s, d, showtype) => {
  let path;
  const halfDistance = (d.y - s.y) / 2;
  const halfY = s.y + halfDistance;
  if (showtype === "up") {
    path = `M${s.x} ${-s.y + 30}
        L${s.x},${-halfY} L${d.x},${-halfY} L${d.x}, ${-d.y}`;
  } else {
    path = `M${s.x} ${s.y}
        L${s.x},${halfY} L${d.x},${halfY} L${d.x},${d.y}`;
  }
  return path;
}



