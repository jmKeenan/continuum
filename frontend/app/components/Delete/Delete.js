import React from 'react'
import Validation from 'react-validation'
import Button from 'components/Button/Button'
import s from './styles.css'
import fs from 'sharedStyles/formStyles.css'

function StrongConfirm (props) {
  return (
    <div>
      <div className={s.check1}>{`Are you absolutely sure you would like to delete this ${props.deleteType}?`}</div>
      <div className={s.check2}>{`A deleted ${props.deleteType} cannot be restored`}</div>
      <div className={s.check3}>{props.deleteMessage}</div>
      <Validation.components.Form className={s.formWrapper} ref={props.formRef} >
        <ConfirmFormInput
          value={props.inputValue}
          handleInputChange={props.handleInputChange}
          name={'deleteValue'}
          placeholder={`Type the name of this ${props.deleteType} to confirm`}
          title={props.nameOfItem}
          validations={['required']}/>
      </Validation.components.Form>
    </div>
  )
}

function LightConfirm (props) {
  return (
    <div>
      <div className={s.lightCheck1}>{`Are you absolutely sure you would like to delete this ${props.deleteType}?`}</div>
      <div className={s.check2}>{`Deleted ${props.deleteType} cannot be restored`}</div>
    </div>
  )
}

function ConfirmFormInput (props) {
  return (
    <div className={s.inputWrapperFull}>
      <label className={fs.labelWrapper}>
        {'Please type '}<span className={s.toDelete}>{props.title}</span>{' to confirm'}
        <Validation.components.Input
          autoComplete={'off'}
          onChange={props.handleInputChange}
          onFocus={props.handleOnFocus}
          className={fs.default}
          value={props.value}
          placeholder={props.placeholder}
          name={props.name}
          validations={props.validations}
          errorClassName={fs.invalidInput} />
      </label>
    </div>
  )
}

export default class Delete extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      inputValue: '',
      submitStatus: 'unstarted',
    }
  }
  handleInputChange = (ev) => {
    this.handleClearError()
    const val = ev.target.value
    this.setState({inputValue: val})
  }
  handleClearError = () => {
    this.setState({
      submitStatus: 'unstarted',
    })
  }
  handleLightDeleteFunction = () => {
    this.props.handleDeleteFunction(this.props.itemId)
  }
  handleDeleteFunction = () => {
    if (this.state.inputValue.replace(/\s/g, '') === this.props.nameOfItem.replace(/\s/g, '')) {
      this.props.handleDeleteFunction(this.props.itemId)
    } else {
      this.setState({
        submitStatus: 'invalid',
      })
    }
  }

  render () {
    return (
      <div className={this.props.tryDelete ? s.box : s.boxHidden}>
        <div onClick={this.props.handleTryDelete} className={s.lightDismiss}></div>
        <div className={s.modal}>
          <div className={s.close} onClick={this.props.handleTryDelete}>{'✕'}</div>
          <div className={s.content}>
            {this.props.deleteType === 'tag' || this.props.deleteType === 'collateral'
              ? <LightConfirm nameOfItem={this.props.nameOfItem} deleteType={this.props.deleteType} />
              : <StrongConfirm
                deleteMessage={this.props.deleteMessage}
                inputValue={this.state.inputValue}
                deleteType={this.props.deleteType}
                nameOfItem={this.props.nameOfItem}
                formRef={c => this.form = c}
                handleInputChange={(ev) => this.handleInputChange(ev)} />}
            </div>
          <div className={s.buttonWrapper}>
            <Button
              text={'Cancel'}
              onClick={this.props.handleTryDelete}
              type='small' />
            <Button
              text={this.state.submitStatus === 'invalid' ? 'Input does not match' : `Yes, delete this ${this.props.deleteType}`}
              status={'warn'}
              onClick={this.props.deleteType === 'tag' || this.props.deleteType === 'collateral' ? this.handleLightDeleteFunction : this.handleDeleteFunction}
              type='small' />
          </div>
        </div>
      </div>
    )
  }
}
