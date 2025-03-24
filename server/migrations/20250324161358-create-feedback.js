"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Feedbacks", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      totalScore: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      categoryScores: {
        type: Sequelize.JSONB,
        defaultValue: [],
      },
      strengths: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      areasForImprovement: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        defaultValue: [],
      },
      finalAssessment: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      interviewId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Interviews",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Feedbacks");
  },
};
