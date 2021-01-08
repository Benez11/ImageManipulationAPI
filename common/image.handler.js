const fs = require("fs");
let imageDB = require("./image.db.json");

const imageIDs = [];
imageDB.forEach((image, idx) => {
  imageIDs.push(image.id);
});

const findImage = function (id, { execUponFind, execUponNotFound }) {
  let toBeReturned = { image: null, index: -1 };
  imageDB.every((imageObj, idx) => {
    if (imageObj.id === id) {
      typeof execUponFind === "function" ? execUponFind(imageObj) : "";
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
  imageDB.push({ id, reqId, tempName, fileObj, transformed: false });
  saveDBToDisk();
  return true;
};

const removeImage = function (id, { execUponRemoved, execUponNotFound }) {
  let ret = false;
  findImage(id, {
    execUponFind: (imageObj) => {
      imageDB.splice(imageObj.index, 1);
      execUponRemoved(imageObj.image);
      ret = true;
      saveDBToDisk();
    },
    execUponNotFound: () => {
      console.error("Image NOT found");
      execUponNotFound();
      ret = false;
    },
  });
  return ret;
};

const saveDBToDisk = function () {
  const imageDBToString = JSON.stringify(imageDB);
  //   console.log("GIVEN ORDER TO SAVE:", { imageDB, imageDBToString });
  fs.writeFile("common/image.db.json", imageDBToString, function (err) {
    if (err) console.error(err);
    console.log("Written to image DB successfully!");
  });
};

module.exports = {
  findImage,
  addImage,
  removeImage,
  saveDBToDisk,
  imageIDs,
  imageDB,
};
