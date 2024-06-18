const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/connectionPool");
const Joi = require('joi');

/**
 * @swagger
 * definitions:
 *   Books:
 *     properties:
 *       id:
 *         type: string
 *       name:
 *         type: string
 *       author:
 *         type: string
 *       publisher:
 *         type: string
 *       publicationYear:
 *         type: string
 *       subject:
 *         type: string
 *     required:
 *       - laptopSerialNumber
 *       - manufactureCompany
 *       - modelName
 */

const Book = sequelize.define("laptops", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  publisher: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  publicationYear: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  subject: {
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

// Sync laptop model with the database
(async () => {
  try {
    await Book.sync();
    console.log("Book table created successfully");
  } catch (err) {
    console.error("Error syncing Book table:", err);
  }
})();

module.exports = Book;

module.exports.validateBook = (body) => {
  return Joi.object({
    name: Joi.string().required(),
    author: Joi.string().required(),
    publisher: Joi.string().required(),
    publicationYear: Joi.string().required(),
    subject: Joi.string().required(),
  }).validate(body);
};
