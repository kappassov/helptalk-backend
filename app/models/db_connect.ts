import { Sequelize } from 'sequelize-typescript'

const connect = require("../config/db")

export const sequelize = new Sequelize(connect.DB, connect.USER, connect.PASSWORD, {
    host: connect.HOST,
    dialect: connect.dialect,
});
