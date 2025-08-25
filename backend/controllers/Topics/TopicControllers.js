import Topics_Trainings from "../../models/Trainings/TopicsTraining.js";

// Get all topics
export const getAllTopics = async (req, res) => {
  try {
    const topics = await Topics_Trainings.find();
    res.status(200).json(topics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single topic by ID
export const getTopicById = async (req, res) => {
  try {
    const topic = await Topics_Trainings.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new topic
export const createTopic = async (req, res) => {
  try {
    const { title, description, price, pricePerHour } = req.body;
    
    // Validate required fields
    if (!title || !description || !pricePerHour) {
      return res.status(400).json({ 
        message: "Title, description, and price per hour are required" 
      });
    }

    // Validate price per hour is positive
    if (pricePerHour <= 0) {
      return res.status(400).json({ 
        message: "Price per hour must be greater than 0" 
      });
    }

    const newTopic = new Topics_Trainings({ 
      title, 
      description, 
      price: pricePerHour, // Set price to pricePerHour for backward compatibility
      pricePerHour 
    });
    await newTopic.save();
    res.status(201).json(newTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a topic
export const updateTopic = async (req, res) => {
  try {
    const updatedTopic = await Topics_Trainings.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedTopic)
      return res.status(404).json({ message: "Topic not found" });
    res.status(200).json(updatedTopic);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a topic
export const deleteTopic = async (req, res) => {
  try {
    const deletedTopic = await Topics_Trainings.findByIdAndDelete(
      req.params.id
    );
    if (!deletedTopic)
      return res.status(404).json({ message: "Topic not found" });
    res.status(200).json({ message: "Topic deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle topic status
export const toggleTopicStatus = async (req, res) => {
  try {
    const topic = await Topics_Trainings.findById(req.params.id);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    topic.status = topic.status === "active" ? "inactive" : "active";
    await topic.save();
    res.status(200).json(topic);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
