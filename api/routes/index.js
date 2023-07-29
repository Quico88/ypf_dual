const { Router } = require("express");

const router = Router();

const carWashRoute = require("./carWashRouter");
const inflatorRoute = require("./inflatorRouter");
const vacuumRoute = require("./vacuumRouter");

router.use("/carwash", carWashRoute);
router.use("/inflator", inflatorRoute);
router.use("/vacuum", vacuumRoute);

module.exports = router;
