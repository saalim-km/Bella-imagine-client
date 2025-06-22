import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TNotification } from "@/components/common/Notification";

interface NotificationState {
  notifications: TNotification[];
  total: number;
  page: number;
}

const initialState: NotificationState = {
  notifications: [],
  total: 0,
  page: 1,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<TNotification>) => {
      state.notifications.unshift(action.payload);
      state.total += 1;
    },
    removeNotification: (state, action: PayloadAction<{ _id: string }>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== action.payload._id
      );
      state.total -= 1;
    },
    markAsRead: (state, action: PayloadAction<{ _id: string }>) => {
      const notification = state.notifications.find(
        (notification) => notification._id === action.payload._id
      );
      if (notification) {
        notification.isRead = true;
      }
    },
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));
    },
    setNotifications: (
      state,
      action: PayloadAction<{
        notifications: TNotification[];
        total: number;
        page: number;
      }>
    ) => {
      state.notifications =
        action.payload.page === 1
          ? action.payload.notifications
          : [...state.notifications, ...action.payload.notifications];
      state.total = action.payload.total;
      state.page = action.payload.page;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
});

export const {
  addNotification,
  removeNotification,
  markAsRead,
  markAllAsRead,
  setNotifications,
  setPage,
} = notificationSlice.actions;

export default notificationSlice.reducer;