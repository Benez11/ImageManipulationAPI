const Shipment = require("../model.js");

module.exports = [
  function (req, res) {
    Shipment.findByIdAndRemove(
      req.params.shipmentId,
      { new: true, useFindAndModify: false },
      (err, doc) => {
        if (err) {
          return res.status(500).json({
            status: false,
            data: {
              message: "An error has occured. Failed to delete shipment.",
              error: err,
            },
          });
        } else {
          res.json({
            status: true,
            body: {
              message: "Shipment deleted.",
              shipment: doc,
            },
          });
        }
      }
    );
  },
];
