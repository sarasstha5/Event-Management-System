import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./router/auth.route.js";
import userRoute from "./router/user.route.js";
import categoryRoute from "./router/category.route.js";
import eventRoute from "./router/event.route.js";
import registrationRoute from "./router/registration.route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images statically
app.use("/public", express.static("public"));

// Route mappings
app.use("/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/events", eventRoute);
app.use("/api/registrations", registrationRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port 127.0.0.1:${PORT}`);
});

