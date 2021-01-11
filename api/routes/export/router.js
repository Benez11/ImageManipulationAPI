const express = require("express");
const router = express.Router({ mergeParams: true });

const { read } = require("./controllers/index.js");

router.get("/:uploadId", read); //export an upload

module.exports = router;
