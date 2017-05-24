import React from 'react'
import { Link } from 'react-router'
import s from './styles.css'

function MakeCategoryItems (props) {
  let initialCount = 0
  function countTags (tags) { // Count the number of tags in the category
    tags.map(function () {
      initialCount++
    })
    return initialCount
  }
  return (
    <li className={s.categoryElement}>
      <div className={s.categoryName}>{props.category.categoryName}<span className={s.number}>{` (${countTags(props.category.tags)})`}</span></div>
      <Link to={'/editCategory/' + props.category.categoryId} className={s.edit}>{'edit'}</Link>
    </li>
  )
}

function MakeCategoryElements (props) {
  return (
    <ul className={s.itemLists}>
      {props.categories.map(function (category, index) {
        return (
          <MakeCategoryItems key={index} category={category} />
        )
      })}
    </ul>
  )
}

function MakeMembers (props) {
  return (
    <li className={s.categoryElement}>
      <div className={s.categoryName}>{props.member.firstName + ' ' + props.member.lastName}</div>
      <a href={'/editTeamMember/' + props.member.userId} className={s.edit}>{'edit'}</a>
    </li>
  )
}

function MakeTeamMemberElements (props) {
  return (
    <ul>
      {props.members.map(function (member, index) {
        return (
          <MakeMembers key={index} member={member} />
        )
      })}
    </ul>
  )
}

export default class Admin extends React.Component {
  render () {
    return (
      <div className={s.view}>
        <div className={s.viewWrapper}>
          <div className={s.pageHeading}>
            <h3>{'Admin'}</h3>
          </div>
          <div className={s.team}>
          <div className={s.header}>
            <div className={s.headerText}><h3>{'Team Members'}</h3></div>
            <a href='/newTeamMember' className={s.createNew}>{'+ add new team member'}</a>
          </div>
            <MakeTeamMemberElements members={this.props.members} />
          </div>
          <div className={s.categories}>
            <div className={s.header}>
              <div className={s.headerText}><h3>{'Categories'}</h3></div>
              <a href='/newCategory' className={s.createNew}>{'+ add new category'}</a>
            </div>
            <MakeCategoryElements categories={this.props.categories} />
          </div>
        </div>
      </div>
    )
  }
}
