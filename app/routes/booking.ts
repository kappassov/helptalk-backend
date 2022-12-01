import { Router } from "express";
import BookingController from "../controllers/booking.controller";
import authMiddleware from "../middlewares/auth-middleware";

const bookingRouter = Router();

bookingRouter.post("/book", authMiddleware, BookingController.create_booking);

bookingRouter.get("/book/getall", authMiddleware, BookingController.get_all);

bookingRouter.get(
  "/book/getbypatientid",
  authMiddleware,
  BookingController.get_by_patient_id
);

bookingRouter.get(
  "/book/getbyspecialistid",
  authMiddleware,
  BookingController.get_by_specialist_id
);

bookingRouter.post(
  "/book/update",
  authMiddleware,
  BookingController.update_booking
);

bookingRouter.delete(
  "/book/delete",
  authMiddleware,
  BookingController.delete_booking
);

bookingRouter.post(
  "/book/approve",
  authMiddleware,
  BookingController.approve_booking
);

export default bookingRouter;
