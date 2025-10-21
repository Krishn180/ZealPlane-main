import React, { useEffect, useState, useRef } from "react";
import { FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NotificationBell.scss";

const HeaderNotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.get(`${apiBaseUrl}/notification`, { headers });
      setNotifications(res.data);
      setUnreadCount(res.data.filter((n) => !n.isRead).length);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 11000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (notificationId, projectId) => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.patch(
        `${apiBaseUrl}/notification/${notificationId}/read`,
        {},
        { headers }
      );

      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));

      navigate(`/details/${projectId}`);
      setDropdownOpen(false);
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const handleReadAll = async () => {
    try {
      setIsMarkingAllRead(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const unreadNotifications = notifications.filter((n) => !n.isRead);
      if (unreadNotifications.length === 0) {
        navigate("/home/notification");
        setDropdownOpen(false);
        return;
      }

      await Promise.all(
        unreadNotifications.map((notification) =>
          axios.patch(`${apiBaseUrl}/notification/${notification._id}/read`, {}, { headers })
        )
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);

      navigate("/home/notification");
      setDropdownOpen(false);
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      alert("Failed to mark all notifications as read. Please try again.");
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  // ✅ Updated onClick handler for bell button
  const handleBellClick = () => {
    const isMobile = window.innerWidth <= 768; // mobile threshold
    if (isMobile) {
      navigate("/home/notification");
    } else {
      setDropdownOpen(!dropdownOpen);
    }
  };

  return (
    <>
      <button
        onClick={handleBellClick}
        className="bell-button"
        ref={dropdownRef}
      >
        <FiBell size={24} />
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}

        {!window.matchMedia("(max-width: 768px)").matches && dropdownOpen && (
          <div className="dropdown-modal">
            {notifications.length === 0 ? (
              <div className="no-notifications">No notifications</div>
            ) : (
              <>
                <ul className="dropdown-list">
                  {notifications.map((n) => (
                    <li
                      key={n._id}
                      className={`dropdown-item ${!n.isRead ? "unread" : ""}`}
                      onClick={() =>
                        handleNotificationClick(n._id, n.projectId)
                      }
                    >
                      <div className="item-content">
                        <p>{n.message}</p>
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div
                  className={`read-more ${isMarkingAllRead ? "loading" : ""}`}
                  onClick={!isMarkingAllRead ? handleReadAll : undefined}
                  style={{
                    cursor: isMarkingAllRead ? "not-allowed" : "pointer",
                    opacity: isMarkingAllRead ? 0.6 : 1,
                  }}
                >
                  {isMarkingAllRead
                    ? "Marking as read..."
                    : "View all Notifications"}
                </div>
              </>
            )}
          </div>
        )}
      </button>
    </>
  );
};

export default HeaderNotificationBell;
