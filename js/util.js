
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


//转换为图片格式
export function convertCanvasToImg (canvas) {
  // canvas base64 转 blob
  const base64File = canvas.toDataURL("img/png", 0.92)
  const myBlob = dataURLtoBlob(base64File);
  // blob转URL对象
  return URL.createObjectURL(myBlob);
}
//base64 转 blob
export function dataURLtoBlob (dataurl) {
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

// 下载图片
export function downloadImag (url, fileName ='fileName') {
  let a = document.createElement("a");
  let clickEvent = document.createEvent("MouseEvents");
  a.setAttribute("href", url);
  a.setAttribute("download", fileName);
  a.setAttribute("target", "_blank");
  clickEvent.initEvent("click", true, true);
  a.dispatchEvent(clickEvent);
}