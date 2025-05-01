import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
} from 'chart.js';
import './RadarChart.scss';
import axiosInstance from '../../Auth/Axios';
import { useParams } from 'react-router-dom';


ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler
);

export default function RadarChartExample() {
  const [popularity, setPopularity] = useState(0);
  const { id } = useParams();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  console.log("userId fetched from useparams are", id);
  

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const res = await axiosInstance.get(`${apiBaseUrl}/users/${id}`);
        console.log("total number of likes recieved for user", res.data);
        
        const likes = res.data.user.totalLikes;
        console.log("total likes are", likes);
        
        // Normalize popularity value (e.g., max out at 100)
        const normalized = Math.min((likes / 100) * 100, 100); // Adjust scale as needed
        setPopularity(normalized);
      } catch (err) {
        console.error('Failed to fetch total likes:', err);
      }
    };

    fetchLikes();
  }, [id]);

  const data = {
    labels: ['Popularity', 'Recognition', 'Monetary', 'Connections', 'Grind'],
    datasets: [{
      label: 'User Stats',
      data: [popularity, 60, 50, 40, 90],
      backgroundColor: 'rgba(255, 215, 0, 0.3)',
      borderColor: 'rgba(255, 215, 0, 1)',
      pointBackgroundColor: 'rgba(255, 0, 0, 1)',
      pointBorderColor: 'rgba(255, 0, 0, 1)',
      pointHoverRadius: 6,
      pointRadius: 4,
    }]
  };

  const options = {
    responsive: true,
    onClick: (event, elements) => {
      if (elements && elements.length > 0) {
        const clickedLabel = data.labels[elements[0].index];
        console.log(`Clicked on label: ${clickedLabel}`);
      }
    },
    elements: {
      line: {
        borderWidth: 2,
      },
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        pointLabels: {
          font: {
            size: 14,
            weight: '600',
            family: "'Orbitron', sans-serif"
          },
          color: '#FFD700',
        },
        ticks: {
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 100
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#111',
        titleColor: '#FFD700',
        bodyColor: '#fff',
        borderColor: '#FFD700',
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="radar-chart-container">
      <Radar data={data} options={options} />
    </div>
  );
}
