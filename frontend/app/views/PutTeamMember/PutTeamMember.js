import React from 'react'
import Button from 'components/Button/Button'
import Loading from 'components/Loading/Loading'
import FormInput from 'components/Input/FormInput'
import Delete from 'components/Delete/Delete'
import { browserHistory } from 'react-router'
import Validation from 'react-validation'
import s from './styles.css'

function AccountType (props) {
  function getButtonStyle (state) {
    if (state === props.userType) {
      return s.radioButtonOn
    } else {
      return s.radioButtonOff
    }
  }

  return (
    <div className={s.checkboxBlock}>
      <div>{'Account Type'}</div>
      <label className={s.checkboxWrapper}>
        <button
          className= {s.radioButton + ' ' + getButtonStyle('admin')}
          onClick={props.handleCheckboxChange.bind(this, 'admin')}>
        </button> {'Admin'}
      </label>
      <label className={s.checkboxWrapper}>
        <button
          className= {s.radioButton + ' ' + getButtonStyle('default')}
          onClick={props.handleCheckboxChange.bind(this, 'default')}>
        </button> {'Default'}
      </label>
    </div>
  )
}

AccountType.propTypes = {
  onChange: React.PropTypes.func,
}

export default class PutTeamMember extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: !this.props.isEditPage,
      email: '',
      firstName: '',
      lastName: '',
      userType: 'default',
      userId: null,
      submitStatus: 'unstarted',
    }
  }

  componentDidMount () {
    if (this.props.isEditPage) {
      const memberPromise = this.props.API.getTeamMember(this.props.params.userID)
      memberPromise
        .then((member) => {
          this.setState({
            loaded: true,
            email: member.email,
            firstName: member.firstName,
            lastName: member.lastName,
            userType: member.userType,
            userId: member.userId,
            tryDelete: false,
          })
          document.title = 'Edit Team Member'
        })
    } else {
      document.title = 'New Team Member'
    }
  }

  backToAdmin () {
    browserHistory.push('/admin')
  }

  handleInputChange = (key, ev) => {
    const val = ev.target.value
    const newState = {}
    newState[key] = val
    this.setState(newState)
  }

  handleCheckboxChange = (key, ev) => {
    ev.preventDefault()
    this.setState({userType: key})
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const formIsValid = this.checkFormValidation()
    if (formIsValid) {
      this.setState({
        submitStatus: 'pending',
      })
    }
  }

  handlePutMember = () => {
    let member = {
      email: this.state.email,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      userType: this.state.userType,
      userId: this.state.userId,
    }
    this.props.API.putTeamMember(member).then(browserHistory.push('/admin'))
    this.props.notifyWithBanner(`${this.state.firstName} ${this.state.lastName} was added to the team`, 'confirm')
  }

  handleTryDelete = () => {
    this.setState({tryDelete: !this.state.tryDelete})
  }

  handleRemoveMember = (id) => {
    this.props.API.deleteTeamMember(id).then(browserHistory.push('/admin'))
    this.props.notifyWithBanner(`${this.state.firstName} ${this.state.lastName} was removed from the team`, 'confirm')
  }

  handleClearError = () => {
    this.setState({
      submitStatus: 'unstarted',
    })
  }

  checkFormValidation = () => {
    const errors = this.form.validateAll()
    this.setState({
      formIsValid: Object.keys(errors).length === 0,
      errors: errors,
    }, function () {
      if (this.state.formIsValid) {
        this.handlePutMember()
      } else {
        this.setState({
          submitStatus: 'invalid',
        })
      }
    })
  }

  render () {
    function getStatus (type) {
      var text = {
        'unstarted': function () { return 'Submit' },
        'pending': function () { return 'Pending' },
        'failed': function () { return 'Error' },
        'invalid': function () { return 'Form is Invalid' },
        'default': function () { return 'Submit' },
      }
      return (text[type] || text['default'])()
    }
    return (
      <div className={s.view}>
        {this.state.loaded
        ? <div className={s.viewWrapper}>
          <Delete
            tryDelete={this.state.tryDelete}
            nameOfItem={this.state.firstName + ' ' + this.state.lastName}
            deleteType={'team member'}
            handleDeleteFunction={this.handleRemoveMember}
            handleTryDelete={this.handleTryDelete}
            itemId={this.state.userId}
            deleteMessage={'This team member will be removed. TAKE CAUTION!'}/>
          <div className={s.pageHeading}>
            <h3>{this.props.isEditPage ? 'Edit Team Member' : 'Create New Team Member'}</h3>
          </div>
          <Validation.components.Form className={s.formWrapper} ref={c => this.form = c} >
            <FormInput
              value={this.state.firstName}
              onChange={this.handleInputChange.bind(this, 'firstName')}
              onFocus={this.handleClearError}
              name={'firstName'}
              title={'First Name *'}
              placeholder={'Mary'}
              validations={['required']}/>
            <FormInput
              value={this.state.lastName}
              onChange={this.handleInputChange.bind(this, 'lastName')}
              onFocus={this.handleClearError}
              name={'lastName'}
              title={'Last Name *'}
              placeholder={'Omela'}
              validations={['required']}/>
            <FormInput
              value={this.state.email}
              onChange={this.handleInputChange.bind(this, 'email')}
              onFocus={this.handleClearError}
              name={'email'}
              title={'Email *'}
              placeholder={'omelamary@gmail.com'}
              validations={['required', 'email']}/>
            <AccountType
              handleCheckboxChange={this.handleCheckboxChange}
              userType={this.state.userType}/>
            </Validation.components.Form>
            <div className={s.buttonWrapper}>
            {this.props.isEditPage
              ? <Button
                onClick={this.handleTryDelete}
                type='submit'
                status='warn'
                text= {'Delete User'}/>
                : <div></div>}
              <div className={s.rightHandButtonWrapper}>
              <Button
                onClick={this.backToAdmin}
                type='submit'
                status='default'
                margin='right'
                text= {'Cancel'}/>
              <Button
                onClick={this.handleSubmit}
                type={'submit'}
                status={this.state.submitStatus}
                text= {getStatus(this.state.submitStatus)}/>
              </div>
            </div>
          </div>
        : <Loading />}
      </div>
    )
  }
}
