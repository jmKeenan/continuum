import React from 'react'
let PropTypes = React.PropTypes
import s from './styles.css'

export default class Footer extends React.Component {
  static propTypes = {
    authType: PropTypes.string.isRequired,
    componentStyle: PropTypes.string.isRequired,
  }
  render () {
    let active = null
    if (this.props.componentStyle === 'light') {
      active = s.light
    } else {
      active = null
    }
    return (
      <footer className={active + ' ' + s.viewFooter}>

      </footer>
    )
  }
}
