import { Router } from "express";
import BookingController from "../controllers/booking.controller";

const bookingRouter = Router();

bookingRouter.post("/book", BookingController.create_booking);

bookingRouter.get("/book/getall", BookingController.get_all);

bookingRouter.get("/book/getbypatientid", BookingController.get_by_patient_id);

bookingRouter.get("/book/getbyspecialistid", BookingController.get_by_specialist_id);

bookingRouter.post("/book/update", BookingController.update_booking);

bookingRouter.delete("/book/delete", BookingController.delete_booking);

bookingRouter.post("/book/approve", BookingController.approve_booking);

export default bookingRouter;