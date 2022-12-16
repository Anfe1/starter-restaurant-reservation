const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const hasProperties = require("../errors/hasProperties");

//----Middleware----//
const REQUIRED_PROPERTIES = ["table_name", "capacity"];
const hasRequiredProperties = hasProperties(...REQUIRED_PROPERTIES);

function validateTableName(req, res, next) {
  const { table_name } = req.body.data;

  if (!table_name) {
    return next({
      status: 400,
      message: "table_name is missing",
    });
  }

  if (!(table_name.length > 1)) {
    next({
      status: 400,
      message: "table_name must be more than 1 character.",
    });
  }
  next();
}

function validateCapacity(req, res, next) {
  const { capacity } = req.body.data;
  console.log(capacity);

  if (typeof capacity !== "number") {
    return next({
      status: 400,
      message: "capacity must be a number.",
    });
  }
  next();
}

//----Functions----//
async function list(req, res) {
  res.status(200).json({ data: await service.list() });
}

async function create(req, res) {
  res.status(201).json({ data: await service.create(req.body.data) });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasRequiredProperties,
    validateTableName,
    validateCapacity,
    asyncErrorBoundary(create),
  ],
};
