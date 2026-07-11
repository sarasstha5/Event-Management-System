import db from "../database/db.js";

// Get all categories (Public)
export const getCategories = (req, res) => {
  try {
    const q = "SELECT * FROM categories";
    db.query(q, (error, result) => {
      if (error) {
        return res
          .status(500)
          .send({ message: "Error while fetching categories", error: error.message });
      }
      return res.status(200).send(result);
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

// Add Category (Admin only)
export const addCategory = (req, res) => {
  try {
    const { category_name } = req.body;
    if (!category_name) {
      return res.status(400).send({ message: "Category name is required" });
    }

    const q = "INSERT INTO categories (category_name) VALUES (?)";
    db.query(q, [category_name], (error, result) => {
      if (error) {
        return res
          .status(500)
          .send({ message: "Error while inserting category", error: error.message });
      }
      return res.status(201).send({ message: "Category created successfully.", result });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

// Edit Category (Admin only)
export const editCategory = (req, res) => {
  try {
    const { id } = req.params;
    const { category_name } = req.body;
    if (!category_name) {
      return res.status(400).send({ message: "Category name is required" });
    }

    const q = "UPDATE categories SET category_name = ? WHERE id = ?";
    db.query(q, [category_name, id], (error, result) => {
      if (error) {
        return res
          .status(500)
          .send({ message: "Error while updating category", error: error.message });
      }
      return res.status(200).send({ message: "Category updated successfully." });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};

// Delete Category (Admin only)
export const deleteCategory = (req, res) => {
  try {
    const { id } = req.params;
    const q = "DELETE FROM categories WHERE id = ?";
    db.query(q, [id], (error, result) => {
      if (error) {
        return res
          .status(500)
          .send({ message: "Error while deleting category", error: error.message });
      }
      return res.status(200).send({ message: "Category deleted successfully." });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Server error" });
  }
};
