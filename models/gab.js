'use strict';
module.exports = function (sequelize, DataTypes) {
    var Gab = sequelize.define('Gab', {
        title: {
            type: DataTypes.STRING
        },
        content: DataTypes.TEXT,
        likes: DataTypes.INTEGER
    });
    Gab.associate = function (models) {
        Gab.belongsTo(models.User, {foreignKey: 'userId'});
    };
    return Gab;
};
