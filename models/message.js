'use strict';
module.exports = (sequelize, DataTypes) => {
  var Message = sequelize.define('Message', {
    from: {
    	type: DataTypes.INTEGER,
    },
    to: {
    	type: DataTypes.INTEGER,
    },
    body: {
    	type: DataTypes.STRING
    }
  }, {
  	timestamp: true,    

    getterMethods: {
      async sender () {
        const user = await this.getUser();
        return user;
        return this.getUser().then(u => u.username)
      }
    }
  });
  Message.associate = function(models) {
    Message.belongsTo(models.Chat, {
      as: 'Chat',
      foreignKey: 'to'
    })
  	Message.belongsTo(models.User, {
      as: 'User',
      foreignKey: 'from' // use 'from' field as the FK instead of UserId.
    })
  };

  // Message.prototype.sender = function () {
  //   return this.getChat()
  // }
  return Message;
};