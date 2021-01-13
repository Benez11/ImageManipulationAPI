const { parentPort } = require("worker_threads");
const Jimp = require("jimp");

const {
  constants: {
    DIRS: { UPLOADED_IMAGE_DIR, TRANSFORMED_IMAGE_DIR },
  },
} = require("../common/index.js");

parentPort.on("message", (param) => {
  console.log("CHILD: New message from parent. Param:", param);
  if (param && param.killCmd) return process.exit(0);
  else if (param && param.ping)
    return parentPort.postMessage({ tag: "init", pong: true });
  else if (param) {
    transformQueue.push(param);
    return startExecuting();
  } else
    console.error(
      "Parent has sent a message signal that has no valid 'param' argument attached. Further investigation needed."
    );
});

const extractKeyValuePairs = (str) => {
  let pairObj = {};
  str.split(";").forEach((pair) => {
    let keyVal = pair.split("=");
    if (keyVal[0] && keyVal[1]) pairObj[keyVal[0]] = Number(pair.split("=")[1]);
  });
  return pairObj;
};

const transformQueue = [];

const startExecuting = () => {
  if (transformQueue.length > 0) {
    executeTransformCMD(transformQueue.splice(0, 1)[0]);
  } else console.info("Completed all transform requests in the queue.");
};

const executeTransformCMD = (param) => {
  console.log({ param, imageObj: param.imageObj });

  let readPath = `${UPLOADED_IMAGE_DIR}\\${param.imageObj.tempName}`;

  Jimp.read(readPath, (err, img) => {
    // console.log("Viewing details", img);
    if (err) {
      startExecuting();
      return parentPort.postMessage({
        tag: "transformation-update",
        data: {
          status: false,
          body: {
            message: "An error has occurred",
            parsedParameters: param,
            oldImgPath: readPath,
            error: err,
          },
        },
      });
    }

    let { crop, resize, rotate, scale, order } = param.requestBody;

    const doResize = () => {
      if (resize) {
        let resizeParams = extractKeyValuePairs(resize);
        img.resize(resizeParams.w || Jimp.AUTO, resizeParams.h || Jimp.AUTO);
      }
    };
    const doRotate = () => {
      if (rotate) {
        let rotateParams = extractKeyValuePairs(rotate);
        img.rotate(rotateParams.d || 0);
      }
    };
    const doScale = () => {
      if (scale) {
        let scaleParams = extractKeyValuePairs(scale);
        img.scale(scaleParams.f || 1);
      }
    };
    const doCrop = () => {
      if (crop) {
        let cropParams = extractKeyValuePairs(crop);
        img.crop(
          cropParams.x || 0,
          cropParams.y || 0,
          cropParams.w || 0,
          cropParams.h || 0
        );
      }
    };
    if (order) {
      order.split(";").forEach((task) => {
        if (task === "re") doResize();
        else if (task === "ro") doRotate();
        else if (task === "sc") doScale();
        else if (task === "cr") doCrop();
        else
          console.log(
            "ExecuteTransformCMD :: Unknown task listed for execution:",
            task
          );
      });
    } else {
      doResize();
      doRotate();
      doScale();
      doCrop();
    }

    let writePath = `${TRANSFORMED_IMAGE_DIR}\\${param.imageObj.id}.jpg`;

    img.write(writePath, () => {
      startExecuting();
      parentPort.postMessage({
        tag: "transformation-update",
        data: {
          status: true,
          body: {
            id: param.imageObj.id,
            oldImg: readPath,
            newImg: writePath,
          },
        },
      });
    }); // save
  });
};
