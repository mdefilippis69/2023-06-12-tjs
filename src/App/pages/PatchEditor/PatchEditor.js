import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { update } from '../../store/currentSlice'
import { useEffect } from 'react'
import { PatchFormStoreConnected } from '../../components/functional/PatchForm/PatchForm'

const PatchEditor = (props) => {
  const storeDispatch = useDispatch()
  const params = useParams()
  const patchs = useSelector(s=>s.ressources.patchs)
  useEffect(() => {
    if(undefined!==params.id) {
      const patch = patchs.find(p => p.id === Number(params.id))
      if(undefined!==patch){
        storeDispatch(update(patch))
      }            
    }
    else {
      storeDispatch(update({}))
    }
  }, [params, patchs, storeDispatch])
  

  return (
    <PatchFormStoreConnected/>
  )
}

export default PatchEditor