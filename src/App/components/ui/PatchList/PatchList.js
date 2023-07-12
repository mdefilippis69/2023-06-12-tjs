import React, { useState, CSSProperties } from 'react'
import PropTypes from 'prop-types'
import style from './PatchList.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { CheckCircle, XCircle, PlayFill, XLg, PauseFill, GearWide, QuestionCircle, FileText, GearFill } from "react-bootstrap-icons"
import WebsocketConnexion from '../../services/WebsocketConnexion/WebsocketConnexion'
import { PATCH_ROOM, WS_ADR } from '../../../config/config'
import Button from '../Button/Button'
import { addPatch, createPatch, deleteEmptyPatch, deletePatch, getJobLogs, runPipeline, updateLoading, updatePatch } from '../../../store/ressourcesSlice'
import { ClipLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom'
import { update } from '../../../store/currentSlice'

const PatchList = (props) => {

  const navigate = useNavigate()

  const override: CSSProperties = {
    display: "inline-block",
    margin: "5px"
  }

  const [edition, setEdition] = useState(false)

  const [version, setVersion] = useState('')

  return (
    <div className={style.PatchList} data-testid="PatchList">
      <WebsocketConnexion  
        address={`${WS_ADR}${PATCH_ROOM}`}
        shouldReconnect = {true}
        onClose={() => {console.log('fermeture connexion')}}
        onMessage={(message) => {
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
            <th>Logs</th>
            <th>Editer</th>
          </tr>
        </thead>
        <tbody>
          {props.patchs.map((p, i) => <tr key={'patch-' + i} >
            <td>{p.version ? p.version : <input autoFocus value={version} onChange={(evt) => {setVersion(evt.target.value)}}/>}</td>
            <td>{p.last_pipeline ? (p.last_pipeline.created_at ? new Date(p.last_pipeline.created_at).toLocaleDateString() + ' ' + new Date(p.last_pipeline.created_at).toLocaleTimeString() : '') : ''}</td>
            <td>{p.last_pipeline ? p.last_pipeline.pipeline_id : ''}</td>
            <td>{
              p.last_pipeline ? (p.last_pipeline.status === 'success' ? <CheckCircle color='green'/> 
                                                                      : p.last_pipeline.status === 'created' ? <GearWide color='blue'/>
                                                                      : p.last_pipeline.status === 'pending' ? <PauseFill color='orange'></PauseFill>
                                                                      : p.last_pipeline.status === 'running' ? <ClipLoader size={20} cssOverride={override} data-testid="pipeline-running"/>
                                                                      : p.last_pipeline.status === 'failed' ? <XCircle color='red'/>
                                                                      : <QuestionCircle/>)
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
            <td>{p.last_pipeline ? <Button onClick={() =>{
                props.getLogs({token: props.token, pipeline_id: p.last_pipeline.pipeline_id})
              }}><FileText></FileText></Button> : ''}</td>
            <td>{p.id ? <Button onClick={() => {
                                            props.updateCurrentPatch(p);
                                            navigate("/patch/" + p.id)
                                          }}><GearFill></GearFill></Button> : ''}</td>
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
            props.addPatch({id: "", version: "", pub_date: "", last_pipeline: null})
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
  deletePatch: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  getLogs: PropTypes.func.isRequired,
  updateCurrentPatch: PropTypes.func.isRequired
}
export default PatchList

export const PatchListStoreConnected = (props) => {
  const patchs = useSelector(s => {return s.ressources.patchs})
  const loading = useSelector(s => {return s.ressources.loading})
  const token = useSelector(s => {return s.ressources.token})
  const storeDispatch = useDispatch()
  return (
    <PatchList
      {...props}
      patchs={patchs}
      token={token}
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
      getLogs={(data) => {
        storeDispatch(getJobLogs(data))
      }}
      updateCurrentPatch={(patch) => storeDispatch(update(patch))}
    />
  )
}