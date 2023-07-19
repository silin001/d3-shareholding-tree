
export function debounce (func, delay=500) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}


// 修正svg等比缩放
export function newSvgNode (svg, zoomIdName, scaleData) {
  //得到svg的真实大小
  let box = svg.getBBox(),
    x = box.x,
    y = box.y,
    width = box.width,
    height = box.height;
  if (zoomIdName) {
    //查找zoomObj
    let zoomObj = svg.getElementById(zoomIdName.replace(/\./g, ""));
    if (!zoomObj) {
      alert("zoomObj不存在");
      return false;
    }
    /*------这里是处理svg缩放的--------*/
    let transformMath = zoomObj.getAttribute("transform"),
      scaleMath = zoomObj.getAttribute("transform");
    if (transformMath || scaleMath) {
      let transformObj = transformMath.match(
        /translate\(([^,]*),([^,)]*)\)/
      );
      if (transformObj) {
        // 原缩放，移动值 反应用到svg的宽高上
        let translateX = transformObj[1],
          translateY = transformObj[2],
          scale = scaleData;
        x = (x - translateX) / scale;
        y = (y - translateY) / scale;
        width = width / Number(scale);
        height = height / Number(scale);
      }
    }
  }
  //克隆svg
  let node = svg.cloneNode(true);

  //重新设置svg的width,height,viewbox
  node.setAttribute("width", width);
  node.setAttribute("height", height);
  node.setAttribute("viewBox", [x, y, width, height]);

  if (zoomIdName) {
    let zoomObj1 = node.getElementById(zoomIdName.replace(/\./g, ""));
    /*-------------清除缩放元素的缩放-------------*/
    zoomObj1.setAttribute("transform", "translate(0,0) scale(1)");
    // zoomObj1.setAttribute("transform", "translate(50%,-50%) scale(1)");
  }
  return {
    newSvg: node,
    orgSvg: box
  }
}

// 创建canvas转为img后下载
export function createCanvasDownloadImg (newSvg, orgSvg ,name) {
  const { width, height } = orgSvg
  const w = width + 200
  const h = height + 500
  const serializer = new XMLSerializer();
  const source =
    '<?xml version="1.0" standalone="no"?>\r\n' +
    serializer.serializeToString(newSvg);
  const image = new Image();
  image.src =
    "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
  image.onload = function () {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const context = canvas.getContext("2d");
    context.rect(0, 0, w, h);
    context.translate(100, h/4);
    context.fillStyle = "#fff";
    context.fill();
    context.drawImage(image, 0, 0);
    // canvas转化为img
    const imgSrc = convertCanvasToImg(canvas)
    downloadImag(imgSrc,name)
  };
}


// canvas转换为图片格式
export function convertCanvasToImg (canvas) {
  // canvas base64 转 blob
  // const base64File = canvas.toDataURL("img/png", 1)
  const base64File = canvas.toDataURL("image/jpg", 1);
  const myBlob = base64DownloadFile(base64File);
  // blob转url对象
  return URL.createObjectURL(myBlob);
}
// base64 转 blob
export function base64DownloadFile (dataurl) {
  let parts = dataurl.split(",")
  let contentType = parts[0].split(":")[1];
  let raw = window.atob(parts[1]);
  let rawLength = raw.length;
  let uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
}

// a标签下载
export function downloadImag (url, fileName ='fileName') {
  let a = document.createElement("a");
  let clickEvent = document.createEvent("MouseEvents");
  a.setAttribute("href", url);
  a.setAttribute("download", fileName);
  a.setAttribute("target", "_blank");
  clickEvent.initEvent("click", true, true);
  a.dispatchEvent(clickEvent);
}