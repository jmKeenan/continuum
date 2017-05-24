import React from 'react'
import Validation from 'react-validation'
import 'helpers/validationRules'
import s from './styles.css'
import fs from 'sharedStyles/formStyles.css'

function CollateralTitle (props) {
  let getPlaceholder = () => {
    if (props.formType === 'success_story') {
      return 'Ex: Aerospace company saves 10%'
    } else if (props.formType === 'marketing_material') {
      return 'Ex: Non-technical product overview'
    } else {
      return 'Ex: Large bank loves us!'
    }
  }
  return (
    <div className={s.inputWrapperFull}>
      <label className={fs.labelWrapper}>
      <div className={fs.heading}> {'Collateral Title *'} </div>
        <Validation.components.Input
          autoComplete={'off'}
          onChange={props.onChange}
          onFocus={props.clearError}
          className={fs.default}
          value={props.originalCollateral ? props.originalCollateral.collateralTitle : ''}
          placeholder={getPlaceholder()}
          name='collateralTitle'
          validations={['required']}
          errorClassName={fs.invalidInput}/>
      </label>
    </div>
  )
}
CollateralTitle.propTypes = {
  onChange: React.PropTypes.func,
}

function CollateralAccountName (props) {
  return (
    <div className={s.inputWrapperHalf}>
      <label className={fs.labelWrapper}>
      <div className={fs.heading}> {'Account Name'} </div>
        <Validation.components.Input
          autoComplete={'off'}
          onChange={props.onChange}
          className={fs.default}
          value={props.originalCollateral ? props.originalCollateral.collateralAccountName : ''}
          name='collateralAccountName'
          validations={[]}/>
      </label>
    </div>
  )
}
CollateralAccountName.propTypes = {
  onChange: React.PropTypes.func,
}

function CollateralLink (props) {
  return (
    <div className={s.inputWrapperHalf}>
      <label className={fs.labelWrapper}>
      <div className={fs.heading}> {'Link to CRM'} </div>
        <Validation.components.Input
          autoComplete={'off'}
          onChange={props.onChange}
          className={fs.default}
          value={props.originalCollateral ? props.originalCollateral.collateralLink : ''}
          name='collateralLink'
          validations={[]}/>
      </label>
    </div>
  )
}
CollateralLink.propTypes = {
  onChange: React.PropTypes.func,
}

function CollateralContactName (props) {
  return (
    <div className={s.inputWrapperHalf}>
      <label className={fs.labelWrapper}>
      <div className={fs.heading}> {'Contact Name'} </div>
        <Validation.components.Input
          autoComplete={'off'}
          onFocus={props.clearError}
          onChange={props.onChange}
          className={fs.default}
          value={props.originalCollateral ? props.originalCollateral.collateralContactName : ''}
          name='collateralContactTitle'
          validations={[]}/>
      </label>
    </div>
  )
}
CollateralContactName.propTypes = {
  onChange: React.PropTypes.func,
}

function CollateralContactTitle (props) {
  return (
    <div className={s.inputWrapperHalf}>
      <label className={fs.labelWrapper}>
      <div className={fs.heading}>{'Contact Title'} </div>
        <Validation.components.Input
          autoComplete={'off'}
          onFocus={props.clearError}
          onChange={props.onChange}
          className={fs.default}
          value={props.originalCollateral ? props.originalCollateral.collateralContactTitle : ''}
          name='collateralContactTitle'
          validations={[]}/>
      </label>
    </div>
  )
}
CollateralContactTitle.propTypes = {
  onChange: React.PropTypes.func,
}

function CollateralText (props) {
  let getPlaceholder = () => {
    if (props.formType === 'success_story') {
      return 'Describe how we helped the client, what they achieved, and anything positive they said about working with us'
    } else if (props.formType === 'marketing_material') {
      return 'Tell your colleagues any details about this material. What is it\'s main purpose? Who or what situations was it designed for?'
    } else {
      return 'Did this client say anything positive about working with us? Feel free to include quotes and details!'
    }
  }
  let getTitle = () => {
    if (props.formType === 'success_story') {
      return 'Description *'
    } else if (props.formType === 'marketing_material') {
      return 'Description *'
    } else {
      return 'Story Details *'
    }
  }
  return (
    <div className={s.inputWrapperFull}>
      <label className={fs.labelWrapper}>
      <div className={fs.heading}>{getTitle()} </div>
        <Validation.components.Textarea
          autoComplete={'off'}
          onFocus={props.clearError}
          onChange={props.onChange}
          placeholder={getPlaceholder()}
          className={fs.textArea}
          name='collateralText'
          value={props.originalCollateral ? props.originalCollateral.collateralText : ''}
          validations={['required']}
          errorClassName={fs.invalidInput}/>
      </label>
    </div>
  )
}
CollateralText.propTypes = {
  onChange: React.PropTypes.func,
}

function CollateralPermissions (props) {
  function getButtonStyle (state) {
    if (state === props.collateralPermissions) {
      return s.radioButtonOn
    } else {
      return s.radioButtonOff
    }
  }

  return (
    <div className={s.checkboxBlock}>
      <label className={s.checkboxWrapper}>
        <button
          className= {s.radioButton + ' ' + getButtonStyle('yes')}
          onClick={props.handleCheckboxChange.bind(this, 'yes')}>
        </button> {'This client will serve as a reference'}
      </label>
      <label className={s.checkboxWrapper}>
        <button
          className= {s.radioButton + ' ' + getButtonStyle('ask')}
          onClick={props.handleCheckboxChange.bind(this, 'ask')}>
        </button> {'You can request a reference'}
      </label>
    </div>
  )
}

CollateralPermissions.propTypes = {
  onChange: React.PropTypes.func,
}

function Confidentiality (props) {
  let getPlaceholder = () => {
    if (props.formType === 'success_story') {
      return 'If there is any aspect of this story that should NOT be shared, tell your colleagues here (Optional)'
    } else if (props.formType === 'marketing_material') {
      return ''
    } else {
      return 'If there is any aspect of this information that should NOT be shared, tell your colleagues here (optional)'
    }
  }
  return (
    <div className={s.inputWrapperFull}>
      <label className={fs.labelWrapper}>
      <div className={fs.heading}>{'Confidentiality'} </div>
        <Validation.components.Textarea
          autoComplete={'off'}
          onFocus={props.clearError}
          onChange={props.onChange}
          placeholder={getPlaceholder()}
          className={fs.textAreaSmall}
          name='collateralConfidentiality'
          value={props.originalCollateral ? props.originalCollateral.collateralConfidentiality : ''}
          validations={[]}
          errorClassName={fs.invalidInput}/>
      </label>
    </div>
  )
}
Confidentiality.propTypes = {
  onChange: React.PropTypes.func,
}

function CollateralFileLink (props) {
  return (
    <div className={s.inputWrapperHalf}>
      <label className={fs.inputWrapper}>
      <div className={fs.heading}>{'Link to File'} </div>
        <Validation.components.Input
        onFocus={props.clearError}
          autoComplete={'off'}
          onChange={props.onChange}
          className={fs.default}
          value={props.originalCollateral ? props.originalCollateral.collateralFileLink : ''}
          name='collateralFileLink'
          validations={[]}/>
      </label>
    </div>
  )
}
CollateralFileLink.propTypes = {
  onChange: React.PropTypes.func,
}

function MaketingMaterialComments (props) {
  return (
    <div className={s.inputWrapperFull}>
      <label className={fs.labelWrapper}>
      <div className={fs.heading}>{'Description'} </div>
        <Validation.components.Textarea
          onFocus={props.clearError}
          autoComplete={'off'}
          onChange={props.onChange}
          className={fs.textArea}
          placeholder={'Tell your colleagues any details about this material. What is it\'s main purpose? Who or what situations was it designed for?'}
          name='collateralText'
          value={props.originalCollateral ? props.originalCollateral.collateralText : ''}
          validations={[]}
          errorClassName={fs.invalidInput}/>
      </label>
    </div>
  )
}

MaketingMaterialComments.propTypes = {
  onChange: React.PropTypes.func,
}

export function DefaultForm (props) {
  let handleInputChange = props.handleInputChange
  let handleCheckboxChange = props.handleCheckboxChange
  let originalCollateral = props.originalCollateral
  let clearError = props.clearError
  let collateralPermissions = props.collateralPermissions
  let formType = props.formType

  return (
    <div>
      <CollateralTitle
        originalCollateral={originalCollateral}
        onChange={handleInputChange.bind(this, 'collateralTitle')}
        clearError={clearError}
        formType = {formType}/>
      <section className = {s.section}>
        <CollateralAccountName
          originalCollateral={originalCollateral}
          onChange={handleInputChange.bind(this, 'collateralAccountName')}
          formType = {formType} />
        <CollateralLink
          originalCollateral={originalCollateral}
          onChange={handleInputChange.bind(this, 'collateralLink')}
          formType = {formType} />
      </section>

      <section className = {s.section}>
        <CollateralContactName
          originalCollateral={originalCollateral}
          onChange={handleInputChange.bind(this, 'collateralContactName')}
          formType = {formType} />
        <CollateralContactTitle
          originalCollateral={originalCollateral}
          onChange={handleInputChange.bind(this, 'collateralContactTitle')}
          formType = {formType} />
      </section>

      <section className = {s.section}>
        <CollateralText
          originalCollateral={originalCollateral}
          onChange={handleInputChange.bind(this, 'collateralText')}
          clearError={clearError}
          formType = {formType}/>
      </section>

      <section className = {s.checkboxSection}>
        <div className={s.sectionHeader}>{'Referenceability – optional'}</div>
          <CollateralPermissions
            originalCollateral={originalCollateral}
            handleCheckboxChange={handleCheckboxChange}
            collateralPermissions={collateralPermissions}
            formType = {formType} />
      </section>

      <section className = {s.section}>
        <Confidentiality
          originalCollateral={originalCollateral}
          onChange={handleInputChange.bind(this, 'collateralConfidentiality')}
          formType = {formType} />
      </section>
    </div>
  )
}
DefaultForm.propTypes = {
  handleInputChange: React.PropTypes.func,
}

export function MarketingMaterialForm (props) {
  let handleInputChange = props.handleInputChange
  let originalCollateral = props.originalCollateral
  let formType = props.formType

  return (
    <div>
      <CollateralTitle
        originalCollateral={originalCollateral}
        onChange={handleInputChange.bind(this, 'collateralTitle')}
        formType = {formType}/>
      <section className = {s.section}>
        <CollateralAccountName
          originalCollateral={originalCollateral}
          onChange={handleInputChange.bind(this, 'collateralAccountName')}
          formType = {formType}/>
        <CollateralFileLink
          originalCollateral={originalCollateral}
          onChange={handleInputChange.bind(this, 'collateralFileLink')}
          formType = {formType}/>
      </section>

      <section className = {s.section}>
        <MaketingMaterialComments
        originalCollateral={originalCollateral}
        onChange={handleInputChange.bind(this, 'collateralText')}
        formType = {formType}/>
      </section>
    </div>
  )
}
DefaultForm.propTypes = {
  handleInputChange: React.PropTypes.func,
}
