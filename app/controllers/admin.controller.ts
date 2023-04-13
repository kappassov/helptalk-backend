export {};
const express = require("express");
const prisma = require("../models/prisma-client");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    requireTLS: true,
    auth: {
      user: 'helptalk.kz@gmail.com',
      pass: 'krpvudfjcbqbmyse'
    }
});

class AdminController{
    static getSpecialists = async (req, res) => {
        try {
            const post = await prisma.specialist.findMany()
            return res.status(201).json(post)
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }

    static getUnconfirmedSpecialists = async (req, res) => {
        try {
            const specialists = await prisma.specialist.findMany({
                where: {confirmed: false}
            })
            return res.status(201).json(specialists)
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }

    static approveSpecialist = async (req, res) => {
        try {
            const {email}  = req.body;

            const specialist = await prisma.specialist.findFirst({
                where: {email: email}
              })
        
            const updated = await prisma.specialist.update({
                where: { id: specialist.id },
                data: {
                    confirmed: true,
                },
            });

            const mailOptions = {
                from: '"Helptalk" <helptalk@gmail.com>',
                to: email,
                subject: 'HelpTalk registration result',
                text: 'Dear, ' + specialist.first_name + " " + specialist.last_name + ", \n\nCongratulations, you have been approved by HelpTalk, and now you can " +
                "login into your accound and work with our clients freely. Hope you will enjoy your work, and thank you for cooperation! \n\n Kind regards, \n HelpTalk Admin"
            };
              
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent!');
                }
            });

            return res.status(200).json({ result: true });
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }

    static declineSpecialist = async (req, res) => {
        try {
            const {email, message}  = req.body;

            const specialist = await prisma.specialist.findFirst({
                where: {email: email}
              });

            const mailOptions = {
                from: '"Helptalk" <helptalk.kz@gmail.com>',
                to: email,
                subject: 'HelpTalk registration result',
                text: 'Dear, ' + specialist.first_name + " " + specialist.last_name + ", \n\nWe regret to inform that you have been declined by HelpTalk, due to certain reasons." +
                "\n\nOur admin sends you the following message: " + message + ". Thank you for your efforts! \n\n Kind regards, \n HelpTalk Admin"
            };
              
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent!');
                }
            });

            const deleteRating = prisma.rating.deleteMany({
                where: {
                  specialist_id: specialist.id,
                },
              })

              const deleteReview = prisma.review.deleteMany({
                where: {
                  specialist_id: specialist.id,
                },
              })

            const deleteDocument = prisma.document.deleteMany({
                where: {
                  specialist_id: specialist.id,
                },
              })

            const deleteSpecialist = prisma.specialist.deleteMany({
                where: {
                  id: specialist.id,
                },
              })

              const deleteUser = prisma.user.delete({
                where: {
                  email: email,
                },
              })
              
              const transaction = await prisma.$transaction([deleteRating, deleteReview, deleteDocument,deleteSpecialist, deleteUser])


            return res.status(200).json({ result: true });
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }

    
}

module.exports = AdminController;