import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("dist")); // Serve static files from the build directory

// MongoDB Connection
// Replace 'mongodb://localhost:27017/portfolio' with your actual connection string
const mongoURI = "mongodb://localhost:27017/portfolio";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Blog Schema
const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Blog = mongoose.model("Blog", blogSchema);

// Routes

// GET /api/blogs - Fetch all blogs
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// POST /api/blogs - Create a new blog (Protected)
app.post("/api/blogs", async (req, res) => {
  const { title, content, key } = req.body;

  // Security Verification
  if (key !== "13822004") {
    return res.status(403).json({ error: "Access Denied: Invalid Key" });
  }

  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const newBlog = new Blog({ title, content });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ error: "Failed to create blog post" });
  }
});
// GET /api/blogs/:id - Fetch single blog
app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

// DELETE /api/blogs/:id - Delete a blog (Protected)
app.delete("/api/blogs/:id", async (req, res) => {
  const { key } = req.body;
  if (key !== "13822004") return res.status(403).json({ error: "Access Denied" });

  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

// PUT /api/blogs/:id - Update a blog (Protected)
app.put("/api/blogs/:id", async (req, res) => {
  const { title, content, key } = req.body;
  if (key !== "13822004") return res.status(403).json({ error: "Access Denied" });

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true }
    );
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: "Failed to update blog" });
  }
});
// POST /api/contact - Send an email
app.post("/api/contact", async (req, res) => {
  const { name, message } = req.body;
  console.log("Received contact request.");

  if (!name || !message) {
    return res.status(400).json({ error: "Name and message are required" });
  }

  const user = process.env.EMAIL_USER || "soheil1382@gmail.com";
  const pass = process.env.EMAIL_PASS;

  console.log(`Attempting to send email via user: ${user}`);
  if (!pass) {
    console.error("Error: EMAIL_PASS is missing in environment variables.");
    return res.status(500).json({ error: "Server configuration error: Missing email password." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user,
      pass: pass,
    },
  });

  const mailOptions = {
    from: `Portfolio Contact <${user}>`,
    to: "soheil1382@gmail.com",
    subject: `[Portfolio] Message from ${name}`,
    text: `You have received a new message.\n\nSender: ${name}\n\nMessage:\n${message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ error: "Failed to send email. Check server logs." });
  }
});

// Serve index.html for any other route (SPA support)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
