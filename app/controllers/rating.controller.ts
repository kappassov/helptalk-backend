export {};
const express = require("express");
const prisma = require("../models/prisma-client");

class RatingController{
    static submitRating = async (req, res) => {
        try {
            const { appointment_id, rating, review } = req.body;

            const appointment = await prisma.appointment.findUnique({
                where: {
                    id: appointment_id,
                  },
            });

            if(appointment == null){
              return res.status(404).json("The appointment is not found!")
            }

            const specialist = await prisma.specialist.findUnique({
                where: {
                  id: appointment.specialist_id,
                },
              });

            const rating_result = await prisma.rating.findFirst({
                where: {
                  specialist_id: appointment.specialist_id,
                },
              });
            
            if(rating_result == null){
              const ratingAdded = await prisma.rating.create({
                data: {
                  specialist_id: appointment.specialist_id,
                  rating: rating,
                  count_rated: Number(1),
                },
              });
            }else{
              const newRating = ((rating_result.count_rated * rating_result.rating) + Number(rating))/(rating_result.count_rated + 1);
              const ratingUpdated = await prisma.rating.updateMany({
                  where: { 
                    specialist_id: appointment.specialist_id,
                  },
                  data: {
                      rating: newRating,
                      count_rated: rating_result.count_rated + 1,
                  },
              });
            }

            const reviewAdded = await prisma.review.create({
              data: {
                appointment_id: appointment_id,
                review: review,
              },
            });

              return res.status(200).json({ result: true });
        } catch (error: any) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = RatingController;