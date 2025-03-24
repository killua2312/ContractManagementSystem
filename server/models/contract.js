const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Contract = sequelize.define(
    "Contract",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: () => uuidv4(),
        primaryKey: true,
        allowNull: false,
      },
      client: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("Draft", "Finalized"),
        allowNull: false,
      },
      data: {
        type: DataTypes.TEXT(),
        allowNull: false,
      },
    },
    {
      indexes: [
        {
          fields: ["status"],
        },
        {
          fields: ["client"],
        },
        {
          fields: ["id"],
        },
        {
          unique: true,
          fields: ["client", "title"],
        },
      ],
    },
  );

  return Contract;
};
