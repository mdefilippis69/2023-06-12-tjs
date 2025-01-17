import { createSlice } from "@reduxjs/toolkit";
import { ReadyState } from "react-use-websocket";

const initialState = {
    status: ReadyState.UNINSTANTIATED
}

const websocketSlice = createSlice({
    name: 'websocket',
    initialState,
    reducers: {
        update: (state, action) => {            
            Object.assign(state, action.payload)
        }
    }
});

export const { update } = websocketSlice.actions

export default websocketSlice.reducer