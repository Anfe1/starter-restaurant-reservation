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

function readReservationId(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

function updateReservationStatus(reservation_id, status) {
  return knex("reservations")
    .where({ reservation_id })
    .update({ status: status }, "*");
}

module.exports = {
  listDate,
  create,
  readReservationId,
  updateReservationStatus,
};
