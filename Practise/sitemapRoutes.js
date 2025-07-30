const express = require("express");
const Project = require("./models/projectModel");
const User = require("./models/userModel");
const Post = require("./models/Post");

const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
  const baseUrl = "https://comicplane.site";

  try {
    const projects = await Project.find();
    const users = await User.find();
    const posts = await Post.find();

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

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
        </url>`;
    });

    users.forEach((user) => {
      xml += `
        <url>
          <loc>${baseUrl}/profile/${user._id}</loc>
          <lastmod>${new Date(user.updatedAt || user.createdAt).toISOString()}</lastmod>
          <priority>0.6</priority>
        </url>`;
    });

    projects.forEach((project) => {
      xml += `
        <url>
          <loc>${baseUrl}/details/${project._id}</loc>
          <lastmod>${new Date(project.updatedAt || project.createdAt).toISOString()}</lastmod>
          <priority>0.8</priority>
        </url>`;
    });

    posts.forEach((post) => {
      xml += `
        <url>
          <loc>${baseUrl}/post/${post._id}</loc>
          <lastmod>${new Date(post.updatedAt || post.createdAt).toISOString()}</lastmod>
          <priority>0.7</priority>
        </url>`;
    });

    xml += `</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error generating sitemap");
  }
});

module.exports = router;
