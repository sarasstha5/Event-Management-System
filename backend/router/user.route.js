import express from "express";
import {
  getUsers,
  deleteUser,
  getProfile,
  updateProfile,
  uploadProfileImage,
  updateUserRole
} from "../controller/user.js";
import { isVerify, isAdmin } from "../middleware/isAuth.js";
import upload from "../middleware/multerConfig.js";

const route = express.Router();

// Admin operations: all of these require verification (isVerify) and admin credentials (isAdmin)
// GET /api/users - Fetch list of all active participants
route.get("/", isVerify, isAdmin, getUsers);
// DELETE /api/users/:id - Delete a user and clean their records
route.delete("/:id", isVerify, isAdmin, deleteUser);
// PUT /api/users/:id/role - Update user role (e.g. promoting them to admin)
route.put("/:id/role", isVerify, isAdmin, updateUserRole);

// Profile operations (Logged-in users)
route.get("/profile", isVerify, getProfile);
route.put("/profile", isVerify, updateProfile);
route.post("/profile-image", isVerify, upload.single("profile_image"), uploadProfileImage);

export default route;
