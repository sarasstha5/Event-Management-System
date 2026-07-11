import db from "../database/db.js";

// Get all events / Search events
export const getEvents = (req, res) => {
  try {
    const { name, category, organizer, venue, date } = req.query;

    let q = `
      SELECT e.*, c.category_name,
             (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status = 'Approved') AS registered_count
      FROM events e
      INNER JOIN categories c ON e.category_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (name) {
      q += " AND e.event_name LIKE ?";
      params.push(`%${name}%`);
    }
    if (category) {
      q += " AND c.category_name LIKE ?";
      params.push(`%${category}%`);
    }
    if (organizer) {
      q += " AND e.organizer LIKE ?";
      params.push(`%${organizer}%`);
    }
    if (venue) {
      q += " AND e.venue LIKE ?";
      params.push(`%${venue}%`);
    }
    if (date) {
      q += " AND e.event_date = ?";
      params.push(date);
    }

    db.query(q, params, (error, result) => {
      if (error) {
        return res
          .status(500)
          .send({ message: "Error while fetching events", error: error.message });
      }
      return res.status(200).send(result);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

// Get single event details
export const getSingleEvent = (req, res) => {
  try {
    const { id } = req.params;
    const q = `
      SELECT e.*, c.category_name,
             (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status = 'Approved') AS registered_count
      FROM events e
      INNER JOIN categories c ON e.category_id = c.id
      WHERE e.id = ?
    `;
    db.query(q, [id], (error, result) => {
      if (error) {
        return res
          .status(500)
          .send({ message: "Error while fetching event details", error: error.message });
      }
      if (result.length === 0) {
        return res.status(404).send({ message: "Event not found" });
      }
      return res.status(200).send(result[0]);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

// Create Event (Admin only)
export const createEvent = (req, res) => {
  try {
    const {
      event_name,
      category_id,
      organizer,
      event_date,
      event_time,
      venue,
      registration_fee,
      max_participants,
      description
    } = req.body;

    if (
      !event_name ||
      !category_id ||
      !organizer ||
      !event_date ||
      !event_time ||
      !venue ||
      !description
    ) {
      return res.status(400).send({ message: "Required fields are missing" });
    }

    const bannerFilename = req.file ? req.file.filename : null;
    const fee = registration_fee || 0.00;
    const maxParts = max_participants || 0;

    const q = `
      INSERT INTO events (
        event_name, category_id, organizer, event_date, event_time, 
        venue, registration_fee, max_participants, description, banner
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      q,
      [
        event_name,
        category_id,
        organizer,
        event_date,
        event_time,
        venue,
        fee,
        maxParts,
        description,
        bannerFilename
      ],
      (error, result) => {
        if (error) {
          return res
            .status(500)
            .send({ message: "Error while creating event", error: error.message });
        }
        return res
          .status(201)
          .send({ message: "Event created successfully.", result });
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

// Update Event (Admin only)
export const editEvent = (req, res) => {
  try {
    const { id } = req.params;
    const {
      event_name,
      category_id,
      organizer,
      event_date,
      event_time,
      venue,
      registration_fee,
      max_participants,
      description
    } = req.body;

    if (
      !event_name ||
      !category_id ||
      !organizer ||
      !event_date ||
      !event_time ||
      !venue ||
      !description
    ) {
      return res.status(400).send({ message: "Required fields are missing" });
    }

    const fee = registration_fee || 0.00;
    const maxParts = max_participants || 0;

    // Check if new banner image was uploaded
    if (req.file) {
      const bannerFilename = req.file.filename;
      const q = `
        UPDATE events SET 
          event_name = ?, category_id = ?, organizer = ?, event_date = ?, 
          event_time = ?, venue = ?, registration_fee = ?, max_participants = ?, 
          description = ?, banner = ? 
        WHERE id = ?
      `;
      db.query(
        q,
        [
          event_name,
          category_id,
          organizer,
          event_date,
          event_time,
          venue,
          fee,
          maxParts,
          description,
          bannerFilename,
          id
        ],
        (error, result) => {
          if (error) {
            return res
              .status(500)
              .send({ message: "Error while updating event", error: error.message });
          }
          return res.status(200).send({ message: "Event updated successfully." });
        }
      );
    } else {
      // Keep old banner image
      const q = `
        UPDATE events SET 
          event_name = ?, category_id = ?, organizer = ?, event_date = ?, 
          event_time = ?, venue = ?, registration_fee = ?, max_participants = ?, 
          description = ? 
        WHERE id = ?
      `;
      db.query(
        q,
        [
          event_name,
          category_id,
          organizer,
          event_date,
          event_time,
          venue,
          fee,
          maxParts,
          description,
          id
        ],
        (error, result) => {
          if (error) {
            return res
              .status(500)
              .send({ message: "Error while updating event", error: error.message });
          }
          return res.status(200).send({ message: "Event updated successfully." });
        }
      );
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

// Delete Event (Admin only)
export const deleteEvent = (req, res) => {
  try {
    const { id } = req.params;
    const q = "DELETE FROM events WHERE id = ?";
    db.query(q, [id], (error, result) => {
      if (error) {
        return res
          .status(500)
          .send({ message: "Error while deleting event", error: error.message });
      }
      return res.status(200).send({ message: "Event deleted successfully." });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};
