import { createSlice } from "@reduxjs/toolkit";
import { ReadyState } from "react-use-websocket";

const initialState = {
    message: ''
}

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        update: (state, action) => {
            console.log('appel update message')
            Object.assign(state, action.payload)
        }
    }
});

export const { update } = messageSlice.actions

export default messageSlice.reducer