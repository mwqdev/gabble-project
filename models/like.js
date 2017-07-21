'use strict';
module.exports = function (sequelize, DataTypes) {
    var Like = sequelize.define('Like', {});
    Like.associate = function (models) {
        Like.belongsTo(models.User, {foreignKey: 'userId'});
        Like.belongsTo(models.Gab, {foreignKey: 'gabId'});
    };
    return Like;
};
