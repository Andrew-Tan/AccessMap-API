module.exports = (sequelize, DataTypes) => {
  return sequelize.define('profile', {
    profileID: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    userID: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profileName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    inclineMin: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    inclineMax: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    inclineIdeal: {
      type: DataTypes.REAL,
      allowNull: false,
    },
    avoidCurbs: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    avoidConstruction: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
  });
};
