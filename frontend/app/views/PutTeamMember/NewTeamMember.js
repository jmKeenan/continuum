import React from 'react'
import PutTeamMember from './PutTeamMember'

export default class NewTeamMember extends React.Component {
  render () {
    return (
        <PutTeamMember isEditPage={false} {...this.props} />
    )
  }
}
