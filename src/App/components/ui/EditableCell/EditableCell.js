import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import style from './EditableCell.module.css'
import Button from '../Button/Button'
import { Check, X } from 'react-bootstrap-icons'
const EditableCell = (props) => {

  
  const [value, setValue] = useState('')
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  return (
    <div className={style.EditableCell} data-testid="EditableCell">
        {clicked ? <div>
                      <input value={value} onChange={(evt) =>{setValue(evt.target.value)}} autoFocus/>
                      <Button onClick={() => {
                          setClicked(false)                          
                          props.onValueSave(value)
                        }}><Check></Check></Button>
                   </div>
                 : <span onClick={(evt) => {
                        setClicked(true)
                      }}>{value}
                  </span>}      
    </div>
  )
}

EditableCell.propTypes = {
  value: PropTypes.string.isRequired,
  onValueSave: PropTypes.func.isRequired
}
export default EditableCell