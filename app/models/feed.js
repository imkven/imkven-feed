module.exports = function (sequelize, DataTypes) {

  var Feed = sequelize.define('Feed', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING
    },
    url: {
      type: DataTypes.STRING,
      unique: true
    },
    lastModified: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        // example on how to add relations
        // Article.hasMany(models.Comments);
      }
    }
  });

  return Feed;
};
