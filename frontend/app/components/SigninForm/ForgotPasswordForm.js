import React from 'react'
import s from './styles.css'
import Validation from 'react-validation'
import Button from 'components/Button/Button'
import FormInput from 'components/Input/FormInput'
import { browserHistory } from 'react-router'

export default class ForgotPasswordForm extends React.Component {
  static get propTypes () {
    return {
      location: React.PropTypes.shape({
        state: React.PropTypes.shape({
          previousLocation: React.PropTypes.string,
        }),
      }),
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      email: '',
      submitStatus: 'default',
      errors: {},
      formIsValid: false,
    }
  }

  handleEmailChange = (event) => {
    this.setState({
      email: event.target.value,
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const formIsValid = this.checkFormValidation()
    if (formIsValid) {
      this.setState({
        submitStatus: 'pending',
      })
      this.props.API.forgotPassword(this.state.email).then((returned) => {
        if (returned.success) {
          this.props.notifyWithBanner('Password reset email has been sent', 'confirm')
        } else {
          this.props.notifyWithBanner(`${returned.message}`, 'warn', true)
        }
        this.setState({
          submitStatus: 'default',
        })
      })
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

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSubmit()
    }
  }

  clearError = () => {
    this.setState({
      submitStatus: 'default',
    })
  }

  render = () => {
    function getStatus (type) {
      var text = {
        'default': function () { return 'Submit' },
        'pending': function () { return 'Trying' },
        'failed': function () { return 'Couldn\'t reach server' },
        'invalid': function () { return 'Email is invalid' },
      }
      return (text[type] || text['default'])()
    }
    return (
      <div className={s.signinCard}>
      <Validation.components.Form className={s.mainFormWrapper} ref={c => this.form = c} >
      <FormInput
        title={'Please enter your account email'}
        name={'email'}
        value={this.state.email}
        onChange={(e) => this.handleEmailChange(e)}
        onFocus={this.clearError}
        placeholder={'name@email.com'}
        validations={['required', 'email']}/>
      <Button
        onClick={this.handleSubmit}
        type='submitWide'
        status={this.state.submitStatus}
        text= {getStatus(this.state.submitStatus)}/>
            </Validation.components.Form >

      </div>
    )
  }
}
