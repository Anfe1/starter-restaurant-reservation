const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

//----Functions----//
async function list(req, res) {
  res.status(200).json({ data: await service.list() });
}

async function create(req, res) {
  res.status(201).json({ data: await service.create(req.body.data) });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [asyncErrorBoundary(create)],
};
