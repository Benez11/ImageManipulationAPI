const express = require("express");
const router = express.Router({ mergeParams: true });

const { create } = require("./controllers/index.js");

router.post("/", create); //create an upload

module.exports = router;
