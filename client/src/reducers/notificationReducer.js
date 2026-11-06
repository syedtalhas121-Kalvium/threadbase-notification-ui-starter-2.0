export const initialState = {
  notifications: [],
  unreadCount: 0,
};

export function notificationReducer(state, action) {
  switch (action.type) {
    case "ADD_NOTIFICATION": {
      const notification = action.payload;
      if (!notification) return state;
      if (state.notifications.some((item) => item.id === notification.id)) return state;
      return {
        ...state,
        notifications: [notification, ...state.notifications].slice(0, 50),
        unreadCount: state.unreadCount + (notification.isRead ? 0 : 1),
      };
    }
    case "MARK_READ": {
      const id = action.payload;
      const target = state.notifications.find((item) => item.id === id);
      if (!target || target.isRead) return state;
      return {
        ...state,
        notifications: state.notifications.map((item) =>
          item.id === id ? { ...item, isRead: true } : item
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    }
    case "MARK_ALL_READ":
      return {
        ...state,
        notifications: state.notifications.map((item) => ({ ...item, isRead: true })),
        unreadCount: 0,
      };
    case "LOAD_NOTIFICATIONS": {
      const notifications = Array.isArray(action.payload) ? action.payload : [];
      return {
        ...state,
        notifications,
        unreadCount: notifications.filter((item) => !item.isRead).length,
      };
    }
    default:
      return state;
  }
}
