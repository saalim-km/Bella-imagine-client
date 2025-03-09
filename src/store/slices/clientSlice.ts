import { createSlice } from "@reduxjs/toolkit";

interface Client {
    _id : string;
    name : string;
    email : string;
    role : string;
}

interface ClientState {
    client : Client | null
}

const initialState : ClientState = {
    client : JSON.parse(localStorage.getItem("clientSession") || "null")
}

const clientSlice = createSlice({
    name : "client",
    initialState : initialState,
    reducers : {
        clientLogin : (state ,action) => {
            state.client = action.payload;
            localStorage.setItem("clientSession" , JSON.stringify(action.payload));
        },
        clientLogout : (state)=> {
            state.client = null;
            localStorage.removeItem("clientSession");
        }
    }
})

const {clientLogin , clientLogout} = clientSlice.actions



export {
    clientLogin , 
    clientLogout
}

export default clientSlice.reducer