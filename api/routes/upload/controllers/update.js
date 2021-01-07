const Joi = require("joi");
const validator = require("express-joi-validation").createValidator({});

const expectedSchema = Joi.object({
  sendersName: Joi.string(),
  sendersAddress: Joi.string(),
  sendersPhone: Joi.number(),
  sendersEmail: Joi.string().email(),
  receiversName: Joi.string(),
  receiversAddress: Joi.string(),
  receiversPhone: Joi.number(),
  receiversEmail: Joi.string().email(),
  origin: Joi.string(),
  package: Joi.string(),
  status: Joi.string(),
  destination: Joi.string(),
  carrier: Joi.string(),
  typeOfShipment: Joi.string(),
  weight: Joi.number(),
  shipmentMode: Joi.string(),
  product: Joi.string(),
  quantity: Joi.number(),
  wayBill: Joi.string(),
});

const Shipment = require("../model.js");

module.exports = [
  validator.body(expectedSchema),
  function (req, res) {
    Shipment.findByIdAndUpdate(
      req.params.shipmentId,
      { ...req.body },
      { new: true, useFindAndModify: false },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            status: false,
            data: {
              message: "An error has occured. Failed to update shipment.",
              error: err,
            },
          });
        } else {
          res.json({
            status: true,
            body: {
              message: "Shipment updated!",
              shipment: doc,
            },
          });
        }
      }
    );
  },
];
