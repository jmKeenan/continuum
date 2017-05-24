import React from 'react'
import { browserHistory } from 'react-router'

export default function RequireNotAuthenticatedWrapper (WrappedComponent) {
  return class RequireNotAuthenticatedComponent extends React.Component {
    static get propTypes () {
      return {
        loggedIn: React.PropTypes.bool,
        doneCheckingUser: React.PropTypes.bool,
      }
    }

    render () {
      if (this.props.loggedIn) {
        browserHistory.push({
          pathname: '/',
        })
      }
      return (
        <WrappedComponent {...this.props} />
      )
    }
  }
}
