const knex = require("../db/connection");

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time");
}

function read(reservation_Id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservation_Id })
    .first();
}

module.exports = {
  list,
  create,
  read,
};
