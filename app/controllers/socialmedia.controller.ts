export {};
const prisma = require("../models/prisma-client");

class SocialMediaController{
    static getSocialMedia = async (req, res) => {
        try {
            const socialmedia = await prisma.socialMedia.findMany();
            res.status(201).json(socialmedia);
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = SocialMediaController;