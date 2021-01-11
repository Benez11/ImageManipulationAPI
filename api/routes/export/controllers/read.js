const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const imgToPDF = require("image-to-pdf");
const Jimp = require("Jimp");

const {
  imageHandler: { findImage },
} = require("../../../../common/index.js");

const expectedSchema = Joi.object({
  to: Joi.string().valid("JPG", "PNG", "PDF").insensitive().required(),
});

module.exports = [
  validator.query(expectedSchema),
  function (req, res) {
    let ids = {
      uploadId: req.params.uploadId,
      requestId: req.id,
    };
    findImage(req.params.uploadId, {
      execUponFind: (imageObj, idx) => {
        if (imageObj.transformed === 1) {
          const { to } = req.query;
          if (to === "JPG") {
            Jimp.read(imageObj.newImg, (err, img) => {
              if (err) {
                console.error(
                  `Export (read.js) :: Failed to read image from path: "${imageObj.newImg}"`,
                  imageObj
                );
                return res.status(500).json({
                  status: false,
                  body: {
                    message: "An error has occurred.",
                    ...ids,
                  },
                });
              }
              img
                .getBufferAsync(Jimp.MIME_JPEG)
                .then((buff) => {
                  res.set(
                    "Content-disposition",
                    `attachment; filename=exported -- ${new Date().toISOString()}.jpg`
                  );
                  res.set("Content-Type", "image/jpeg");
                  res.send(Buffer.from(buff, "base64"));
                })
                .catch((err) =>
                  res.status(500).json({
                    status: false,
                    body: {
                      message: "An error has occurred.",
                      ...ids,
                      error: err,
                    },
                  })
                );
            });
          } else if (to === "PNG") {
            Jimp.read(imageObj.newImg, (err, img) => {
              if (err) {
                console.error(
                  `Export (read.js) :: Failed to read image from path: "${imageObj.newImg}"`,
                  imageObj
                );
                return res.status(500).json({
                  status: false,
                  body: {
                    message: "An error has occurred.",
                    ...ids,
                  },
                });
              }
              img
                .getBufferAsync(Jimp.MIME_PNG)
                .then((buff) => {
                  res.set(
                    "Content-disposition",
                    `attachment; filename=exported -- ${new Date().toISOString()}.png`
                  );
                  res.set("Content-Type", "image/png");
                  res.send(Buffer.from(buff, "base64"));
                })
                .catch((err) =>
                  res.status(500).json({
                    status: false,
                    body: {
                      message: "An error has occurred.",
                      ...ids,
                      error: err,
                    },
                  })
                );
            });
          } else if (to === "PDF") {
            res.set(
              "Content-disposition",
              `attachment; filename=exported -- ${new Date().toISOString()}.pdf`
            );
            res.set("Content-Type", "application/pdf");
            imgToPDF([imageObj.newImg], "A4").pipe(res);
          } else {
            res.json({
              status: false,
              body: {
                message: "You have parsed an invalid export 'to' query",
                ...ids,
                to,
              },
            });
          }
        } else {
          res.json({
            status: false,
            body: {
              message:
                "Image is still in the transformation queue. Try again in a moment.",
              ...ids,
            },
          });
        }
      },
      execUponNotFound: () => {
        console.error("Image upload not found in DB. Details:", ids);
        res.status(404).json({
          status: false,
          body: {
            message: "Image not found.",
            ...ids,
          },
        });
      },
    });
  },
];
