const { DataTypes, Op } = require('sequelize');
const sequelize = require('../config/connectionPool');
const Joi = require('joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * definitions:
 *   Student:
 *     properties:
 *       id:
 *         type: string
 *       fullNamea:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       class:
 *         type: string
 *     required:
 *       - names
 *       - email
 *       - password
 *       - phone
 *       - nationalId
 *       - department
 *       - position
 */

const Student = sequelize.define('students', {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  fullNames: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
 
  class: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
});

// Sync employee model with the database
(async () => {
  try {
    await Student.sync();
    console.log("Student table created successfully");
  } catch (err) {
    console.error("Error syncing Student table:", err);
  }
})();

Student.prototype.generateAuthToken = function () {
  const token = jwt.sign({ id: this.id }, process.env.JWT_SECRET);
  return token;
};

module.exports = Student ;

module.exports.validateStudent = (body, isUpdating = false) => {
  return Joi.object({
    fullNames: Joi.string().required(),
    email: Joi.string().email().required(),
    password: isUpdating ? Joi.string().min(6) : Joi.string().min(6).required(),
    class: Joi.string().required(),
   
  }).validate(body);
};

module.exports.validateStudentLogin = (body) => {
  return Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }).validate(body);
};


module.exports.NationalIdPattern = /(?<!\d)\d{16}(?!\d)/;
module.exports.PhoneRegex = /(?<!\d)\d{10}(?!\d)/