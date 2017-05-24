import React from 'react'
import { browserHistory } from 'react-router'
import { storeSessionToken } from 'helpers/auth'
import s from './styles.css'
import Validation from 'react-validation'
import FormInput from 'components/Input/FormInput'
import Button from 'components/Button/Button'

export default class AccountActivationForm extends React.Component {
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
      email: '',
      confirmationMessage: false,
    }
  }

  componentDidMount = () => {
    if (this.props.loggedIn) {
      // if they are already logged in, redirect them to home
      browserHistory.push('/')
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
      this.activateAccountHelper(this.state.email, this.state.password, this.props.params.secretLink)
    }
  }

  checkFormValidation = () => {
    const errors = this.form.validateAll()
    const formIsValid = Object.keys(errors).length === 0
    this.setState({
      formIsValid: formIsValid,
      errors: errors,
    })
    if (!formIsValid) {
      this.setState({
        submitStatus: 'invalid',
      })
    }
    return formIsValid
  }

  activateAccountHelper = (email, newPassword, secretLink) => {
    return this.props.API.activateAccount(email, newPassword, secretLink).then((response) => {
      if (response.success) {
        storeSessionToken(response.token)
        this.displayConfirmationMessage()
        setTimeout(() => {
          // provideUser fetches the logged in user from the backend
          // after fetching the user, redirect to the home page
          this.props.provideUser().then(() => {
            browserHistory.push('/')
          })
        }, 3000)
      } else {
        this.props.notifyWithBanner('Continuum encountered an error 😞', 'warn', true)
      }
    })
  }

  displayConfirmationMessage = () => {
    this.setState({
      confirmationMessage: true,
    })
  }

  render = () => {
    function getStatus (type) {
      var text = {
        'default': function () { return 'Create Account' },
        'pending': function () { return 'Trying' },
        'failed': function () { return 'Couldn\'t reach server' },
        'invalid': function () { return 'Passwords don\'t match' },
      }
      return (text[type] || text['default'])()
    }

    function drawConfirm (state) {
      let opacity = s.opacity
      switch (state) {
        case true:
          opacity = s.noOpacity
          break
        case false:
          opacity = s.opacity
          break
        default: opacity = s.opacity
      }

      let styles = [s.loginInputWrapper, opacity]
      return (
        styles.join(' ')
      )
    }

    function drawCheckmark (state) {
      if (state) {
        let styles = [s.checkmarkContainer, s.checkmarkOn]
        return styles.join(' ')
      } else {
        return s.checkmarkContainer
      }
    }

    return (
      <div className={s.signinCard}>
      <div className={drawCheckmark(this.state.confirmationMessage)}>
        <div className={s.successCheckmark} />
        {'Thank you, you are now registered on Continuum'}
      </div>
        <div className={drawConfirm(this.state.confirmationMessage)}>
        <Validation.components.Form className={s.mainFormWrapper} ref={c => this.form = c} >
        <FormInput
          title={'Email *'}
          name={'email'}
          value={this.state.email}
          onChange={this.handleInputChange.bind(this, 'email')}
          onFocus={this.clearError}
          validations={['required']}/>
        <FormInput
          title={'Password *'}
          name={'password'}
          type={'password'}
          value={this.state.password}
          onChange={this.handleInputChange.bind(this, 'password')}
          onFocus={this.clearError}
          validations={['required', 'password']}/>
        <FormInput
          title={'Confirm Password *'}
          name={'passwordConfirm'}
          type={'password'}
          value={this.state.passwordConfirm}
          onChange={this.handleInputChange.bind(this, 'passwordConfirm')}
          onFocus={this.clearError}
          validations={['required', 'password']}/>
        <section className={s.passwordRequirements}>
          {'Password must be 8 characters or longer and include a number, uppercase letter or special character.'}
        </section>
        <Button
          onClick={(e) => this.handleSubmit(e)}
          type='submitWide'
          status={this.state.submitStatus}
          text= {getStatus(this.state.submitStatus)}/>
        </Validation.components.Form >
        </div>
      </div>
    )
  }
}
