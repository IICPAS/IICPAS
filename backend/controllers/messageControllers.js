import Message from "../models/Message.js";

// Create
export const createMessage = async (req, res) => {
  try {
    const { email, name, message } = req.body;
    const newMsg = await Message.create({ email, name, message });
    res.status(201).json(newMsg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Read all
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ created: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Read one
export const getMessage = async (req, res) => {
  try {
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ error: "Not found" });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update
export const updateMessage = async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!msg) return res.status(404).json({ error: "Not found" });
    res.json(msg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete
export const deleteMessage = async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
