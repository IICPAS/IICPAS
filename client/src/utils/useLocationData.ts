import { useState, useEffect, useCallback } from 'react';

interface LocationData {
  _id?: string;
  title: string;
  description: string;
  address: {
    formatted_address: string;
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
  coordinates: {
    latitude: string;
    longitude: string;
  };
  googleMaps?: {
    place_id?: string;
    zoom_level?: number;
    share_link?: string;
    embed_html?: string;
  };
  displaySettings?: {
    showMap?: boolean;
    mapHeight?: number;
    showAddressCard?: boolean;
    mapSize?: string;
  };
  contactInfo?: {
    phone: string;
    email: string;
    office_hours?: {
      weekdays?: string;
      weekends?: string;
    };
  };
  isActive?: boolean;
  branch_name?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UseLocationDataReturn {
  locationData: LocationData | null;
  loading: boolean;
  error: string | null;
  lastUpdateTime: number;
  refreshLocationData: () => Promise<void>;
}

export const useLocationData = (pollInterval: number = 5000): UseLocationDataReturn => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);

  const fetchLocationData = useCallback(async (isBackgroundUpdate = false) => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080/api";
      const response = await fetch(`${API_BASE}/location`, {
        // Add cache-busting for background updates to ensure fresh data
        ...(isBackgroundUpdate && {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Check if location data has changed
        const hasChanged = !locationData || 
          JSON.stringify(data) !== JSON.stringify(locationData);
        
        if (hasChanged) {
          console.log("🔄 Location data updated:", data);
          setLocationData(data);
          setLastUpdateTime(Date.now());
          
          // Show a subtle notification for background updates
          if (isBackgroundUpdate) {
            console.log("📍 Location information updated automatically");
          }
        } else if (isBackgroundUpdate) {
          console.log("📍 Location data is up to date");
        }
      } else {
        console.error("Failed to fetch location data:", response.status);
        if (!isBackgroundUpdate) {
          setError("Failed to load location information");
        }
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
      if (!isBackgroundUpdate) {
        setError("Error loading location information");
      }
    } finally {
      if (!isBackgroundUpdate) {
        setLoading(false);
      }
    }
  }, [locationData]);

  const refreshLocationData = useCallback(async () => {
    await fetchLocationData(false);
  }, [fetchLocationData]);

  useEffect(() => {
    fetchLocationData();
    
    // Set up polling to check for location updates
    const pollIntervalId = setInterval(() => {
      fetchLocationData(true); // true indicates it's a background update
    }, pollInterval);

    // Cleanup interval on component unmount
    return () => clearInterval(pollIntervalId);
  }, [fetchLocationData, pollInterval]);

  return {
    locationData,
    loading,
    error,
    lastUpdateTime,
    refreshLocationData
  };
};

export default useLocationData;
