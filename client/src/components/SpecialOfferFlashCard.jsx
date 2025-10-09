"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Collapse,
  Stack,
  Chip,
  Alert,
} from "@mui/material";
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  PartyMode as PartyModeIcon,
  CardGiftcard as GiftIcon,
  Share as ShareIcon,
  Star as StarIcon,
  LocalFireDepartment as FireIcon,
  EmojiEvents as TrophyIcon,
  Diamond as DiamondIcon,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

const SpecialOfferFlashCard = ({
  location = "admin_dashboard",
  maxCards = 3,
  onClose,
}) => {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [expandedCards, setExpandedCards] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveOffers();
  }, [location]);

  const fetchActiveOffers = async () => {
    try {
      console.log("Fetching offers for location:", location);
      console.log("API_BASE:", API_BASE);
      const response = await axios.get(
        `${API_BASE}/special-offers/active?location=${location}`
      );
      console.log("API Response:", response.data);
      setOffers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching active special offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      party_pomp: <PartyModeIcon />,
      gift: <GiftIcon />,
      star: <StarIcon />,
      fire: <FireIcon />,
      trophy: <TrophyIcon />,
      diamond: <DiamondIcon />,
    };
    return iconMap[iconName] || <PartyModeIcon />;
  };

  const toggleExpanded = (offerId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [offerId]: !prev[offerId],
    }));
  };

  const handleCloseCard = (offerId) => {
    setOffers((prev) => prev.filter((offer) => offer._id !== offerId));
    if (onClose) {
      onClose(offerId);
    }
  };

  const handleGetNowClick = (offerId) => {
    // Close the modal first
    handleCloseCard(offerId);
    // Then navigate to courses page
    router.push("/course");
  };

  const handleWhatsAppShare = (offer) => {
    const shareText = `🎉 ${offer.title} - ${offer.description}\n\nGet up to 60% discount on courses at IICPA Institute!\n\nVisit: ${window.location.origin}/course\n\n#IICPAInstitute #CourseOffer #Education`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
  };

  const formatTimeRemaining = (expiryDate) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry - now;

    if (diff <= 0) return "Expired";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    if (hours > 0) return `${hours}h ${minutes}m left`;
    return `${minutes}m left`;
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Loading special offers...</Typography>
      </Box>
    );
  }

  if (offers.length === 0) {
    return null; // Don't render anything if no offers
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(5px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Box
        sx={{
          maxWidth: 400,
          width: "100%",
          position: "relative",
        }}
      >
        {offers.slice(0, maxCards).map((offer) => {
          const isExpiredOffer = isExpired(offer.expiryDate);
          const isExpanded = expandedCards[offer._id];

          return (
            <Card
              key={offer._id}
              sx={{
                background: "white",
                color: "#333",
                borderRadius: 4,
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                border: "none",
                overflow: "hidden",
                position: "relative",
                textAlign: "center",
                p: 3,
              }}
            >
              {/* Close Button */}
              <IconButton
                onClick={() => handleCloseCard(offer._id)}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  color: "#666",
                  backgroundColor: "rgba(0,0,0,0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(0,0,0,0.2)",
                  },
                }}
                size="small"
              >
                <CloseIcon fontSize="small" />
              </IconButton>

              <CardContent sx={{ p: 0 }}>
                {/* Celebration Icon */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 80,
                    height: 80,
                    borderRadius: "50%",

                    margin: "0 auto 20px auto",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="/images/celeb.png"
                    alt="Celebration"
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "contain",
                    }}
                  />
                </Box>

                {/* Title */}
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, mb: 2, color: "#333" }}
                >
                  {offer.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body1"
                  sx={{
                    mb: 3,
                    lineHeight: 1.6,
                    color: "#666",
                  }}
                >
                  {offer.description}
                </Typography>

                {/* Time Remaining */}
                <Box sx={{ mb: 3 }}>
                  <Chip
                    label={formatTimeRemaining(offer.expiryDate)}
                    sx={{
                      backgroundColor: "#FF6B6B",
                      color: "white",
                      fontWeight: 600,
                      fontSize: "14px",
                      px: 2,
                      py: 1,
                    }}
                  />
                </Box>

                {/* Action Buttons */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {/* Get Now Button */}
                  <Box
                    onClick={() => handleGetNowClick(offer._id)}
                    sx={{
                      backgroundColor: "#FF6B6B",
                      color: "white",
                      padding: "12px 40px",
                      borderRadius: "25px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      minWidth: "200px",
                      "&:hover": {
                        backgroundColor: "#e55a5a",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    GET NOW
                  </Box>

                  {/* WhatsApp Share Button */}
                  <IconButton
                    onClick={() => handleWhatsAppShare(offer)}
                    sx={{
                      backgroundColor: "#25D366",
                      color: "white",
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#20b358",
                        transform: "scale(1.1)",
                      },
                    }}
                    title="Share on WhatsApp"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                    </svg>
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default SpecialOfferFlashCard;
