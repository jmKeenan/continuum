import React from 'react'
import { storeSessionToken } from 'helpers/auth'
import s from './styles.css'
import Validation from 'react-validation'
import FormInput from 'components/Input/FormInput'
import Button from 'components/Button/Button'
import { browserHistory } from 'react-router'

export default class ResetPasswordForm extends React.Component {
  static get propTypes () {
    return {
      params: React.PropTypes.shape({ secretLink: React.PropTypes.string }),
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      password: '',
      passwordConfirm: '',
      submitStatus: 'default',
    }
  }

  clearError = () => {
    this.setState({
      submitStatus: 'default',
    })
  }

  handleInputChange = (key, ev) => {
    const val = ev.target.value
    const newState = {}
    newState[key] = val
    this.setState(newState)
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const formIsValid = this.checkFormValidation()
    if (formIsValid) {
      this.setState({
        submitStatus: 'pending',
      })
      let that = this
      this.resetPasswordHelper(this.state.password, this.props.params.secretLink, that)
    }
  }

  checkFormValidation = () => {
    const errors = this.form.validateAll()
    const formIsValid = Object.keys(errors).length === 0
    this.setState({
      errors: errors,
    })
    if (!formIsValid) {
      this.setState({
        submitStatus: 'invalid',
      })
    }
    return formIsValid
  }

  resetPasswordHelper = (newPassword, secretLink, that) => {
    return this.props.API.resetPassword(newPassword, secretLink).then((response) => {
      if (response.success) {
        storeSessionToken(response.token)
        this.props.notifyWithBanner('Successfully reset password', 'confirm')
        this.props.provideUser().then(() => {
          browserHistory.push('/')
        })
      } else {
        this.props.notifyWithBanner(`${response.message}`, 'warn', true)
      }
      this.setState({
        submitStatus: 'default',
      })
    })
  }

  render = () => {
    function getStatus (type) {
      var text = {
        'default': function () { return 'Reset Password' },
        'pending': function () { return 'Trying' },
        'failed': function () { return 'Couldn\'t reach server' },
        'invalid': function () { return 'Passwords don\'t match' },
      }
      return (text[type] || text['default'])()
    }

    return (
      <div className={s.signinCard}>
        <div className={s.loginInputWrapper}>
        <Validation.components.Form className={s.mainFormWrapper} ref={c => this.form = c} >
        <FormInput
          title={'Password *'}
          type={'password'}
          name={'password'}
          value={this.state.password}
          onChange={this.handleInputChange.bind(this, 'password')}
          onFocus={this.clearError}
          validations={['required', 'password']}/>
        <FormInput
          title={'Confirm Password *'}
          type={'password'}
          name={'passwordConfirm'}
          value={this.state.passwordConfirm}
          onChange={this.handleInputChange.bind(this, 'passwordConfirm')}
          onFocus={this.clearError}
          validations={['required', 'password']}/>
        <Button
          onClick={this.handleSubmit}
          type='submitWide'
          status={this.state.submitStatus}
          text= {getStatus(this.state.submitStatus)}/>
        </Validation.components.Form >
        </div>
      </div>
    )
  }
}
