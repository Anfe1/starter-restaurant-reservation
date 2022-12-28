/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
// const nextId = require("../utils/nextId");
const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");

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
  const { reservation_date, reservation_time } = req.body.data;
  const now = new Date();
  const reservationDate = new Date(reservation_date + "T" + reservation_time);

  if (!Date.parse(reservation_date)) {
    return next({
      status: 400,
      message: "reservation_date must be in YYYY-MM-DD (ISO-8601) format.",
    });
  }

  if (reservationDate < now) {
    return next({
      status: 400,
      message: "Reservation must be in the future.",
    });
  }

  const dayOfWeek = new Date(reservation_date).getUTCDay();

  if (dayOfWeek === 2) {
    return next({
      status: 400,
      message: "closed on Tuesdays",
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
  const { reservation_time } = req.body.data;
  timeFormat = /^\d{1,2}:\d{2}([ap]m)?$/;

  if (!reservation_time || !reservation_time.match(timeFormat)) {
    return next({
      status: 400,
      message: "reservation_time must be in HH:MM:SS (or HH:MM) format.",
    });
  }

  if (reservation_time < "10:30" || reservation_time > "21:30") {
    return next({
      status: 400,
      message: "reservation_time is not avalible.",
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

function statusUnknown(req, res, next) {
  const { status } = req.body.data;

  if (status === "unknown") {
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
  res.status(200).json({ data: await service.listDate(req.query.date) });
}

async function create(req, res) {
  res.status(201).json({ data: await service.create(req.body.data) });
}

function read(req, res, next) {
  const data = res.locals.reservation;
  res.json({ data });
}

async function update(req, res, next) {
  const status = res.locals.status;
  const reservation = res.locals.reservation;

  const data = await service.updateReservationStatus(
    reservation.reservation_id,
    status
  );
  res.status(200).json({ data: { status: data[0].status } });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasRequiredProperties,
    validateFirstName,
    validateLastName,
    validateMobileNumber,
    validateDate,
    validatePeople,
    validateTime,
    validateStatus,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [
    reservationExists,
    statusUnknown,
    finishedReservation,
    asyncErrorBoundary(update),
  ],
};
