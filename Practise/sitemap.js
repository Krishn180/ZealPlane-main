import express from "express";
import Project from "./models/projectModel.js"; // Your comics/projects collection
import User from "./models/userModel.js";       // For user profiles
import Post from "./models/Post.js";           // Forum posts

const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
  const baseUrl = "https://comicplane.site";

  try {
    // Fetch dynamic data from database
    const projects = await Project.find();
    const users = await User.find();
    const posts = await Post.find();

    // Start XML
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // 1. Add Static Pages
    const staticPages = [
      { url: "/", priority: 1.0 },
      { url: "/home", priority: 0.9 },
      { url: "/forum", priority: 0.9 },
      { url: "/register", priority: 0.7 }
    ];

    staticPages.forEach((page) => {
      xml += `
        <url>
          <loc>${baseUrl}${page.url}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <priority>${page.priority}</priority>
        </url>
      `;
    });

    // 2. Add User Profiles
    users.forEach((user) => {
      xml += `
        <url>
          <loc>${baseUrl}/profile/${user._id}</loc>
          <lastmod>${new Date(user.updatedAt || user.createdAt).toISOString()}</lastmod>
          <priority>0.6</priority>
        </url>
      `;
    });

    // 3. Add Project/Comic Pages
    projects.forEach((project) => {
      xml += `
        <url>
          <loc>${baseUrl}/details/${project._id}</loc>
          <lastmod>${new Date(project.updatedAt || project.createdAt).toISOString()}</lastmod>
          <priority>0.8</priority>
        </url>
      `;
    });

    // 4. Add Forum Posts
    posts.forEach((post) => {
      xml += `
        <url>
          <loc>${baseUrl}/post/${post._id}</loc>
          <lastmod>${new Date(post.updatedAt || post.createdAt).toISOString()}</lastmod>
          <priority>0.7</priority>
        </url>
      `;
    });

    xml += `</urlset>`;

    // Send XML
    res.header("Content-Type", "application/xml");
    res.send(xml);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating sitemap");
  }
});

export default router;
