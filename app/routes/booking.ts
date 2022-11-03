import { Router } from "express";
import BookingController from "../controllers/booking.controller";

const bookingRouter = Router();

bookingRouter.post("/book", BookingController.create_booking);

bookingRouter.post("/book/getall", BookingController.get_all);

bookingRouter.post("/book/getbypatientid", BookingController.get_by_patient_id);

bookingRouter.post("/book/getbyspecialistid", BookingController.get_by_specialist_id);

bookingRouter.post("/book/update", BookingController.update_booking);

bookingRouter.delete("/book/delete", BookingController.delete_booking);

bookingRouter.post("/book/approve", BookingController.approve_booking);

export default bookingRouter;