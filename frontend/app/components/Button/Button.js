import React from 'react'
let PropTypes = React.PropTypes
import { Link } from 'react-router'
import s from './styles.css'

Button.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string,
  status: PropTypes.string,
  margin: PropTypes.string,
  link: PropTypes.string,
  onClick: PropTypes.func,
}

export default function Button (props) {
  let handleButtonStyling = (type, status, margin) => {
    let typeToSet = s.default
    switch (type) {
      case 'large':
        typeToSet = s.large
        break
      case 'submit':
        typeToSet = s.submit
        break
      case 'submitWide':
        typeToSet = s.submitWide
        break
      case 'warn':
        typeToSet = s.warn
        break
      case 'small':
        typeToSet = s.small
        break
      case 'bistableLarge':
        typeToSet = s.bistableLarge
        break
      default: typeToSet = s.default
    }

    let statusToSet = s.defaultStatus
    switch (status) {
      case 'default':
        statusToSet = s.defaultStatus
        break
      case 'pending':
        statusToSet = s.pendingStatus
        break
      case 'warn':
        statusToSet = s.warnStatus
        break
      case 'failed':
        statusToSet = s.warnStatus
        break
      case 'invalid':
        statusToSet = s.warnStatus
        break
      case 'error':
        statusToSet = s.warnStatus
        break
      case 'on':
        statusToSet = s.selectionButtonOn
        break
      case 'off':
        statusToSet = s.selectionButtonOff
        break
      default: statusToSet = s.defaultStatus
    }

    let marginToSet = s.defaultMargin
    switch (margin) {
      case 'both':
        marginToSet = s.bothMargin
        break
      case 'left':
        marginToSet = s.leftMargin
        break
      case 'right':
        marginToSet = s.rightMargin
        break
      default: marginToSet = s.defaultMargin
    }

    let styles = [typeToSet, statusToSet, marginToSet]
    return (
      styles.join(' ')
    )
  }

  return (
    <button className={handleButtonStyling(props.type, props.status, props.margin)} onClick={props.onClick}>
      <Link to={props.link}>
       {props.text}
      </Link>
    </button>
  )
}
