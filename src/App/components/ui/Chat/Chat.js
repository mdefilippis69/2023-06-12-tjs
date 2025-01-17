import React, { useState, useEffect, useCallback, CSSProperties } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import PropTypes from 'prop-types'
import style from './Chat.module.css'
import { CHAT_ROOM_NAME, WS_ADR } from '../../../config/config'
import { CircleFill } from 'react-bootstrap-icons';
import { ClipLoader } from 'react-spinners';
import { useSelector, useDispatch } from 'react-redux';
import WebsocketConnexion from '../../services/WebsocketConnexion/WebsocketConnexion';
import { update } from '../../../store/messageSlice';

const Chat = () => {

  const websocketState = useSelector(s => s.websocket)
  const storeDispatch=useDispatch()

  const [input, setInput] = useState('')

  const [triggerDisconnect, setTriggerDisconnect] = useState(0);
  const [triggerSendMessage, setTriggerSendMessage] = useState(0)

  const override: CSSProperties = {
    display: "inline-block",
    margin: "0 auto"
  }

  const displayMessage = (message) => {
    document.querySelector('#chat-log').value += JSON.parse(message.data).time + ' ' + JSON.parse(message.data).message + '\n'
  }

  const handleClickSendMessage = () => {
    storeDispatch(update({message: document.querySelector('#chat-message-input').value}));
    setTriggerSendMessage((triggerSendMessage) => triggerSendMessage + 1)
    setInput('')
  };

  const handleClickDisconnect = () => {
    setTriggerDisconnect((triggerDisconnect) => triggerDisconnect+1)
  }

  const clearChat = () => {
    document.querySelector('#chat-log').value = ''
  }

  const handleKeyDown = (evt) => {
    if(evt.key === 'Enter'){
      handleClickSendMessage()
    }
  }

  return (
    <div className={style.Chat} data-testid="Chat">
      <WebsocketConnexion  
        address={`${WS_ADR}${CHAT_ROOM_NAME}`}
        shouldReconnect = {true}
        onClose={() => {console.log('fermeture connexion')}}
        onMessage={(message) => {displayMessage(message)}}
        triggerDisconnect={triggerDisconnect}
        triggerSendMessage={triggerSendMessage}
        messageType='chat'
      />
      <span>Statut connexion : {websocketState.status === ReadyState.OPEN ? <CircleFill color='green'/>
       : websocketState.status === ReadyState.CLOSED ? <CircleFill color='red'/> 
       : <ClipLoader size={20} cssOverride={override} data-testid="ws-loader"/>}
       </span>      
      <br/>
      <textarea id="chat-log" cols="100" rows="20"></textarea><br/>
      <input id="chat-message-input" type="text" size="100" 
        onChange={(evt) => {setInput(evt.target.value)}} 
        onKeyDown={handleKeyDown}
        value={input}/>
      <br/>
      <button
        onClick={handleClickSendMessage}
        disabled={websocketState.status !== ReadyState.OPEN || !input}
      >
        Envoyer
      </button>    
      <button
        onClick={handleClickDisconnect}
        disabled={websocketState.status !== ReadyState.OPEN}
      >
        Déconnexion
      </button>
      <button
        onClick={clearChat}
      >
        Vider
      </button> 
    </div>
  )
}


export default Chat