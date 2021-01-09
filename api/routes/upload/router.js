const express = require("express");
const router = express.Router({ mergeParams: true });

const { all, create, read, delete: del } = require("./controllers/index.js");

// Get all uploads
// router.get("/all", all);

router.post("/", create); //create an upload

router.route("/:uploadId");
// .get(read) //find an upload
// .delete(del); //delete an upload

module.exports = router;
