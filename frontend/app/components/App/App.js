import React, { PropTypes } from 'react'
import { app } from './styles.css'

App.propTypes = {
  children: PropTypes.object,
}

export default function App (props) {
  return (
    <div className={app}>
      {React.cloneElement(props.children, {...props})}
    </div>
  )
}
