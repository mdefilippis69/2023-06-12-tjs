import React, { useState, useEffect, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import PropTypes from 'prop-types';
import styles from './WebsocketConnexion.module.css';
import { useDispatch, useSelector }from 'react-redux'
import { update } from '../../../store/websocketSlice';

export const initialStateWebsocketConnexion={}

const WebsocketConnexion = (props) => {
  const messageState = useSelector(s => s.message)
  const storeDispatch=useDispatch()
  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    props.address,
    {
      shouldReconnect: (closeEvent) => props.shouldReconnect,
      onClose: (closeEvent) => props.onClose(),
      onError: (errorEvent) => {
        console.log('erreur connexion');
      },
      onOpen: (openEvent) => {
        console.log('connecté à ' + props.address)
      }
    }
    );

    useEffect(() => {
      if (lastMessage !== null) {
        props.onMessage(lastMessage);
      }
    }, [lastMessage]);

    useEffect(() => {
      storeDispatch(update({status: readyState}));
    }, [readyState])

    const connectionStatus = {
      [ReadyState.CONNECTING]: 'Connecting',
      [ReadyState.OPEN]: 'Open',
      [ReadyState.CLOSING]: 'Closing',
      [ReadyState.CLOSED]: 'Closed',
      [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    useEffect(() => {      
      if(props.triggerDisconnect) {
        getWebSocket().close()
      }
    }, [props.triggerDisconnect])

    useEffect(() => {      
      if(props.triggerSendMessage) {        
        sendMessage(JSON.stringify({message: messageState.message, time: new Date().toLocaleTimeString()}))
      }      
    }, [props.triggerSendMessage])
  
  return (<br/>);
};

WebsocketConnexion.propTypes = {
  address: PropTypes.string.isRequired,
  shouldReconnect: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onMessage: PropTypes.func.isRequired,
  triggerDisconnect: PropTypes.number.isRequired,
  triggerSendMessage: PropTypes.number.isRequired
};

WebsocketConnexion.defaultProps = {};

export default WebsocketConnexion;