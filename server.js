require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()

var corsOptions = {
  origin: "*"
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const db = require("./app/models")

db.sequelize.sync()
  .then(() => {
    console.log("Synced db.")
  })
  .catch((err) => {
    console.log("Failed to sync db: ", err.message)
  })

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Rest APi application"
  })
})

require("./app/routes/user.routes")(app)

const PORT = process.env.APP_PORT

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
