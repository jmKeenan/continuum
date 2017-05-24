import React from 'react'
import PutCollateral from './PutCollateral'

export default class EditCollateral extends React.Component {
  render () {
    return (
        <PutCollateral isEditCollateralPage={false} {...this.props} />
    )
  }
}
