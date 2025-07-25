import LiveSession from "../../models/LiveSession/LiveSession.js";

export const createLiveSession = async (req, res) => {
  try {
    const session = await LiveSession.create(req.body);
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllLiveSessions = async (req, res) => {
  try {
    const sessions = await LiveSession.find();
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLiveSession = async (req, res) => {
  try {
    const session = await LiveSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!session) return res.status(404).json({ error: "Session not found" });
    res.status(200).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteLiveSession = async (req, res) => {
  try {
    const deleted = await LiveSession.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Session not found" });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleStatus = async (req, res) => {
  try {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found" });

    session.status = session.status === "active" ? "inactive" : "active";
    await session.save();
    res.status(200).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
