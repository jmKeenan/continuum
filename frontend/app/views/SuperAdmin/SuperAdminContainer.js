import React from 'react'
import SuperAdmin from './SuperAdmin'
import Loading from 'components/Loading/Loading'

export default class SuperAdminContainer extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      categories: [],
      loaded: false,
    }
  }

  componentDidMount () {
    const tenanciesPromise = this.props.API.getTenancies()
    tenanciesPromise
      .then((tenancies) => {
        this.setState({
          tenancies: tenancies,
          loaded: true,
        })
        document.title = 'SuperAdmin'
      })
  }

  render () {
    return (
      <div>
        {this.state.loaded
          ? <SuperAdmin tenancies={this.state.tenancies}
            {...this.props}/>
          : <Loading />}
      </div>
    )
  }
}
