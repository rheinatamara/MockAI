"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {
      Feedback.belongsTo(models.Interview, {
        foreignKey: "interviewId",
      });
      Feedback.belongsTo(models.User, { foreignKey: "userId" });
    }
  }

  Feedback.init(
    {
      totalScore: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      categoryScores: {
        type: DataTypes.JSONB,
        defaultValue: [],
      },
      strengths: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      areasForImprovement: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      interviewId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Interviews",
          key: "id",
        },
      },
      finalAssessment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Feedback",
    }
  );

  return Feedback;
};
