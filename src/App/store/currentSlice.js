import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {  PATCHS_ADR, patchsURI } from '../config/config';
import { act } from 'react-dom/test-utils';
const initialState = {
    patch: {},
    loading: false
}

const currentSlice = createSlice({
    name: 'current',
    initialState,
    reducers: {
        update: (state, action) => {            
            Object.assign(state.patch, action.payload)
        },
        clear: (state) => {            
            Object.assign(state.patch, {})
        },
        updateVariable: (state, action) => {            
            state.patch.variables.splice(action.payload.idx, 1, {label: action.payload.label, valeur: action.payload.valeur})
            
        },
        addNewVariable: (state, action) => {
            state.patch.variables.splice(action.payload, 0 ,{label: '', valeur: ''})
        },
        deleteVariable: (state, action) => {
            state.patch.variables.splice(action.payload, 1)
        },
        updateLoading: (state, action) => {
            state.loading = action.payload
        }
    },
    extraReducers:(builder)=>{
        builder.addCase('current/updatePatch/fulfilled',(state,action)=>{
            Object.assign(state.patch,action.payload)
            state.loading = false
        })
        builder.addCase('current/updatePatch/rejected', (state, action) => {
            state.loading = false
        })
    }
});

export const { update, clear, updateVariable, addNewVariable, deleteVariable, updateLoading } = currentSlice.actions
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