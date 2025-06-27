import React, { useState, useEffect } from "react";
import axios from "axios";

import Carousel from "../../../components/carousel/Carousel";
import ContentWrapper from "../../../components/contentWrapper/ContentWrapper";
import SwitchTabs from "../../../components/switchTabs/SwitchTabs";
import DemoCarausel from "../../../components/carousel/DemoCarousel";

const Trending = () => {
    const [endpoint, setEndpoint] = useState("day");
    const [data, setData] = useState(null);
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
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${apiBaseUrl}/projects`);
                console.log("data is", res.data);
                const shuffledData = shuffleArray(res.data);
                setData(shuffledData);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiBaseUrl]);

    const onTabChange = (tab) => {
        setEndpoint(tab === "Day" ? "day" : "week");
    };

    return (
        <div className="carouselSection">
            <ContentWrapper>
                <span className="carouselTitle">Trending</span>
                <SwitchTabs data={["Day", "Week"]} onTabChange={onTabChange} />
            </ContentWrapper>

            <DemoCarausel data={data} loading={loading} />
        </div>
    );
};

export default Trending;
