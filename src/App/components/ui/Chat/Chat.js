import React, { useState, useEffect, useCallback, CSSProperties } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket';
import PropTypes from 'prop-types'
import style from './Chat.module.css'
import { CHAT_ROOM_NAME, WS_ADR } from '../../../config/config'
import { CircleFill } from 'react-bootstrap-icons';
import { ClipLoader } from 'react-spinners';

const Chat = () => {

  const override: CSSProperties = {
    display: "inline-block",
    margin: "0 auto"
  }

  const [socketUrl, setSocketUrl] = useState(WS_ADR+CHAT_ROOM_NAME);
  const [messageHistory, setMessageHistory] = useState([]);
  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    socketUrl,
    {
      shouldReconnect: (closeEvent) => true,
      onClose: (closeEvent) => {
        console.log('fermeture connexion');        
      },
      onError: (errorEvent) => {
        console.log('erreur connexion');
        document.querySelector('#chat-log').value += 'erreur connexion\n'
      },
      onOpen: (openEvent) => {
        document.querySelector('#chat-log').value += 'Connecté\n'
      }
    }
    );

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
      console.log(JSON.parse(lastMessage.data).message)
      document.querySelector('#chat-log').value += JSON.parse(lastMessage.data).time + ' ' + JSON.parse(lastMessage.data).message + '\n'
    }
  }, [lastMessage, setMessageHistory]);

  const handleClickSendMessage = useCallback(() => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    sendMessage(
      JSON.stringify({
        "message": document.querySelector('#chat-message-input').value,
        "time": time
      })
      );
    document.querySelector('#chat-message-input').value = ''
  }, []);

  const handleClickDisconenct = useCallback(() => {
    getWebSocket().close();
  }, []
  )

  const clearChat = () => {
    document.querySelector('#chat-log').value = ''
  }

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div className={style.Chat} data-testid="Chat">
      <span>Statut connexion : {connectionStatus === 'Open' ? <CircleFill color='green'/>
       : connectionStatus === 'Closed' ? <CircleFill color='red'/> 
       : <ClipLoader size={20} cssOverride={override} data-testid="ws-loader"/>}
       </span>      
      <br/>
      <textarea id="chat-log" cols="100" rows="20"></textarea><br/>
      <input id="chat-message-input" type="text" size="100"/><br/>
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Envoyer
      </button>    
      <button
        onClick={handleClickDisconenct}
        disabled={readyState !== ReadyState.OPEN}
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