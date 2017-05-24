import React from 'react'
let PropTypes = React.PropTypes
import { Link } from 'react-router'
import s from './styles.css'

Header.propTypes = {
  headerTitle: PropTypes.string.isRequired,
  componentStyle: PropTypes.string.isRequired,
  navItems: PropTypes.array.isRequired,
}

export default function Header (props) {
  let createItem = (n) => {
    let navType = n.type === 'link' ? s.headerLink : s.headerText
    return <div key={n.title} className={navType} onClick={n.onClick}>{n.title}</div>
  }
  let createItems = (n) => {
    return n.map(createItem)
  }
  let headerStyle = props.componentStyle === 'light' ? s.light : null
  return (
    <header className={headerStyle + ' ' + s.viewHeader}>
      <div className={s.productHeading}>
        <Link to='/'>
          {/* {props.headerTitle} */}
          {props.componentStyle === 'light' ? <div>home</div> : <div></div>}
        </Link>
      </div>
      <div className={s.headerLinkWrapper}>
        {createItems(props.navItems)}
      </div>
    </header>
  )
}
