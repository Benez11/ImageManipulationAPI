const express = require("express");
const router = express.Router({ mergeParams: true });

const { upload } = require("./routes/index.js");

router.use("/upload", upload.router);

module.exports = router;
