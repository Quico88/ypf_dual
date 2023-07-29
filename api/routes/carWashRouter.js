const { Router } = require("express");
const {
  generateKey,
  countGeneratedKeys,
  bringKeyCreationHisotry,
  checkKey,
} = require("../controllers");

const carWashRouter = Router();
const { Carwash } = require("../db");

module.exports = carWashRouter;

carWashRouter.get("/:key", async (req, res) => {
  const { key } = req.params;
  console.log(key);
  try {
    if (await checkKey(key, Carwash)) {
      res.status(200).send("correct password");
    } else {
      res.status(404).send("password not found");
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

carWashRouter.get("/key/generate", async (req, res) => {
  console.log("generando clave");
  try {
    const key = await generateKey(Carwash);
    console.log("la clave es", key);
    if (key) {
      res.status(200).send({ key });
    } else {
      res.status(404).send("Hubo un error al generar la clave");
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

carWashRouter.get("/key/counter", async (req, res) => {
  try {
    const { MTDCount, currentShiftCount, prevShiftCount } =
      await countGeneratedKeys(Carwash);
    res.status(200).send({ MTDCount, currentShiftCount, prevShiftCount });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

carWashRouter.get("/key/history", async (req, res) => {
  try {
    const keyHistory = await bringKeyCreationHisotry(Carwash);
    if (keyHistory) {
      res.status(200).send({ keyHistory });
    } else {
      res.status(404).send("No data was found");
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});
