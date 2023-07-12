import PropTypes from 'prop-types';
import styles from './PatchForm.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { saveCurrent, update } from '../../../store/currentSlice';
import { useNavigate } from 'react-router-dom';
export const initialStatePatchForm={}
const PatchForm = (props) => {

  const navigate = useNavigate()
  
  return (
    <div className={styles.PatchForm} data-testid="PatchForm">
      <h1>Edition patch {props.patch.version}</h1>
      <form onSubmit={(evt) => {
        props.onPatchSave(props.patch)
        evt.preventDefault()
        navigate('/patch')
      }}>
        <label htmlFor="chemin">
          <span>Chemin</span>
        </label>
        <input name='chemin' id='chemin' value={props.patch.chemin} onChange={(evt) => {props.onPatchChange({...props.patch, chemin: evt.target.value})}}></input>
        <br/>
        <input id='submitbtn' type='submit' value='Enregistrer'/>
      </form>
    </div>
  );
};

PatchForm.propTypes = {
  patch: PropTypes.object.isRequired,
  onPatchChange: PropTypes.func.isRequired,
  onPatchSave: PropTypes.func.isRequired
};

PatchForm.defaultProps = {};

export default PatchForm;

export const PatchFormStoreConnected = (props) => {
  const currentPatch = useSelector(s => s.current)
  const storeDispatch = useDispatch()

  return(
    <PatchForm
      patch={currentPatch}
      onPatchChange={(patch) => {storeDispatch(update(patch))}}
      onPatchSave={(patch) => {storeDispatch(saveCurrent(patch))}}
    />
  )
}
