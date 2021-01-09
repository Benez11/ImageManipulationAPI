const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const {
  codeGenerator,
  imageHandler: { addImage, imageIDs, findImage },
  workerHandler: { startImageWorker, messageImgWorker },
} = require("../../../../common/index");

const transformationSuccessCb = ({ body }) => {
  findImage(body.id, {
    execUponFind: (imageObj) => {
      imageObj.transformed = 1;
      imageObj.oldImg = body.oldImg;
      imageObj.newImg = body.newImg;
    },
    execUponNotFound: () =>
      console.log(
        "This image is not found in the image DB. Further inspection needed."
      ),
  });
};
const transformationFailureCb = (data) => {
  findImage(data.body.id, {
    execUponFind: (imageObj) => {
      imageObj.transformed = -1;
      console.error("\nA transform request has failed. Details: ", data);
    },
    execUponNotFound: () =>
      console.log(
        "This image is not found in the image DB. Further inspection needed."
      ),
  });
};
startImageWorker(({ tag, data }) => {
  if (tag === "transformation-update" && data.status)
    transformationSuccessCb(data);
  else if (tag === "transformation-update") transformationFailureCb(data);
  else
    console.error(
      "Worker has sent a message with an unregistered tag. Further inspection needed."
    );
});

const expectedSchema = Joi.object({
  scale: Joi.string(),
  crop: Joi.string(),
  resize: Joi.string(),
  rotate: Joi.string(),
});

module.exports = [
  validator.body(expectedSchema),
  function (req, res) {
    if (Object.keys(req.files).length >= 1 && req.files.image) {
      if (req.files.image.mimetype.split("/")[0] === "image") {
        let _id = codeGenerator({
          blocks: [
            { len: 4, toUse: "A" },
            { len: 4, toUse: "Aa" },
            { len: 4, toUse: "A0" },
            { len: 4, toUse: "0" },
          ],
          joiner: ["-", "-", "-"],
          pastList: imageIDs,
        });

        const split = req.files.image.tempFilePath.split("\\");
        let tempName = split[split.length - 1];

        addImage(_id, req.id, tempName, req.files.image);

        messageImgWorker({
          requestBody: req.body,
          imageObj: {
            tempName,
            id: _id,
          },
        });

        res.json({
          status: true,
          body: {
            message: "Image uploaded successfully.",
            _id,
            request: {
              id: req.id,
              file: req.files,
            },
          },
        });
      } else {
        res.status(400).json({
          status: false,
          body: {
            message: "An error has occurred - Uploaded file is not an image.",
            request: {
              files: req.files,
            },
          },
        });
      }
    } else {
      res.status(400).json({
        status: false,
        body: {
          message:
            "An error has occurred - No file(s) parameter attached in the body of the request",
          request: {
            files: req.files,
          },
        },
      });
    }
  },
];
