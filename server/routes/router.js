const express = require("express");
const health = require("./health_route");
const alpha = require("./alpha_route");
const fmp = require("./fmp_route");
const nasdaq = require("./nasdaq_route");
const path = require("path");
const router = express.Router();
const yahoo = require('./yahoo_route');

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });


router.use(health);
router.use(alpha);
router.use(fmp);
router.use(nasdaq);
router.use(yahoo);

module.exports = router;
