import { createSlice } from "@reduxjs/toolkit";

interface Admin {
    _id: string;
    name: string;
    email: string;
    role: string;
}

interface AdminState {
    admin: Admin | null;
}

const initialState: AdminState = {
    admin: JSON.parse(localStorage.getItem("adminSession") || "null")
};

const adminSlice = createSlice({
    name: "admin",
    initialState: initialState,
    reducers: {
        adminLogin: (state, action) => {
            state.admin = action.payload;
            localStorage.setItem("adminSession", JSON.stringify(action.payload));
        },
        adminLogout: (state) => {
            state.admin = null;
            localStorage.removeItem("adminSession");
        }
    }
});

const { adminLogin, adminLogout } = adminSlice.actions;

export {
    adminLogin,
    adminLogout
};

export default adminSlice.reducer;

