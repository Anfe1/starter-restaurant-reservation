const knex = require("../db/connection");

//Create a new entry
function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function readReservationById(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

function readTableByRes(reservation_id) {
  return knex("tables")
    .where({ reservation_id })
    .whereExists(knex.select("*").from("tables").where({ reservation_id }))
    .then((result) => result[0]);
}

function readTableId(table_id) {
  return knex("tables")
    .select("*")
    .where({ table_id: table_id })
    .then((record) => record[0]);
}

//function update a table with a new reservation id and a seated status
async function updateTableReservationIdStatus(reservation_id, table_id) {
  const trx = await knex.transaction();
  return trx("tables")
    .where({ table_id })
    .update(
      {
        reservation_id: reservation_id,
        status: "occupied",
      },
      "*"
    )
    .then(() =>
      trx("reservations").where({ reservation_id }).update({ status: "seated" })
    )
    .then(trx.commit)
    .catch(trx.rollback);
}

function destroyTable(table_id, reservation_id) {
  return knex.transaction(function (trx) {
    return trx("tables")
      .where({ table_id: table_id })
      .update({ reservation_id: null })
      .then(() => {
        return trx("reservations")
          .where({ reservation_id })
          .update({ status: "finished" });
      });
  });
}

module.exports = {
  list,
  create,
  updateTableReservationIdStatus,
  readReservationById,
  readTableId,
  destroyTable,
  readTableByRes,
};
