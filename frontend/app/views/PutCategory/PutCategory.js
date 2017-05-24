import React from 'react'
import Button from 'components/Button/Button'
import {PutTags} from './PutTags'
import { browserHistory } from 'react-router'
import Delete from 'components/Delete/Delete'
import Loading from 'components/Loading/Loading'
import FormInput from 'components/Input/FormInput'
import Validation from 'react-validation'

import s from './styles.css'

export default class PutCategory extends React.Component {
  constructor (props) {
    super(props)
    const emptyCategory = { // Empty data to begin adding new category
      categoryName: '',
      categoryIndex: 0,
      categoryId: null,
      tags: [],
      tryDelete: false,
    }
    this.state = {
      loaded: !this.props.isEditPage,
      deletedTags: [],
      category: emptyCategory,
      submitStatus: 'unstarted',
    }
  }
  componentDidMount () {
    if (this.props.isEditPage) {
      const categoryPromise = this.props.API.getCategory(this.props.params.categoryID)
      categoryPromise
        .then((category) => {
          // Normalize tagIndex values to prevent editing bugs
          category.tags.map(function (tag, index) {
            tag.tagIndex = index
          })
          this.setState({
            loaded: true,
            category: category,
          })
          document.title = 'Edit Category'
        })
    } else {
      document.title = 'New Category'
    }
  }
  backToAdmin () {
    browserHistory.push('/admin')
  }
  handleNameChange = (e) => {
    let alteredCategory = this.state.category
    alteredCategory.categoryName = e.target.value
    this.setState({category: alteredCategory})
  }
  handleSetDeletedTags = (tagId, index) => {
    let alteredCategory = this.state.category
    let deletedTags = this.state.deletedTags
    alteredCategory.tags.splice(index, 1)
    if (tagId != null) {
      deletedTags.includes(tagId) ? null : deletedTags.push(tagId)
    }
    /* Updates the array of deleted tagIds. Accpets an array of tagIds */
    this.setState({
      deletedTags: deletedTags,
      category: alteredCategory,
    })
  }
  handleSetCategoryTags = (newTags) => {
    /* Updates the tags in the state. Accepts an array of tags */
    let alteredCategory = this.state.category
    alteredCategory.tags = newTags
    this.setState({
      category: alteredCategory,
    })
  }

  checkFormValidation = () => {
    const errors = this.form.validateAll()
    this.setState({
      formIsValid: Object.keys(errors).length === 0,
      errors: errors,
    }, function () {
      if (this.state.formIsValid) {
        this.handleMakeCategory()
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

  handleClearError = () => {
    this.setState({
      submitStatus: 'unstarted',
      buttonStyle: s.submitButton,
    })
  }

  handleMakeCategory = () => {
    /* Constructs or Updates a category - if categoryId is null creates new category, if included updates existing category */
    let reconstructedTags = []
    this.state.category.tags.map(function (tag, index) {
      /* Checks if a tag was added, then deleted before submitting - see PutTags.js*/
      tag.deleted === undefined ? reconstructedTags.push(tag) : null
    })
    let data = {
      categoryName: this.state.category.categoryName,
      categoryId: this.state.category.categoryId,
      categoryIndex: 0,
      putTags: reconstructedTags,
      deleteTags: this.state.deletedTags,
    }
    this.props.API.putCategory(data).then(function (data) {
      browserHistory.push('/admin')
    })
    !this.props.isEditPage ? this.props.notifyWithBanner(`Category ${this.state.category.categoryName} was added`, 'confirm') : null
  }

  handleTryDelete = () => {
    this.setState({tryDelete: !this.state.tryDelete})
  }
  handleRemoveCategory = (id) => {
    this.props.API.deleteCategory(id).then(function (data) {
      browserHistory.push('/admin')
    })
    this.props.notifyWithBanner(`Category ${this.state.category.categoryName} was deleted`, 'confirm')
  }
  render () {
    function getStatus (type) {
      var text = {
        'unstarted': function () { return 'Submit' },
        'pending': function () { return 'Pending' },
        'failed': function () { return 'Error' },
        'invalid': function () { return 'Category must have a name' },
        'default': function () { return 'Submit' },
      }
      return (text[type] || text['default'])()
    }
    return (
      <div className={s.view}>
        {this.state.loaded
        ? <div className={s.viewWrapper}>
          <div className={s.pageHeading}>
            <h3>{this.props.isEditPage ? 'Edit Category' : 'Create New Category'}</h3>
          </div>
          <Delete
            tryDelete={this.state.tryDelete}
            nameOfItem={this.state.category.categoryName}
            deleteType={'category'}
            handleDeleteFunction={this.handleRemoveCategory}
            handleTryDelete={this.handleTryDelete}
            itemId={this.state.category.categoryId}
            deleteMessage={'If you delete this all users will lose access to this category and its tags. TAKE CAUTION!'}/>
          <div className={s.description}>
          <div className={s.columnTitle}>{'Category Name'}</div>
          <Validation.components.Form className={s.formWrapper} ref={c => this.form = c} >
            <FormInput
              value={this.state.category.categoryName}
              onChange={this.handleNameChange}
              onFocus={this.handleClearError}
              name={'name'}
              title={''}
              placeholder='Give this category a name'
              validations={['required']}/>
          </Validation.components.Form>
          </div>
          <PutTags
            notifyWithBanner={this.props.notifyWithBanner}
            handleSetCategoryTags={this.handleSetCategoryTags} // Updates state with new tags
            handleSetDeletedTags={this.handleSetDeletedTags} // Adds deleted tagId to deletedTags
            tags={this.state.category.tags}
            deletedTags={this.state.deletedTags}
            loaded={this.state.loaded}/>
        <div className={s.buttonWrapper}>
        {this.props.isEditPage
          ? <Button
            onClick={this.handleTryDelete}
            type='submit'
            status='warn'
            text= {'Delete Category'}/>
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
            type='submit'
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
