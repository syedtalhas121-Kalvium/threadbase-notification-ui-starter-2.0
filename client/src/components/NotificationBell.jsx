import { useEffect, useRef, useState } from "react";
import { useNotifications } from "../context/NotificationContext.jsx";
import NotificationDropdown from "./NotificationDropdown.jsx";

export default function NotificationBell() {
  const { state } = useNotifications();
  const { unreadCount } = state;
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function handleMouseDown(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [open]);

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-label={`Notifications, ${unreadCount} unread`}
        aria-expanded={open}
        aria-haspopup="dialog"
        style={{ position: "relative", background: "none", border: "none", cursor: "pointer", fontSize: "1.3rem", color: "#fff", padding: "0.35rem" }}
      >
        🔔
        {unreadCount > 0 && (
          <span aria-hidden="true" style={{
            position: "absolute", top: "-2px", right: "-5px", minWidth: "18px", height: "18px",
            padding: "0 4px", display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxSizing: "border-box", borderRadius: "999px", background: "#ef4444", color: "#fff",
            fontSize: "0.68rem", fontWeight: 700, lineHeight: 1,
          }}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      {open && <NotificationDropdown onClose={() => setOpen(false)} />}
    </div>
  );
}
