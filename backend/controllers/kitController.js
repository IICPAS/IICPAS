import Kit from "../models/Kit.js";

// Get all kits
export const getAllKits = async (req, res) => {
  try {
    const kits = await Kit.find().sort({ module: 1 });
    res.status(200).json(kits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get kits by category
export const getKitsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const kits = await Kit.find({ 
      category, 
      status: "active" 
    }).sort({ module: 1 });
    res.status(200).json(kits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single kit by ID
export const getKitById = async (req, res) => {
  try {
    const kit = await Kit.findById(req.params.id);
    if (!kit) {
      return res.status(404).json({ message: "Kit not found" });
    }
    res.status(200).json(kit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new kit
export const createKit = async (req, res) => {
  try {
    const {
      module,
      labClassroom,
      recorded,
      labPlusLive,
      description,
      category,
      price,
      supplier
    } = req.body;

    // Validate required fields
    if (!module) {
      return res.status(400).json({
        message: "Module name is required"
      });
    }

    // Check if kit with same module already exists
    const existingKit = await Kit.findOne({ module });
    if (existingKit) {
      return res.status(400).json({
        message: "Kit with this module name already exists"
      });
    }

    const newKit = new Kit({
      module,
      labClassroom: labClassroom || 0,
      recorded: recorded || 0,
      labPlusLive: labPlusLive || 0,
      description,
      category: category || "other",
      price: price || 0,
      supplier
    });

    await newKit.save();
    res.status(201).json(newKit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a kit
export const updateKit = async (req, res) => {
  try {
    const updatedKit = await Kit.findByIdAndUpdate(
      req.params.id,
      { ...req.body, lastUpdated: Date.now() },
      { new: true, runValidators: true }
    );
    
    if (!updatedKit) {
      return res.status(404).json({ message: "Kit not found" });
    }
    
    res.status(200).json(updatedKit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a kit
export const deleteKit = async (req, res) => {
  try {
    const deletedKit = await Kit.findByIdAndDelete(req.params.id);
    
    if (!deletedKit) {
      return res.status(404).json({ message: "Kit not found" });
    }
    
    res.status(200).json({ message: "Kit deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle kit status
export const toggleKitStatus = async (req, res) => {
  try {
    const kit = await Kit.findById(req.params.id);
    
    if (!kit) {
      return res.status(404).json({ message: "Kit not found" });
    }
    
    kit.status = kit.status === "active" ? "inactive" : "active";
    kit.lastUpdated = Date.now();
    await kit.save();
    
    res.status(200).json(kit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update stock quantities
export const updateStock = async (req, res) => {
  try {
    const { labClassroom, recorded, labPlusLive } = req.body;
    
    const kit = await Kit.findById(req.params.id);
    if (!kit) {
      return res.status(404).json({ message: "Kit not found" });
    }
    
    if (labClassroom !== undefined) kit.labClassroom = labClassroom;
    if (recorded !== undefined) kit.recorded = recorded;
    if (labPlusLive !== undefined) kit.labPlusLive = labPlusLive;
    
    kit.lastUpdated = Date.now();
    await kit.save();
    
    res.status(200).json(kit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get low stock kits (less than 5 in any category)
export const getLowStockKits = async (req, res) => {
  try {
    const lowStockKits = await Kit.find({
      $or: [
        { labClassroom: { $lt: 5 } },
        { recorded: { $lt: 5 } },
        { labPlusLive: { $lt: 5 } }
      ],
      status: "active"
    }).sort({ module: 1 });
    
    res.status(200).json(lowStockKits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get kit statistics
export const getKitStats = async (req, res) => {
  try {
    const totalKits = await Kit.countDocuments();
    const activeKits = await Kit.countDocuments({ status: "active" });
    const lowStockKits = await Kit.countDocuments({
      $or: [
        { labClassroom: { $lt: 5 } },
        { recorded: { $lt: 5 } },
        { labPlusLive: { $lt: 5 } }
      ],
      status: "active"
    });
    
    const totalLabClassroom = await Kit.aggregate([
      { $group: { _id: null, total: { $sum: "$labClassroom" } } }
    ]);
    
    const totalRecorded = await Kit.aggregate([
      { $group: { _id: null, total: { $sum: "$recorded" } } }
    ]);
    
    const totalLabPlusLive = await Kit.aggregate([
      { $group: { _id: null, total: { $sum: "$labPlusLive" } } }
    ]);
    
    res.status(200).json({
      totalKits,
      activeKits,
      lowStockKits,
      totalStock: {
        labClassroom: totalLabClassroom[0]?.total || 0,
        recorded: totalRecorded[0]?.total || 0,
        labPlusLive: totalLabPlusLive[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
