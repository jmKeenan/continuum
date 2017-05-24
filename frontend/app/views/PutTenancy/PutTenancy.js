import React from 'react'
import Button from 'components/Button/Button'
import Delete from 'components/Delete/Delete'
import Loading from 'components/Loading/Loading'
import FormInput from 'components/Input/FormInput'
import { browserHistory } from 'react-router'
import Validation from 'react-validation'
import s from './styles.css'
import fs from 'sharedStyles/formStyles.css'

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

export default class PutTenancy extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: !this.props.isEditPage,
      tenantName: '',
      seats: '0',
      accountType: 'monthly',
      contactName: '',
      contactTitle: '',
      accountEmail: '',
      comments: '',
      id: null,
      submitStatus: 'default',
      buttonStyle: s.submitButton,
      tryDelete: false,
    }
  }

  componentDidMount () {
    if (this.props.isEditPage) {
      const tenancyPromise = this.props.API.getTenancy(this.props.params.tenancyID)
      tenancyPromise
        .then((tenancy) => {
          this.setState({
            loaded: true,
            tenancy: tenancy,
            tenantName: tenancy.tenancySlug,
            seats: tenancy.numSeats,
            accountType: tenancy.accountType,
            contactName: tenancy.contactName,
            contactTitle: tenancy.contactTitle,
            accountEmail: tenancy.accountEmail,
            comments: tenancy.comments,
            id: tenancy.tenancyId,
          })
          document.title = tenancy.tenancySlug
        })
    }
  }

  backToAdmin () {
    browserHistory.push('/superAdmin')
  }

  handleInputChange = (key, ev) => {
    const val = ev.target.value
    const newState = {}
    newState[key] = val
    this.setState(newState)
  }

  handleClearError = () => {
    this.setState({
      submitStatus: 'default',
      buttonStyle: s.submitButton,
    })
  }

  checkFormValidation = () => {
    const errors = this.form.validateAll()
    this.setState({
      formIsValid: Object.keys(errors).length === 0,
      errors: errors,
    }, function () {
      if (this.state.formIsValid) {
        this.handlePutTenancy()
      } else {
        this.setState({
          submitStatus: 'invalid',
          buttonStyle: s.submitButtonError,
        })
      }
    })
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

  handlePutTenancy = () => {
    let tenancy = {
      tenancySlug: this.state.tenantName,
      numSeats: this.state.seats.toString(),
      accountType: this.state.accountType,
      contactName: this.state.contactName,
      contactTitle: this.state.contactTitle,
      accountEmail: this.state.accountEmail,
      comments: this.state.comments,
      tenancyId: this.state.id,
    }
    this.props.API.putTenancy(tenancy).then(browserHistory.push('/superAdmin/'))
    this.props.notifyWithBanner(`${this.state.tenantName} was added to Continuum`, 'confirm')
  }
  handleTryDelete = () => {
    this.setState({tryDelete: !this.state.tryDelete})
  }
  handleRemoveTenancy = (id) => {
    this.props.API.deleteTenancy(id).then(browserHistory.push('/superAdmin/'))
    this.props.notifyWithBanner(`Tenant ${this.state.tenantName} was removed from Continuum`, 'confirm')
  }
  render () {
    function getStatus (type) {
      var text = {
        'default': function () { return 'Submit' },
        'pending': function () { return 'Pending' },
        'failed': function () { return 'Error' },
        'invalid': function () { return 'Form is Invalid' },
      }
      return (text[type] || text['default'])()
    }
    return (
      <div className={s.view}>
        {this.state.loaded
        ? <div className={s.viewWrapper}>
          <Delete
            tryDelete={this.state.tryDelete}
            nameOfItem={this.state.tenantName}
            deleteType={'tenancy'}
            handleDeleteFunction={this.handleRemoveTenancy}
            handleTryDelete={this.handleTryDelete}
            itemId={this.state.id}
            deleteMessage={'If you delete this all users will lose access to their collateral. TAKE CAUTION!'}/>
          <div className={s.pageHeading}>
            <h3>{this.props.isEditPage ? 'Edit Tenancy' : 'Create New Tenancy'}</h3>
          </div>
          <Validation.components.Form className={s.formWrapper} ref={c => this.form = c} >
            <FormInput
              value={this.state.tenantName}
              onChange={this.handleInputChange.bind(this, 'tenantName')}
              onFocus={this.handleClearError}
              name={'tenantName'}
              title={'Tenant Name *'}
              placeholder={'Mary'}
              validations={['required']}/>
            <FormInput
              value={this.state.seats}
              onChange={this.handleInputChange.bind(this, 'seats')}
              onFocus={this.handleClearError}
              name={'seats'}
              title={'Number of Seats *'}
              placeholder={'How many tenants?'}
              validations={['required']}/>
            <FormInput
              value={this.state.contactName}
              onChange={this.handleInputChange.bind(this, 'contactName')}
              onFocus={this.handleClearError}
              name={'contactName'}
              title={'Contact Name *'}
              placeholder={'Who is the point of contact?'}
              validations={['required']}/>
            <FormInput
              value={this.state.contactTitle}
              onChange={this.handleInputChange.bind(this, 'contactTitle')}
              onFocus={this.handleClearError}
              name={'contactTitle'}
              title={'Contact Title *'}
              placeholder={'What is the contact\'s title?'}
              validations={['required']}/>
            <FormInput
              value={this.state.accountEmail}
              onChange={this.handleInputChange.bind(this, 'accountEmail')}
              onFocus={this.handleClearError}
              name={'accountEmail'}
              title={'Account Email *'}
              placeholder={'What is the contact\'s email?'}
              validations={['required', 'email']}/>
            <label className={fs.labelWrapper}>
            <div className={fs.heading}>{'Comments'}</div>
            <Validation.components.Textarea
              autoComplete={'off'}
              className={fs.textArea}
              value={this.state.comments}
              onFocus={this.clearError}
              onChange={this.handleInputChange.bind(this, 'comments')}
              name={'comments'}
              placeholder={'A place for comments'}
              validations={[]}/>
            </label>
          </Validation.components.Form>
          <div className={s.buttonWrapper}>
          {this.props.isEditPage
            ? <Button
              onClick={this.handleTryDelete}
              type='submit'
              status='warn'
              text= {'Delete Tenancy'}/>
              : <div/>}
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
