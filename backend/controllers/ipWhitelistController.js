import IPWhitelist from "../models/IPWhitelist.js";

// CREATE - Add new IP to whitelist
export const addIP = async (req, res) => {
  try {
    const { ipAddress, description, status } = req.body;

    // Check if IP already exists
    const existingIP = await IPWhitelist.findOne({ ipAddress });
    if (existingIP) {
      return res.status(400).json({ error: "IP address already exists in whitelist" });
    }

    const newIP = new IPWhitelist({
      ipAddress,
      description,
      status: status || "Active",
      addedBy: req.user?.name || "Admin",
    });

    const savedIP = await newIP.save();
    res.status(201).json(savedIP);
  } catch (error) {
    console.error("Error adding IP to whitelist:", error);
    res.status(500).json({ error: "Failed to add IP to whitelist" });
  }
};

// READ - Get all whitelisted IPs
export const getAllIPs = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const ips = await IPWhitelist.find(query).sort({ createdAt: -1 });
    res.json(ips);
  } catch (error) {
    console.error("Error fetching IPs:", error);
    res.status(500).json({ error: "Failed to fetch IPs" });
  }
};

// READ - Get single IP by ID
export const getIPById = async (req, res) => {
  try {
    const ip = await IPWhitelist.findById(req.params.id);
    if (!ip) {
      return res.status(404).json({ error: "IP not found" });
    }
    res.json(ip);
  } catch (error) {
    console.error("Error fetching IP:", error);
    res.status(500).json({ error: "Failed to fetch IP" });
  }
};

// UPDATE - Update IP details
export const updateIP = async (req, res) => {
  try {
    const { ipAddress, description, status } = req.body;
    const { id } = req.params;

    // Check if IP already exists (excluding current record)
    if (ipAddress) {
      const existingIP = await IPWhitelist.findOne({ 
        ipAddress, 
        _id: { $ne: id } 
      });
      if (existingIP) {
        return res.status(400).json({ error: "IP address already exists in whitelist" });
      }
    }

    const updatedIP = await IPWhitelist.findByIdAndUpdate(
      id,
      {
        ipAddress,
        description,
        status,
      },
      { new: true, runValidators: true }
    );

    if (!updatedIP) {
      return res.status(404).json({ error: "IP not found" });
    }

    res.json(updatedIP);
  } catch (error) {
    console.error("Error updating IP:", error);
    res.status(500).json({ error: "Failed to update IP" });
  }
};

// DELETE - Remove IP from whitelist
export const deleteIP = async (req, res) => {
  try {
    const deletedIP = await IPWhitelist.findByIdAndDelete(req.params.id);
    
    if (!deletedIP) {
      return res.status(404).json({ error: "IP not found" });
    }

    res.json({ message: "IP removed from whitelist successfully" });
  } catch (error) {
    console.error("Error deleting IP:", error);
    res.status(500).json({ error: "Failed to delete IP" });
  }
};

// Check if IP is whitelisted
export const checkIPWhitelist = async (req, res) => {
  try {
    const { ipAddress } = req.params;
    
    const whitelistedIP = await IPWhitelist.findOne({ 
      ipAddress, 
      status: "Active" 
    });

    res.json({ 
      isWhitelisted: !!whitelistedIP,
      ip: whitelistedIP 
    });
  } catch (error) {
    console.error("Error checking IP whitelist:", error);
    res.status(500).json({ error: "Failed to check IP whitelist" });
  }
};
