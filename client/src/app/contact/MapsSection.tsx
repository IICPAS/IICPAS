"use client";
import { motion } from "framer-motion";
import { useLocationData } from "@/utils/useLocationData";

const MapsSection = () => {
  const { locationData, loading, error, lastUpdateTime } = useLocationData(5000);

  // Generate dynamic Google Maps URL based on coordinates
  const generateMapUrl = (locationData: any, zoom = 15) => {
    const { latitude, longitude } = locationData.coordinates;
    
    // Create a dynamic Google Maps embed URL using the coordinates
    // This will properly center the map on the provided coordinates
    const encodedAddress = encodeURIComponent(locationData.address?.formatted_address || '');
    
    // Use a more conservative zoom level for better overview
    // Zoom level 12-13 provides a good balance - shows surrounding area
    const zoomLevel = Math.max(12, Math.min(16, zoom)); // Limit zoom between 12-16 for better view
    
    // Use a slightly higher zoom value for 5% more zoomed in view
    // This value (10000) provides a bit closer view while maintaining good overview
    const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10000!2d${longitude}!3d${latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s${encodedAddress}!5e0!3m2!1sen!2sin!4v${Date.now()}!5m2!1sen!2sin`;
    
    console.log("Generated map URL:", mapUrl);
    console.log("Coordinates:", { latitude, longitude });
    console.log("Address:", locationData.address?.formatted_address);
    console.log("Zoom level:", zoomLevel);
    
    return mapUrl;
  };

  // Default fallback data
  const defaultLocationData = {
    title: "Visit Us",
    description: "We'd love to meet you. Find our office at the heart of Noida.",
    address: {
      formatted_address: "Plot 20, H-1/A, Sector 63, Noida, Uttar Pradesh 201301, India"
    },
    coordinates: {
      latitude: 28.6182566,
      longitude: 77.3767294
    },
    googleMaps: {
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
    }
  };

  // Use fetched data or fallback to default
  const currentLocation = locationData || defaultLocationData;

  if (loading) {
    return (
      <section id="location" className="bg-gradient-to-br from-blue-50 to-green-50 py-20 px-6 md:px-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="location" className="bg-gradient-to-br from-blue-50 to-green-50 py-20 px-6 md:px-20">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6">
            {currentLocation.title}
          </h2>
          <p className="text-gray-700 mb-10 max-w-xl mx-auto text-xl">
            {currentLocation.description}
          </p>
        </motion.div>

        {/* Google Map Embed */}
        {currentLocation.displaySettings?.showMap && (
          <motion.div 
            className="rounded-xl overflow-hidden shadow-2xl max-w-full w-full mx-auto mb-8"
            style={{ height: `${currentLocation.displaySettings.mapHeight || 500}px` }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <iframe
              key={`map-${currentLocation.coordinates?.latitude}-${currentLocation.coordinates?.longitude}`}
              className="google-map-iframe w-full h-full border-0"
              src={generateMapUrl(currentLocation, 14)}
              width="100%"
              height="100%"
              loading="lazy"
              allowFullScreen
              title={`Google Map showing ${currentLocation.title}`}
            />
          </motion.div>
        )}

        {/* Address Card */}
        {currentLocation.displaySettings?.showAddressCard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center mr-4">
                  <svg 
                    className="w-6 h-6 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Location</h3>
              </div>
              <p className="text-gray-700 text-lg font-semibold mb-4">
                {currentLocation.address?.formatted_address}
              </p>
              
              {/* Contact Information */}
              {(currentLocation.contactInfo?.phone || currentLocation.contactInfo?.email) && (
                <div className="border-t pt-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {currentLocation.contactInfo?.phone && (
                      <div className="flex items-center justify-center md:justify-start">
                        <svg className="w-4 h-4 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span className="text-gray-600">{currentLocation.contactInfo.phone}</span>
                      </div>
                    )}
                    {currentLocation.contactInfo?.email && (
                      <div className="flex items-center justify-center md:justify-start">
                        <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        <span className="text-gray-600">{currentLocation.contactInfo.email}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Office Hours */}
                  {(currentLocation.contactInfo?.office_hours?.weekdays || currentLocation.contactInfo?.office_hours?.weekends) && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex items-center justify-center mb-2">
                        <svg className="w-4 h-4 text-orange-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700">Office Hours</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        {currentLocation.contactInfo.office_hours.weekdays && (
                          <p>Monday - Friday: {currentLocation.contactInfo.office_hours.weekdays}</p>
                        )}
                        {currentLocation.contactInfo.office_hours.weekends && (
                          <p>Saturday - Sunday: {currentLocation.contactInfo.office_hours.weekends}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-gray-600 mt-4 text-sm">
                Easily accessible by metro and road transport
              </p>
              
              {/* Real-time Update Indicator */}
              {lastUpdateTime > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span>Live updates enabled</span>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default MapsSection;
