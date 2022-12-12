const crypto = require("crypto");

function nextId() {
  return crypto.randomBytes(16).toString("hex");
}
