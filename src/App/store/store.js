import {configureStore,combineReducers} from '@reduxjs/toolkit'
import currentReducer from './currentSlice'
import ressourcesReducer, { fetchAllRessources, getGitlabToken } from './ressourcesSlice'
import websocketReducer from './websocketSlice'
import messageReducer from './messageSlice'
const store=configureStore({
    reducer:combineReducers({
        ressources:ressourcesReducer,
        current:currentReducer,
        websocket: websocketReducer,
        message: messageReducer
    }),
    devTools:true
})
store.dispatch(fetchAllRessources())
store.dispatch(getGitlabToken())
export default store