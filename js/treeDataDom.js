
import { COMPANY, config } from './treeConfig'

// 创建持股比例dom
export const createSharesScale = ({ nodeEnter, showtype }) => {
  // 上游
  nodeEnter
    .append("g")
    .attr("transform", () => "translate(0,0)")
    .append("text")
    .attr("x", (d) => (d.x > 0 ? (showtype === "up" ? 55 : 30) : 45))
    .attr("y", showtype === "up" ? config.rectHeight - 10 : 10)
    .attr("text-anchor", "middle")
    .attr("fill", (d) => (d.data.type === COMPANY ? "#7A9EFF" : "#7A9EFF"))
    .attr("opacity", (d) => (!d.depth ? 0 : 1))
    .text((d) =>
      showtype === "up" ? d.data.scale === 0 ? "非公示" : d.data.Holding === 2 ? "" : "控股" + "\xa0\xa0\xa0" +d.data.scale + "%" : ""
    )
    .style("font-size", "10px")
    .style("font-family", "Microsoft YaHei")
    .style("font-weight", "400");
  // 下游
  nodeEnter
    .append("g")
    .attr("transform", () => "translate(-27,-75)")
    .append("text")
    .attr("x", (d) => (d.x > 0 ? (showtype === "down" ? 75 : 30) : 75))
    .attr("y", showtype === "down" ? config.rectHeight - 20 : -80)
    .attr("text-anchor", "middle")
    .attr("fill", (d) => (d.data.type === COMPANY ? "#7A9EFF" : "#7A9EFF"))
    .attr("opacity", (d) => (!d.depth ? 0 : 1))
    .text((d) =>
      showtype === "down" ? d.data.scale === undefined ? "" : d.data.Holding === 0 ? "控股" + "\xa0\xa0\xa0" + d.data.scale + "%" : "控股"+"\xa0\xa0\xa0\xa0\xa0\xa0\xa0" + d.data.scale + "%" : ""
    )
    .style("font-size", "10px")
    .style("font-family", "Microsoft YaHei")
    .style("font-weight", "400");

}

// 公司名称
export const createCorporateName = ({ nodeEnter, showtype }) => {
  // y轴 否表源头的字体距离
  nodeEnter
    .append("text")
    .attr("x", 0)
    .attr("y", (d) => {
      // 如果是上半部分
      if (showtype === "up") {
        // 如果是1层以上
        if (d.depth) {
          return -config.rectHeight / 2;
        } else {
          // 如果名字长度大于9个
          if (d.data.name.length > 10) {
            return -5;
          }
          return 0;
        }
      } else {
        if (d.depth) {
          return 0;
        } else {
          if (d.data.name.length > 10) {
            return -5;
          }
          return 0;
        }
      }
    })
    .attr("dy", (d) =>
      d.depth ? (d.data.name.length > 10 ? "1.5em" : "2em") : ".3em"
    )
    .attr("text-anchor", "middle")
    .attr("fill", (d) => (d.depth ? "#465166" : "#fff"))
    .text((d) =>
      d.data.name.length > 10 ? d.data.name.substr(0, 10) : d.data.name
    )
    .style("font-size", "12px")
    .style("font-family", "PingFangSC-Medium")
    .style("font-weight", "800");
  createCorporateNameSubTitle({ nodeEnter, showtype })
}

// 公司名称过长、第二段部分
const createCorporateNameSubTitle = ({ nodeEnter, showtype }) => {
  nodeEnter
    .append("text")
    .attr("x", 0)
    .attr("y", (d) => {
      if (showtype === "up") {
        if (d.depth) {
          return -config.rectHeight / 2;
        }
        return 9;
      } else {
        if (!d.depth) {
          return 8;
        }
        return 0;
      }
    })
    .attr("dy", (d) => (d.depth ? "3em" : ".3em"))
    .attr("text-anchor", "middle")
    .attr("fill", (d) => (d.depth ? "#465166" : "#fff"))
    .text((d) => {
      // 索引从第19个开始截取有表示超出
      if (d.data.name.substr(19, 1)) {
        return d.data.name.substr(10, 11) + "...";
      }
      return d.data.name.substr(10, 11);
    })
    .style("font-size", "12px")
    .style("font-family", "PingFangSC-Medium")
    .style("font-weight", "800");
}

// 认缴金额
export const createMoney = ({ nodeEnter, showtype }) => {
  nodeEnter
    .append("text")
    .attr("x", 0)
    .attr("y", showtype === "up" ? -config.rectHeight / 2 : 0)
    .attr("dy", (d) =>
      d.data.name.substr(9, d.data.name.length).length ? "5em" : "4em"
    )
    .attr("text-anchor", "middle")
    .attr("fill", (d) => (d.depth ? "#465166" : "#fff"))
    .text((d) =>
      d.data.money ? d.data.money === "" ? "认缴金额：非公示" : `认缴金额：${d.data.money}万元` : ""
    )
    .style("font-size", "10px")
    .style("font-family", "PingFangSC-Regular")
    .style("font-weight", "500")
    .style("color", "rgba(70,81,102,1)");

}





