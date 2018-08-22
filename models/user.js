'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      required: true
    },
    password: {
      type: DataTypes.STRING,
      required: true
    }
  }, {
  	timestamps: true
  });
  User.associate = models => {
    User.belongsToMany(models.Chat, {
      as: 'Chats',
      through: 'UserChats',
      foreignKey: 'UserId',
      otherKey: 'ChatId'
    });
    User.hasMany(models.Message, {
      as: 'Messages',
      foreignKey: 'from'
    });

  };
  return User;
};