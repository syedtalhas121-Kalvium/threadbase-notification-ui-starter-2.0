import { useState } from "react";
import { useNotifications } from "../context/NotificationContext.jsx";
import apiClient from "../services/apiClient.js";
import NotificationItem from "./NotificationItem.jsx";

export default function NotificationDropdown({ onClose }) {
  const { state, dispatch } = useNotifications();
  const [markAllError, setMarkAllError] = useState("");
  const [markingAll, setMarkingAll] = useState(false);

  async function markAllAsRead() {
    const unread = state.notifications.filter((item) => !item.isRead);
    if (unread.length === 0 || markingAll) return;
    const previousNotifications = state.notifications;
    setMarkAllError("");
    setMarkingAll(true);
    dispatch({ type: "MARK_ALL_READ" });
    try {
      await Promise.all(unread.map((item) =>
        apiClient.patch(`/api/notifications/${encodeURIComponent(item.id)}/read`)
      ));
    } catch (error) {
      dispatch({ type: "LOAD_NOTIFICATIONS", payload: previousNotifications });
      setMarkAllError("Some notifications couldn't be updated. Please try again.");
      console.error("[NotificationDropdown] mark-all failed:", error);
    } finally {
      setMarkingAll(false);
    }
  }

  return (
    <section role="dialog" aria-label="Notifications" style={{
      position: "absolute", top: "calc(100% + 0.75rem)", right: 0, zIndex: 20,
      width: "min(360px, calc(100vw - 2rem))", maxHeight: "min(480px, calc(100vh - 6rem))",
      overflow: "hidden", display: "flex", flexDirection: "column", background: "#fff",
      color: "#1e293b", border: "1px solid #e2e8f0", borderRadius: 12,
      boxShadow: "0 12px 32px rgba(15, 23, 42, 0.2)",
    }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "0.75rem", padding: "0.9rem 1rem", borderBottom: "1px solid #e2e8f0" }}>
        <strong style={{ fontSize: "0.95rem" }}>Notifications</strong>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
          <button type="button" onClick={markAllAsRead}
            disabled={state.unreadCount === 0 || markingAll}
            style={{ padding: 0, border: 0, background: "none",
              color: state.unreadCount === 0 ? "#94a3b8" : "#4f46e5",
              fontSize: "0.75rem", fontWeight: 600,
              cursor: state.unreadCount === 0 ? "default" : "pointer" }}>
            {markingAll ? "Marking…" : "Mark all read"}
          </button>
          <button type="button" onClick={onClose} aria-label="Close notifications"
            style={{ border: 0, background: "none", color: "#64748b",
              cursor: "pointer", fontSize: "1.1rem", lineHeight: 1 }}>×</button>
        </div>
      </header>
      {markAllError && <p role="alert" style={{ margin: 0, padding: "0.65rem 1rem",
        color: "#dc2626", fontSize: "0.75rem" }}>{markAllError}</p>}
      <ul style={{ margin: 0, padding: 0, overflowY: "auto" }}>
        {state.notifications.length === 0 ? (
          <li style={{ listStyle: "none", padding: "2rem 1rem", textAlign: "center",
            color: "#64748b", fontSize: "0.85rem" }}>You're all caught up. No notifications yet.</li>
        ) : state.notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </ul>
    </section>
  );
}
