const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes)=>{
    const Post = sequelize.define('Post', {
        name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        content:{
            type: DataTypes.TEXT,
            allowNull : false
        }
    })
    Post.associate = (models)=>{
        Post.belongsTo(models.User, {
            foreignKey: 'userId',
            as : 'author',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        })
    }
    return Post
}