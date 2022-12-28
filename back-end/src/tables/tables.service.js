const knex = require("../db/connection");

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

function readTableId(table_id) {
  return knex("tables")
    .select("*")
    .where({ table_id: table_id })
    .then((record) => record[0]);
}

//function update a table with a new reservation id and a seated status
function updateTableReservationIdStatus(table_id, reservation_id, status) {
  return knex("tables")
    .select("*")
    .where({ table_id: table_id })
    .update({ reservation_id: reservation_id, status: status });
}

module.exports = {
  list,
  create,
  updateTableReservationIdStatus,
  readReservationById,
  readTableId,
};
