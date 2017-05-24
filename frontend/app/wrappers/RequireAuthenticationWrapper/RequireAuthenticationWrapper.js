import React from 'react'
import { browserHistory } from 'react-router'

import { removeSessionToken } from 'helpers/auth'

export default function RequireAuthenticationWrapper (WrappedComponent) {
  return class RequireAuthenticationComponent extends React.Component {
    static get propTypes () {
      return {
        location: React.PropTypes.shape({
          pathname: React.PropTypes.string,
          state: React.PropTypes.object,
        }),
        currentUser: React.PropTypes.shape({
          user_id: React.PropTypes.string,
        }),
        loggedIn: React.PropTypes.bool,
        doneCheckingUser: React.PropTypes.bool,
      }
    }

    componentWillMount () {
      if (!this.props.loggedIn && this.props.doneCheckingUser) {
        removeSessionToken()
        browserHistory.push({
          pathname: '/signin',
          state: {
            previousLocation: this.props.location.pathname,
          },
        })
      }
    }

    render () {
      return (
        <WrappedComponent {...this.props} />
      )
    }
  }
}
