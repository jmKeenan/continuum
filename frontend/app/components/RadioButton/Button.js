import React from 'react'
let PropTypes = React.PropTypes
import { Link } from 'react-router'
import s from './styles.css'

Button.propTypes = {
  type: PropTypes.string,
  text: PropTypes.string,
  link: PropTypes.string,
}

export default function Button (props) {
  let getStyle = (type) => {
    var style = {
      'large': function () { return s.large },
      'medium': function () { return s.medium },
      'small': function () { return s.small },
      'bistableLarge': function () { return s.bistableLarge },
    }
    return (style[type] || style[s.default])()
  }
  return (
      <Link to={props.link}>
        <button className={getStyle(props.type)}>{props.text}</button>
      </Link>
  )
}
