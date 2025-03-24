"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Interview extends Model {
    static associate(models) {
      Interview.belongsTo(models.User, { foreignKey: "userId" });
      Interview.hasMany(models.Feedback, {
        foreignKey: "interviewId",
      });
    }
  }

  Interview.init(
    {
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      level: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      questions: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: [],
      },
      techstack: {
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
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      finalized: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Interview",
    }
  );

  return Interview;
};
