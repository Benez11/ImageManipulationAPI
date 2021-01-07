const Shipment = require("../model.js");

module.exports = [
  function (req, res) {
    Shipment.find({}, (err, doc) => {
      if (err) {
        return res.status(500).json({
          status: false,
          data: {
            message: "An error has occured. Failed to get all shipments.",
            error: err,
          },
        });
      } else if (!doc) {
        return res.status(404).json({
          status: false,
          data: {
            message: "No shipment found.",
          },
        });
      } else
        res.json({
          status: true,
          body: {
            message: "Query successful!",
            shipments: doc,
          },
        });
    });
  },
];
