const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});
const imgToPDF = require("image-to-pdf");
const Jimp = require("Jimp");

const {
  imageHandler: { findImage },
} = require("../../../../common/index.js");

const expectedSchema = Joi.object({
  to: Joi.string().insensitive().lowercase().required(),
});

module.exports = [
  validator.query(expectedSchema),
  function (req, res) {
    console.info({ Query: req.query });
    let ids = {
      uploadId: req.params.uploadId,
      requestId: req.id,
    };
    findImage(req.params.uploadId, {
      execUponFind: (imageObj, idx) => {
        if (imageObj.transformed === 1) {
          const { to } = req.query;
          if (to === "jpg") {
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
          } else if (to === "png") {
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
          } else if (to === "pdf") {
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
        } else if (imageObj.transformed === -1) {
          res.status(500).json({
            status: false,
            body: {
              message:
                "This image was NOT successfully transformed. An error occurred during the process. Re-upload the image and attempt this extraction again and if problem persists, kindly contact support for further assistance.",
              ...ids,
            },
          });
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
