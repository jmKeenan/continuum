import React from 'react'
import Feed from 'components/Feed/Feed'
import TagSelection from 'components/TagSelection/TagSelection'
import s from './styles.css'

export default class FindCollateral extends React.Component {
  static get propTypes () {
    return {
      filterArray: React.PropTypes.array,
      params: React.PropTypes.shape({
        collateralId: React.PropTypes.number,
      }),
    }
  }
  constructor (props) {
    super(props)
    // Empty object to begin formulating findQuery
    this.state = {
      filtersCleared: false,
      findQuery: { // this format requred by api.js
        categoryFilters: [],
        referenceFilters: [],
        typeFilters: [],
      },
    }
  }
  handleGetNewFeedItems = () => {
    this.props.handleUpdateFindResults(this.state.findQuery)
    // Passes formed findQuery to container to update the feed content
    // See api.js for required fields
  }
  handleClearFilters = () => {
    // Nulls findQuery to reset feed filtering
    this.setState({
      filtersCleared: true,
      findQuery: { // this format requred by api.js
        categoryFilters: [],
        referenceFilters: [],
        typeFilters: [],
      },
    }, this.handleGetNewFeedItems)
  }
  handleQuery (tagId, queryArray) { // function to formulate findQuery correctly to prepare for handleGetNewFeedItems, accepts tagId (str) and queryArray (array)
    queryArray.indexOf(tagId) === -1 ? queryArray.push(tagId) : queryArray.splice(queryArray.indexOf(tagId), 1)
    // This checks if the tagId already exists in its parents array (ie categoryFilters, referenceFilters, typeFilters)
    // If it does, remove it from the array by name, if it doesn't add it to the array by name
    this.setState(queryArray, this.handleGetNewFeedItems)
    // Updates the findQuery object by setting state with the new values and updates the feed by firing handleGetNewFeedItems
  }
  handleFilterFeed = (tagId, categoryName) => {
    // accepts tagId (str) and categoryName (str) - called when a tag is toggled in ToggleTag.js
    this.setState({filtersCleared: false}) // resets to false because a tag has been toggled
    // If statement to check in the right place if the tag already exists in the findQuery
    if (categoryName === 'Collateral Type') {
      this.handleQuery(tagId, this.state.findQuery['typeFilters'])
    } else if (categoryName === 'Referenceability') {
      this.handleQuery(tagId, this.state.findQuery['referenceFilters'])
    } else {
      this.handleQuery(tagId, this.state.findQuery['categoryFilters'])
    }
  }
  render () {
    return (
      <div className={s.view}>
        <div className={s.filter}>
          <div className={s.header}>
            <h3 className={s.title}>{'What are you looking for?'}</h3>
          </div>
          <div><p className={s.clear} onClick={this.handleClearFilters}>{'clear all'}</p></div>
          <TagSelection
            style={'findCollateral'} // used to update toggleTag styling depending on location (findCollateral vs Edit/ViewCollateral)
            categories={this.props.categories}
            handleFilterFeed={this.handleFilterFeed} // fired in ToggleTag.js
            filtersCleared={this.state.filtersCleared} // bool
            isEditCollateralPage={false}/>
        </div>
        <div className={s.feed}>
          <div className={s.header}><h3>{'Results'}</h3></div>
          <Feed
            feedItems={this.props.feedItems}
            categories={this.props.categories}
            handleUpdateFindResults={this.props.handleUpdateFindResults}
            filterQuery={this.state.findQuery} // passing to style the display tags if they are actively selected in the query
            // below used to check if there are more items to load when feed updates
            loadingNewFindResults={this.props.loadingNewFindResults}
            loadingMoreFindResults={this.props.loadingMoreFindResults}
            numFindResultsRemaing={this.props.numFindResultsRemaing}/>
        </div>
      </div>
    )
  }
}
