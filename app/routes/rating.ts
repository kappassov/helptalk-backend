export {};
const express = require("express");
const RatingController = require("../controllers/rating.controller");
const authMiddleware = require("../middlewares/auth-middleware");
const ratingRouter = express.Router();

ratingRouter.post("/rating/submit", RatingController.submitRating);

module.exports = ratingRouter;
