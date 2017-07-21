'use strict';
module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define('User', {
        username: DataTypes.STRING,
        displayName: DataTypes.STRING,
        password: DataTypes.STRING
    });
    User.associate = function (models) {
    };
    return User;
};
