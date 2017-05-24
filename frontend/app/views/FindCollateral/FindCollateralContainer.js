import React from 'react'
import FindCollateral from './FindCollateral'

export default class FindCollateralContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      findResults: [],
      numFindResultsRemaining: 0,
      categories: [],
      loaded: false,
      loadingFindResults: false,
      startIndex: 0,
      numResults: 7,
    }
  }

  componentDidMount () {
    const categoriesPromise = this.props.API.getCategories()
    categoriesPromise
      .then((categories) => {
        this.setState({
          categories: categories,
          loaded: true,
        })
        document.title = 'Search Collateral'
      })
    this.updateFindResults({})
  }

  updateFindResults = (params, loadMore) => {
    if (loadMore) {
      this.setState({
        loadingMoreFindResults: true,
      })
      params.startIndex = this.state.findResults.length
    } else {
      this.setState({
        loadingNewFindResults: true,
      })
      params.startIndex = 0
    }
    params.numResults = this.state.numResults
    const findPromise = this.props.API.getFindResults(params)
    findPromise
      .then((findResults) => {
        const newFindResults = loadMore ? this.state.findResults.concat(findResults.results) : findResults.results
        this.setState({
          findResults: newFindResults,
          numFindResultsRemaining: findResults.numRemaining,
          loadingMoreFindResults: false,
          loadingNewFindResults: false,
        })
      })
  }

  render () {
    return (
      <div>
        <FindCollateral
            feedItems={this.state.findResults}
            numFindResultsRemaing={this.state.numFindResultsRemaining}
            loadingFindResults={this.state.loadingFindResults}
            loadingNewFindResults={this.state.loadingNewFindResults}
            loadingMoreFindResults={this.state.loadingMoreFindResults}
            categories={this.state.categories}
            handleUpdateFindResults={this.updateFindResults}
            {...this.props}/>
      </div>
    )
  }
}
