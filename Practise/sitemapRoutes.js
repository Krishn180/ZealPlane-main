const express = require("express");
const Project = require("./models/projectModel");
const User = require("./models/userModel");

const router = express.Router();

router.get("/sitemap.xml", async (req, res) => {
  const baseUrl = "https://comicplane.site";

  try {
    const projects = await Project.find();
    const users = await User.find();

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

    // User profiles
    users.forEach((user) => {
      const date = user.updatedAt || user.createdAt;
      if (date) {
        xml += `
          <url>
            <loc>${baseUrl}/profile/${user._id}</loc>
            <lastmod>${new Date(date).toISOString()}</lastmod>
            <priority>0.6</priority>
          </url>`;
      }
    });

    // Projects
    projects.forEach((project) => {
      const date = project.updatedAt || project.createdAt;
      if (date) {
        xml += `
          <url>
            <loc>${baseUrl}/details/${project._id}</loc>
            <lastmod>${new Date(date).toISOString()}</lastmod>
            <priority>0.8</priority>
          </url>`;
      }
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
