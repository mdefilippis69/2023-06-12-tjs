import React from 'react'
import PropTypes from 'prop-types'
import style from './PatchList.module.css'
import { useSelector } from 'react-redux'
import { CheckCircle, XCircle } from "react-bootstrap-icons"

const PatchList = (props) => {
  return (
    <div className={style.PatchList} data-testid="PatchList">
      <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>Dernière exécution</th>
            <th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {props.patchs.map((p, i) => <tr key={'patch-' + i}>
            <td>{p.version}</td>
            <td>{new Date(p.pub_date).toLocaleDateString() + ' ' + new Date(p.pub_date).toLocaleTimeString()}</td>
            <td>{p.statut === 'success' ? <CheckCircle color='green'/> : <XCircle color='red'/>} </td>
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
  const ressources = useSelector(s => s.ressources)
  return (
    <PatchList
      {...props}
      {...ressources}/>
  )
}