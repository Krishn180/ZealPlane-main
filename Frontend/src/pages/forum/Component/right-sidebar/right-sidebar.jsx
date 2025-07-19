import React from "react";
import "./right-sidebar.scss";

const CuratedSidebar = () => {
  // Example curated content (you can replace this with dynamic data)
  const curatedPosts = [
    { title: "DC vs Marvel: Which Universe Reigns Supreme?", link: "#" },
    { title: "Superman vs Goku: Who Would Win?", link: "#" },
    { title: "Top 10 Most Powerful Superheroes of All Time", link: "#" },
    { title: "Is Batman Really Prepared for Anything?", link: "#" },
    { title: "The Best Villains from DC and Marvel", link: "#" },
  ];

  return (
    <div className="curated-sidebar-container">
      <h3>Curated Posts & Projects</h3>
      <ul>
        {curatedPosts.map((post, index) => (
          <li key={index} className="curated-post-item">
            <a href={post.link}>{post.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CuratedSidebar;
