import {configureStore,combineReducers} from '@reduxjs/toolkit'
import currentReducer from './currentSlice'
import ressourcesReducer, { fetchAllRessources } from './ressourcesSlice'
import websocketReducer from './websocketSlice'
const store=configureStore({
    reducer:combineReducers({
        ressources:ressourcesReducer,
        current:currentReducer,
        websocket: websocketReducer
    }),
    devTools:true
})
store.dispatch(fetchAllRessources())
export default store