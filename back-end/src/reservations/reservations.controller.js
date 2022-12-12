/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
// const nextId = require("../utils/nextId");
const service = require("./reservations.service");
const hasProperties = require("../errors/hasProperties");

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

//----Middleware----//
function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

const hasRequiredProperties = hasProperties(...VALID_PROPERTIES);

function hasValidQuery(req, res, next) {
  const { date, mobile_number } = req.query;
  if (!date && !mobile_number) {
    return next({
      status: 400,
      message: `Either a ?date or ?mobile_number query is needed`,
    });
  }

  next();
}
// function validateProperty()

//Function to get all reservations
async function list(req, res) {
  res.status(200).json({ data: await service.list() });
}

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

module.exports = {
  list: [hasValidQuery, asyncErrorBoundary(list)],
  create: [
    hasValidProperties,
    hasRequiredProperties,
    asyncErrorBoundary(create),
  ],
};
