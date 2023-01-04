const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");

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

async function tableExists(req, res, next) {
  const table_id = req.params.table_id;
  const table = await service.readTableId(table_id);

  if (table) {
    res.locals.table = table;
    next();
  } else {
    next({
      status: 404,
      message: `table cannot be found. ${table_id}`,
    });
  }
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
  const { data = {} } = req.body;

  if (data["capacity"] === 0 || !Number.isInteger(data["capacity"])) {
    return next({
      status: 400,
      message: "capacity must be a number.",
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

function finishOccupiedTable(req, res, next) {
  const { table } = res.locals;

  if (!table.reservation_id) {
    return next({
      status: 400,
      message: "Table is not occupied.",
    });
  }
  next();
}

async function reservationSeated(req, res, next) {
  const seated = await service.readTableByRes(req.body.data.reservation_id);
  if (!seated) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_id is already seated",
  });
}

function tableAlreadySeated(req, res, next) {
  const { status } = res.locals.reservation;
  if (status === "seated") {
    return next({
      status: 400,
      message: "seated",
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

  const data = await service.updateTableReservationIdStatus(
    reservation.reservation_id,
    table.table_id
  );

  res.json({ data });
}

async function deleteTable(req, res, next) {
  // const { table_id } = req.params;
  // const { table } = res.locals;
  // const updatedTableData = {
  //   ...table,
  //   status: "free",
  // };
  // const updatedTable = await service.finish(updatedTableData);
  // const updatedReservation = {
  //   status: "finished",
  //   reservation_id: table.reservation_id,
  // };
  // await reservationService.update(updatedReservation);
  // res.json({ data: updatedTable });

  // const data = await service.destroyTable(table.table_id, table.reservation_id);
  // res.json({ data });
  const { table } = res.locals;
  const { table_id } = req.params;
  const { reservation_id } = res.locals.table;
  console.log("before", table);
  const data = await service.destroyTable(table_id, reservation_id);
  console.log("after", data);
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
    hasData,
    hasRequiredProperties("reservation_id"),
    validateReservationIdExists,
    asyncErrorBoundary(validateSufficientCapacity),
    validateTableIsOpen,
    tableAlreadySeated,
    asyncErrorBoundary(reservationSeated),
    asyncErrorBoundary(update),
  ],
  deleteFinishedTable: [
    asyncErrorBoundary(tableExists),
    finishOccupiedTable,
    asyncErrorBoundary(deleteTable),
  ],
};
