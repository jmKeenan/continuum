import React from 'react'
import { browserHistory } from 'react-router'
import ViewCollateral from './ViewCollateral'
import Loading from 'components/Loading/Loading'

export default class ViewCollateralContainer extends React.Component {
  static get PropTypes () {
    return {
      params: React.PropTypes.shape({
        collateralId: React.PropTypes.number,
      }),
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      collateral: null,
      categories: [],
      loaded: false,
      justPublished: false,
    }
  }

  componentDidMount = () => {
    const collateralPromise = this.props.API.getCollateral(this.props.params.collateralId)
    const categoriesPromise = this.props.API.getCategories()
    Promise.all([collateralPromise, categoriesPromise])
      .then(([collateral, categories]) => {
        this.setState({
          collateral: collateral,
          categories: categories,
          loaded: true,
        })
        document.title = collateral.collateralName
      })
  }

  publishCollateral = () => {
    this.setState({
      loaded: false,
      justPublished: false,
    })
    this.props.API.publishCollateral(this.state.collateral.collateralId).then((collateral) => {
      this.setState({
        collateral: collateral,
        loaded: true,
        justPublished: true,
      })
    })
    // this.props.notifyWithBanner(`${this.state.collateral.collateralName} was published`, 'confirm')
  }

  deleteCollateral = () => {
    this.props.API.deleteCollateral(this.state.collateral.collateralId).then(browserHistory.push('/'))
    this.props.notifyWithBanner(`${this.state.collateral.collateralName} was deleted`, 'confirm')
  }

  render () {
    return (
      <div>
        {this.state.loaded
          ? <ViewCollateral
            collateral={this.state.collateral}
            categories={this.state.categories}
            handlePublishCollateral={this.publishCollateral}
            handleDeleteCollateral={this.deleteCollateral}
            justPublished={this.state.justPublished}
            {...this.props}/>
          : <Loading />}
      </div>
    )
  }
}
