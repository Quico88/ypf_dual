const moment = require("moment/moment");
const { Carwash } = require("../db");
const { Op } = require("sequelize");

const SHIFTS = {
  morning: "morning",
  afternoon: "afternoon",
};

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
  const utcDifference = process.env.NODE_ENV === "production" ? 3 : 0;
  const AMStart = process.env.NODE_ENV === "production" ? 3 : 0;
  const PMStart = process.env.NODE_ENV === "production" ? 17 : 14;
  const now = moment();
  const yesterday = moment()
    .subtract(utcDifference, "hours")
    .subtract(1, "days");
  const monthStart = moment.subtract(
    utcDifference,
    "hours"
  )({ day: 1, hour: 0, minute: 0, seconds: 0 });
  const hour = now.hour();
  console.log("la hora en el back es", hour);
  const currentShift = hour < PMStart ? SHIFTS.morning : SHIFTS.afternoon;
  const currentShiftStarts =
    currentShift === SHIFTS.morning
      ? moment({ hour: AMStart, minute: 0, seconds: 0 })
      : moment({ hour: PMStart, minute: 0, seconds: 0 });

  const prevShiftStarts =
    currentShift === SHIFTS.morning
      ? yesterday.hours(PMStart).minutes(0).seconds(0)
      : moment({ hour: AMStart, minute: 0, seconds: 0 });

  const MTDCount = await Carwash.count({
    where: {
      createdAt: {
        [Op.gt]: monthStart,
      },
    },
  });

  const prevShiftCount = await Carwash.count({
    where: {
      createdAt: {
        [Op.gt]: prevShiftStarts,
        [Op.lt]: currentShiftStarts,
      },
    },
  });

  const currentShiftCount = await Carwash.count({
    where: {
      createdAt: {
        [Op.gt]: currentShiftStarts,
      },
    },
  });

  console.log(
    "los shifts ",
    currentShift,
    prevShiftStarts,
    currentShiftStarts,
    now
  );

  return { MTDCount, prevShiftCount, currentShiftCount };
};

module.exports = {
  checkCarWashKey,
  generateRandomNumber,
  generateKey,
  countGeneratedKeys,
};
