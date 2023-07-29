const { Router } = require("express");
const {
  generateKey,
  countGeneratedKeys,
  bringKeyCreationHisotry,
  checkKey,
} = require("../controllers");

const vacuumRouter = Router();
const { Vacuum } = require("../db");

module.exports = vacuumRouter;

vacuumRouter.get("/:key", async (req, res) => {
  const { key } = req.params;
  console.log(key);
  try {
    if (await checkKey(key, Vacuum)) {
      res.status(200).send("correct password");
    } else {
      res.status(404).send("password not found");
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

vacuumRouter.get("/key/generate", async (req, res) => {
  console.log("generando clave");
  try {
    const key = await generateKey(Vacuum);
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

vacuumRouter.get("/key/counter", async (req, res) => {
  try {
    const { MTDCount, currentShiftCount, prevShiftCount } =
      await countGeneratedKeys(Vacuum);
    res.status(200).send({ MTDCount, currentShiftCount, prevShiftCount });
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

vacuumRouter.get("/key/history", async (req, res) => {
  try {
    const keyHistory = await bringKeyCreationHisotry(Vacuum);
    if (keyHistory) {
      res.status(200).send({ keyHistory });
    } else {
      res.status(404).send("No data was found");
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});
