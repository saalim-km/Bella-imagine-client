import { createSlice } from "@reduxjs/toolkit";

interface Vendor {
    _id : string;
    name : string;
    email : string;
    role : string;
    avatar : string;
}

interface VendorState {
    vendor : Vendor | null
}

const initialState : VendorState = {
    vendor : JSON.parse(localStorage.getItem("vendorSession") || "null")
}

const vendorSlice = createSlice({
    name : "vendor",
    initialState : initialState,
    reducers : {
        vendorLogin : (state ,action) => {
            state.vendor = action.payload;
            localStorage.setItem("vendorSession" , JSON.stringify(action.payload));
        },
        vendorLogout : (state)=> {
            state.vendor = null;
            localStorage.removeItem("vendorSession");
        },
        updateVendorSlice : (state, action) => {
            if (state.vendor) {
                // Only update name and avatar fields
                if (action.payload.name !== undefined) {
                    state.vendor.name = action.payload.name;
                }
                if (action.payload.avatar !== undefined) {
                    state.vendor.avatar = action.payload.avatar;
                }
                // Update localStorage with the modified vendor data
                localStorage.setItem("vendorSession", JSON.stringify(state.vendor));
            }
        }
    }
})

const {vendorLogin , vendorLogout , updateVendorSlice} = vendorSlice.actions

export {
    vendorLogin , 
    vendorLogout,
    updateVendorSlice
}

export default vendorSlice.reducer