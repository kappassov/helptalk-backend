"use strict";
exports.__esModule = true;
exports.db_connect = void 0;
var sequelize_typescript_1 = require("sequelize-typescript");
var connect = require("../config/db");
var db_connect = function () {
    var sequelize = new sequelize_typescript_1.Sequelize(connect.DB, connect.USER, connect.PASSWORD, {
        host: connect.HOST,
        dialect: connect.dialect
    });
    var db = {};
    db.Sequelize = sequelize_typescript_1.Sequelize;
    db.sequelize = sequelize;
    return db;
};
exports.db_connect = db_connect;
