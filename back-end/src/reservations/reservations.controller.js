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

// function validateData(request, response, next) {
//   if (!request.body.data) {
//     return next({ status: 400, message: "Body must include a data object" });
//   }
//   return next();
// }

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

function dateNotInPast(dateString, timeString) {
  const now = new Date();
  // creating a date object using a string like:  '2021-10-08T01:21:00'
  const reservationDate = new Date(dateString + "T" + timeString);
  return reservationDate >= now;
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

  if (!(reservationDate >= now)) {
    return next({
      status: 400,
      message: "Reservation must be in the future.",
    });
  }

  const dayOfWeek = new Date(reservation_date).getUTCDay();

  if (!(dayOfWeek !== 2)) {
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
  re = /^\d{1,2}:\d{2}([ap]m)?$/;

  if (!reservation_time || !reservation_time.match(re)) {
    next({
      status: 400,
      message: "reservation_time must be in HH:MM:SS (or HH:MM) format.",
    });
  }
  next();
}

//----Functions----//
async function list(req, res) {
  res.status(200).json({ data: await service.list(req.query.date) });
}

async function create(req, res) {
  res.status(201).json({ data: await service.create(req.body.data) });
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
    asyncErrorBoundary(create),
  ],
};
