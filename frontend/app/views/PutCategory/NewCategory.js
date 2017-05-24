import React from 'react'
import PutCategory from './PutCategory'

export default class NewCategory extends React.Component {
  render () {
    return (
        <PutCategory isEditPage={false} {...this.props} />
    )
  }
}
