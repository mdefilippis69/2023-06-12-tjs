import PropTypes from 'prop-types';
import styles from './PatchForm.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { addNewVariable, deleteVariable, saveCurrent, update, updateLoading, updateVariable } from '../../../store/currentSlice';
import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button/Button';
import { XLg, PlusLg } from 'react-bootstrap-icons';
import EditableCell from '../../ui/EditableCell/EditableCell';
import { ClipLoader } from 'react-spinners';
export const initialStatePatchForm={}
const PatchForm = (props) => {

  const navigate = useNavigate()
  
  return (
    <div className={styles.PatchForm} data-testid="PatchForm">
      <h1>Edition patch {props.patch.version}</h1>      
      <table>
        <thead>
          <tr>
            <th>Variable</th>
            <th>Valeur</th>
            <th>Supprimer</th>
            <th>Insérer</th>
          </tr>
        </thead>
        <tbody>          
          {props.patch.variables ? props.patch.variables.map((v, i) => <tr key={'variable-'+i}>
            <td><EditableCell value={v.label} onValueSave={(newLabel) => {props.updateVariable(i, newLabel, v.valeur)}}></EditableCell></td>
            <td><EditableCell value={v.valeur} onValueSave={(newValeur) => {props.updateVariable(i, v.label, newValeur)}}></EditableCell></td>
            <td><Button onClick={() => {props.deleteVariable(i)}}><XLg></XLg></Button></td>
            <td><Button onClick={() => {props.addVariable(i+1)}}><PlusLg></PlusLg></Button></td>
          </tr> ) : <tr></tr>}
        </tbody>
      </table>
      { props.patch.variables < 1 ? <Button onClick={() => {props.addVariable(0)}}><PlusLg></PlusLg></Button> : ''}
      <br></br>
      <button onClick={() => {
          props.onPatchSave(props.patch)
        }}>{props.loading ? <ClipLoader size={20} data-testid="put-loader"></ClipLoader> : 'Enregistrer'}</button>      
    </div>
  );
};

PatchForm.propTypes = {
  patch: PropTypes.object.isRequired,
  onPatchChange: PropTypes.func.isRequired,
  onPatchSave: PropTypes.func.isRequired,
  addVariable: PropTypes.func.isRequired,
  updateVariable: PropTypes.func.isRequired,
  deleteVariable: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

PatchForm.defaultProps = {};

export default PatchForm;

export const PatchFormStoreConnected = (props) => {
  const currentPatch = useSelector(s => s.current.patch)
  const loading = useSelector(s => s.current.loading)
  const storeDispatch = useDispatch()

  return(
    <PatchForm
      patch={currentPatch}
      onPatchChange={(patch) => {storeDispatch(update(patch))}}
      onPatchSave={(patch) => {storeDispatch(saveCurrent(patch)); storeDispatch(updateLoading(true))}}
      addVariable={(idx) => {storeDispatch(addNewVariable(idx))}}
      updateVariable={(idx, label, valeur) => {storeDispatch(updateVariable({idx: idx, label: label, valeur: valeur}))}}
      deleteVariable={(i) => {storeDispatch(deleteVariable(i))}}
      loading={loading}
    />
  )
}
