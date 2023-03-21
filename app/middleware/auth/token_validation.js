const {verify} = require("jsonwebtoken")

module.exports = {
  checkToken: (req, res, next) => {
    let token = req.get("authorization")
    if (token) {
      token = token.slice(7)
      verify(token, process.env.JWT_TOKEN, (err, decode) => {
        if (err) {
          res.json({
            message: "Invalide token"
          })
        } else {
          console.log("Decoded info: ", decode.data.id)
          next()
        }
      })
    } else {
      res.json({
        message: "Access denied! Unauthorized user"
      })
    }
  }
}
