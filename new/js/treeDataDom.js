
import { COMPANY, config } from './treeConfig'


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
    .attr("dy", (d) => {
      // console.log('====',d)
      if (showtype === 'up') {
        if (d.depth) {
          if (d.data.name.length > 10) {
            return '2.6em'
          } else {
            return '3.2em'
          }
        } else {
          return '.25em'
        }
      } else {
        return d.depth ? '1.8em' : '.25em'
      }
    }
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
    .attr("dy", (d) => {
      if (showtype === 'up') {
        if (d.depth) {
          return '4em'
        } else {
          return '.3em'
        }
      } else {
        return d.depth ? '3.3em' : '.35em'
      }
    })
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





