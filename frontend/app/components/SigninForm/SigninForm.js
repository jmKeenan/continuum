import React from 'react'
import { Link, browserHistory } from 'react-router'
import { storeSessionToken } from 'helpers/auth'
import Button from 'components/Button/Button'
import s from './styles.css'
import fs from 'sharedStyles/formStyles.css'

export default class SigninForm extends React.Component {
  static get propTypes () {
    return {
      location: React.PropTypes.shape({
        state: React.PropTypes.shape({
          previousLocation: React.PropTypes.string,
        }),
      }),
      provideUser: React.PropTypes.func,
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      email: '',
      emailUsed: false,
      emailIsValid: false,
      password: '',
      submitStatus: 'default',
      errors: {},
      formIsValid: false,
      buttonStyle: s.loginButton,
    }
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.loginWithEmail = this.loginWithEmail.bind(this)
    this.getSessionTokenFromApi = this.getSessionTokenFromApi.bind(this)
    this.redirectToPreviousRoute = this.redirectToPreviousRoute.bind(this)
  }

  handleEnter = (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit()
    }
  }

  handleEmailChange (event) {
    this.setState({
      email: event.target.value,
    })
  }

  handlePasswordChange (event) {
    this.setState({
      password: event.target.value,
    })
  }

  handleSubmit () {
    let formIsValid = true
    if (formIsValid) {
      const authData = {
        auth_type: 'email',
        email: this.state.email,
        password: this.state.password,
      }
      this.setState({
        submitStatus: 'inProgress',
      })
      this.loginWithEmail(authData)
    } else {
      this.setState({
        submitStatus: 'invalid',
      })
      // TODO: show errors here somehow
    }
  }

  redirectToPreviousRoute () {
    const previousLocation = this.props.location &&
      this.props.location.state && this.props.location.state.previousLocation
    this.props.provideUser().then(() => {
      if (previousLocation) {
        browserHistory.push(this.props.location.state.previousLocation)
      } else {
        browserHistory.push('/')
      }
    })
  }

  loginWithEmail (authData) {
    this.getSessionTokenFromApi(authData)
      .then(token => storeSessionToken(token))
      .then(this.redirectToPreviousRoute)
      .catch(error => {
        console.error(`++ login response status: ${error.message}`)
      })
  }

  getSessionTokenFromApi (authData) {
    const requestBody = JSON.stringify(authData)
    const requestHeaders = new window.Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    })

    return fetch('/api/auth/', { method: 'POST', body: requestBody, headers: requestHeaders })
      .then(response => {
        if (!response.ok) { throw new Error(response.status) }
        return response
      })
      .then(response => response.json())
      .then(data => data.token)
      .catch(error => {
        console.error(error.message)
        this.setState({
          submitStatus: 'failed',
        })
        throw new Error('login failed')
      })
  }

  clearError = () => {
    this.setState({
      submitStatus: 'default',
    })
  }

  render = () => {
    function getStatus (type) {
      var text = {
        'default': function () { return 'Sign In' },
        'inProgress': function () { return 'Trying' },
        'failed': function () { return 'Email or password is incorrect' },
        'invalid': function () { return 'Error' },
      }
      return (text[type] || text['default'])()
    }
    return (
      <div className={s.signinCard}>
        <div className={s.loginInputWrapper}>
          <div className={fs.inputWrapper}>
              <label className={fs.label}>
                <div className={fs.heading}>{'Email'}</div>
                <input
                  onChange={this.handleEmailChange}
                  onFocus={this.clearError}
                  onKeyUp={this.handleEnter}
                  placeholder={'name@email.com'}
                  className={fs.default}/>
              </label>
            </div>
            <div className={fs.inputWrapper}>
                <label className={fs.label}>
                <div className={fs.heading}>{'Password'}</div>
                  <input
                    onChange={this.handlePasswordChange}
                    onFocus={this.clearError}
                    onKeyUp={this.handleEnter}
                    type={'password'}
                    placeholder={'password'}
                    className={fs.default}/>
                </label>
              </div>
            <Button
              onClick={this.handleSubmit}
              type='submitWide'
              status={this.state.submitStatus}
              text= {getStatus(this.state.submitStatus)}/>
        </div>
        <Link to='/forgotPassword' className={s.forgotPassword}>{'(Forgot?)'}</Link>
      </div>
    )
  }
}
