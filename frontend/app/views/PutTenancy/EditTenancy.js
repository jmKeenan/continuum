import React from 'react'
import PutTenancy from './PutTenancy'

export default class EditTenancy extends React.Component {
  render () {
    return (
        <PutTenancy isEditPage={true} {...this.props} />
    )
  }
}
