import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit'
import { REST_ADR, ressourcesURI, PATCHS_ADR, patchsURI } from '../config/config';
const initialState = {
    images: [],
    memes: [],
    patchs: [],
    loading: []
}

const ressourcesSlice = createSlice({
    name: 'ressources',
    initialState,
    reducers: {
        updatePatch: (state, action) => {           
            var jsonPatch = JSON.parse(action.payload)

            const idx = state.patchs.findIndex(p => p.id === jsonPatch.patch.id)
            
            state.patchs.splice(idx, 1, jsonPatch.patch)
        },
        updateLoading: (state, action) => {
            const idx = state.loading.findIndex(l => l.id === action.payload.id)
            state.loading.splice(idx, 1, action.payload)
        },
        addPatch: (state, action) => {
            state.patchs.push(action.payload)
        },
        deleteEmptyPatch: (state, action) => {
            const idx = state.patchs.findIndex(p => p.id === "")
            if(idx > -1) { state.patchs.splice(idx, 1) }
        }
    },
    extraReducers:(builder)=>{
        builder.addCase('ressources/fetchRessources/fulfilled',(state,action)=>{
            state.images.splice(0);
            state.images.push(...action.payload.images)
            state.memes.splice(0);
            state.memes.push(...action.payload.memes)
            state.patchs.splice(0)
            state.patchs.push(...action.payload.patchs)
            state.loading.splice(0)
            state.patchs.map((p, i) => {
                state.loading.push({id: p.id, loading: false})
            })
        })
        builder.addCase('current/save/fulfilled',(state,action)=>{
            const position=state.memes.findIndex(m=>m.id===action.payload)
            if(position>-1){state.memes[position]=action.payload}
            else { state.memes.push(action.payload)}
        })
        builder.addCase('ressources/runPipeline/fulfilled', (state, action) => {
            console.log('payload run : ')
            console.log(action.payload)
            const position = state.patchs.findIndex(p => p.id === action.payload.id)
            if(position > -1){state.patchs[position] = action.payload}
            const loadingIndex = state.loading.findIndex(l => l.id === action.payload.id)
            if(loadingIndex > -1){state.loading[loadingIndex] = {id: action.payload.id, loading: false}}
        })
        builder.addCase('ressources/createPatch/fulfilled', (state, action) => {
            state.patchs.splice(0)
            state.patchs.push(...action.payload)
            state.loading.splice(0)
            state.patchs.map((p, i) => {
                state.loading.push({id: p.id, loading: false})
            })
        })
        builder.addCase('ressources/deletePatch/fulfilled', (state, action) => {
            state.patchs.splice(0)
            state.patchs.push(...action.payload)
            state.loading.splice(0)
            state.patchs.map((p, i) => {
                state.loading.push({id: p.id, loading: false})
            })
        })
        builder.addDefaultCase(()=>{})
    }
});

export const { updatePatch, updateLoading, addPatch, deleteEmptyPatch } = ressourcesSlice.actions

// export const {} = ressourcesSlice.actions
export const fetchAllRessources = createAsyncThunk('ressources/fetchRessources',
    async () => {
        const promiseImages = await fetch(`${REST_ADR}${ressourcesURI.images}`)
        const promiseMemes = await fetch(`${REST_ADR}${ressourcesURI.memes}`)
        const promisePatchs = await fetch(`${PATCHS_ADR}${patchsURI.all}`)
        const jsoI= await promiseImages.json();
        const jsoM= await promiseMemes.json()
        const jsoP = await promisePatchs.json()
        return {memes:jsoM,images:jsoI, patchs:jsoP}
    })

export const runPipeline = createAsyncThunk('ressources/runPipeline',
    async (patchId) => {
        const promisePatch = await fetch(`${PATCHS_ADR}/${patchId}${patchsURI.run}`)
        const jsonPatch = await promisePatch.json()
        console.log(jsonPatch)
        return jsonPatch
    }
)

export const createPatch = createAsyncThunk('ressources/createPatch',
    async (version) => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ version: version })
        };

        const promisePatch = await fetch(`${PATCHS_ADR}${patchsURI.add}`, requestOptions)
        const jsonPatch = await promisePatch.json()
        console.log(jsonPatch)
        return jsonPatch
    }
)

export const deletePatch = createAsyncThunk('ressources/deletePatch',
    async(id) => {
        const requestOptions = {
            method: 'DELETE'
        }
        
        const promisePatch = await fetch(`${PATCHS_ADR}/${id}${patchsURI.delete}`, requestOptions)
        const jsonPatch = await promisePatch.json()
        return jsonPatch
    }
)

export default ressourcesSlice.reducer