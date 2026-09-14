const express = require("express");
const router = express.Router();

const { List } = require("../controller/list");

router.get("/list", List);

module.exports = router;