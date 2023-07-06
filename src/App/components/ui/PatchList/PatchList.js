import React, { useState, CSSProperties } from 'react'
import PropTypes from 'prop-types'
import style from './PatchList.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { CheckCircle, XCircle, PlayFill, X, XLg } from "react-bootstrap-icons"
import WebsocketConnexion from '../../services/WebsocketConnexion/WebsocketConnexion'
import { PATCH_ROOM, WS_ADR } from '../../../config/config'
import Button from '../Button/Button'
import { addPatch, createPatch, deleteEmptyPatch, deletePatch, runPipeline, updateLoading, updatePatch } from '../../../store/ressourcesSlice'
import { ClipLoader } from 'react-spinners';

const PatchList = (props) => {

  const override: CSSProperties = {
    display: "inline-block",
    margin: "5px"
  }

  const [edition, setEdition] = useState(false)

  const [version, setVersion] = useState('')

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
            <th>Supprimer</th>
          </tr>
        </thead>
        <tbody>
          {props.patchs.map((p, i) => <tr key={'patch-' + i}>
            <td>{p.version ? p.version : <input value={version} onChange={(evt) => {setVersion(evt.target.value)}}/>}</td>
            <td>{p.last_pipeline ? (p.last_pipeline.created_at ? new Date(p.last_pipeline.created_at).toLocaleDateString() + ' ' + new Date(p.last_pipeline.created_at).toLocaleTimeString() : '') : ''}</td>
            <td>{p.last_pipeline ? p.last_pipeline.pipeline_id : ''}</td>
            <td>{
              p.last_pipeline ? (p.last_pipeline.status === 'success' ? <CheckCircle color='green'/> 
                                                                      : p.last_pipeline.status === 'created' ? <XCircle color='red'/>
                                                                      : '')
              : ''              
            }</td>
            <td>{
              props.loading.findIndex(l => l.id === p.id) > -1 ? (
                props.loading.find(l => l.id === p.id).loading 
                ? <ClipLoader size={20} cssOverride={override} data-testid="ws-loader"/> 
                : <Button onClick={() => {props.onRunPatch(p.id)}}><PlayFill/></Button>
              ) : ''
            }</td>
            <td>{p.id ? <Button onClick={() => props.deletePatch(p.id)}><XLg></XLg></Button> : ''}</td>
          </tr>)}
        </tbody>
      </table>
      {edition 
        ? <div>
            <button onClick={() => {
              props.createPatch(version)
              setVersion('')
              setEdition(false)
            }}>Valider</button>
            <button onClick={() => {
              setVersion('')
              setEdition(false)
              props.deleteEmptyPatch()
            }}>Annuler</button>
        </div> 
        : <div><button onClick={() => {
            props.addPatch({id: "", version: "", pub_date: "", last_pipeline: {pipeline_id: ""}})
            setEdition(true)
          }}>Ajouter</button></div>}
    </div>
  )
}
PatchList.propTypes = {
  patchs: PropTypes.array.isRequired,
  onRunPatch: PropTypes.func.isRequired,
  loading: PropTypes.array.isRequired,
  addPatch: PropTypes.func.isRequired,
  deletePatch: PropTypes.func.isRequired
}
export default PatchList

export const PatchListStoreConnected = (props) => {
  const patchs = useSelector(s => {return s.ressources.patchs})
  const loading = useSelector(s => {return s.ressources.loading})
  const storeDispatch = useDispatch()
  return (
    <PatchList
      {...props}
      patchs={patchs}
      onRunPatch={(patchId) => {
        storeDispatch(runPipeline(patchId))
        storeDispatch(updateLoading({id: patchId, loading: true}))
      }}
      updatePatch={(patch) => {storeDispatch(updatePatch(patch))}}
      loading={loading}
      addPatch={(patch) => {storeDispatch(addPatch(patch))}}
      deleteEmptyPatch={() => {storeDispatch(deleteEmptyPatch())}}
      createPatch={(version) => storeDispatch(createPatch(version))}
      deletePatch={(id) => storeDispatch(deletePatch(id))}
    />
  )
}