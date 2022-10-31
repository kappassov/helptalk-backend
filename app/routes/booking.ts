import { Router } from "express";
import BookingController from "../controllers/booking.controller";

const bookingRouter = Router();

bookingRouter.post("/book", BookingController.create_booking);

bookingRouter.post("/book/update", BookingController.update_booking);

bookingRouter.delete("/book/delete", BookingController.delete_booking);

bookingRouter.post("/book/approve", BookingController.approve_booking);

export default bookingRouter;