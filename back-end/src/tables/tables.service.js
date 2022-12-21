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

function read(reservation_id) {
  return knex("tables")
    .select("*")
    .where({ reservation_id: reservation_id })
    .then((result) => result[0]);
}

//function update a table with a new reservation id and a seated status
function updateReservationTable(table_id, reservation_id, status) {
  return knex("table")
    .select("*")
    .where({ table_id: table_id })
    .update({ reservation_id: reservation_id, status: status });
}

module.exports = {
  list,
  create,
  updateReservationTable,
  read,
};
