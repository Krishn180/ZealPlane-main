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
const gamificationRoutes = require("./routes/gamificationRoutes");
const newsletterRoutes = require("./routes/newsletterRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const uploadRoute = require("./routes/uploadRoutes");



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
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
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
app.use("/api/gamification", gamificationRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/upload", uploadRoute);

// Error handler
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port} in ${process.env.NODE_ENV || "development"} mode`);
});
