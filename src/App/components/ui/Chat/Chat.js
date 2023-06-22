import React, { useState, useEffect, useCallback } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import PropTypes from 'prop-types'
import style from './Chat.module.css'
import { CHAT_ROOM_NAME, WS_ADR } from '../../../config/config'
import { CircleFill } from 'react-bootstrap-icons';

const Chat = () => {

  const [socketUrl, setSocketUrl] = useState(WS_ADR+CHAT_ROOM_NAME);
  const [messageHistory, setMessageHistory] = useState([]);
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
      console.log(JSON.parse(lastMessage.data).message)
      document.querySelector('#chat-log').value += JSON.parse(lastMessage.data).message + '\n'
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickSendMessage = useCallback(() => {
    sendMessage(document.querySelector('#chat-message-input').value);
    document.querySelector('#chat-message-input').value = ''
  }, []);

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div className={style.Chat} data-testid="Chat">
      <span>Statut connexion : </span>
      {connectionStatus === 'Open' ? <CircleFill color='green'/>
       : connectionStatus === 'Closed' ? <CircleFill color='red'/> 
       : <CircleFill color='purple'/>}
      <br/>
      <textarea id="chat-log" cols="100" rows="20"></textarea><br/>
      <input id="chat-message-input" type="text" size="100"/><br/>
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Envoyer
      </button>      
    </div>
  )
}


export default Chat