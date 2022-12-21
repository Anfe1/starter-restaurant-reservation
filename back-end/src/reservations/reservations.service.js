const knex = require("../db/connection");

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function listDate(reservation_date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .orderBy("reservation_time");
}

function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

module.exports = {
  listDate,
  create,
  read,
};
