/**
 * List handler for reservation resources
 */
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const nextId = require("../utils/nextId");
const service = require("./reservations.service");

// const reservations = require();

//--functions--//
// async function list(req, res) {
//   const data = await service.list();
//   if (data) {
//     res.status(200).json({ data: data });
//   } else {
//     nextId({
//       status: 404,
//       mesage: "There are no reservations",
//     });
//   }
// }
async function list(req, res) {
  res.status(200).json({ data: await service.list() });
}

// function create(req, res, next) {
//   const {
//     data: {
//       first_name,
//       last_name,
//       mobile_number,
//       reservation_date,
//       reservation_time,
//       people,
//     } = {},
//   } = req.body;

//   const newReservation = {
//     first_name: first_name,
//     last_name: last_name,
//     mobile_number: mobile_number,
//     reservation_date: reservation_date,
//     reservation_time: reservation_time,
//     people: people,
//   };
//}

module.exports = {
  list: asyncErrorBoundary(list),
};
