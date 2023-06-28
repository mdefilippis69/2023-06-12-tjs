import React, { useState } from 'react'
import PropTypes from 'prop-types'
import style from './PatchList.module.css'
import { useSelector } from 'react-redux'
import { CheckCircle, XCircle, PlayFill } from "react-bootstrap-icons"
import WebsocketConnexion from '../../services/WebsocketConnexion/WebsocketConnexion'
import { PATCH_ROOM, WS_ADR } from '../../../config/config'
import Button from '../Button/Button'

const PatchList = (props) => {

  const [trigger, setTrigger] = useState(0);

  return (
    <div className={style.PatchList} data-testid="PatchList">
      <WebsocketConnexion  
        address={`${WS_ADR}${PATCH_ROOM}`}
        shouldReconnect = {true}
        onClose={() => {console.log('fermeture connexion')}}
        onMessage={(message) => {console.log('message reçu : ' + message)}}
        triggerDisconnect={0}
        triggerSendMessage={0}
      />
      <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>Dernière exécution</th>
            <th>Statut</th>
            <th>Exécuter</th>
          </tr>
        </thead>
        <tbody>
          {props.patchs.map((p, i) => <tr key={'patch-' + i}>
            <td>{p.version}</td>
            <td>{new Date(p.pub_date).toLocaleDateString() + ' ' + new Date(p.pub_date).toLocaleTimeString()}</td>
            <td>{p.statut === 'success' ? <CheckCircle color='green'/> : <XCircle color='red'/>} </td>
            <td><Button><PlayFill/></Button></td>
          </tr>)}
        </tbody>
      </table>
    </div>
  )
}
PatchList.propTypes = {
  patchs: PropTypes.array.isRequired,
}
export default PatchList

export const PatchListStoreConnected = (props) => {
  const patchs = useSelector(s => {return s.ressources.patchs})
  return (
    <PatchList
      {...props}
      patchs={patchs}/>
  )
}