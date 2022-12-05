export {};
const express = require("express");
const SocialMediaController  = require("../controllers/socialmedia.controller");
const socialmediaRouter = express.Router();

socialmediaRouter.get("/socialmedia/getAll", SocialMediaController.getSocialMedia);

module.exports = socialmediaRouter;
