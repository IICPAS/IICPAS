// controllers/alertController.js
import { Alert } from "../models/Alert.js";

// Get all alerts
export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching alerts" });
  }
};

// Create a new alert
export const createAlert = async (req, res) => {
  try {
    const { title, message, status } = req.body;
    const alert = new Alert({ title, message, status });
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating alert", error: err.message });
  }
};

// Delete an alert by ID
export const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Alert.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).json({ message: "Alert not found" });
    }
    res.json({ message: "Alert deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting alert" });
  }
};

// Update alert status by ID (PATCH)
export const updateAlertStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updated = await Alert.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating alert status" });
  }
};
