import { TNotification } from "@/components/common/Notification";
import { createSlice } from "@reduxjs/toolkit";


const initialState: TNotification[] = []

const notificationSlice = createSlice({
    name : "notification",
    initialState,
    reducers : {
        addNotification: (state, action) => {
            state.unshift(action.payload);
        },
        removeNotification: (state, action) => {
            return state.filter(notification => notification._id !== action.payload._id);
        },
        markAsRead: (state, action) => {
            const notification = state.find(notification => notification._id === action.payload._id);
            if (notification) {
                notification.isRead = true;
            }
        },
    }
})

export const {
    addNotification,
    removeNotification,
    markAsRead
} = notificationSlice.actions;

export default notificationSlice.reducer;