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
  Star as StarIcon,
  LocalFireDepartment as FireIcon,
  EmojiEvents as TrophyIcon,
  Diamond as DiamondIcon,
} from "@mui/icons-material";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8080";

const SpecialOfferFlashCard = ({
  location = "admin_dashboard",
  maxCards = 3,
  onClose,
}) => {
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

                {/* Get Now Button */}
                <Box
                  sx={{
                    backgroundColor: "#FF6B6B",
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "25px",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#e55a5a",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  GET NOW
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
