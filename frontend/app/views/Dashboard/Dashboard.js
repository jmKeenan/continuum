import React from 'react'
import Feed from 'components/Feed/Feed'
import Button from 'components/Button/Button'
import s from './styles.css'

export default class DashBoard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      findQuery: { // required for Feed rendering
        categoryFilters: [],
        referenceFilters: [],
        typeFilters: [],
      },
      feedItems: [],
      categories: [],
    }
  }
  render () {
    return (
      <div className={s.view}>
        <div className={s.pageHeading}>
          <h3>{'Welcome to Continuum!'}</h3>
        </div>
        <div className={s.dashButtonWrapper}>
          <Button
            text='Enter Collateral'
            type='large'
            link='/newCollateral'
            status='default' margin='right'/>
          <Button
            text='Search Collateral'
            type='large'
            link='/findCollateral'
            status='default'/>
          {this.props.currentUser.userType === 'admin' || this.props.currentUser.userType === 'superadmin'
            ? <Button
                text='Admin Access'
                type='large'
                status='default'
                margin='left'
                link='/admin' />
            : null}
        </div>
        <div className={s.feedWrapper}>
        <div className={s.subHeading}>
          <h3>{'Recently added collateral'}</h3>
        </div>
          <Feed
            feedItems={this.props.feedItems}
            categories={this.props.categories}
            handleUpdateFindResults={this.props.handleUpdateFindResults}
            loadingNewFindResults={this.props.loadingNewFindResults}
            loadingMoreFindResults={this.props.loadingMoreFindResults}
            numFindResultsRemaing={this.props.numFindResultsRemaing}
            filterQuery={this.state.findQuery} />
        </div>
      </div>
    )
  }
}
