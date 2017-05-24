import React from 'react'
import { Link } from 'react-router'
import s from './styles.css'

function MakeTenants (props) {
  return (
    <li className={s.categoryElement}>
      <div className={s.categoryName}>{props.tenancy.tenancySlug}</div>
      <div className={s.categoryName}>{props.tenancy.numSeats}</div>
      <div className={s.categoryName}>{props.tenancy.accountType}</div>
      <Link to={'/editTenancy/' + props.tenancy.tenancyId} className={s.edit}>
        {'edit'}
      </Link>
    </li>
  )
}

function MakeTenantElements (props) {
  return (
    <ul>
      {props.tenancies.map(function (tenancy, index) {
        return (
          <MakeTenants key={index} tenancy={tenancy} />
        )
      })}
    </ul>
  )
}

export default class SuperAdmin extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tenencies: [],
    }
  }
  render () {
    return (
      <div className={s.view}>
        <div className={s.viewWrapper}>
          <div className={s.pageHeading}>
            <h3>{'Accounts'}</h3>
          </div>
          <div className={s.team}>
            <div className={s.labelHeader}>
              <div className={s.labelHeading}>{'Account'}</div>
              <div className={s.labelHeading}>{'# of tenants'}</div>
              <div className={s.labelHeading}>{'Term'}</div>
              <div className={s.hiddenSpacer}>{'edit'}</div>
            </div>
            <MakeTenantElements tenancies={this.props.tenancies} />
            <a href='/newTenancy' className={s.createNew}>{'+ add new tenant'}</a>
          </div>
        </div>
      </div>
    )
  }
}
