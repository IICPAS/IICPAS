"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { toast } from "react-hot-toast";

const MySwal = withReactContent(Swal);
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const GroupPricingTab = ({ onBack }) => {
  const [groupPricing, setGroupPricing] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    level: "",
    courseIds: [],
    groupPrice: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const courseLevels = [
    { value: "Executive Level", label: "Executive Level" },
    { value: "Professional Level", label: "Professional Level" },
  ];

  useEffect(() => {
    fetchGroupPricing();
    fetchCourses();
  }, []);

  const fetchGroupPricing = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/group-pricing`);
      const groupPricingData = response.data || [];

      // Ensure courses are populated
      const populatedGroupPricing = groupPricingData.map((item) => ({
        ...item,
        courseIds: item.courseIds || [],
      }));

      setGroupPricing(populatedGroupPricing);
    } catch (error) {
      console.error("Error fetching group pricing:", error);
      // Initialize with empty array if API doesn't exist yet
      setGroupPricing([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${API_BASE}/courses`);
      setCourses(response.data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setFormData({
      level: "",
      courseIds: [],
      groupPrice: "",
      description: "",
      image: null,
    });
    setImagePreview(null);
    setOpenDialog(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      level: item.level,
      courseIds: item.courseIds || [],
      groupPrice: item.groupPrice.toString(),
      description: item.description || "",
      image: null,
    });
    setImagePreview(item.image || null);
    setOpenDialog(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = async (item) => {
    const result = await MySwal.fire({
      title: `Delete group pricing for ${item.level}?`,
      text: "This cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${API_BASE}/group-pricing/${item._id}`);
      toast.success("Group pricing deleted successfully!", {
        style: {
          zIndex: 9999,
          position: "top-center",
        },
      });
      fetchGroupPricing();
    } catch (error) {
      console.error("Error deleting group pricing:", error);
      toast.error("Failed to delete group pricing", {
        style: {
          zIndex: 9999,
          position: "top-center",
        },
      });
    }
  };

  const handleSave = async () => {
    if (!formData.level || !formData.courseIds.length || !formData.groupPrice) {
      toast.error("Please fill in all required fields", {
        style: {
          zIndex: 9999,
          position: "top-center",
        },
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("level", formData.level);
      formDataToSend.append("courseIds", JSON.stringify(formData.courseIds));
      formDataToSend.append("groupPrice", formData.groupPrice);
      formDataToSend.append("description", formData.description);
      
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      if (editingItem) {
        await axios.put(
          `${API_BASE}/group-pricing/${editingItem._id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Group pricing updated successfully!", {
          style: {
            zIndex: 9999,
            position: "top-center",
          },
        });
      } else {
        await axios.post(`${API_BASE}/group-pricing`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Group pricing created successfully!", {
          style: {
            zIndex: 9999,
            position: "top-center",
          },
        });
      }

      setOpenDialog(false);
      fetchGroupPricing();
    } catch (error) {
      console.error("Error saving group pricing:", error);
      toast.error("Failed to save group pricing", {
        style: {
          zIndex: 9999,
          position: "top-center",
        },
      });
    }
  };

  const getCoursesForLevel = (level) => {
    return courses.filter((course) => course.level === level);
  };

  const getSelectedCourseNames = (courseIds) => {
    if (!courseIds || !Array.isArray(courseIds)) return [];

    return courseIds.map((courseId) => {
      // Handle both string IDs and populated course objects
      if (typeof courseId === "object" && courseId.title) {
        return courseId.title;
      }

      const course = courses.find((c) => c._id === courseId);
      return course ? course.title : `Course ID: ${courseId}`;
    });
  };

  return (
    <Box
      sx={{
        height: "auto",
        overflow: "visible",
        position: "relative",
        zIndex: 1,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h5" fontWeight={700} sx={{ color: "#1a237e" }}>
          Group Pricing Management
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={onBack}
            sx={{
              borderColor: "#1976d2",
              color: "#1976d2",
              borderRadius: "8px",
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
            }}
          >
            ← Back
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
              borderRadius: "8px",
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
            }}
          >
            Add Group Pricing
          </Button>
        </Stack>
      </Stack>

      {loading ? (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography>Loading group pricing...</Typography>
        </Box>
      ) : groupPricing.length === 0 ? (
        <Alert severity="info" sx={{ mb: 3 }}>
          No group pricing configurations found. Click "Add Group Pricing" to
          create one.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {groupPricing.map((item) => (
            <Grid item xs={12} md={6} lg={4} key={item._id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  border: "1px solid #e8eaf6",
                  "&:hover": {
                    boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Chip
                      label={item.level}
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                    <Stack direction="row" spacing={1}>
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(item)}
                          sx={{
                            bgcolor: "#e3f2fd",
                            color: "#1976d2",
                            "&:hover": { bgcolor: "#bbdefb" },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(item)}
                          sx={{
                            bgcolor: "#ffebee",
                            color: "#d32f2f",
                            "&:hover": { bgcolor: "#ffcdd2" },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>

                  <Typography
                    variant="h6"
                    sx={{ mb: 1, color: "#2e7d32", fontWeight: 600 }}
                  >
                    ₹{item.groupPrice.toLocaleString()}
                  </Typography>

                  {item.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {item.description}
                    </Typography>
                  )}

                  <Typography
                    variant="subtitle2"
                    sx={{ mb: 1, fontWeight: 600 }}
                  >
                    Courses Included:
                  </Typography>
                  <Stack spacing={0.5}>
                    {getSelectedCourseNames(item.courseIds).map(
                      (courseName, index) => (
                        <Chip
                          key={index}
                          label={courseName}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: "0.75rem" }}
                        />
                      )
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingItem ? "Edit Group Pricing" : "Add Group Pricing"}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Course Level</InputLabel>
              <Select
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
                label="Course Level"
              >
                {courseLevels.map((level) => (
                  <MenuItem key={level.value} value={level.value}>
                    {level.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Select Courses</InputLabel>
              <Select
                multiple
                value={formData.courseIds}
                onChange={(e) =>
                  setFormData({ ...formData, courseIds: e.target.value })
                }
                label="Select Courses"
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => {
                      const course = courses.find((c) => c._id === value);
                      return (
                        <Chip
                          key={value}
                          label={course?.title || "Unknown"}
                          size="small"
                        />
                      );
                    })}
                  </Box>
                )}
              >
                {formData.level &&
                  getCoursesForLevel(formData.level).map((course) => (
                    <MenuItem key={course._id} value={course._id}>
                      {course.title}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Group Price (₹)"
              type="number"
              value={formData.groupPrice}
              onChange={(e) =>
                setFormData({ ...formData, groupPrice: e.target.value })
              }
              required
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              fullWidth
              label="Description (Optional)"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe this group pricing package..."
            />

            <Box>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
                Group Pricing Image (Optional)
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ marginBottom: 16 }}
              />
              {imagePreview && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Image Preview:
                  </Typography>
                  <img
                    src={imagePreview}
                    alt="Group Pricing Preview"
                    style={{
                      maxWidth: "200px",
                      maxHeight: "150px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                    }}
                  />
                </Box>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            startIcon={<CancelIcon />}
            sx={{ color: "#666" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              background: "linear-gradient(135deg, #1976d2 0%, #1565c0 100%)",
            }}
          >
            {editingItem ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupPricingTab;
