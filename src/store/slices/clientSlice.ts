import { createSlice } from "@reduxjs/toolkit";

interface Client {
    _id : string;
    name : string;
    email : string;
    role : string;
    avatar : string;
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
        },
        updateClientslice : (state,action)=> {
            if(state.client) {
                // Only update name and avatar fields
                if (action.payload.name !== undefined) {
                    state.client.name = action.payload.name;
                }
                if (action.payload.avatar !== undefined) {
                    state.client.avatar = action.payload.avatar;
                }
                // Update localStorage with the modified vendor data
                localStorage.setItem("clientSession", JSON.stringify(state.client));
            }
        }
    }
})

const {clientLogin , clientLogout , updateClientslice} = clientSlice.actions



export {
    clientLogin , 
    clientLogout,
    updateClientslice
}

export default clientSlice.reducer