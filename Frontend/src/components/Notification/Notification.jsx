import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./NotificationPage.scss";
import Header from "../header/Header";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const location = useLocation();
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${apiBaseUrl}/notification`, { headers });
      setNotifications(res.data);
    } catch (err) {
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [location]);

  // Navigate to project when notification is clicked
  const handleNotificationClick = (projectId) => {
    if (projectId) {
      navigate(`/details/${projectId}`);
    }
  };

  return (
    <div className="notification-page">
      <Header />

      <main className="notification-list-container">
        {loading ? (
          <p className="info-text">Loading notifications...</p>
        ) : error ? (
          <p className="info-text error">{error}</p>
        ) : notifications.length === 0 ? (
          <p className="info-text">No notifications to show</p>
        ) : (
          <ul className="notification-list">
            {notifications.map((notification) => (
              <li
                key={notification._id}
                className="notification-item"
                onClick={() => handleNotificationClick(notification.projectId)}
              >
                <p>{notification.message}</p>
                <span className="timestamp">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default NotificationPage;
