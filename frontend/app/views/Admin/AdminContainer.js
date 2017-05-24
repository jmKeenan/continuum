import React from 'react'
import Admin from './Admin'
import Loading from 'components/Loading/Loading'

export default class AdminContainer extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      categories: [],
      members: [{}],
      loaded: false,
    }
  }

  componentDidMount () {
    const categoriesPromise = this.props.API.getCategories()
    const teamMembersPromise = this.props.API.getTeamMembers()
    Promise.all([categoriesPromise, teamMembersPromise])
      .then(([categories, members]) => {
        this.setState({
          categories: categories,
          members: members,
          loaded: true,
        })
        document.title = 'Admin'
      })
  }

  render () {
    return (
      <div>
        {this.state.loaded
          ? <Admin
            categories={this.state.categories}
            members={this.state.members}
            {...this.props}/>
          : <Loading />}
      </div>
    )
  }
}
