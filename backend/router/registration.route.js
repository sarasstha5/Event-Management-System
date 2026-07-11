import express from "express";
import {
  registerForEvent,
  getRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  getEventParticipants
} from "../controller/registration.js";
import { isVerify, isAdmin } from "../middleware/isAuth.js";

const route = express.Router();

route.post("/", isVerify, registerForEvent);
route.get("/", isVerify, getRegistrations);
route.put("/:id", isVerify, updateRegistrationStatus);
route.delete("/:id", isVerify, deleteRegistration);
route.get("/event/:eventId", isVerify, isAdmin, getEventParticipants);

export default route;
