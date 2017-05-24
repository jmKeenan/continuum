import React from 'react'
import Raven from 'raven-js'

export default class TestError extends React.Component {
  /*
   * This is a helper page for testing frontend error logging
   */

  throwError = () => {
    throw new Error('Test Frontend Error5')
  }
  throwCapturedError = () => {
    try {
      throw new Error('Test Captured Frontend Error')
    } catch (e) {
      Raven.captureException(e)
    }
  }

  render = () => {
    return (
      <div>
      <div>
        {'This is a helper page for testing frontend error logging'}
      </div>
      <div>
        <button onClick={this.throwError}>{'throw error'}</button>
      </div>
      <div>
        <button onClick={this.throwCapturedError}>{'throw captured error'}</button>
      </div>
      </div>
    )
  }
}
