import React from 'react'
import PutTeamMember from './PutTeamMember'

export default class EditTeamMember extends React.Component {
  render () {
    return (
        <PutTeamMember isEditPage={true} {...this.props} />
    )
  }
}
