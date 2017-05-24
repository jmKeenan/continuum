import React from 'react'
import { Link } from 'react-router'
import s from './styles.css'
import DisplayTag from 'components/DisplayTag/DisplayTag'
import Loading from 'components/Loading/Loading'

export default class Feed extends React.Component {
  static get propTypes () {
    return {
      currentUser: React.PropTypes.object,
      filterQuery: React.PropTypes.object.isRequired,
      feedItems: React.PropTypes.array.isRequired,
      categories: React.PropTypes.array.isRequired,
    }
  }
  constructor (props) {
    super(props)
    this.state = {
      findQuery: {
        categoryFilters: [],
        referenceFilters: [],
        typeFilters: [],
      },
      feedItems: [],
      categories: [],
    }
  }
  collateralType (props) { // Converts from database name to human readable name
    let getType = (type) => {
      var style = {
        'success_story': function () { return 'Success Story' },
        'marketing_material': function () { return 'Marketing Material' },
        'delighted_customer': function () { return 'Delighted Customer' },
      }
      return (style[type] || style[s.default])()
    }
    return (
      <div className={s.col}>
        {getType(props)}
      </div>
    )
  }
  handleTagReorder (tags, filter) { // Reorders tags so the selected filter tags are place at the front of the array
    let reorderedTags = []
    tags.map(function (tag, index) {
      filter.indexOf(tag.tagId) === -1 ? reorderedTags.push(tag) : reorderedTags.unshift(tag)
    })
    return (reorderedTags)
  }
  handleMakeTags = (tags) => {
    this.props.filterQuery.categoryFilters.length > 0 ? tags = this.handleTagReorder(tags, this.props.filterQuery.categoryFilters) : null // check for 0 length array
    return (
      tags.map(function (tag, index) {
        return (
          <DisplayTag
            style={this.props.filterQuery.categoryFilters.length > 0 && this.props.filterQuery.categoryFilters.indexOf(tag.tagId) === -1 ? 'no match' : 'match'}
            // style tags if they are selected based on filterQuery prop.
            key={index}
            tag={tag} />
        )
      }, this)
    )
  }
  handleDateStyling (updatedDate) { // Sane date formatting or 'New' in date field if the collateral was create the same day
    let currentDate, restructuredDate, prettyDate
    if (!updatedDate) {
      null
    } else {
      let itemDate = updatedDate.split('/')
      restructuredDate = itemDate[0] + '-' + itemDate[1] + '-' + itemDate[2]
      currentDate = new Date().toJSON().slice(0, 10)
      prettyDate = itemDate[1] + '/' + itemDate[2] + '/' + itemDate[0]
    }
    return (
      restructuredDate === currentDate ? <span className={s.new}>{'New'}</span> : prettyDate
    )
  }
  handleMakeFeedList = () => {
    return (
      this.props.feedItems.map(function (feedItem, index) {
        return (
          <li className={s.row} key={index} >
              <Link target='_blank' to={'/collateral/' + feedItem.collateralId}>
                <div className={s.col}>{this.handleDateStyling(feedItem.updatedDate)}</div>
                <div className={s.name + ' ' + s.col}>{feedItem.collateralName}</div>
                {this.collateralType(feedItem.collateralType)}
                <div className={s.tagView + ' ' + s.col}>{this.handleMakeTags(feedItem.categoryTags)}</div>
              </Link>
          </li>
        )
      }, this)
    )
  }

  handleUpdateFindResults = () => { // Requests new items from api when clicking 'Load More'
    this.props.handleUpdateFindResults(this.props.filterQuery, true)
  }

  render = () => {
    return (
      <div className={s.feedWrapper}>
        <ul>
          <li className={s.row + ' ' + s.feedTitles}>
            <div className={s.col}>{'Date'}</div>
            <div className={s.col}>{'Title'}</div>
            <div className={s.col}>{'Type'}</div>
            <div className={s.col}>{'Tags'}</div>
          </li>
          {!this.props.loadingNewFindResults ? this.handleMakeFeedList() : <Loading type={'fluid'} />}
          <li onClick={this.handleUpdateFindResults} className={this.props.numFindResultsRemaing < 0 ? s.loadNone : s.loadMore}>
          {this.props.loadingMoreFindResults ? <div>{'Loading...'}</div>
          : <div>{this.props.numFindResultsRemaing < 0 ? 'End of results' : 'Load More'}</div>}
          </li>
        </ul>
      </div>
    )
  }
}
