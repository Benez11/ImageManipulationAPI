const fs = require("fs");
const hash = require("object-hash");
let imageDB = require("./image.db.json");
const constants = process.env.imageManipAPI_constants;

const imageIDs = [];
imageDB.forEach((image, idx) => {
  imageIDs.push(image.id);
});

const findImage = function (id, { execUponFind, execUponNotFound }) {
  let toBeReturned = { image: null, index: -1 };
  imageDB.every((imageObj, idx) => {
    if (imageObj.id === id) {
      typeof execUponFind === "function" ? execUponFind(imageObj, idx) : "";
      toBeReturned = { image: imageObj, index: idx };
      return false;
    } else return true;
  });
  if (!toBeReturned.image && typeof execUponNotFound === "function")
    execUponNotFound();
  return toBeReturned;
};

const addImage = function (id, reqId, tempName, fileObj) {
  imageIDs.push(id);
  const imageObj = { id, reqId, tempName, fileObj, transformed: 0 };
  imageDB.push(imageObj);
  //   saveDBToDisk();
  return imageObj;
};

const removeImage = function (id, { execUponRemoved, execUponNotFound }) {
  let ret = false;
  findImage(id, {
    execUponFind: (imageObj, idx) => {
      imageDB.splice(idx, 1);
      execUponRemoved(imageObj);
      ret = imageObj;
      //   saveDBToDisk();
    },
    execUponNotFound: () => {
      console.error("Image NOT found");
      execUponNotFound();
      ret = false;
    },
  });
  return ret;
};

let lastDBHash = hash(imageDB);

const saveDBToDisk = function () {
  let currentHash = hash(imageDB);
  //   console.log({ currentHash, lastDBHash });
  if (currentHash !== lastDBHash) {
    const imageDBToString = JSON.stringify(imageDB);
    //   console.log("GIVEN ORDER TO SAVE:", { imageDB, imageDBToString });
    fs.writeFile("common/image.db.json", imageDBToString, function (err) {
      if (err) console.error(err);
      console.log("Written to image DB successfully!");
      lastDBHash = currentHash;
    });
  }
};

const saveInterval = setInterval(
  () => saveDBToDisk(),
  constants.IMAGE_HANDLER.SAVE_INTERVAL
);

module.exports = {
  findImage,
  addImage,
  removeImage,
  imageIDs,
  imageDB,
};
