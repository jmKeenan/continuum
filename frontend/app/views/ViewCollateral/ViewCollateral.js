import React from 'react'
import s from './styles.css'
import { browserHistory } from 'react-router'
import DisplayTag from 'components/DisplayTag/DisplayTag'
import Delete from 'components/Delete/Delete'
import Button from 'components/Button/Button'

function Warning (props) {
  return (
    <svg className={s.warning} version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      x='0px' y='0px'
      viewBox='0 0 486.463 486.463'>
      <g>
      <path d='M243.225,333.382c-13.6,0-25,11.4-25,25s11.4,25,25,25c13.1,0,25-11.4,24.4-24.4
      C268.225,344.682,256.925,333.382,243.225,333.382z'/>
      <path d='M474.625,421.982c15.7-27.1,15.8-59.4,0.2-86.4l-156.6-271.2c-15.5-27.3-43.5-43.5-74.9-43.5s-59.4,16.3-74.9,43.4
      l-156.8,271.5c-15.6,27.3-15.5,59.8,0.3,86.9c15.6,26.8,43.5,42.9,74.7,42.9h312.8
      C430.725,465.582,458.825,449.282,474.625,421.982z M440.625,402.382c-8.7,15-24.1,23.9-41.3,23.9h-312.8
      c-17,0-32.3-8.7-40.8-23.4c-8.6-14.9-8.7-32.7-0.1-47.7l156.8-271.4c8.5-14.9,23.7-23.7,40.9-23.7c17.1,0,32.4,8.9,40.9,23.8
      l156.7,271.4C449.325,369.882,449.225,387.482,440.625,402.382z'/>
      <path d='M237.025,157.882c-11.9,3.4-19.3,14.2-19.3,27.3c0.6,7.9,1.1,15.9,1.7,23.8c1.7,30.1,3.4,59.6,5.1,89.7
      c0.6,10.2,8.5,17.6,18.7,17.6c10.2,0,18.2-7.9,18.7-18.2c0-6.2,0-11.9,0.6-18.2c1.1-19.3,2.3-38.6,3.4-57.9
      c0.6-12.5,1.7-25,2.3-37.5c0-4.5-0.6-8.5-2.3-12.5C260.825,160.782,248.925,155.082,237.025,157.882z'/>
      </g>
      </svg>
  )
}

function CategoryTags (props) {
  return (
    <div className={s.categories}>
      {props.categoryTags.map((tag, index) =>
        <DisplayTag style={'match'} key={index} tag={tag}/>
      )}
    </div>
  )
}
CategoryTags.propTypes = {
  categoryTags: React.PropTypes.array,
}

function Category (props) {
  return (
    <div key={props.index} className={s.category}>
      <div className={s.categoryName}>{props.category.categoryName + ':'}</div>
      <div className={s.tagWrapper}>
        <CategoryTags categoryTags={props.tags}/>
      </div>
    </div>
  )
}
Category.propTypes = {
  category: React.PropTypes.object,
}

function CollateralField (props) {
  return (
    <div className={props.fieldValue ? props.className : s.hidden}>
      <div className={s.itemDesc}>
        {props.fieldName + ': '}
      </div>
      <div className={s.itemValue}>
        {props.fieldValue}
      </div>
    </div>
  )
}
CollateralField.propTypes = {
  fieldName: React.PropTypes.string,
  fieldValue: React.PropTypes.string,
}

function CollateralLinkField (props) {
  function isURL (str) {
    if (str === null) {
      return false
    } else {
      // This matches if the link is valid
      var urlRegex = /^[-a-zA-Z0-9@:%_.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_.~#?&//=]*)?$/
      var url = new RegExp(urlRegex)
      return str.match(url)
    }
  }
  return (
    <div className={props.fieldValue ? props.className : s.hidden}>
      <span className={s.itemDesc}>
        {props.fieldName + ': '}
      </span>
      {isURL(props.fieldValue) ? <a href={props.fieldValue}>{props.fieldValue}</a> : props.fieldValue}
    </div>
  )
}
CollateralLinkField.propTypes = {
  fieldName: React.PropTypes.string,
  fieldValue: React.PropTypes.string,
}

function EditCollateralField (props) {
  let handleEditCollateral = () => {
    return (
      browserHistory.push(`/editCollateral/${props.collateral.collateralId}`)
    )
  }
  return (
    <div className={s.buttonWrapperEdit}>
    <Button
      onClick={props.handlePublishCollateral}
      type='small'
      status='default'
      margin='right'
      text= {'Publish'}/>
    <Button
      onClick={handleEditCollateral}
      type='small'
      status='default'
      text= {'Edit'}/>
    </div>
  )
}
EditCollateralField.propTypes = {
  edit: React.PropTypes.func,
  publish: React.PropTypes.func,
}

function EditCollateralOwnerField (props) {
  let handleEditCollateral = () => {
    return (
      browserHistory.push(`/editCollateral/${props.collateral.collateralId}`)
    )
  }
  return (
    <div className={s.buttonWrapper}>
    <Button
      onClick={props.delete}
      type='submit'
      status='warn'
      text= {'Delete'}/>
    <Button
      onClick={handleEditCollateral}
      type='submit'
      status='default'
      text= {'Edit'}/>
    </div>

  )
}
EditCollateralField.propTypes = {
  edit: React.PropTypes.func,
  // publish: React.PropTypes.func,
}

function ReferenceType (props) {
  let getRef = (type) => {
    var options = {
      'yes': function () { return 'This client will serve as a reference' },
      'ask': function () { return 'You can request a reference' },
      'default': function () { return 'Do not use as reference' },
    }
    return (options[type] || options['default'])()
  }
  return (
    <div>
      {getRef(props.fieldValue)}
    </div>
  )
}
ReferenceType.propTypes = {
  fieldName: React.PropTypes.string,
}

function CollateralType (props) {
  let getType = (type) => {
    var options = {
      'success_story': function () { return 'Success Story' },
      'marketing_material': function () { return 'Marketing Material' },
      'delighted_customer': function () { return 'Delighted Customer' },
      'default': function () { return 'Success Story' },
    }
    return (options[type] || options['default'])()
  }
  return (
    <div>
      {getType(props.fieldValue)}
    </div>
  )
}
CollateralType.propTypes = {
  fieldName: React.PropTypes.string,
}

function ActiveTags (props) {
  const {collateral, categories} = props
  let activeIds = []
  for (let id in collateral.tagsByCategory) {
    activeIds.push(parseInt(id))
  }
  return (
    <div className={Object.keys(collateral.tagsByCategory).length > 0 ? s.categoryWrapper : s.hidden}>
      {categories.map((category, index) => {
        if (activeIds.indexOf(category.categoryId) > -1) {
          return <Category category={category} tags={collateral.tagsByCategory[category.categoryId]} key={index}/>
        } else {
          return null
        }
      }
      )}
    </div>
  )
}

export default class ViewCollateral extends React.Component {
  static get PropTypes () {
    return {
      collateral: React.PropTypes.Object,
      categories: React.PropTypes.array,
    }
  }
  constructor (props) {
    super(props)
    this.state = {
      tryDelete: false,
    }
  }

  componentDidMount = () => {
    window.scrollTo(0, 0)
  }

  handleTryDelete = () => {
    this.setState({tryDelete: !this.state.tryDelete})
  }

  checkURI = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      url = 'http://' + url
    }
    return url
  }

  render () {
    const {collateral, categories, handlePublishCollateral} = this.props
    return (
      <section className={s.view}>
        <Delete
          tryDelete={this.state.tryDelete}
          nameOfItem={collateral.collateralName}
          deleteType={'collateral'}
          handleDeleteFunction={this.props.handleDeleteCollateral}
          handleTryDelete={this.handleTryDelete}
          itemId={null}
          deleteMessage={'Hi!'}/>
        <section className={s.collateralWrapper}>
          <wasPublished/>
          <div className={this.props.justPublished ? s.metaWrapper : s.hidden}>
            <div className={s.publishText}>{'Your item was published'}</div>
            <div className={s.buttonWrapper}>
              <Button
                text='Home'
                type='submit'
                link='/'
                status='default'/>
              <Button
                text='Enter another item'
                type='submit'
                link='/newCollateral'
                status='default'
                margin='right'/>
            </div>
          </div>
          <div className={!collateral.published ? s.metaWrapper : s.hidden}>
            <Warning />
            <div className={s.publishText}>{'Please review and publish this item'}</div>
             <EditCollateralField publish={handlePublishCollateral} {...this.props}/>
          </div>
          <div className={s.detailWrapper}>
            <div className={s.header}>
              <div className={s.title}>
                <h3>{collateral.collateralName}</h3>
              </div>
              <div className={s.type}>
                <CollateralType fieldValue={collateral.collateralType} />
              </div>
            </div>
            <CollateralField fieldName='Account Name' fieldValue={collateral.collateralAccountName}/>
            <CollateralField fieldName='Contact Name' fieldValue={collateral.collateralContactName}/>
            <CollateralField fieldName='Contact Title' fieldValue={collateral.collateralContactTitle}/>
            <CollateralLinkField fieldName='Link to material' fieldValue={collateral.collateralFileLink}/>
            <CollateralLinkField fieldName='Link to CRM' fieldValue={this.checkURI(collateral.collateralLink)}/>
            <CollateralField fieldName={collateral.collateralType === 'success_story' ? 'Story Details' : 'Description'} fieldValue={collateral.collateralText}/>
            <CollateralField fieldName='Confidentiality' fieldValue={collateral.collateralConfidentiality} className={s.confidentiality} />
            <div className={collateral.collateralReferenceability === 'no' ? s.hidden : null}>
              <span className={s.itemDesc}>
                {'Referenceability:'}
              </span>
              <ReferenceType fieldValue={collateral.collateralReferenceability} />
            </div>
            <ActiveTags
              collateral={collateral}
              categories={categories} />
            <div className={s.hr}></div>
            <CollateralField fieldName='Author' fieldValue={collateral.collateralCreator.firstName + ' ' + collateral.collateralCreator.lastName}/>
            <CollateralField fieldName='Date' fieldValue={collateral.updatedDate}/>
          </div>
          <div className={this.props.justPublished || collateral.editable && collateral.published ? s.editWrapper : s.hidden}>
             <EditCollateralOwnerField delete={this.handleTryDelete} {...this.props}/>
          </div>
          </section>
      </section>
    )
  }
}
