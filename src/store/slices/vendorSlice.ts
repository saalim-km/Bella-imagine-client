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
        }
    }
})

const {vendorLogin , vendorLogout} = vendorSlice.actions



export {
    vendorLogin , 
    vendorLogout
}

export default vendorSlice.reducer