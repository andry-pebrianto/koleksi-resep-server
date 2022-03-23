const express = require("express");
const {
  list,
  detail,
  insert,
  update,
  remove,
} = require("../controllers/user.controller");

const router = express.Router();

router
  .get("/user", list)
  .get("/user/:id", detail)
  .post("/user", insert)
  .put("/use/:id", update)
  .delete("/user/:id", remove);

module.exports = router;
