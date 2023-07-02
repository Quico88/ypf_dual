const { Router } = require("express");
const {
  checkCarWashKey,
  generateRandomKey,
  generateKey,
  countGeneratedKeys,
} = require("../controllers");

const carWashRouter = Router();

module.exports = carWashRouter;

carWashRouter.get("/:key", async (req, res) => {
  const { key } = req.params;
  console.log(key);
  try {
    if (await checkCarWashKey(key)) {
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
    const key = await generateKey();
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
    const count = await countGeneratedKeys();
    console.log("El acumulado es", count);
    if (count) {
      res.status(200).send({ count });
    } else {
      res.status(404).send("Hubo un error al contar las claves");
    }
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});
