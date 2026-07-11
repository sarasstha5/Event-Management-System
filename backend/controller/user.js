import db from "../database/db.js";

// Admin: Get all participants (users)
export const getUsers = (req, res) => {
  try {
    const q = "SELECT id, fullname, email, phone, role, profile_image FROM users WHERE role = 'user'";
    db.query(q, (error, result) => {
      if (error) {
        return res
          .status(500)
          .send({ message: "Error while fetching users", error: error.message });
      }
      return res.status(200).send(result);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

// Admin: Delete user/participant
export const deleteUser = (req, res) => {
  try {
    const { id } = req.params;
    const q = "DELETE FROM users WHERE id = ?";
    db.query(q, [id], (error, result) => {
      if (error) {
        return res
          .status(500)
          .send({ message: "Error while deleting user", error: error.message });
      }
      return res.status(200).send({ message: "User deleted successfully." });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

// User: View Profile
export const getProfile = (req, res) => {
  try {
    const q = "SELECT id, fullname, email, phone, role, profile_image FROM users WHERE id = ?";
    db.query(q, [req.userId], (error, result) => {
      if (error) {
        return res
          .status(500)
          .send({ message: "Error while fetching profile", error: error.message });
      }
      if (result.length === 0) {
        return res.status(404).send({ message: "User not found" });
      }
      return res.status(200).send(result[0]);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

// User: Update Profile Details
export const updateProfile = (req, res) => {
  try {
    const { fullname, phone } = req.body;
    if (!fullname || !phone) {
      return res.status(400).send({ message: "Full name and phone are required" });
    }

    const q = "UPDATE users SET fullname = ?, phone = ? WHERE id = ?";
    db.query(q, [fullname, phone, req.userId], (error, result) => {
      if (error) {
        return res
          .status(500)
          .send({ message: "Error while updating profile", error: error.message });
      }
      return res.status(200).send({ message: "Profile updated successfully." });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

// User: Update Profile Picture
export const uploadProfileImage = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "Please upload an image file" });
    }

    const filename = req.file.filename;
    const q = "UPDATE users SET profile_image = ? WHERE id = ?";
    
    db.query(q, [filename, req.userId], (error, result) => {
      if (error) {
        return res
          .status(500)
          .send({ message: "Error while updating profile image", error: error.message });
      }
      return res.status(200).send({ 
        message: "Profile image updated successfully.", 
        profile_image: filename 
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

// Admin: Update user role (e.g. promoting a user to administrator)
export const updateUserRole = (req, res) => {
  try {
    // Extract user ID from route parameter (e.g., /api/users/:id/role)
    const { id } = req.params;
    // Extract the new role from request body (should be 'admin' or 'user')
    const { role } = req.body;
    
    // Validate role input to prevent inserting arbitrary values in database
    if (role !== "user" && role !== "admin") {
      return res.status(400).send({ message: "Invalid role specified" });
    }

    // Run UPDATE query to change the user's role in the SQLite/MySQL database
    const q = "UPDATE users SET role = ? WHERE id = ?";
    db.query(q, [role, id], (error, result) => {
      if (error) {
        // Return 500 server error if query fails
        return res
          .status(500)
          .send({ message: "Error while updating user role", error: error.message });
      }
      // Return 200 success response if row is updated successfully
      return res.status(200).send({ message: "User role updated successfully." });
    });
  } catch (err) {
    // Catch-all for runtime errors
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};
