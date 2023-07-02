const moment = require("moment/moment");
const { Carwash } = require("../db");
const { Op } = require("sequelize");

const checkCarWashKey = async (key) => {
  console.log("checking password: ", key);
  const result = await Carwash.findOne({
    where: {
      key,
      used: false,
      expires_at: {
        [Op.gt]: new Date(),
      },
    },
  });
  if (result) {
    await Carwash.update(
      {
        used: true,
      },
      {
        where: {
          id: result.id,
        },
      }
    );
    return true;
  } else return false;
};

const generateKey = async () => {
  let key = generateRandomNumber();
  const now = new Date();
  const valid_time = 3600 * 24 * 1000 * 1; // 1 day
  const expires_at = now.getTime() + valid_time;
  try {
    result = await Carwash.create({
      key,
      expires_at,
    });
    return key;
  } catch (e) {
    console.log("hubo un error ", e);
  }
  return key;
};

const generateRandomNumber = () => {
  const key = Math.round(Math.random() * 899 + 100);
  return key;
};

const countGeneratedKeys = async () => {
  const count = await Carwash.count({
    where: {
      createdAt: {
        [Op.gt]: moment("2023-07"),
      },
    },
  });

  return count;
};

module.exports = {
  checkCarWashKey,
  generateRandomNumber,
  generateKey,
  countGeneratedKeys,
};
