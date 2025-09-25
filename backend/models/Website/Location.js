import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    // Basic location information
    title: {
      type: String,
      required: true,
      default: "Visit Us"
    },
    
    description: {
      type: String,
      required: true,
      default: "We'd love to meet you. Find our office at the heart of Noida."
    },
    
    // Address details
    address: {
      street: { 
        type: String, 
        required: true, 
        default: "Plot 20, H-1/A, Sector 63" 
      },
      city: { 
        type: String, 
        required: true, 
        default: "Noida" 
      },
      state: { 
        type: String, 
        required: true, 
        default: "Uttar Pradesh" 
      },
      country: { 
        type: String, 
        required: true, 
        default: "India" 
      },
      pincode: { 
        type: String, 
        required: true, 
        default: "201301" 
      },
      formatted_address: {
        type: String,
        required: true,
        default: "Plot 20, H-1/A, Sector 63, Noida, Uttar Pradesh 201301, India"
      }
    },
    
    // Geographic coordinates
    coordinates: {
      latitude: {
        type: Number,
        required: true,
        default: 28.6182566
      },
      longitude: {
        type: Number,
        required: true,
        default: 77.3767294
      }
    },
    
    // Google Maps specific
    googleMaps: {
      place_id: {
        type: String,
        default: "ChIJX8Vc8qVZDDkRZ5zL8Y8Qz1Y"
      },
      zoom_level: {
        type: Number,
        default: 15
      }
    },
    
    // Display settings
    displaySettings: {
      showMap: {
        type: Boolean,
        default: true
      },
      mapHeight: {
        type: Number,
        default: 500
      },
      showAddressCard: {
        type: Boolean,
        default: true
      }
    },
    
    // Contact information for this location
    contactInfo: {
      phone: {
        type: String,
        default: "+91 98765 43210"
      },
      email: {
        type: String,
        default: "info@iicpa.org"
      },
      office_hours: {
        weekdays: {
          type: String,
          default: "9:00 AM - 6:00 PM"
        },
        weekends: {
          type: String,
          default: "10:00 AM - 4:00 PM"
        }
      }
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true
    },
    
    // Additional metadata
    branch_name: {
      type: String,
      default: "Main Branch"
    },
    
    notes: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const WebsiteLocation = mongoose.model("WebsiteLocation", locationSchema);
export default WebsiteLocation;
