import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001"],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Mock testimonials data
const mockTestimonials = [
  {
    _id: "1",
    name: "Rajiv Ranjan",
    designation: "Student",
    message: "IICPA Institute transformed my career completely. The courses are comprehensive and the instructors are experts in their field. Highly recommended!",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    status: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "2", 
    name: "Sneha Kapoor",
    designation: "HR Manager",
    message: "The learning experience at IICPA is exceptional. The practical approach and real-world examples made complex concepts easy to understand.",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    status: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: "3",
    name: "Michael Scott", 
    designation: "Marketing Head",
    message: "IICPA helped me master accounting and finance skills that directly improved my job performance. The support team is amazing!",
    image: "https://randomuser.me/api/portraits/men/78.jpg",
    status: false,
    createdAt: new Date().toISOString()
  }
];

// Routes
app.get("/api/testimonials/approved", (req, res) => {
  const approvedTestimonials = mockTestimonials.filter(t => t.status === true);
  res.json(approvedTestimonials);
});

app.get("/api/testimonials", (req, res) => {
  res.json(mockTestimonials);
});

app.post("/api/testimonials/submit", (req, res) => {
  const { name, designation, message, image } = req.body;
  
  const newTestimonial = {
    _id: Date.now().toString(),
    name,
    designation,
    message,
    image: image || "",
    status: false,
    createdAt: new Date().toISOString()
  };
  
  mockTestimonials.push(newTestimonial);
  res.status(201).json({ message: "Testimonial submitted successfully", testimonial: newTestimonial });
});

app.get("/api/testimonials/student", (req, res) => {
  // Mock student testimonials - in real app this would filter by student ID
  const studentTestimonials = mockTestimonials.filter(t => t.name === "Rajiv Ranjan");
  res.json(studentTestimonials);
});

app.patch("/api/testimonials/approve/:id", (req, res) => {
  const { id } = req.params;
  const testimonial = mockTestimonials.find(t => t._id === id);
  
  if (!testimonial) {
    return res.status(404).json({ error: "Testimonial not found" });
  }
  
  testimonial.status = true;
  res.json({ message: "Testimonial approved successfully", testimonial });
});

app.patch("/api/testimonials/reject/:id", (req, res) => {
  const { id } = req.params;
  const testimonial = mockTestimonials.find(t => t._id === id);
  
  if (!testimonial) {
    return res.status(404).json({ error: "Testimonial not found" });
  }
  
  testimonial.status = false;
  res.json({ message: "Testimonial rejected successfully", testimonial });
});

app.delete("/api/testimonials/:id", (req, res) => {
  const { id } = req.params;
  const index = mockTestimonials.findIndex(t => t._id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: "Testimonial not found" });
  }
  
  mockTestimonials.splice(index, 1);
  res.json({ message: "Testimonial deleted successfully" });
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Testimonial API is running" });
});

app.listen(PORT, () => {
  console.log(`🚀 Testimonial API Server running on port ${PORT}`);
  console.log(`📝 Available endpoints:`);
  console.log(`   GET  /api/testimonials/approved`);
  console.log(`   GET  /api/testimonials`);
  console.log(`   POST /api/testimonials/submit`);
  console.log(`   GET  /api/testimonials/student`);
  console.log(`   PATCH /api/testimonials/approve/:id`);
  console.log(`   PATCH /api/testimonials/reject/:id`);
  console.log(`   DELETE /api/testimonials/:id`);
});
