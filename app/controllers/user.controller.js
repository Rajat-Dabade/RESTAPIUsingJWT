const {genSaltSync, hashSync, compareSync} = require("bcrypt")
const {sign} = require("jsonwebtoken")
const db = require("../models")
const User = db.User
const Op = db.Sequelize.Op

// To create and save new user
exports.create = (req, res) => {

  // Validate request
  if (!req.body.firstName ||
      !req.body.lastName ||
      !req.body.gender ||
      !req.body.email ||
      !req.body.password ||
      !req.body.number
     ) {
    res.status(400).send({
      message: "Content cannot be empty"
    })
    return
  }

  const salt = genSaltSync(10)
  const user = {
    id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    gender: req.body.gender,
    email: req.body.email,
    password: hashSync(req.body.password, salt),
    number: req.body.number
  }

  if (req.body.address) {
    const address = {
      steet: req.body.address.street,
      city: req.body.address.city,
      state: req.body.address.state,
      zip: req.body.address.zip
    }
    user.address = address

    User.create(user, {
      include: db.Address
    }).then(data => {
      res.send(data)
    }).catch(err => {
      if (err.fields.email) {
          res.status(500).send({
            message: "User already present with email: " + user.email
          })
          return
        }
        res.status(500).send({
          message: err.message || "Some error occurred while creating the tutorial"
        })
    })
    return
  }

  User.create(user)
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        if (err.fields.email !== undefined) {
          res.status(500).send({
            message: "User already present with email: " + user.email
          })
          return
        }
        res.status(500).send({
          message: err.message || "Some error occurred while creating the tutorial"
        })
      })
}

// Retrieve all User from the database
exports.findAll = (req, res) => {
  User.findAll({include: db.Address})
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving Users"
        })
      })
}

// find a single user with an id
exports.findOne = (req, res) => {
  const id = req.params.id

  User.findAll({
    where: {
      id: {
        [Op.eq]: id
      }
    }
  }).then(data => {
    if (data) {
      res.send(data)
    } else {
      res.status(400).send({
        message: `Cannot find User with id=${id}`
      })
    }
  }).catch(err => {
    res.status(500).send({
      message: `Error retrieving User with id ${id}`
    })
  })
}

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id

  User.update(req.body, {
    where: {
      id : {
        [Op.eq] : id
      }
    }
  }).then(num => {
    if (num == 1) {
      res.send({
        message: "User data was updated successfully"
      })
    } else {
      res.send({
        message: `Cannot update user with id = ${id}. Maybe user was not found`
      })
    }
  }).catch(err => {
    res.status(500).send({
      message: "Error updating Tutorial with id" + id
    })
  })
}

// Date a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id

  User.destroy({
    where: {
      id: {
        [Op.eq]: id
      }
    }
  }).then(num => {
    if (num == 1) {
      res.send({
        message: "User was deleted successfully"
      })
    } else {
      res.send({
        message: `Cannot delete user with id = ${id}. Maybe user was not found`
      })
    }
  }).catch(err => {
    res.status(500).send({
      message: "Could not delete User with id =" + id
    })
  })
}

exports.getUserByEmailAndPassword = (req, res) => {
  const email = req.body.email
  const password = req.body.password
  console.log("Email: ", email, "passowrd: ", password)

  User.findOne({
    where: {
      email: {
        [Op.eq] : email
      }
    }
  }).then(data => {
    if(!data) {
      res.send({
        message: "User not found with email" + email
      })
      return
    }

    const pwdCheck = compareSync(password, data.password)
    if (pwdCheck) {
      data.password = undefined
      const jsonToken = sign({data}, process.env.JWT_TOKEN, {
        expiresIn: "1h"
      })
      res.send({
        message: "login successfully",
        token: jsonToken,
        username: data.firstName + data.lastName
      })
      return
    } else {
      return res.send({
        message: "Invalid email or password"
      })
    }
  }).catch(err => {
    res.status(500).send({
      message: err.message || "Something went wrong please try again"
    })
  })
}
