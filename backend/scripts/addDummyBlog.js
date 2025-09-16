import mongoose from "mongoose";
import Blog from "../models/Blogs.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/iicpas";

async function addDummyBlog() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Sample blog data
    const dummyBlog = new Blog({
      title: "Complete Guide to ERP Development: Building Modern Business Solutions",
      author: "Anil Kumar",
      content: `
        <h2>Introduction to ERP Development</h2>
        <p>Enterprise Resource Planning (ERP) systems are comprehensive business management software that integrate various business processes into a unified system. In today's competitive business environment, having a robust ERP solution is crucial for operational efficiency.</p>
        
        <h3>Key Benefits of ERP Systems</h3>
        <ul>
          <li><strong>Streamlined Operations:</strong> ERP systems eliminate data silos and provide a single source of truth for all business data.</li>
          <li><strong>Improved Decision Making:</strong> Real-time analytics and reporting capabilities enable better business decisions.</li>
          <li><strong>Cost Reduction:</strong> Automation of routine tasks reduces operational costs significantly.</li>
          <li><strong>Enhanced Collaboration:</strong> Integrated modules improve communication between departments.</li>
        </ul>
        
        <h3>Modern ERP Development Technologies</h3>
        <p>Today's ERP systems leverage cutting-edge technologies including:</p>
        <ul>
          <li>Cloud Computing and SaaS platforms</li>
          <li>Artificial Intelligence and Machine Learning</li>
          <li>Mobile-first responsive design</li>
          <li>API-first architecture</li>
          <li>Microservices architecture</li>
        </ul>
        
        <h3>Best Practices for ERP Implementation</h3>
        <p>Successful ERP implementation requires careful planning and execution. Here are some key best practices:</p>
        <ol>
          <li><strong>Requirements Analysis:</strong> Thoroughly analyze business requirements before selecting or developing an ERP solution.</li>
          <li><strong>User Training:</strong> Invest in comprehensive training programs for all users.</li>
          <li><strong>Data Migration:</strong> Plan and execute data migration carefully to avoid data loss.</li>
          <li><strong>Change Management:</strong> Implement proper change management strategies to ensure smooth transition.</li>
        </ol>
        
        <h3>Future of ERP Development</h3>
        <p>The future of ERP development is exciting, with emerging trends including:</p>
        <ul>
          <li>AI-powered predictive analytics</li>
          <li>Internet of Things (IoT) integration</li>
          <li>Blockchain for secure transactions</li>
          <li>Voice-activated interfaces</li>
          <li>Augmented Reality for maintenance and training</li>
        </ul>
        
        <p>As businesses continue to evolve, ERP systems will play an increasingly important role in driving digital transformation and operational excellence.</p>
      `,
      imageUrl: "/images/accounting.webp", // Using existing image from your public folder
      status: "active"
    });

    // Save the blog
    await dummyBlog.save();
    console.log("✅ Dummy blog added successfully!");
    console.log("Blog ID:", dummyBlog._id);
    console.log("Title:", dummyBlog.title);
    console.log("Author:", dummyBlog.author);
    console.log("Status:", dummyBlog.status);

    // Add a few more sample blogs for better testing
    const additionalBlogs = [
      {
        title: "Digital Transformation in Education: The Future of Learning",
        author: "Priya Sharma",
        content: `
          <h2>Embracing Digital Learning</h2>
          <p>The education sector is undergoing a massive digital transformation. From online classrooms to AI-powered learning assistants, technology is revolutionizing how we learn and teach.</p>
          
          <h3>Key Technologies Shaping Education</h3>
          <ul>
            <li>Virtual Reality (VR) for immersive learning experiences</li>
            <li>Artificial Intelligence for personalized learning paths</li>
            <li>Cloud-based learning management systems</li>
            <li>Mobile learning applications</li>
            <li>Blockchain for secure credential verification</li>
          </ul>
          
          <p>The future of education is digital, and institutions that adapt quickly will thrive in this new landscape.</p>
        `,
        imageUrl: "/images/university.png",
        status: "active"
      },
      {
        title: "Building Scalable Web Applications with Modern Frameworks",
        author: "Rajesh Patel",
        content: `
          <h2>Modern Web Development</h2>
          <p>Building scalable web applications requires careful consideration of architecture, performance, and user experience. Modern frameworks provide powerful tools to create robust applications.</p>
          
          <h3>Popular Frameworks and Their Benefits</h3>
          <ul>
            <li><strong>React:</strong> Component-based architecture with virtual DOM</li>
            <li><strong>Vue.js:</strong> Progressive framework with excellent developer experience</li>
            <li><strong>Angular:</strong> Full-featured framework with TypeScript support</li>
            <li><strong>Next.js:</strong> React framework with server-side rendering</li>
          </ul>
          
          <p>Choosing the right framework depends on your project requirements, team expertise, and long-term goals.</p>
        `,
        imageUrl: "/images/course.png",
        status: "active"
      },
      {
        title: "Data Analytics and Business Intelligence: Driving Smart Decisions",
        author: "Sneha Gupta",
        content: `
          <h2>The Power of Data Analytics</h2>
          <p>In today's data-driven world, businesses that leverage analytics effectively gain significant competitive advantages. Data analytics helps organizations make informed decisions based on real insights.</p>
          
          <h3>Types of Data Analytics</h3>
          <ul>
            <li><strong>Descriptive Analytics:</strong> Understanding what happened in the past</li>
            <li><strong>Diagnostic Analytics:</strong> Understanding why something happened</li>
            <li><strong>Predictive Analytics:</strong> Forecasting future trends</li>
            <li><strong>Prescriptive Analytics:</strong> Recommending actions to take</li>
          </ul>
          
          <p>Implementing a comprehensive analytics strategy is essential for modern business success.</p>
        `,
        imageUrl: "/images/vr-student.jpg",
        status: "active"
      }
    ];

    for (const blogData of additionalBlogs) {
      const blog = new Blog(blogData);
      await blog.save();
      console.log(`✅ Added blog: ${blog.title}`);
    }

    console.log("\n🎉 All dummy blogs added successfully!");
    console.log("You can now check your blog section to see the modern cards in action!");

  } catch (error) {
    console.error("❌ Error adding dummy blog:", error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("Database connection closed");
  }
}

// Run the function
addDummyBlog();
