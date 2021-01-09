const { parentPort, workerData } = require("worker_threads");
const Jimp = require("jimp");

const extractKeyValuePairs = (str) => {
  let pairObj = {};
  str
    .split(";")
    .forEach((pair) => (pairObj[pair.split("=")[0]] = pair.split("=")[1]));
  return pairObj;
};

parentPort.on("message", (param) => {
  Jimp.read(`temp\\${param.imageObj.tempName}`, (err, img) => {
    if (err) throw err;

    let { crop, resize, rotate, scale } = param.req.body;
    if (crop) {
      let cropParams = extractKeyValuePairs(crop);
      img.crop(
        cropParams.x || 0,
        cropParams.y || 0,
        cropParams.w || 0,
        cropParams.h || 0
      );
    }
    if (resize) {
      let resizeParams = extractKeyValuePairs(resize);
      img.resize(resizeParams.w || Jimp.AUTO, resizeParams.h || Jimp.AUTO);
    }
    if (rotate) {
      let rotateParams = extractKeyValuePairs(rotate);
      img.rotate(rotateParams.d || 0);
    }
    if (scale) {
      let scaleParams = extractKeyValuePairs(scale);
      img.scale(scaleParams.f || 1);
    }

    img.write(`transformed\\${param.imageObj.id}.${img.getExtension()}`, () => {
      parentPort.postMessage({
        tag: "completed-transformation",
        data: {
          status: true,
          body: {
            id: param.imageObj.id,
          },
        },
      });
    }); // save
  });
});
