import React from 'react'
import Dashboard from './Dashboard'
import Loading from 'components/Loading/Loading'

export default class DashBoardContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      findResults: [],
      numFindResultsRemaining: 0,
      categories: [],
      loaded: false,
      loadingFindResults: false,
      startIndex: 0,
      numResults: 10,
    }
  }

  componentDidMount () {
    if (this.props.loggedIn) {
      const categoriesPromise = this.props.API.getCategories()
      categoriesPromise
        .then((categories) => {
          this.setState({
            categories: categories,
            loaded: true,
          })
          document.title = 'Dashboard'
        })
      this.handleUpdateFindResults({})
    }
  }

  handleUpdateFindResults = (params, loadMore) => {
    // Updates feed list by called getFindResults
    // requires properly formatted findQuery as params and loadMore bool
    // sets state with new results
    if (loadMore) {
      this.setState({
        loadingMoreFindResults: true, // helper for loading state
      })
      params.startIndex = this.state.findResults.length // starts the query from the index of the last item returned
    } else {
      this.setState({
        loadingNewFindResults: true, // helper for loading state
      })
      params.startIndex = 0 // resets startIndex val
    }
    params.numResults = 7 // required by getFindResults - # of items returned
    const findPromise = this.props.API.getFindResults(params)
    findPromise
      .then((findResults) => {
        const newFindResults = loadMore ? this.state.findResults.concat(findResults.results) : findResults.results
        // adds the old feed items and the new items together if loading more
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
        {this.state.loaded && !this.state.loadingFindResults && !this.state.loadingNewFindResults
          ? <Dashboard
            feedItems={this.state.findResults}
            numFindResultsRemaing={this.state.numFindResultsRemaining}
            loadingFindResults={this.state.loadingFindResults}
            loadingNewFindResults={this.state.loadingNewFindResults}
            loadingMoreFindResults={this.state.loadingMoreFindResults}
            categories={this.state.categories}
            handleUpdateFindResults={this.handleUpdateFindResults}
            {...this.props}/>
          : <Loading />}
      </div>
    )
  }
}
