import db from "../database/db.js";

// User: Register for an Event
export const registerForEvent = (req, res) => {
  try {
    const { event_id } = req.body;
    const user_id = req.userId;

    if (!event_id) {
      return res.status(400).send({ message: "Event ID is required" });
    }

    // 1. Check if user is already registered for this event
    const checkDupQ = "SELECT * FROM registrations WHERE user_id = ? AND event_id = ?";
    db.query(checkDupQ, [user_id, event_id], (err, dupResult) => {
      if (err) {
        return res.status(500).send({ message: "Database error", error: err.message });
      }
      if (dupResult.length > 0) {
        return res.status(400).send({ message: "You are already registered for this event" });
      }

      // 2. Check if event exists and if maximum participant limit is reached
      const checkLimitQ = `
        SELECT max_participants, 
               (SELECT COUNT(*) FROM registrations WHERE event_id = ? AND status = 'Approved') AS current_approved
        FROM events 
        WHERE id = ?
      `;
      db.query(checkLimitQ, [event_id, event_id], (err, eventResult) => {
        if (err) {
          return res.status(500).send({ message: "Database error", error: err.message });
        }
        if (eventResult.length === 0) {
          return res.status(404).send({ message: "Event not found" });
        }

        const { max_participants, current_approved } = eventResult[0];
        
        // If max_participants is 0, it means unlimited spots
        if (max_participants > 0 && current_approved >= max_participants) {
          return res.status(400).send({ message: "Registration is full for this event" });
        }

        // 3. Create the registration
        const insertQ = `
          INSERT INTO registrations (user_id, event_id, registration_date, status) 
          VALUES (?, ?, CURDATE(), 'Pending')
        `;
        db.query(insertQ, [user_id, event_id], (error, result) => {
          if (error) {
            return res
              .status(500)
              .send({ message: "Error booking registration", error: error.message });
          }
          return res.status(201).send({ message: "Registered for event successfully. Pending approval.", result });
        });
      });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

// View Registrations (Admin: all, User: their own)
export const getRegistrations = (req, res) => {
  try {
    if (req.userRole === "admin") {
      const q = `
        SELECT r.*, u.fullname, u.email, e.event_name, e.event_date, e.registration_fee 
        FROM registrations r
        INNER JOIN users u ON r.user_id = u.id
        INNER JOIN events e ON r.event_id = e.id
        ORDER BY r.id DESC
      `;
      db.query(q, (error, result) => {
        if (error) {
          return res
            .status(500)
            .send({ message: "Error fetching registrations", error: error.message });
        }
        return res.status(200).send(result);
      });
    } else {
      const q = `
        SELECT r.*, e.event_name, e.event_date, e.event_time, e.venue, e.registration_fee, e.banner 
        FROM registrations r
        INNER JOIN events e ON r.event_id = e.id
        WHERE r.user_id = ?
        ORDER BY r.id DESC
      `;
      db.query(q, [req.userId], (error, result) => {
        if (error) {
          return res
            .status(500)
            .send({ message: "Error fetching registrations", error: error.message });
        }
        return res.status(200).send(result);
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

// Update Registration Status (Admin: Approve/Cancel/Pending, User: Cancel own)
export const updateRegistrationStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'Approved', 'Cancelled', 'Pending'

    if (!status) {
      return res.status(400).send({ message: "Status is required" });
    }

    if (req.userRole === "admin") {
      const q = "UPDATE registrations SET status = ? WHERE id = ?";
      db.query(q, [status, id], (error, result) => {
        if (error) {
          return res
            .status(500)
            .send({ message: "Error updating registration status", error: error.message });
        }
        return res.status(200).send({ message: "Registration status updated successfully." });
      });
    } else {
      // User can only cancel their own registration
      if (status !== "Cancelled") {
        return res.status(401).send({ message: "Unauthorized action. Users can only cancel registrations." });
      }

      const checkOwnerQ = "SELECT * FROM registrations WHERE id = ? AND user_id = ?";
      db.query(checkOwnerQ, [id, req.userId], (err, result) => {
        if (err) {
          return res.status(500).send({ message: "Database error", error: err.message });
        }
        if (result.length === 0) {
          return res.status(404).send({ message: "Registration not found or unauthorized" });
        }

        const q = "UPDATE registrations SET status = 'Cancelled' WHERE id = ?";
        db.query(q, [id], (error, result) => {
          if (error) {
            return res
              .status(500)
              .send({ message: "Error cancelling registration", error: error.message });
          }
          return res.status(200).send({ message: "Registration cancelled successfully." });
        });
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

// Delete/Remove Registration (Admin or User's own)
export const deleteRegistration = (req, res) => {
  try {
    const { id } = req.params;

    if (req.userRole === "admin") {
      const q = "DELETE FROM registrations WHERE id = ?";
      db.query(q, [id], (error, result) => {
        if (error) {
          return res
            .status(500)
            .send({ message: "Error deleting registration", error: error.message });
        }
        return res.status(200).send({ message: "Registration deleted successfully." });
      });
    } else {
      // Check owner first
      const checkOwnerQ = "SELECT * FROM registrations WHERE id = ? AND user_id = ?";
      db.query(checkOwnerQ, [id, req.userId], (err, result) => {
        if (err) {
          return res.status(500).send({ message: "Database error", error: err.message });
        }
        if (result.length === 0) {
          return res.status(404).send({ message: "Registration not found or unauthorized" });
        }

        const q = "DELETE FROM registrations WHERE id = ?";
        db.query(q, [id], (error, result) => {
          if (error) {
            return res
              .status(500)
              .send({ message: "Error deleting registration", error: error.message });
          }
          return res.status(200).send({ message: "Registration deleted successfully." });
        });
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

// Admin: View Event-wise Participant Lists
export const getEventParticipants = (req, res) => {
  try {
    const { eventId } = req.params;

    const q = `
      SELECT r.id AS registration_id, r.registration_date, r.status, 
             u.id AS user_id, u.fullname, u.email, u.phone, u.profile_image 
      FROM registrations r
      INNER JOIN users u ON r.user_id = u.id
      WHERE r.event_id = ?
      ORDER BY r.id DESC
    `;

    db.query(q, [eventId], (error, result) => {
      if (error) {
        return res
          .status(500)
          .send({ message: "Error fetching event participant list", error: error.message });
      }
      return res.status(200).send(result);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};
