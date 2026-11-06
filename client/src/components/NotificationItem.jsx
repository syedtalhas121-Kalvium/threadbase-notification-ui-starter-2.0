import { useState } from "react";
import { useNotifications } from "../context/NotificationContext.jsx";
import apiClient from "../services/apiClient.js";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export default function NotificationItem({ notification }) {
  const { state, dispatch } = useNotifications();
  const [error, setError] = useState("");

  async function markAsRead() {
    if (notification.isRead) return;
    const previousNotifications = state.notifications;
    setError("");
    dispatch({ type: "MARK_READ", payload: notification.id });
    try {
      await apiClient.patch(
        `/api/notifications/${encodeURIComponent(notification.id)}/read`
      );
    } catch (requestError) {
      dispatch({ type: "LOAD_NOTIFICATIONS", payload: previousNotifications });
      setError("Couldn't mark this notification as read. Please try again.");
      console.error("[NotificationItem] mark-read failed:", requestError);
    }
  }

  return (
    <li style={{ listStyle: "none", borderBottom: "1px solid #e2e8f0",
      background: notification.isRead ? "#fff" : "#eef2ff" }}>
      <button type="button" onClick={markAsRead} disabled={notification.isRead}
        aria-label={notification.isRead ? notification.message : `Mark as read: ${notification.message}`}
        style={{ display: "block", width: "100%", padding: "0.85rem 1rem", border: 0,
          textAlign: "left", background: "transparent", color: "#1e293b",
          cursor: notification.isRead ? "default" : "pointer" }}>
        <span style={{ display: "flex", alignItems: "flex-start", gap: "0.55rem" }}>
          {!notification.isRead && <span aria-label="Unread" style={{
            flex: "0 0 8px", width: 8, height: 8, marginTop: 6, borderRadius: "50%",
            background: "#4f46e5",
          }} />}
          <span style={{ minWidth: 0, flex: 1 }}>
            <span style={{ display: "block", fontSize: "0.88rem", lineHeight: 1.45 }}>
              {notification.message}
            </span>
            <span style={{ display: "block", marginTop: "0.3rem", color: "#64748b", fontSize: "0.72rem" }}>
              {formatDate(notification.createdAt)}
            </span>
            {error && <span role="alert" style={{ display: "block", marginTop: "0.35rem",
              color: "#dc2626", fontSize: "0.75rem" }}>{error}</span>}
          </span>
        </span>
      </button>
    </li>
  );
}
