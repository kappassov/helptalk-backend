"use strict";
const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const app = express();
// const corsOptions = {
//   origin: "http://localhost:8081",
// };
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
db.sequelize
    .sync()
    .then(() => {
    console.log("Synced db.");
})
    .catch((err) => {
    console.log("Failed to sync db: " + err.message);
});
app.get("/", (req, res) => {
    res.json({ message: "Test assignment for Klika." });
});
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
