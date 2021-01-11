const express = require("express");
const router = express.Router({ mergeParams: true });

const { upload, export: exp } = require("./routes/index.js");

router.use("/upload", upload.router);
router.use("/export", exp.router);

module.exports = router;
