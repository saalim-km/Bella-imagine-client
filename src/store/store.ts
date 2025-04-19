import {configureStore} from '@reduxjs/toolkit'
import clientReducers from './slices/clientSlice'
import vendorReducers from './slices/vendorSlice'
import adminReducers from './slices/adminSlice'
import chatReducers from './slices/chatSlice'

export const store = configureStore({
    reducer : {
        client : clientReducers,
        vendor : vendorReducers,
        admin : adminReducers,
        chat : chatReducers
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;