// Example model


module.exports = function (sequelize, DataTypes) {

  var Article = sequelize.define('Article', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: DataTypes.STRING,
    date: DataTypes.DATE,
    url: {
      type: DataTypes.STRING,
      unique: true
    },
    content: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        // example on how to add relations
        // Article.hasMany(models.Comments);
      }
    }
  });

  return Article;
};
