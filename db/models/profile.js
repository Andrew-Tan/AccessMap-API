module.exports = (sequelize, DataTypes) => {
  return sequelize.define('profile', {
    userID: {
      type: DataTypes.INTEGER,
    },
    profileName: {
      type: DataTypes.STRING,
    },
    inclineMin: {
      type: DataTypes.REAL,
    },
    inclineMax: {
      type: DataTypes.REAL,
    },
    inclineIdeal: {
      type: DataTypes.REAL,
    },
    avoidCurbs: {
      type: DataTypes.BOOLEAN,
    },
    avoidConstruction: {
      type: DataTypes.BOOLEAN,
    },
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
  });
};
