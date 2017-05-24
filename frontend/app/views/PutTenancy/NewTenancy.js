import React from 'react'
import PutTenancy from './PutTenancy'

export default class NewTenancy extends React.Component {
  render () {
    return (
        <PutTenancy isEditPage={false} {...this.props} />
    )
  }
}
