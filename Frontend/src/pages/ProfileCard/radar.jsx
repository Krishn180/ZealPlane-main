import React, { useEffect, useState } from 'react';
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

// 🔴 Glow plugin for red center
const glowPlugin = {
  id: 'glowBackground',
  beforeDraw: (chart) => {
    const { ctx, chartArea } = chart;
    const { left, top, width, height } = chartArea;
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const radius = Math.min(width, height) / 2;

    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(255, 0, 0, 0.5)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = gradient;
    ctx.fillRect(left, top, width, height);
    ctx.restore();
  }
};

ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
  glowPlugin
);

export default function RadarChartExample() {
  const [datasetValues, setDatasetValues] = useState([0, 0, 0, 0, 0]);
  const { id } = useParams();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get(`${apiBaseUrl}/users/${id}`);
        console.log("fetched user data for radar chart", res.data);
        
        const { totalLikes = 0, totalViews = 0 } = res.data.user;

        let popularity = 0;
        let recognition = 0;
        let monetary = 0;
        let connections = 0;
        let grind = 0;

        if (totalLikes < 50 && totalViews < 100) {
          // Level 1 (Beginner)
          popularity = 10;
          recognition = 15;
          monetary = 5;
          connections = 20;
          grind = 25;
        } else {
          // Level based on data (Example: Normalization)
          popularity = Math.min((totalLikes / 100) * 100, 100);
          recognition = Math.min((totalViews / 200) * 100, 100);
          monetary = Math.min((totalViews / 300) * 100, 100);
          connections = Math.min((totalLikes / 80) * 100, 100);
          grind = Math.min((totalViews / 150) * 100, 100);
        }

        setDatasetValues([
          Math.round(popularity),
          Math.round(recognition),
          Math.round(monetary),
          Math.round(connections),
          Math.round(grind)
        ]);
      } catch (err) {
        console.error('Failed to fetch user stats:', err);
      }
    };
    fetchStats();
  }, [id]);

  const data = {
    labels: ['Visibility', 'Recognition', 'Sustainibility', 'Connections', 'Momentum'],
    datasets: [{
      label: 'User Stats',
      data: datasetValues,
      backgroundColor: 'rgba(255, 50, 50, 0.3)',
      borderColor: 'rgba(255, 0, 0, 1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(255, 255, 255, 1)',
      pointBorderColor: 'rgba(255, 0, 0, 1)',
      pointRadius: 5,
      pointHoverRadius: 7,
    }]
  };

  const options = {
    responsive: true,
    elements: {
      line: {
        borderJoinStyle: 'round'
      }
    },
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 0, 0, 0.2)',
          lineWidth: 1.5
        },
        grid: {
          color: 'rgba(255, 0, 0, 0.05)',
        },
        pointLabels: {
          font: {
            size: 13,
            weight: '600',
            family: "'Orbitron', sans-serif",
          },
          color: 'rgba(255, 255, 255, 0.8)',
        },
        ticks: {
          display: false
        },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#111',
        titleColor: '#FF3333',
        bodyColor: '#fff',
        borderColor: '#FF3333',
        borderWidth: 1,
        titleFont: {
          family: "'Orbitron', sans-serif",
          size: 16,
          weight: '700',
        },
        bodyFont: {
          family: "'Orbitron', sans-serif",
          size: 14,
          weight: '600',
        },
      }
    }
  };

  return (
    <div className="radar-chart-container">
      <Radar data={data} options={options} />
    </div>
  );
}
