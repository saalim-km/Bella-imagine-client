import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TNotification } from "@/components/common/Notification";

interface NotificationState {
  notifications: TNotification[];
  total: number;
  page: number;
  unReadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  total: 0,
  page: 1,
  unReadCount : 0
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<TNotification>) => {
      state.notifications.unshift(action.payload);
      state.total += 1;
      state.unReadCount += 1;
    },
    removeNotification: (state, action: PayloadAction<{ _id: string }>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification._id !== action.payload._id
      );
      state.total -= 1;
    },
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        isRead: true,
      }));
      state.unReadCount = 0
    },
    setNotifications: (
      state,
      action: PayloadAction<{
        notifications: TNotification[];
        total: number;
        page: number;
        unReadCount: number
      }>
    ) => {
      state.notifications = action.payload.notifications
      state.total = action.payload.total;
      state.page = action.payload.page;
      state.unReadCount = action.payload.unReadCount
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
});

export const {
  addNotification,
  removeNotification,
  markAllAsRead,
  setNotifications,
  setPage,
} = notificationSlice.actions;

export default notificationSlice.reducer;