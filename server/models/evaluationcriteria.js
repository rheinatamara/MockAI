"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EvaluationCriteria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EvaluationCriteria.belongsTo(models.InterviewSession, {
        foreignKey: "sessionId",
        as: "interviewSession",
      });
    }
  }
  EvaluationCriteria.init(
    {
      sessionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "InterviewSessions",
          key: "id",
        },
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comments: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "EvaluationCriteria",
    }
  );
  return EvaluationCriteria;
};
