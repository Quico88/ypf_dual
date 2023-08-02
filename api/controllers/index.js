require("dotenv").config();
const moment = require("moment/moment");
const { Op } = require("sequelize");
const { MASTER_KEY } = process.env;

const SHIFTS = {
  morning: "morning",
  afternoon: "afternoon",
};

const checkKey = async (key, deviceData) => {
  console.log("checking password: ", key);
  if (key === MASTER_KEY) return true;
  const result = await deviceData.findOne({
    where: {
      key,
      used: false,
      expires_at: {
        [Op.gt]: new Date(),
      },
    },
  });
  if (result) {
    await deviceData.update(
      {
        used: true,
      },
      {
        where: {
          id: result.id,
        },
      }
    );
    console.log("valid password");
    return true;
  } else return false;
};

const generateKey = async (deviceData) => {
  let key = generateRandomNumber();
  const now = new Date();
  const valid_time = 3600 * 24 * 1000 * 1; // 1 day
  const expires_at = now.getTime() + valid_time;
  try {
    result = await deviceData.create({
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

const bringKeyCreationHisotry = async (deviceData) => {
  const monthsOfHistory = 2;
  const data = await deviceData.findAll({
    where: {
      createdAt: {
        [Op.gt]: moment().subtract(monthsOfHistory, "months"),
      },
    },
    attributes: ["createdAt"],
  });
  return data;
};

const countGeneratedKeys = async (deviceData) => {
  const utcDifference = process.env.NODE_ENV === "production" ? 3 : 0;
  const AMStart = process.env.NODE_ENV === "production" ? 3 : 0;
  const PMStart = process.env.NODE_ENV === "production" ? 17 : 14;
  const now = moment();
  const yesterday = moment()
    .subtract(utcDifference, "hours")
    .subtract(1, "days");
  const localTime = moment().subtract(utcDifference, "hours");
  const monthStart = localTime.startOf("month").add(utcDifference, "hours");
  const hour = now.hour();
  const currentShift =
    hour < PMStart && hour >= AMStart ? SHIFTS.morning : SHIFTS.afternoon;
  const currentShiftStarts =
    currentShift === SHIFTS.morning
      ? moment({ hour: AMStart, minute: 0, seconds: 0 })
      : hour >= 3
      ? moment({ hour: PMStart, minute: 0, seconds: 0 })
      : moment({ hour: PMStart, minute: 0, seconds: 0 }).subtract(1, "days");

  const prevShiftStarts =
    currentShift === SHIFTS.morning
      ? yesterday.hours(PMStart).minutes(0).seconds(0)
      : hour >= 3
      ? moment({ hour: AMStart, minute: 0, seconds: 0 })
      : moment({ hour: AMStart, minute: 0, seconds: 0 }).subtract(1, "days");

  const MTDCount = await deviceData.count({
    where: {
      createdAt: {
        [Op.gt]: monthStart,
      },
    },
  });

  const prevShiftCount = await deviceData.count({
    where: {
      createdAt: {
        [Op.gt]: prevShiftStarts,
        [Op.lt]: currentShiftStarts,
      },
    },
  });

  const currentShiftCount = await deviceData.count({
    where: {
      createdAt: {
        [Op.gt]: currentShiftStarts,
      },
    },
  });

  return { MTDCount, prevShiftCount, currentShiftCount };
};

module.exports = {
  checkKey,
  generateRandomNumber,
  generateKey,
  countGeneratedKeys,
  bringKeyCreationHisotry,
};
