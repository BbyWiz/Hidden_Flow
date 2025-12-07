const express = require("express");
const health = require("./health_route");
// const alpha = require("./alpha_route");
const router = express.Router();
const yahoo = require('./yahoo_route');


router.use(health);
router.use(yahoo);

module.exports = router;
