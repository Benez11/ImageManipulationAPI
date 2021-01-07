const Shipment = require("../model.js");

module.exports = [
  function (req, res) {
    Shipment.findOne({ wayBill: req.params.wayBillNo }, (err, doc) => {
      if (err) {
        return res.status(500).json({
          status: false,
          data: {
            message: "An error has occured. Failed to get your shipment.",
            error: err,
          },
        });
      } else if (!doc) {
        return res.status(404).json({
          status: false,
          data: {
            message: "There's no shipment with this waybill number.",
          },
        });
      } else
        res.json({
          status: true,
          body: {
            message: "Shipment found!",
            shipment: doc,
          },
        });
    });
  },
];
