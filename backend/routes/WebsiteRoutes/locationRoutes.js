import express from "express";
import Location from "../../models/Website/Location.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { cookieAuth } from "../../middleware/cookieAuth.js";
import { isAdmin } from "../../middleware/isAdmin.js";
  import axios from "axios";

const router = express.Router();

// Get current Location content (public endpoint)
router.get("/", async (req, res) => {
  try {
    const location = await Location.findOne({ isActive: true }).sort({ createdAt: -1 });
    if (!location) {
      // Return default content if no content found
      return res.json({
        title: "Visit Us",
        description: "We'd love to meet you. Find our office at the heart of Noida.",
        address: {
          street: "Plot 20, H-1/A, Sector 63",
          city: "Noida",
          state: "Uttar Pradesh",
          country: "India",
          pincode: "201301",
          formatted_address: "Plot 20, H-1/A, Sector 63, Noida, Uttar Pradesh 201301, India"
        },
        coordinates: {
          latitude: 28.6182566,
          longitude: 77.3767294
        },
        googleMaps: {
          place_id: "ChIJX8Vc8qVZDDkRZ5zL8Y8Qz1Y",
          zoom_level: 15
        },
        displaySettings: {
          showMap: true,
          mapHeight: 500,
          showAddressCard: true
        },
        contactInfo: {
          phone: "+91 98765 43210",
          email: "info@iicpa.org",
          office_hours: {
            weekdays: "9:00 AM - 6:00 PM",
            weekends: "10:00 AM - 4:00 PM"
          }
        },
        branch_name: "Main Branch",
        notes: ""
      });
    }
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Location entries (admin only)
router.get("/all", cookieAuth, isAdmin, async (req, res) => {
  try {
    const locations = await Location.find().sort({ createdAt: -1 });
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single Location entry (admin only)
router.get("/:id", cookieAuth, isAdmin, async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json(location);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new Location entry (admin only)
router.post("/", cookieAuth, isAdmin, async (req, res) => {
  try {
    // Deactivate all other locations when creating a new active one
    if (req.body.isActive) {
      await Location.updateMany({}, { isActive: false });
    }

    const location = new Location(req.body);
    await location.save();
    res.status(201).json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update Location entry (admin only)
router.put("/:id", cookieAuth, isAdmin, async (req, res) => {
  try {
    // If setting this location as active, deactivate all others
    if (req.body.isActive) {
      await Location.updateMany({ _id: { $ne: req.params.id } }, { isActive: false });
    }

    const location = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    res.json(location);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete Location entry (admin only)
router.delete("/:id", cookieAuth, isAdmin, async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        error: "Invalid location ID format. Please provide a valid MongoDB ObjectId." 
      });
    }

    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    // Check if location is active - prevent deletion of active locations
    if (location.isActive) {
      return res.status(400).json({ 
        error: "Cannot delete active locations. Please deactivate the location first.",
        locationTitle: location.title,
        locationId: location._id
      });
    }

    // Proceed with deletion
    await Location.findByIdAndDelete(req.params.id);
    
    console.log(`✅ Location deleted: ${location.title} (ID: ${location._id})`);
    
    res.json({ 
      message: "Location deleted successfully",
      deletedLocation: {
        id: location._id,
        title: location.title,
        branch_name: location.branch_name,
        address: location.address.formatted_address
      }
    });
  } catch (err) {
    console.error("❌ Error deleting location:", err);
    res.status(500).json({ 
      error: "Internal server error while deleting location",
      details: err.message 
    });
  }
});

// Toggle active status (admin only)
router.patch("/:id/toggle", cookieAuth, isAdmin, async (req, res) => {
  try {
    // Validate MongoDB ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        error: "Invalid location ID format. Please provide a valid MongoDB ObjectId." 
      });
    }

    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }

    const previousStatus = location.isActive;
    const newStatus = !location.isActive;

    console.log(`🔄 Toggling location status: ${location.title} from ${previousStatus ? 'Active' : 'Inactive'} to ${newStatus ? 'Active' : 'Inactive'}`);

    // If activating this location, deactivate all others
    if (newStatus) {
      const deactivatedCount = await Location.updateMany(
        { _id: { $ne: req.params.id } }, 
        { isActive: false }
      );
      console.log(`✅ Deactivated ${deactivatedCount.modifiedCount} other locations to make room for active location`);
    }

    location.isActive = newStatus;
    await location.save();

    console.log(`✅ Successfully toggled location status: ${location.title} (ID: ${location._id})`);

    res.json({
      ...location.toObject(),
      message: `Location "${location.title}" status updated to ${newStatus ? 'Active' : 'Inactive'}`,
      previousStatus,
      newStatus
    });
  } catch (err) {
    console.error("❌ Error toggling location status:", err);
    res.status(500).json({ 
      error: "Internal server error while toggling location status",
      details: err.message 
    });
  }
});

// Generate Google Maps embed URL (helper endpoint)
router.post("/generate-map-url", cookieAuth, isAdmin, async (req, res) => {
  try {
    const { latitude, longitude, zoom = 15 } = req.body;
    
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    // Generate Google Maps embed URL
    const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14015.77704516485!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce4d1aa1d9e7d%3A0x7e34a3bc3a30c4ef!2sPlot%2020%2C%20H-1%2FA%2C%20Sector%2063%2C%20Noida%2C%20Uttar%20Pradesh%20201301!5e0!3m2!1sen!2sin!4v1718542209005&center=${latitude},${longitude}&zoom=${zoom}`;

    res.json({ mapUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Resolve Google Maps share link and extract coordinates
router.post("/resolve-share-link", async (req, res) => {
  try {
    const { shareLink } = req.body;
    
    if (!shareLink || !shareLink.includes('maps')) {
      return res.status(400).json({ 
        error: "Invalid share link. Must be a Google Maps URL." 
      });
    }

    console.log("Resolving share link:", shareLink);

    // Follow redirects to get the final URL
    const response = await axios.head(shareLink, {
      maxRedirects: 10,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const finalUrl = response.request.res.responseUrl || shareLink;
    console.log("Final resolved URL:", finalUrl);

    // Extract coordinates from the resolved URL
    const coordinatePatterns = [
      // Pattern 1: @lat,lng,zoom (for maps.google.com URLs)
      /@(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      // Pattern 2: !3d and !2d format (for maps.app.goo.gl URLs)
      /!3d(-?\d+\.?\d*)!2d(-?\d+\.?\d*)/,
      // Pattern 3: ll parameter
      /[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      // Pattern 4: center parameter
      /[?&]center=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      // Pattern 5: q parameter with coordinates
      /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
      // Pattern 6: pb format with coordinates (for embed-style URLs)
      /pb=!1m\d+!1m\d+!1m\d+!1d(-?\d+\.?\d*)!2d(-?\d+\.?\d*)/
    ];

    for (const pattern of coordinatePatterns) {
      const match = finalUrl.match(pattern);
      if (match) {
        const latitude = parseFloat(match[1]);
        const longitude = parseFloat(match[2]);
        
        // Validate coordinates
        if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
          return res.json({
            success: true,
            coordinates: { latitude, longitude },
            resolvedUrl: finalUrl
          });
        }
      }
    }

    // If no coordinates found, try to extract place information
    const placeMatch = finalUrl.match(/\/place\/([^\/]+)/);
    if (placeMatch) {
      return res.json({
        success: false,
        message: "Place found but coordinates not extractable",
        placeId: placeMatch[1],
        resolvedUrl: finalUrl
      });
    }

    return res.json({
      success: false,
      message: "Could not extract coordinates from the resolved URL",
      resolvedUrl: finalUrl
    });

  } catch (error) {
    console.error("Error resolving share link:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to resolve share link",
      details: error.message
    });
  }
});

export default router;
