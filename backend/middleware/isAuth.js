import jwt from "jsonwebtoken";

export const isVerify = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: "Please login first" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "Please login first" });
    }

    const userData = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.userRole = userData.role;
    req.userId = userData.user_id;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).send({ message: "Unauthorized / Invalid Token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.userRole === "admin") {
    next();
  } else {
    return res.status(401).send({ message: "Unauthorized" });
  }
};
