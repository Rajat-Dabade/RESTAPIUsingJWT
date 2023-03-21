module.exports = app => {
  const users = require("../controllers/user.controller")
  var router = require("express").Router()
  const {checkToken} = require("../middleware/auth/token_validation")


  router.get("/", checkToken, users.findAll)
  router.post("/", users.create)
  router.get("/:id", checkToken, users.findOne)
  router.put("/:id", checkToken, users.update)
  router.delete("/:id", checkToken, users.delete)
  router.post("/login", users.getUserByEmailAndPassword)

  app.use("/api/users", router)
}
