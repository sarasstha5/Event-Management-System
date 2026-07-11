import db from "../database/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, res) => {
  try {
    const { fullname, email, password, phone, role } = req.body;

    if (!fullname || !email || !password || !phone) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const assignedRole = role || "user"; // Default to 'user' if not specified

    const salt = bcrypt.genSaltSync(10);
    const encPassword = bcrypt.hashSync(password, salt);

    const q = "INSERT INTO users (fullname, email, password, phone, role) VALUES (?, ?, ?, ?, ?)";

    db.query(q, [fullname, email, encPassword, phone, assignedRole], (error, result) => {
      if (error) {
        console.error("DB Register Query Error:", error);
        return res
          .status(500)
          .send({ message: `Error while executing query: ${error.message}`, error: error.message });
      }
      return res
        .status(201)
        .send({ message: "User created successfully.", result });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

export const login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ message: "Email and password are required" });
    }

    const q = "SELECT * FROM users WHERE email = ?";
    db.query(q, [email], (error, result) => {
      if (error) {
        console.error("DB Login Query Error:", error);
        return res
          .status(500)
          .send({ message: `Error while executing query: ${error.message}`, error: error.message });
      }

      if (result.length === 0) {
        return res.status(400).send({ message: "User does not exist" });
      }

      const isPasswordMatch = bcrypt.compareSync(password, result[0].password);

      if (isPasswordMatch) {
        const { password, role, ...others } = result[0];

        const token = jwt.sign(
          { user_id: result[0].id, role: result[0].role },
          process.env.JWT_SECRET || "secretkey"
        );

        return res
          .status(200)
          .send({ message: "Login successful", token: token, user: others });
      }

      return res.status(400).send({ message: "Email or password did not match" });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};
