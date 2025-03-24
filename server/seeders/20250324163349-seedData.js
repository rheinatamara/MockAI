"use strict";

const { encode } = require("../helpers/bcrypt");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const interviews = require("../data/interviews.json").map((el) => {
      delete el.id;
      el.createdAt = el.updatedAt = new Date();
      return el;
    });
    const feedbacks = require("../data/feedbacks.json").map((el) => {
      delete el.id;
      el.categoryScores = JSON.stringify(el.categoryScores);
      el.createdAt = el.updatedAt = new Date();
      return el;
    });
    await queryInterface.bulkInsert("Users", [
      {
        id: 1,
        name: "John Doe",
        email: "john@mail.com",
        password: encode("12345"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: "Jane Doe",
        email: "jane@mail.com",
        password: encode("12345"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: "Will Smith",
        email: "will@mail.com",
        password: encode("12345"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    await queryInterface.bulkInsert("Interviews", interviews);
    await queryInterface.bulkInsert("Feedbacks", feedbacks);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Feedbacks", null, {});
    await queryInterface.bulkDelete("Interviews", null, {});
    await queryInterface.bulkDelete("Users", null, {});
  },
};
