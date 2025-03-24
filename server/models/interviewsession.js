"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class InterviewSession extends Model {
    static associate(models) {
      InterviewSession.belongsTo(models.User, {
        foreignKey: "UserId",
        as: "user",
      });
      InterviewSession.hasMany(models.EvaluationCriteria, {
        foreignKey: "sessionId",
        as: "evaluationCriteria",
      });
    }
  }
  InterviewSession.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      vapiSessionId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      interviewType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      techStack: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transcript: {
        type: DataTypes.TEXT,
      },
      feedback: {
        type: DataTypes.TEXT,
      },
      score: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "InterviewSession",
    }
  );
  return InterviewSession;
};
