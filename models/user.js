'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Board);
            User.hasMany(models.Markdata);
        }
    };
    User.init({
        name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: '名前は必ず入力してください。'
                }
            }
        },
        pass: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            }
        },
        mail: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: true
            }
        },
        age: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: true,
                min: 0
            }
        }
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};
