import React from 'react'
import s from './styles.css'

export default class Loading extends React.Component {
  componentWillUnmount () {
  }
  render () {
    return (
      <div className={this.props.type === 'fluid' ? s.spinnerFluid : s.spinnerFixed}></div>
    )
  }
}
