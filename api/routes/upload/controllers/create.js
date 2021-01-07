const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const expectedSchema = Joi.object({
  file: Joi.any(),
  files: Joi.any(),
}).oxor("file", "files");

module.exports = [
  validator.body(expectedSchema),
  function (req, res) {
    if (req.body.file) {
      res.json({
        status: true,
        body: {
          message: "Image uploaded successfully.",
        },
      });
    } else if (req.body.files) {
      res.json({
        status: true,
        body: {
          message: "Images uploaded successfully.",
        },
      });
    } else {
      res.status(400).json({
        status: false,
        body: {
          message:
            "An error has occurred - No file(s) parameter attached in the body of the request",
        },
      });
    }
  },
];
