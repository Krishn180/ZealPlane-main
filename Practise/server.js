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
      'https://www.comicplane.site'
    ], // Allow frontend origins
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allow these HTTP methods
    credentials: true, // Allow cookies and authentication
    allowedHeaders: ["Content-Type", "Authorization"], // Allow headers that might be included in the request
  })
);

// ✅ Ensure OPTIONS request is handled properly
app.options("*", cors());

const port = process.env.PORT || 5000; // Default to 5000 if no PORT environment variable is set

// Route middlewares
app.use("/api/contacts", contactsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productroutes);
app.use("/api/projects", projectRoutes);
app.use("/api/comments", commentRouter);
app.use("/api/like", likeRouter);
app.use("/api/posts", forumPost);
app.use("/api/notification", notification);
app.use("/api/refresh-token", refreshToken);
app.use(errorHandler);

// Start the Express server
app.listen(port, () => {
  console.log(
    `Server is running on port ${port} in ${
      process.env.NODE_ENV || "development"
    } mode`
  );
});
