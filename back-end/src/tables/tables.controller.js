const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const hasProperties = require("../errors/hasProperties");

//----Middleware----//

function hasRequiredProperties(property) {
  return function (res, req, next) {
    const { data = {} } = res.body;

    try {
      if (!data[property]) {
        const error = new Error(`A '${property}' property is required`);
        error.status = 400;
        throw error;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

function validateTableName(req, res, next) {
  const { table_name } = req.body.data;

  if (!table_name) {
    return next({
      status: 400,
      message: "table_name is missing",
    });
  }

  if (table_name.length <= 1) {
    next({
      status: 400,
      message: "table_name must be more than 1 character.",
    });
  }
  next();
}

function validateCapacity(req, res, next) {
  const { capacity } = req.body.data;

  if (typeof capacity !== "number") {
    return next({
      status: 400,
      message: "capacity must be a number.",
    });
  }
  next();
}

async function validateReservationId(req, res, next) {
  const { reservation_id } = req.body.data;

  const reservation = await service.read(reservation_id);

  if (!reservation) {
    res.locals.reservation = reservation;
    return next({
      status: 404,
      message: `Reservation with id: ${reservation_id} does not exists.`,
    });
  }

  next();
}

function validateSufficientCapacity(req, res, next) {
  const { capacity } = res.locals.table;

  const { people } = res.locals.reservation;

  if (capacity < people) {
    return next({
      status: 400,
      message: "Table does not have sufficient capacity.",
    });
  }
  next();
}

function validateTableIsOpen(req, res, ne) {
  const { table } = res.locals;

  if (table.status === "occupied") {
    return next({
      status: 400,
      message: "The table selected is already occupied.",
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

//pass down the table_id, reservation_id, and status
async function update(req, res) {
  const { reservation, table } = res.locals;
  const data = await service.updateReservationTable();
  res.status(200).json({ data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    hasRequiredProperties("table_name"),
    hasRequiredProperties("capacity"),
    validateTableName,
    validateCapacity,
    asyncErrorBoundary(create),
  ],
  update: [
    hasRequiredProperties("reservation_id"),
    validateReservationId,
    validateSufficientCapacity,
    validateTableIsOpen,
    asyncErrorBoundary(update),
  ],
};
