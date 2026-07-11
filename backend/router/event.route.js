import express from "express";
import {
  getEvents,
  getSingleEvent,
  createEvent,
  editEvent,
  deleteEvent
} from "../controller/event.js";
import { isVerify, isAdmin } from "../middleware/isAuth.js";
import upload from "../middleware/multerConfig.js";

const route = express.Router();

route.get("/", getEvents);
route.get("/:id", getSingleEvent);
route.post("/", isVerify, isAdmin, upload.single("banner"), createEvent);
route.put("/:id", isVerify, isAdmin, upload.single("banner"), editEvent);
route.delete("/:id", isVerify, isAdmin, deleteEvent);

export default route;
