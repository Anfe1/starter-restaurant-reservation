const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const { response } = require("express");
// const hasProperties = require("../errors/hasProperties");

//----Middleware----//

function hasRequiredProperties(property) {
  return function (res, req, next) {
    const { data = {} } = res.body;

    if (!data[property]) {
      return next({
        status: 400,
        message: `Property ${property} is missing.`,
      });
    }
    next();
  };
}

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({
    status: 400,
    message: "Body must have a data property.",
  });
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
  console.log(typeof capacity);

  if (typeof capacity != "number") {
    return next({
      status: 400,
      message: "capacity must be a number test.",
    });
  }
  next();
}

async function validateReservationIdExists(req, res, next) {
  const { reservation_id } = req.body.data;

  const reservation = await service.readReservationById(reservation_id);

  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation with id: ${reservation_id} does not exists.`,
    });
  }
  res.locals.reservation = reservation;
  next();
}

async function validateSufficientCapacity(req, res, next) {
  const table = await service.readTableId(req.params.table_id);
  const { people, reservation_id } = res.locals.reservation;

  if (people > table.capacity) {
    return next({
      status: 400,
      message: "Table does not have sufficient capacity.",
    });
  }
  res.locals.table = table;
  next();
}

//If there is a reservation_id already the table is already occupied.
function validateTableIsOpen(req, res, next) {
  const { table } = res.locals;
  if (table.reservation_id) {
    return next({ status: 400, message: "Table is occupied" });
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

  const data = await service.updateTableReservationIdStatus(
    table.table_id,
    reservation.reservation_id,
    "Occupied"
  );
  res.status(200).json({ data: data });
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
    hasData,
    hasRequiredProperties("reservation_id"),
    validateReservationIdExists,
    asyncErrorBoundary(validateSufficientCapacity),
    validateTableIsOpen,
    asyncErrorBoundary(update),
  ],
};
