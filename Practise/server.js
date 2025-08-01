const express = require("express");
const dotenv = require("dotenv").config();
const contactsRoutes = require("./contactsRoutes");
const userRoutes = require("./userRoutes");
const errorHandler = require("./midleware/errorhandler");
const connectDb = require("./config/dbConnection");
const projectRoutes = require("./routes/projectRoutes");
const commentRouter = require("./routes/commentRoutes");
const likeRouter = require("./routes/likeRoutes");
const forumPost = require("./routes/postRoutes");
const notification = require("./routes/notificationRoutes");
const refreshToken = require("./routes/refreshTokenRoutes");
const productroutes = require("./routes/e-commerce routes/productroutes");
const sitemapRoutes = require("./sitemapRoutes"); // ✅ Only this
const newsRoutes = require("./routes/newsRoutes");

// Connect to the database
connectDb();

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const cors = require("cors");

app.use(
  cors({
    origin: [
      "https://comicplane.site",
      "http://localhost:5173",
      "http://comicplane.site",
      "https://www.comicplane.site",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Ensure OPTIONS request is handled properly
app.options("*", cors());

const port = process.env.PORT || 5000;

// ✅ Place sitemap route ABOVE any frontend catch-all
app.use("/", sitemapRoutes);

// API Routes
app.use("/api/contacts", contactsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productroutes);
app.use("/api/projects", projectRoutes);
app.use("/api/comments", commentRouter);
app.use("/api/like", likeRouter);
app.use("/api/posts", forumPost);
app.use("/api/notification", notification);
app.use("/api/refresh-token", refreshToken);
app.use("/api/news", newsRoutes);

// Error handler
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port} in ${process.env.NODE_ENV || "development"} mode`);
});
