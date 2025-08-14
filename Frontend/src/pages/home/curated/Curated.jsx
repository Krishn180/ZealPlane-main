import React, { useState, useEffect } from "react";
import axios from "axios";

import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";
import CarouselUser from "../../../components/carousel/CarouselUser";

const Curated = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${apiBaseUrl}/news`);
        const shuffledData = shuffleArray(res.data);
        console.log("Fetched news:", res.data);
        setData(shuffledData);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [apiBaseUrl]);

  const onTabChange = (tab) => {
    console.log(`Switched to ${tab}`);
    // Optional: implement category-specific API calls here if needed
  };

  return (
    <div className="carouselSection">
      <ContentWrapper>
        <span className="carouselTitle">Top News of the Week</span>
      </ContentWrapper>
      <CarouselUser data={data} loading={loading} />
    </div>
  );
};

export default Curated;
