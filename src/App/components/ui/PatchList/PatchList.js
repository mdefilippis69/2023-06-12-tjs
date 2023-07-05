import React, { useState } from 'react'
import PropTypes from 'prop-types'
import style from './PatchList.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { CheckCircle, XCircle, PlayFill } from "react-bootstrap-icons"
import WebsocketConnexion from '../../services/WebsocketConnexion/WebsocketConnexion'
import { PATCH_ROOM, WS_ADR } from '../../../config/config'
import Button from '../Button/Button'
import { runPipeline, updatePatch } from '../../../store/ressourcesSlice'

const PatchList = (props) => {

  const [trigger, setTrigger] = useState(0);

  return (
    <div className={style.PatchList} data-testid="PatchList">
      <WebsocketConnexion  
        address={`${WS_ADR}${PATCH_ROOM}`}
        shouldReconnect = {true}
        onClose={() => {console.log('fermeture connexion')}}
        onMessage={(message) => {
          console.log('message reçu : ' + message.data)
          props.updatePatch(message.data)
        }}
        triggerDisconnect={0}
        triggerSendMessage={0}
        messageType='patch'
      />
      <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>Dernière exécution</th>
            <th>Id pipeline</th>
            <th>Statut</th>
            <th>Exécuter</th>
          </tr>
        </thead>
        <tbody>
          {props.patchs.map((p, i) => <tr key={'patch-' + i}>
            <td>{p.version}</td>
            <td>{new Date(p.pub_date).toLocaleDateString() + ' ' + new Date(p.pub_date).toLocaleTimeString()}</td>
            <td>{p.last_pipeline.pipeline_id}</td>
            <td>{p.last_pipeline.status === 'success' ? <CheckCircle color='green'/> : <XCircle color='red'/>} </td>
            <td><Button onClick={() => {props.onRunPatch(p.id)}}><PlayFill/></Button></td>
          </tr>)}
        </tbody>
      </table>
    </div>
  )
}
PatchList.propTypes = {
  patchs: PropTypes.array.isRequired,
  onRunPatch: PropTypes.func.isRequired
}
export default PatchList

export const PatchListStoreConnected = (props) => {
  const patchs = useSelector(s => {return s.ressources.patchs})
  const storeDispatch = useDispatch()
  return (
    <PatchList
      {...props}
      patchs={patchs}
      onRunPatch={(patchId) => {storeDispatch(runPipeline(patchId))}}
      updatePatch={(patch) => {storeDispatch(updatePatch(patch))}}
    />
  )
}