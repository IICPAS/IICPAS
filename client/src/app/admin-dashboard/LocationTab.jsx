"use client";

import { useState, useEffect } from "react";
import { useLocationData } from "@/utils/useLocationData";
import { 
  FaSave, 
  FaEye, 
  FaEdit, 
  FaTrash, 
  FaCheck, 
  FaTimes, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaPlus,
  FaGlobe,
  FaSearch
} from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";

// Add CSS animations
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideIn {
    from { 
      opacity: 0; 
      transform: translateY(-20px) scale(0.95); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1); 
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  
  .animate-slideIn {
    animation: slideIn 0.3s ease-out;
  }
`;

export default function LocationTab() {
  const { user } = useAuth();
  const [locationEntries, setLocationEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Use the custom hook for real-time location data
  const { refreshLocationData } = useLocationData(10000); // Poll every 10 seconds in admin
  
  // Custom toast function that dismisses previous toasts
  const showToast = (message, type = 'success') => {
    // Dismiss all existing toasts
    toast.dismiss();
    // Show new toast
    if (type === 'success') {
      toast.success(message);
    } else if (type === 'error') {
      toast.error(message);
    } else if (type === 'loading') {
      return toast.loading(message);
    } else {
      toast(message);
    }
  };
  const [mounted, setMounted] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    address: {
      street: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
      formatted_address: ""
    },
    coordinates: {
      latitude: "",
      longitude: ""
    },
    googleMaps: {
      place_id: "",
      zoom_level: 15,
      share_link: "",
      embed_html: ""
    },
    displaySettings: {
      showMap: true,
      mapHeight: 500,
      showAddressCard: true,
      mapSize: "medium" // small, medium, large, custom
    },
    contactInfo: {
      phone: "",
      email: "",
      office_hours: {
        weekdays: "",
        weekends: ""
      }
    },
    branch_name: "",
    notes: "",
    isActive: false
  });

  // Helper function to normalize location data and prevent uncontrolled input warnings
  const normalizeLocationData = (data) => {
    return {
      _id: data._id, // PRESERVE THE ID!
      title: data.title || "",
      description: data.description || "",
      address: {
        street: data.address?.street || "",
        city: data.address?.city || "",
        state: data.address?.state || "",
        country: data.address?.country || "",
        pincode: data.address?.pincode || "",
        formatted_address: data.address?.formatted_address || ""
      },
      coordinates: {
        latitude: data.coordinates?.latitude ? String(data.coordinates.latitude) : "",
        longitude: data.coordinates?.longitude ? String(data.coordinates.longitude) : ""
      },
      googleMaps: {
        place_id: data.googleMaps?.place_id || "",
        zoom_level: data.googleMaps?.zoom_level || 15,
        share_link: data.googleMaps?.share_link || "",
        embed_html: data.googleMaps?.embed_html || ""
      },
      displaySettings: {
        showMap: data.displaySettings?.showMap !== undefined ? data.displaySettings.showMap : true,
        mapHeight: data.displaySettings?.mapHeight || 500,
        showAddressCard: data.displaySettings?.showAddressCard !== undefined ? data.displaySettings.showAddressCard : true,
        mapSize: data.displaySettings?.mapSize || "medium"
      },
      contactInfo: {
        phone: data.contactInfo?.phone || "",
        email: data.contactInfo?.email || "",
        office_hours: {
          weekdays: data.contactInfo?.office_hours?.weekdays || "",
          weekends: data.contactInfo?.office_hours?.weekends || ""
        }
      },
      branch_name: data.branch_name || "",
      notes: data.notes || "",
      isActive: data.isActive !== undefined ? data.isActive : false,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt
    };
  };

  const [inputMethod, setInputMethod] = useState("coordinates"); // coordinates, share_link, embed_html

  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchLocationEntries();
  }, []);

  const fetchLocationEntries = async () => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      
      // First try to fetch all locations (admin endpoint)
      let response = await fetch(`${API_BASE}/location/all`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Fetched location entries:", data);
        const normalizedData = data.map(normalizeLocationData);
        console.log("📋 Normalized location data:", normalizedData);
        console.log("🔍 Checking IDs in normalized data:", normalizedData.map(loc => ({ title: loc.title, _id: loc._id, hasId: !!loc._id })));
        setLocationEntries(normalizedData);
        showToast(`Loaded ${data.length} location(s)`, 'success');
        
        // Trigger refresh of public location data to sync frontend
        refreshLocationData();
      } else if (response.status === 401) {
        console.log("⚠️ Authentication required, trying public endpoint...");
        showToast("Admin authentication required. Some features may be limited.", 'error');
        
        // If authentication fails, try public endpoint to get current active location
        response = await fetch(`${API_BASE}/location`);
        if (response.ok) {
          const data = await response.json();
          console.log("✅ Fetched public location data:", data);
          // Convert single location to array format for consistency
          setLocationEntries([{
            ...normalizeLocationData(data),
            _id: "default",
            isActive: true,
            createdAt: new Date().toISOString()
          }]);
          showToast("Loaded public location data. Please log in as admin for full management features.", 'success');
        } else {
          console.error("❌ Failed to fetch location data:", response.status);
          showToast("Failed to fetch location data. Please check your connection.", 'error');
        }
      } else {
        console.error("❌ Failed to fetch location entries:", response.status);
        showToast(`Failed to fetch location entries: ${response.status}`, 'error');
      }
    } catch (error) {
      console.error("❌ Error fetching location entries:", error);
      showToast("Error fetching location entries. Please check your connection.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child, grandChild] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandChild ? {
            ...prev[parent][child],
            [grandChild]: type === 'checkbox' ? checked : value
          } : (type === 'checkbox' ? checked : value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const generateFormattedAddress = () => {
    const { street, city, state, country, pincode } = formData.address;
    const formatted = `${street}, ${city}, ${state} ${pincode}, ${country}`;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        formatted_address: formatted
      }
    }));
  };

  // Helper function to extract coordinates from Google Maps share link
  const extractCoordinatesFromShareLink = async (shareLink) => {
    try {
      if (!shareLink || !shareLink.includes('maps')) {
        return null;
      }

      console.log("Processing share link via backend:", shareLink);

      // Call your backend API to resolve the share link
      const response = await fetch('/api/location/resolve-share-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shareLink })
      });

      const result = await response.json();

      if (result.success && result.coordinates) {
        console.log("Extracted coordinates from share link:", result.coordinates);
        return result.coordinates;
      } else {
        console.warn("Could not extract coordinates:", result.message || result.error);
        return null;
      }
    } catch (error) {
      console.error("Error extracting coordinates from share link:", error);
      return null;
    }
  };

  // Helper function to extract coordinates from embed HTML
  const extractCoordinatesFromEmbedHtml = (embedHtml) => {
    try {
      if (!embedHtml || typeof embedHtml !== 'string') {
        return null;
      }

      console.log("Processing embed HTML:", embedHtml);

      // URL decode the embed HTML first
      const decodedHtml = decodeURIComponent(embedHtml);
      
      // Multiple regex patterns for different Google Maps embed formats
      const coordinatePatterns = [
        // Pattern 1: Extract from the specific format in the provided iframe (!2d is longitude, !3d is latitude)
        /!2d(-?\d+\.?\d*)!3d(-?\d+\.?\d*)/,
        // Pattern 2: !3d and !2d format (most common in embed URLs)
        /!3d(-?\d+\.?\d*)!2d(-?\d+\.?\d*)/,
        // Pattern 3: @lat,lng,zoom format
        /@(-?\d+\.?\d*),(-?\d+\.?\d*)/,
        // Pattern 4: ll parameter
        /[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
        // Pattern 5: center parameter
        /[?&]center=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
        // Pattern 6: q parameter with coordinates
        /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/,
        // Pattern 7: pb format with coordinates (Google Maps embed format)
        /pb=!1m\d+!1m\d+!1m\d+!1d(-?\d+\.?\d*)!2d(-?\d+\.?\d*)/,
        // Pattern 8: Alternative pb format with different structure
        /pb=!1m\d+!1m\d+!1m\d+!2d(-?\d+\.?\d*)!3d(-?\d+\.?\d*)/,
        // Pattern 9: More specific pb format for embed URLs
        /pb=!1m\d+!1m\d+!1m\d+!1d(-?\d+\.?\d*)!2d(-?\d+\.?\d*)!3m\d+!1f\d+!2f\d+!3f\d+!3m\d+!1i\d+!2i\d+!4f\d+\.\d+!3m\d+!1m\d+!1s/
      ];

      for (const pattern of coordinatePatterns) {
        const match = decodedHtml.match(pattern);
        if (match) {
          let latitude, longitude;
          
          // Handle different pattern structures
          if (pattern.source.includes('!2d') && pattern.source.includes('!3d')) {
            // For !2d!3d format, longitude is first, latitude is second
            longitude = parseFloat(match[1]);
            latitude = parseFloat(match[2]);
          } else if (pattern.source.includes('!3d') && pattern.source.includes('!2d')) {
            // For !3d!2d format, latitude is first, longitude is second
            latitude = parseFloat(match[1]);
            longitude = parseFloat(match[2]);
          } else {
            // Default: first match is latitude, second is longitude
            latitude = parseFloat(match[1]);
            longitude = parseFloat(match[2]);
          }
          
          // Validate coordinates
          if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
            console.log("Extracted coordinates from embed HTML:", { latitude, longitude });
            return { latitude, longitude };
          }
        }
      }

      // Try to extract coordinates from the specific iframe format provided
      // The iframe contains: !2d77.50405629605734!3d28.476535856126112
      // Note: !2d is longitude, !3d is latitude
      const specificPattern = /!2d(-?\d+\.?\d*)!3d(-?\d+\.?\d*)/;
      const specificMatch = decodedHtml.match(specificPattern);
      if (specificMatch) {
        const longitude = parseFloat(specificMatch[1]);
        const latitude = parseFloat(specificMatch[2]);
        
        if (latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
          console.log("Extracted coordinates from specific iframe format:", { latitude, longitude });
          return { latitude, longitude };
        }
      }

      console.warn("No valid coordinates found in embed HTML");
      return null;
    } catch (error) {
      console.error("Error extracting coordinates from embed HTML:", error);
      return null;
    }
  };

  // Helper function to extract address from embed HTML
  const extractAddressFromEmbedHtml = (embedHtml) => {
    try {
      if (!embedHtml || typeof embedHtml !== 'string') {
        return null;
      }

      // URL decode the embed HTML first
      const decodedHtml = decodeURIComponent(embedHtml);
      
      // Multiple patterns for extracting address
      const addressPatterns = [
        // Pattern 1: !2s format (most common)
        /!2s([^!]+)/,
        // Pattern 2: !1s format
        /!1s([^!]+)/,
        // Pattern 3: q parameter with address
        /[?&]q=([^&]+)/,
        // Pattern 4: query parameter
        /[?&]query=([^&]+)/
      ];

      for (const pattern of addressPatterns) {
        const match = decodedHtml.match(pattern);
        if (match) {
          let address = match[1];
          
          // Clean up the address
          address = address.replace(/%2C/g, ', ');
          address = address.replace(/%20/g, ' ');
          address = address.replace(/%2B/g, '+');
          
          // Validate that it looks like an address (contains common address keywords)
          if (address.length > 10 && (
            address.includes('Street') || 
            address.includes('Road') || 
            address.includes('Avenue') ||
            address.includes(',') ||
            address.includes('Block') ||
            address.includes('Sector')
          )) {
            console.log("Extracted address from embed HTML:", address);
            return address;
          }
        }
      }

      console.warn("No valid address found in embed HTML");
      return null;
    } catch (error) {
      console.error("Error extracting address from embed HTML:", error);
      return null;
    }
  };

  // Process input based on selected method
  const processInputMethod = async () => {
    try {
      if (inputMethod === "share_link" && formData.googleMaps.share_link) {
        showToast("Extracting coordinates from share link...", 'loading');
        
        const coords = await extractCoordinatesFromShareLink(formData.googleMaps.share_link);
        
        if (coords) {
          setFormData(prev => ({
            ...prev,
            coordinates: coords
          }));
          showToast(`Coordinates extracted: ${coords.latitude}, ${coords.longitude}`, 'success');
        } else {
          showToast("Could not extract coordinates from share link. Please check the link format or enter coordinates manually.", 'error');
        }
      } else if (inputMethod === "embed_html" && formData.googleMaps.embed_html) {
        showToast("Extracting coordinates and address from embed HTML...", 'loading');
        
        const coords = extractCoordinatesFromEmbedHtml(formData.googleMaps.embed_html);
        const address = extractAddressFromEmbedHtml(formData.googleMaps.embed_html);
        
        if (coords) {
          setFormData(prev => ({
            ...prev,
            coordinates: coords,
            address: {
              ...prev.address,
              formatted_address: address || prev.address.formatted_address
            }
          }));
          
          let message = `Coordinates extracted: ${coords.latitude}, ${coords.longitude}`;
          if (address) {
            message += `\nAddress: ${address}`;
          }
          showToast(message, 'success');
        } else {
          showToast("Could not extract coordinates from embed HTML. Please check the format. Make sure you copied the complete iframe code from Google Maps.", 'error');
        }
      } else {
        showToast("Please provide a valid input before extracting information.", 'error');
      }
    } catch (error) {
      console.error("Error processing input method:", error);
      showToast("An error occurred while processing the input. Please try again.", 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      let response;

      if (editingId) {
        response = await fetch(`${API_BASE}/location/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData)
        });
      } else {
        response = await fetch(`${API_BASE}/location`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(formData)
        });
      }

      if (response.ok) {
        const data = await response.json();
        showToast(editingId ? "Location updated successfully!" : "Location created successfully!", 'success');
        fetchLocationEntries();
        resetForm();
        
        // Trigger refresh of public location data
        refreshLocationData();
      } else {
        const errorData = await response.json();
        showToast(errorData.error || "Failed to save location", 'error');
      }
    } catch (error) {
      console.error("Error saving location:", error);
      showToast("Error saving location", 'error');
    }
  };

  const handleEdit = (location) => {
    const normalizedLocation = normalizeLocationData(location);
    
    // Handle default location (from public endpoint)
    if (location._id === "default") {
      // For default location, we'll create a new entry based on it
      setFormData({
        ...normalizedLocation,
        isActive: true // Make it active by default when editing
      });
      setEditingId(null); // Treat as new entry
    } else {
      setFormData(normalizedLocation);
      setEditingId(location._id);
    }
    setShowForm(true);
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  const handleDeleteClick = (location) => {
    console.log(`🗑️ Delete button clicked for: ${location.title} (ID: ${location._id}, Active: ${location.isActive})`);
    
    // Check if location is active
    if (location.isActive) {
      console.log(`❌ Cannot delete active location: ${location.title}`);
      showToast("Cannot delete active locations. Please deactivate the location first.", 'error');
      return;
    }
    
    // Log the location object for debugging
    console.log(`🔍 Full location object for delete:`, location);

    // For locations with 'default' ID, we can remove them from local state
    if (!location._id || location._id === 'default') {
      console.log(`⚠️ Location has default/missing ID, removing from local state`);
      
      // Remove from local state using title + address as unique identifier
      setLocationEntries(prevEntries => 
        prevEntries.filter(entry => 
          !(entry._id === location._id && 
            entry.title === location.title && 
            entry.address?.formatted_address === location.address?.formatted_address)
        )
      );
      
      showToast(`Location "${location.title}" removed from local view.`, 'success');
      return;
    }
    
    console.log(`✅ Opening delete confirmation dialog for: ${location.title}`);
    setLocationToDelete(location);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    console.log(`🗑️ Delete confirmation called for: ${locationToDelete?.title} (ID: ${locationToDelete?._id})`);
    
    if (!locationToDelete || !locationToDelete._id) {
      console.log(`❌ Invalid location to delete`);
      showToast("Invalid location to delete", 'error');
      setShowDeleteDialog(false);
      setLocationToDelete(null);
      return;
    }

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      
      console.log(`🗑️ Attempting to delete location: ${locationToDelete.title} (ID: ${locationToDelete._id})`);
      
      const response = await fetch(`${API_BASE}/location/${locationToDelete._id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log(`🗑️ Delete API response status: ${response.status}`);
      const responseData = await response.json();
      console.log(`🗑️ Delete API response data:`, responseData);

      if (response.ok) {
        showToast(`Location "${locationToDelete.title}" deleted successfully!`, 'success');
        console.log(`✅ Successfully deleted location:`, responseData.deletedLocation);
        fetchLocationEntries();
        
        // Trigger refresh of public location data
        refreshLocationData();
      } else {
        console.error(`❌ Failed to delete location:`, responseData);
        showToast(responseData.error || "Failed to delete location", 'error');
      }
    } catch (error) {
      console.error("❌ Error deleting location:", error);
      showToast("Network error. Please check your connection and try again.", 'error');
    } finally {
      setShowDeleteDialog(false);
      setLocationToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setLocationToDelete(null);
  };

  const handleToggleActive = async (location) => {
    console.log(`🔄 handleToggleActive called for: ${location.title} (ID: ${location._id})`);
    
    // Check if location has ID
    if (!location._id) {
      console.log(`❌ Missing location ID: ${location._id}`);
      showToast("Cannot update status for this location. Missing location ID.", 'error');
      return;
    }

    // Log the location object for debugging
    console.log(`🔍 Full location object:`, location);

    // For locations with missing or 'default' ID, we need to create them first
    if (!location._id || location._id === 'default') {
      console.log(`⚠️ Location has missing/default ID, attempting to save as new location`);
      
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
        const loadingToast = showToast(`Saving ${location.title} as new location...`, 'loading');
        
        // Create new location entry (remove _id from the data)
        const { _id, ...locationData } = location;
        const response = await fetch(`${API_BASE}/location`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(locationData)
        });

        const responseData = await response.json();
        toast.dismiss(loadingToast);

        if (response.ok) {
          showToast(`Location "${location.title}" saved successfully!`, 'success');
          console.log(`✅ Created new location:`, responseData);
          fetchLocationEntries(); // Refresh the list
          
          // Trigger refresh of public location data
          refreshLocationData();
          return;
        } else {
          console.error(`❌ Failed to save location:`, responseData);
          showToast(responseData.error || "Failed to save location. Please try again.", 'error');
          return;
        }
      } catch (error) {
        console.error("❌ Error saving location:", error);
        showToast("Network error while saving location. Please try again.", 'error');
        return;
      }
    }

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      
      console.log(`🔄 Toggling location status: ${location.title} (ID: ${location._id}) from ${location.isActive ? 'Active' : 'Inactive'} to ${!location.isActive ? 'Active' : 'Inactive'}`);
      
      // Show loading toast
      const loadingToast = showToast(`Updating ${location.title} status...`, 'loading');
      
      const response = await fetch(`${API_BASE}/location/${location._id}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log(`🔄 API Response status: ${response.status}`);

      const responseData = await response.json();
      console.log(`🔄 API Response data:`, responseData);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.ok) {
        const newStatus = responseData.newStatus;
        showToast(`Location "${location.title}" is now ${newStatus ? 'Active' : 'Inactive'}!`, 'success');
        console.log(`✅ Successfully toggled location status:`, responseData);
        
        // Trigger refresh of public location data
        refreshLocationData();
        
        // Immediately update the local state for better UX
        setLocationEntries(prevEntries => {
          const updatedEntries = prevEntries.map(entry => {
            if (entry._id === location._id) {
              console.log(`🔄 Updating entry ${entry.title} to status: ${newStatus}`);
              return { ...entry, isActive: newStatus };
            }
            // If activating this location, deactivate all others
            if (newStatus && entry._id !== location._id) {
              console.log(`🔄 Deactivating other entry: ${entry.title}`);
              return { ...entry, isActive: false };
            }
            return entry;
          });
          console.log(`🔄 Updated location entries:`, updatedEntries);
          return updatedEntries;
        });
        
        // Then fetch fresh data to ensure consistency
        setTimeout(() => {
          console.log(`🔄 Fetching fresh data after status update`);
          fetchLocationEntries();
        }, 500);
      } else {
        console.error(`❌ Failed to toggle location status:`, responseData);
        showToast(responseData.error || "Failed to update location status", 'error');
      }
    } catch (error) {
      console.error("❌ Error updating location status:", error);
      showToast("Network error. Please check your connection and try again.", 'error');
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        formatted_address: ""
      },
      coordinates: {
        latitude: "",
        longitude: ""
      },
      googleMaps: {
        place_id: "",
        zoom_level: 15,
        share_link: "",
        embed_html: ""
      },
      displaySettings: {
        showMap: true,
        mapHeight: 500,
        showAddressCard: true,
        mapSize: "medium"
      },
      contactInfo: {
        phone: "",
        email: "",
        office_hours: {
          weekdays: "",
          weekends: ""
        }
      },
      branch_name: "",
      notes: "",
      isActive: false
    });
    setEditingId(null);
    setShowForm(false);
    setInputMethod("coordinates");
  };

  const handlePreview = () => {
    setPreviewMode(!previewMode);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <style jsx>{styles}</style>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Location Management</h1>
          <p className="text-gray-600">Manage your office locations and map settings</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handlePreview}
            className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <FaEye className="w-4 h-4" />
            {previewMode ? "Hide Preview" : "Show Preview"}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus className="w-4 h-4" />
            Add Location
          </button>
        </div>
      </div>

      {/* Preview Section */}
      {previewMode && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaGlobe className="w-5 h-5 text-blue-600" />
            Preview
          </h3>
          <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Visit Us</h2>
            <p className="text-gray-700 mb-4">We'd love to meet you. Find our office at the heart of Noida.</p>
            <div className="bg-white rounded-lg p-4 shadow-md">
              <div className="flex items-center gap-3">
                <FaMapMarkerAlt className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-semibold">Our Location</h4>
                  <p className="text-gray-600">Plot 20, H-1/A, Sector 63, Noida, Uttar Pradesh 201301</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {editingId ? "Edit Location" : "Add New Location"}
            </h2>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch Name
                </label>
                <input
                  type="text"
                  name="branch_name"
                  value={formData.branch_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Address Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="w-5 h-5 text-blue-600" />
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="address.country"
                    value={formData.address.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Formatted Address
                  </label>
                  <input
                    type="text"
                    name="address.formatted_address"
                    value={formData.address.formatted_address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={generateFormattedAddress}
                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    Auto-generate from address fields
                  </button>
                </div>
              </div>
            </div>

            {/* Location Input Method */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaGlobe className="w-5 h-5 text-blue-600" />
                Location Input Method
              </h3>
              
              {/* Method Selection */}
              <div className="mb-6">
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="inputMethod"
                      value="coordinates"
                      checked={inputMethod === "coordinates"}
                      onChange={(e) => setInputMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Coordinates (Lat/Lng)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="inputMethod"
                      value="share_link"
                      checked={inputMethod === "share_link"}
                      onChange={(e) => setInputMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Google Maps Share Link</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="inputMethod"
                      value="embed_html"
                      checked={inputMethod === "embed_html"}
                      onChange={(e) => setInputMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Embed HTML</span>
                  </label>
                </div>
              </div>

              {/* Input Method Content */}
              {inputMethod === "coordinates" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="coordinates.latitude"
                      value={formData.coordinates.latitude}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude *
                    </label>
                    <input
                      type="number"
                      step="any"
                      name="coordinates.longitude"
                      value={formData.coordinates.longitude}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              )}

              {inputMethod === "share_link" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Maps Share Link *
                  </label>
                  <input
                    type="url"
                    name="googleMaps.share_link"
                    value={formData.googleMaps.share_link}
                    onChange={handleInputChange}
                    placeholder="https://maps.app.goo.gl/nKwBE5b8BPEbLocSA"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste the Google Maps share link here. Note: You may need to manually enter coordinates as well.
                  </p>
                   <button
                     type="button"
                     onClick={processInputMethod}
                     disabled={!formData.googleMaps.share_link.trim()}
                     className={`mt-2 px-4 py-2 rounded-lg transition-colors text-sm flex items-center ${
                       formData.googleMaps.share_link.trim()
                         ? 'bg-blue-600 text-white hover:bg-blue-700'
                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                     }`}
                   >
                     <FaSearch className="w-4 h-4 inline mr-2" />
                     Extract Information
                   </button>
                </div>
              )}

              {inputMethod === "embed_html" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Google Maps Embed HTML *
                  </label>
                  <textarea
                    name="googleMaps.embed_html"
                    value={formData.googleMaps.embed_html}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder='<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3..." width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>'
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Paste the complete iframe embed code from Google Maps. This will automatically extract coordinates and address.
                  </p>
                   <button
                     type="button"
                     onClick={processInputMethod}
                     disabled={!formData.googleMaps.embed_html.trim()}
                     className={`mt-2 px-4 py-2 rounded-lg transition-colors text-sm flex items-center ${
                       formData.googleMaps.embed_html.trim()
                         ? 'bg-blue-600 text-white hover:bg-blue-700'
                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                     }`}
                   >
                     <FaSearch className="w-4 h-4 inline mr-2" />
                     Extract Coordinates & Address
                   </button>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaPhone className="w-5 h-5 text-green-600" />
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="contactInfo.phone"
                    value={formData.contactInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="contactInfo.email"
                    value={formData.contactInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekday Hours
                  </label>
                  <input
                    type="text"
                    name="contactInfo.office_hours.weekdays"
                    value={formData.contactInfo.office_hours.weekdays}
                    onChange={handleInputChange}
                    placeholder="9:00 AM - 6:00 PM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weekend Hours
                  </label>
                  <input
                    type="text"
                    name="contactInfo.office_hours.weekends"
                    value={formData.contactInfo.office_hours.weekends}
                    onChange={handleInputChange}
                    placeholder="10:00 AM - 4:00 PM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Display Settings */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Display Settings</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="displaySettings.showMap"
                      checked={formData.displaySettings.showMap}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">Show Map</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="displaySettings.showAddressCard"
                      checked={formData.displaySettings.showAddressCard}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label className="ml-2 text-sm text-gray-700">Show Address Card</label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Map Size
                    </label>
                    <select
                      name="displaySettings.mapSize"
                      value={formData.displaySettings.mapSize}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="small">Small (300px)</option>
                      <option value="medium">Medium (500px)</option>
                      <option value="large">Large (700px)</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Map Height (px)
                    </label>
                    <input
                      type="number"
                      name="displaySettings.mapHeight"
                      value={formData.displaySettings.mapHeight}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        let newSize = formData.displaySettings.mapSize;
                        
                        // Auto-update size based on height
                        if (value <= 300) newSize = "small";
                        else if (value <= 500) newSize = "medium";
                        else if (value <= 700) newSize = "large";
                        else newSize = "custom";
                        
                        setFormData(prev => ({
                          ...prev,
                          displaySettings: {
                            ...prev.displaySettings,
                            mapHeight: value,
                            mapSize: newSize
                          }
                        }));
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                {/* Size Preset Buttons */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Size Presets
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        displaySettings: {
                          ...prev.displaySettings,
                          mapHeight: 300,
                          mapSize: "small"
                        }
                      }))}
                      className={`px-3 py-1 text-sm rounded-lg border ${
                        formData.displaySettings.mapHeight === 300 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Small (300px)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        displaySettings: {
                          ...prev.displaySettings,
                          mapHeight: 500,
                          mapSize: "medium"
                        }
                      }))}
                      className={`px-3 py-1 text-sm rounded-lg border ${
                        formData.displaySettings.mapHeight === 500 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Medium (500px)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        displaySettings: {
                          ...prev.displaySettings,
                          mapHeight: 700,
                          mapSize: "large"
                        }
                      }))}
                      className={`px-3 py-1 text-sm rounded-lg border ${
                        formData.displaySettings.mapHeight === 700 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      Large (700px)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="border-t pt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">Make this location active</label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Only one location can be active at a time. Activating this location will deactivate others.
              </p>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Additional notes about this location..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FaSave className="w-4 h-4" />
                {editingId ? "Update Location" : "Create Location"}
              </button>
            </div>
          </form>
        </div>
      )}

       {/* Location Entries List */}
       <div className="bg-white rounded-lg shadow-md overflow-hidden">
         <div className="px-6 py-4 border-b border-gray-200">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-semibold">Location Entries</h3>
             {locationEntries.length > 0 && (
               <button
                 onClick={() => {
                   // Create a new location based on the first existing location
                   const defaultLocation = locationEntries[0];
                   setFormData({
                     ...defaultLocation,
                     title: `${defaultLocation.title} (Copy)`,
                     branch_name: `${defaultLocation.branch_name || "Main Branch"} - Copy`,
                     isActive: false, // Don't make copies active by default
                     _id: undefined // Remove ID to create new entry
                   });
                   setEditingId(null);
                   setShowForm(true);
                 }}
                 className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
               >
                 <FaPlus className="w-3 h-3" />
                 Create from Existing
               </button>
             )}
           </div>
           
         </div>
        
         {locationEntries.length === 0 ? (
           <div className="text-center py-12">
             <FaMapMarkerAlt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
             <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
             <p className="text-gray-500 mb-4">Get started by adding your first location.</p>
             <div className="flex gap-3 justify-center">
               <button
                 onClick={() => setShowForm(true)}
                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
               >
                 <FaPlus className="w-4 h-4" />
                 Add New Location
               </button>
             </div>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {locationEntries.map((location, index) => (
                  <tr key={location._id || `location-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {location.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {location.branch_name || "Main Branch"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {location.address.formatted_address}
                      </div>
                      <div className="text-sm text-gray-500">
                        {location.address.city}, {location.address.state}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {location.contactInfo.phone}
                      </div>
                      <div className="text-sm text-gray-500">
                        {location.contactInfo.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        key={`status-${location._id}-${location.isActive}`}
                        value={location.isActive ? 'active' : 'inactive'}
                        onChange={(e) => {
                          const newStatus = e.target.value === 'active';
                          console.log(`🔄 Status change: ${location.title} from ${location.isActive ? 'Active' : 'Inactive'} to ${newStatus ? 'Active' : 'Inactive'}`);
                          
                          if (newStatus !== location.isActive) {
                            handleToggleActive(location);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 min-w-[100px] ${
                          location.isActive
                            ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200 focus:ring-green-500"
                            : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200 focus:ring-gray-500"
                        }`}
                        title={`Change status for ${location.title}`}
                      >
                        <option value="inactive">Inactive</option>
                        <option value="active">Active</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(location)}
                          className="p-1.5 rounded-full text-blue-600 hover:text-blue-700 bg-blue-50 bg-opacity-50 hover:bg-opacity-70 backdrop-blur-sm border border-blue-200 border-opacity-30 hover:border-opacity-50 transform hover:scale-105 transition-all duration-200"
                          title="Edit"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(location)}
                          className={`p-1.5 rounded-full transition-all duration-200 ${
                            location.isActive
                              ? 'text-gray-400 cursor-not-allowed bg-gray-100 bg-opacity-30'
                              : 'text-red-600 hover:text-red-700 bg-red-50 bg-opacity-50 hover:bg-opacity-70 backdrop-blur-sm border border-red-200 border-opacity-30 hover:border-opacity-50 transform hover:scale-105'
                          }`}
                          title={
                            location.isActive 
                              ? "Cannot delete active locations"
                              : "Delete location"
                          }
                          disabled={location.isActive}
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && locationToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white bg-opacity-70 backdrop-blur-lg rounded-2xl shadow-2xl border border-white border-opacity-30 max-w-md w-full mx-4 transform transition-all duration-300 ease-out animate-slideIn">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="p-2 rounded-full bg-red-100 bg-opacity-50 backdrop-blur-sm">
                    <FaTrash className="w-5 h-5 text-red-600 animate-pulse" />
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Delete Location
                  </h3>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to delete this location? This action cannot be undone.
                </p>
                
                <div className="bg-gray-50 bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-gray-200 border-opacity-50">
                  <h4 className="font-medium text-gray-900 mb-2">{locationToDelete.title}</h4>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Branch:</strong> {locationToDelete.branch_name || "Main Branch"}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <strong>Address:</strong> {locationToDelete.address.formatted_address}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Contact:</strong> {locationToDelete.contactInfo.phone}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white bg-opacity-50 backdrop-blur-sm border border-gray-300 border-opacity-50 rounded-lg hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 bg-opacity-80 backdrop-blur-sm border border-red-400 border-opacity-50 rounded-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform hover:scale-105"
                >
                  Delete Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
