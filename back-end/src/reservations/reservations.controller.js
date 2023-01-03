/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
// const nextId = require("../utils/nextId");
const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");
const { request } = require("../app");

const REQUIRED_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

//----Middleware----//
//Test if data is missing
const hasRequiredProperties = hasProperties(...REQUIRED_PROPERTIES);

//Reservation exists
async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;

  const reservation = await service.readReservationId(reservation_id);

  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation with id: ${reservation_id} not found.`,
    });
  }
  res.locals.reservation = reservation;
  next();
}

//Validate first name
function validateFirstName(req, res, next) {
  const { first_name } = req.body.data;

  if (!first_name || first_name === "") {
    next({
      status: 400,
      message: "first_name must not be empty or missing.",
    });
  }
  next();
}

//Validate last name
function validateLastName(req, res, next) {
  const { last_name } = req.body.data;

  if (!last_name || last_name === "") {
    next({
      status: 400,
      message: "last_name must not be empty or missing.",
    });
  }
  next();
}

//Validate mobile_number
function validateMobileNumber(req, res, next) {
  const { mobile_number } = req.body.data;

  if (!mobile_number || mobile_number === "") {
    next({
      status: 400,
      message: "mobile_number must not be empty or missing.",
    });
  }
  next();
}

//Validate date, Sunday-Saturday: 0-6
function validateDate(req, res, next) {
  const { data = {} } = req.body;
  const date = new Date(data.reservation_date);
  const day = date.getUTCDay();
  const newDate = new Date();

  if (!Date.parse(date)) {
    next({
      status: 400,
      message: "reservation_date must be a valid date format!",
    });
  }
  if (day === 2) {
    return next({
      status: 400,
      message: `Restaurant closed on Tuesday, please choose a different day of the week.`,
    });
  }
  if (
    JSON.stringify(date).slice(1, 11) < JSON.stringify(newDate).slice(1, 11) &&
    JSON.stringify(date).slice(12, 24) < JSON.stringify(newDate).slice(12, 24)
  ) {
    return next({
      status: 400,
      message: `Reservation must be a future date.`,
    });
  }

  next();
}

function validatePeople(req, res, next) {
  const { data: { people } = {} } = req.body;
  if (!people || !Number.isInteger(people) || people < 1) {
    next({
      status: 400,
      message: `Invalid people property.`,
    });
  }
  next();
}

//Validate Time
function validateTime(req, res, next) {
  const { data = {} } = req.body;
  const time = data.reservation_time;
  const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  const valid = time.match(regex);
  if (!valid) {
    return next({
      status: 400,
      message: "reservation_time must be valid time.",
    });
  }

  if (time < "10:30" || time > "21:30") {
    next({
      status: 400,
      message: "reservation_time must be within business hours",
    });
  }

  next();
}

function validateStatus(req, res, next) {
  const { status } = req.body.data;
  if (status === "seated" || status === "finished") {
    return next({
      status: 400,
      message: "Status cannot be already seated or finished.",
    });
  }
  next();
}

function validStatus(req, res, next) {
  const { status } = req.body.data;
  const validStatus = ["booked", "finished", "seated", "cancelled"];
  if (!validStatus.includes(status)) {
    return next({
      status: 400,
      message: "Status is unknown.",
    });
  }
  res.locals.status = status;
  next();
}

function finishedReservation(req, res, next) {
  const reservation = res.locals.reservation;

  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: "Status is currently finished.",
    });
  }
  next();
}

//----Functions----//
async function list(req, res) {
  const { date, mobile_number } = req.query;

  const reservation = await (mobile_number
    ? service.searchByPhoneNumber(mobile_number)
    : service.listDate(date));

  res.status(200).json({ data: reservation });
}

async function create(req, res) {
  res.status(201).json({ data: await service.create(req.body.data) });
}

function read(req, res, next) {
  const data = res.locals.reservation;
  res.json({ data });
}

async function updateStatus(req, res, next) {
  const updatedReservation = {
    ...req.body.data,
    reservation_id: req.params.reservation_id,
    status: req.body.data.status,
  };

  if (res.locals.reservation.status === "finished") {
    return next({
      status: 400,
      message: "a finished reservation cannot be updated",
    });
  }

  const data = await service.updateReservation(updatedReservation);
  res.status(200).json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasRequiredProperties,
    validateDate,
    validatePeople,
    validateTime,
    validateStatus,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],

  updateStatus: [
    asyncErrorBoundary(reservationExists),
    validStatus,
    finishedReservation,
    asyncErrorBoundary(updateStatus),
  ],
  updateReserv: [
    reservationExists,
    hasRequiredProperties,
    validateFirstName,
    validateLastName,
    validateMobileNumber,
    validateDate,
    validateTime,
    validatePeople,
    asyncErrorBoundary(updateStatus),
  ],
};
