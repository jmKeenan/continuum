import React from 'react'
import { browserHistory } from 'react-router'
import Loading from 'components/Loading/Loading'
import Button from 'components/Button/Button'
import Validation from 'react-validation'
import 'helpers/validationRules'
import s from './styles.css'

import TagSelection from 'components/TagSelection/TagSelection'
import {MarketingMaterialForm, DefaultForm} from './FormDefinitions'

export default class PutCollateral extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      errors: {},
      originalCollateral: false,
      collateralType: '', // set a default collateral type
      collateralTitle: '',
      collateralAccountName: '',
      collateralContactTitle: '',
      collateralContactName: '',
      collateralText: '',
      collateralPermissions: 'no', // yes, ask or no
      collateralConfidentiality: '',
      collateralDate: '',
      collateralLink: '',
      collateralFileLink: '',
      collateralTagIds: [], // This is unused on frontend... required for backend
      formIsValid: false,
      formErrors: {},
      selectedTags: [],
      categories: [],
      loaded: false,
      submitStatus: 'default',
    }
  }

  componentDidMount = () => {
    const categoriesPromise = this.props.API.getCategories()
    if (this.props.isEditCollateralPage) {
      const collateralPromise = this.props.API.getCollateral(this.props.params.collateralId)
      Promise.all([collateralPromise, categoriesPromise])
        .then(([collateral, categories]) => {
          let oldSelectedTags = []
          let selectedCategoriesArray = Object.values(collateral.tagsByCategory)
          selectedCategoriesArray.map(function (item, index) {
            let tagsInCategories = Object.values(item)
            tagsInCategories.map(function (item, index) {
              oldSelectedTags.push(item.tagId)
            })
          })
          this.setState({
            categories: categories,
            originalCollateral: collateral,

            collateralType: collateral.collateralType,
            collateralTitle: collateral.collateralTitle,

            collateralAccountName: collateral.collateralAccountName,
            collateralContactTitle: collateral.collateralContactTitle,
            collateralContactName: collateral.collateralContactName,
            collateralFileLink: collateral.collateralFileLink,
            collateralLink: collateral.collateralLink,

            collateralText: collateral.collateralText,

            collateralPermissions: collateral.collateralReferenceability,
            collateralConfidentiality: collateral.collateralConfidentiality,

            collateralTagIds: collateral.tagsByCatagory,
            selectedTags: oldSelectedTags,
            formIsValid: true,
            loaded: true,
            submitStatus: 'default',
          })
          document.title = collateral.collateralName
        })
    } else {
      Promise.all([categoriesPromise])
        .then(([categories]) => {
          this.setState({
            categories: categories,
            loaded: true,
            collateralType: 'success_story',
          })
          document.title = 'New Collateral'
        })
    }
  }

  handleSubmit = (event) => {
    this.setState({
      submitStatus: 'pending',
    })
    event.preventDefault()
    this.checkFormValidation()
  }

  clearError = () => {
    this.setState({
      submitStatus: 'default',
    })
  }

  submitTheForm = () => {
    var today = new Date()
    var timeStamp = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()

    const collateralParams = {
      collateralType: this.state.collateralType,
      collateralTitle: this.state.collateralTitle,
      collateralAccountName: this.state.collateralAccountName,
      collateralContactTitle: this.state.collateralContactTitle,
      collateralContactName: this.state.collateralContactName,
      collateralText: this.state.collateralText,
      collateralReferenceability: this.state.collateralPermissions,
      collateralConfidentiality: this.state.collateralConfidentiality,
      collateralDate: timeStamp,
      collateralFileLink: this.state.collateralFileLink,
      collateralLink: this.state.collateralLink,
      collateralTagIds: this.state.selectedTags,
    }
    if (this.props.isEditCollateralPage) {
      collateralParams.collateralId = this.props.params.collateralId
    }
    this.props.API.putCollateral(collateralParams).then(function (collateral) {
      browserHistory.push(`/collateral/${collateral.collateralId}`)
    })
    !this.props.isEditCollateralPage ? null : this.props.notifyWithBanner(`Collateral ${this.state.collateralTitle} was edited`, 'confirm')
  }

  handleTagSelection = (name) => {
    this.state.selectedTags.indexOf(name) === -1 ? this.state.selectedTags.push(name) : this.state.selectedTags.splice(this.state.selectedTags.indexOf(name), 1)
    this.setState({selectedTags: this.state.selectedTags})
  }

  handleInputChange = (key, ev) => {
    const val = ev.target.value
    const newState = {}
    newState[key] = val
    this.setState(newState)
  }

  handleCheckboxChange = (key, ev) => {
    ev.preventDefault()
    if (this.state.collateralPermissions === key) {
      this.setState({collateralPermissions: 'no'})
    } else {
      this.setState({collateralPermissions: key})
    }
  }

  checkFormValidation = () => {
    const errors = this.form.validateAll()
    this.setState({
      formIsValid: Object.keys(errors).length === 0,
      errors: errors,
    }, function () {
      if (this.state.formIsValid) {
        this.submitTheForm()
      } else {
        this.setState({
          submitStatus: 'error',
        })
      }
    })
  }

  handleCollateralTypeChange = (key, ev) => {
    this.setState({
      collateralType: key,
    })
  }

  getButtonStyle = (type) => {
    if (type === this.state.collateralType) {
      return 'on'
    } else {
      return 'off'
    }
  }

  render = () => {
    function getFormType (
      currentForm,
      handleInputChange,
      originalCollateral,
      clearError,
      handleCheckboxChange,
      collateralPermissions) {
      switch (currentForm) {
        case 'success_story' :
          return <DefaultForm
            handleInputChange={handleInputChange}
            handleCheckboxChange={handleCheckboxChange}
            originalCollateral={originalCollateral}
            collateralPermissions={collateralPermissions}
            formType={currentForm}
            clearError={clearError}/>
        case 'marketing_material':
          return <MarketingMaterialForm
            handleInputChange={handleInputChange}
            handleCheckboxChange={handleCheckboxChange}
            originalCollateral={originalCollateral}
            collateralPermissions={collateralPermissions}
            formType={currentForm}
            clearError={clearError}/>
        case 'delighted_customer':
          return <DefaultForm
            handleInputChange={handleInputChange}
            handleCheckboxChange={handleCheckboxChange}
            originalCollateral={originalCollateral}
            collateralPermissions={collateralPermissions}
            formType={currentForm}
            clearError={clearError}/>
        default:
          return null
      }
    }

    function getStatus (type) {
      var text = {
        'default': function () { return 'Submit' },
        'pending': function () { return 'Submitting' },
        'failed': function () { return 'There was an error' },
        'error': function () { return 'More fields required' },
      }
      return (text[type] || text['default'])()
    }

    return (
      <div className={s.view}>
      {this.state.loaded
        ? <div className={s.viewWrapper}>
          <div className={s.pageHeading}>
            <p>{'Select Collateral Type'}</p>
          </div>
          <div className={s.dashButtonSection}>
            <Button
              onClick={this.handleCollateralTypeChange.bind(this, 'success_story')}
              type='large'
              status={this.getButtonStyle('success_story')}
              text= 'Success Story' />
            <Button
              onClick={this.handleCollateralTypeChange.bind(this, 'marketing_material')}
              type='large'
              status={this.getButtonStyle('marketing_material')}
              text= 'Marketing Material' />
            <Button
              onClick={this.handleCollateralTypeChange.bind(this, 'delighted_customer')}
              type='large'
              status={this.getButtonStyle('delighted_customer')}
              text= 'Delighted Customer' />
          </div>

          <Validation.components.Form className={s.formWrapper} ref={c => this.form = c} >
            {getFormType(
              this.state.collateralType,
              this.handleInputChange,
              this.state.originalCollateral,
              this.clearError,
              this.handleCheckboxChange,
              this.state.collateralPermissions
              )}
            <section className={s.tagSelectionWrapper}>
              <h3>{'Select all attributes that apply'}</h3>
              <TagSelection
                style={'addCollateral'}
                categories={this.state.categories}
                handleFilterFeed={this.handleTagSelection}
                collateralLoaded={this.state.loaded}
                isEditCollateralPage={this.props.isEditCollateralPage}
                originalCollateral={this.props.isEditCollateralPage ? this.state.originalCollateral : {}}/>
            </section>
          <div className={s.buttonWrapper}>
          <Button
            onClick={() => browserHistory.push('/')}
            type='submit'
            status={'default'}
            text= {'Cancel'}/>
          <Button
            onClick={this.handleSubmit}
            type='submit'
            status={this.state.submitStatus}
            text= {getStatus(this.state.submitStatus)}/>
          </div>
          </Validation.components.Form>
        </div>
      : <Loading />}
      </div>
    )
  }
}
