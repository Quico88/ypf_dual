const { Router } = require("express");

const router = Router();

const carWashRoute = require("./carWashRouter");

router.use("/carwash", carWashRoute);

module.exports = router;
