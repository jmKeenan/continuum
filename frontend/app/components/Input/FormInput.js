import React from 'react'
import 'helpers/validationRules'
import Validation from 'react-validation'
import fs from 'sharedStyles/formStyles.css'

export default function FormInput (props) {
  return (
    <div className={fs.inputWrapperFull}>
      <label className={fs.labelWrapper}>
        <div className={fs.heading}> {props.title} </div>
        <Validation.components.Input
          autoComplete={'off'}
          onChange={props.onChange}
          onFocus={props.onFocus}
          className={fs.default}
          value={props.value}
          type={props.type}
          // value={props.originalCollateral ? props.originalCollateral.collateralTitle : ''}
          placeholder={props.placeholder}
          name={props.name}
          validations={props.validations}
          errorClassName={fs.invalidInput} />
      </label>
    </div>
  )
}
