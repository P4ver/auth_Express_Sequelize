'use strict';

module.exports = (sequelize, DataTypes)=>{
    const User = sequelize.define('User',{
        username : {
            type : DataTypes.STRING,
            allowNull : false,
            unique: true,
        },
        password : {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email:{
            type: DataTypes.STRING,
            allowNull: false,
            unique:true,
        },
        isVerified : {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        verifyOTP:{
            type: DataTypes.STRING,
            allowNull: true,
        },
        verifyOTPExpireAt : {
            type: DataTypes.DATE,
            allowNull: true,
        },
        resetPasswordToken :{
            type: DataTypes.STRING,
            allowNull: true,
        },
        resetPasswordTokenExpiresAt : {
            type: DataTypes.DATE,
            allowNull: true,
        }
    });

    User.associate = (models)=>{
        User.hasMany(models.Post, {
            foreignKey : 'userId',
            as : 'posts'
        })

    }
    return User;
}

    // User.associate = (models)=>{
    //     User.hasMany(models.Post, {
    //         foreignKey: 'userId',
    //         as: 'posts'
    //     })
    // }
