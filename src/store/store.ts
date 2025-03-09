import {configureStore} from '@reduxjs/toolkit'
import clientReducers from './slices/clientSlice'

export const store = configureStore({
    reducer : {
        client : clientReducers,
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;