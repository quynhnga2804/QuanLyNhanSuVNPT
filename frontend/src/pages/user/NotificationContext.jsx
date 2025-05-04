import { createContext, useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";
export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const token = localStorage.getItem('token');

  const fetchNotifications = async (onlyUnread = false) => {
    try {
      const response = await axiosClient.get(
        `/user/notifications?onlyUnread=${onlyUnread}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
    } catch (err) {
      console.error("Lỗi khi lấy thông báo:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications();
    }
  }, [token]);

  return (
    <NotificationContext.Provider
      value={{ notifications, setNotifications, unreadCount, fetchNotifications, refreshNotifications: fetchNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
