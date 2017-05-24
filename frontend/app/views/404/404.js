import React from 'react'
import { Link } from 'react-router'
import s from './styles.css'

export default function FourOFourPage (props) {
  return (
    <div className={props.loggedIn ? s.fourLight : s.fourDark}>
      <div>
        {'Sorry, nothing here! '}
      </div>
      <Link to='/' className={s.backHome}>{'Back Home'}</Link>
    </div>
  )
}
