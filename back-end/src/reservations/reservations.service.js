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
    .whereNotIn("status", ["finished", "canceled"])
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

function searchByPhoneNumber(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function updateReservationById(updatedReservation) {
  return knex("reservations")
    .where({ reservation_id: updatedReservation.reservation_id })
    .whereNot({ status: "finished" })
    .update(updatedReservation, "*")
    .then((updatedRecord) => updatedRecord[0]);
}

async function updateReservation(reservation) {
  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = reservation;
  return knex("reservations").where({ reservation_id }).update(
    {
      first_name: first_name,
      last_name: last_name,
      mobile_number: mobile_number,
      reservation_date: reservation_date,
      reservation_time: reservation_time,
      people: people,
    },
    [
      "first_name",
      "last_name",
      "mobile_number",
      "people",
      "reservation_date",
      "reservation_time",
    ]
  );
}
module.exports = {
  listDate,
  create,
  readReservationId,
  updateReservationStatus,
  searchByPhoneNumber,
  updateReservationById,
  updateReservation,
};
