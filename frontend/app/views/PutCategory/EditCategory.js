import React from 'react'
import PutCategory from './PutCategory'

export default class EditCategory extends React.Component {
  render () {
    return (
        <PutCategory isEditPage={true} {...this.props} />
    )
  }
}
