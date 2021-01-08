// const Joi = require("joi");
// const validator = require("express-joi-validation").createValidator({});

// const expectedSchema = Joi.object({
//   searchByWayBillNo: Joi.boolean(),
// });

// const Shipment = require("../model.js");

// module.exports = [
//   validator.body(expectedSchema),
//   function (req, res) {
//     let requiredFunction = req.body.searchByWayBillNo
//       ? Shipment.findOne
//       : Shipment.findById;
//     requiredFunction(
//       req.body.searchByWayBillNo
//         ? { wayBill: req.params.shipmentId }
//         : req.params.shipmentId,
//       (err, doc) => {
//         if (err) {
//           return res.status(500).json({
//             status: false,
//             data: {
//               message: "An error has occured. Failed to get shipment.",
//               error: err,
//             },
//           });
//         } else if (!doc) {
//           return res.status(404).json({
//             status: false,
//             data: {
//               message: "Shipment does not exist.",
//             },
//           });
//         } else
//           res.json({
//             status: true,
//             body: {
//               message: "Shipment found!",
//               shipment: doc,
//             },
//           });
//       }
//     );
//   },
// ];
