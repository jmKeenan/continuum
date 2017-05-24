import React from 'react'
import { removeSessionToken } from 'helpers/auth'

export default class Signout extends React.Component {

  componentDidMount = () => {
    console.log('++ forcing logout')
    removeSessionToken()
    window.location = '/signin'
  }

  render () {
    return (
      <div>
        {'signout'}
      </div>
    )
  }

}
