import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {  PATCHS_ADR, patchsURI } from '../config/config';
const initialState = {}

const currentSlice = createSlice({
    name: 'current',
    initialState,
    reducers: {
        update: (state, action) => {
            delete state.id
            Object.assign(state, action.payload)
        },
        clear: (state) => {
            delete state.id
            Object.assign(state, {})
        }
    },
    extraReducers:(builder)=>{
        builder.addCase('current/save/fulfilled',(state,action)=>{
            Object.assign(state,action.payload)
        })
    }
});

export const { update, clear } = currentSlice.actions
// update(unMeme) -> {type:'current/update', payload:unMeme} 
export const saveCurrent = createAsyncThunk('current/updatePatch', 
async(data) => {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }
    const promisePatch = await fetch(`${PATCHS_ADR}${patchsURI.update}`, requestOptions)
    const jsonPatch = promisePatch.json()
    return jsonPatch
}
)

export default currentSlice.reducer