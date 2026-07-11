import express from "express";
import {
  getCategories,
  addCategory,
  editCategory,
  deleteCategory
} from "../controller/category.js";
import { isVerify, isAdmin } from "../middleware/isAuth.js";

const route = express.Router();

route.get("/", getCategories);
route.post("/", isVerify, isAdmin, addCategory);
route.put("/:id", isVerify, isAdmin, editCategory);
route.delete("/:id", isVerify, isAdmin, deleteCategory);

export default route;
