export {};
const express = require("express");
const BookingController = require("../controllers/booking.controller");
const authMiddleware = require("../middlewares/auth-middleware");

const bookingRouter = express.Router();

bookingRouter.post("/book", authMiddleware, BookingController.create_booking);

bookingRouter.get("/book/getall", authMiddleware, BookingController.get_all);

bookingRouter.post(
  "/book/getbypatientid",
  authMiddleware,
  BookingController.get_by_patient_id
);

bookingRouter.post(
  "/book/getbyspecialistid",
  authMiddleware,
  BookingController.get_by_specialist_id
);

bookingRouter.post(
  "/book/update",
  authMiddleware,
  BookingController.update_booking
);

bookingRouter.post(
  "/book/delete",
  authMiddleware,
  BookingController.delete_booking
);

bookingRouter.post(
  "/book/approve",
  authMiddleware,
  BookingController.approve_booking
);

module.exports = bookingRouter;
