import React, { useState, useEffect, useCallback } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import PropTypes from 'prop-types';
import styles from './WebsocketConnexion.module.css';
import { useDispatch} from 'react-redux'
import { update } from '../../../store/websocketSlice';

export const initialStateWebsocketConnexion={}

const WebsocketConnexion = (props) => {
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
      console.log("etat connexion : " + connectionStatus + '(' + readyState + ')');
      storeDispatch(update({status: readyState}));
    }, [readyState])

    const connectionStatus = {
      [ReadyState.CONNECTING]: 'Connecting',
      [ReadyState.OPEN]: 'Open',
      [ReadyState.CLOSING]: 'Closing',
      [ReadyState.CLOSED]: 'Closed',
      [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    const handleDisconnect = useCallback(() => {
      console.log('trigger n : ' + props.triggerDisconnect)      
      getWebSocket().close();          
    }, []
    )

    useEffect(() => {
      console.log('trigger : ' + props.triggerDisconnect)
      if(props.triggerDisconnect) {
        handleDisconnect()
      }
    }, [props.triggerDisconnect])
  
  return (<br/>);
};

WebsocketConnexion.propTypes = {
  address: PropTypes.string.isRequired,
  shouldReconnect: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onMessage: PropTypes.func.isRequired,
  triggerDisconnect: PropTypes.number.isRequired
};

WebsocketConnexion.defaultProps = {};

export default WebsocketConnexion;