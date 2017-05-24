import React from 'react'
import s from './styles.css'

export default class DisplayTag extends React.Component {
  static get propTypes () {
    return {
      tag: React.PropTypes.object,
      style: React.PropTypes.string,
    }
  }
  render () {
    return (
      <span className={this.props.style === 'match' ? s.tag : s.unmatched}>
        {this.props.tag.tagValue}
      </span>
    )
  }
}
