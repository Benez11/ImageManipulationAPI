const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const {
  codeGenerator,
  imageHandler: { addImage, imageIDs },
} = require("../../../../common/index");

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

        const splitTempFilePath = req.files.image.tempFilePath.split("\\");

        addImage(
          _id,
          req.id,
          splitTempFilePath[splitTempFilePath.length - 1],
          req.files.image
        );

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
