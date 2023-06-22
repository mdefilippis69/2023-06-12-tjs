import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { REST_ADR, ressourcesURI, PATCHS_ADR, patchsURI } from '../config/config';
const initialState = {
    images: [],
    memes: [],
    patchs: []
}

const ressourcesSlice = createSlice({
    name: 'ressources',
    initialState,
    reducers: {},
    extraReducers:(builder)=>{
        builder.addCase('ressources/fetchRessources/fulfilled',(state,action)=>{
            state.images.splice(0);
            state.images.push(...action.payload.images)
            state.memes.splice(0);
            state.memes.push(...action.payload.memes)
            state.patchs.splice(0)
            state.patchs.push(...action.payload.patchs)
        })
        builder.addCase('current/save/fulfilled',(state,action)=>{
            const position=state.memes.findIndex(m=>m.id===action.payload)
            if(position>-1){state.memes[position]=action.payload}
            else { state.memes.push(action.payload)}
        })
        builder.addDefaultCase(()=>{console.log('cas non pris en charge de declenchement par asynThunk')})
    }
});

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

export default ressourcesSlice.reducer