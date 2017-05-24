import React from 'react'
import SigninForm from 'components/SigninForm/SigninForm'
import { loginHeader, loginWrapper } from './styles.css'

export default function Signin (props) {
  return (
    <div className = {loginWrapper}>
    <div className = {loginHeader}>
      {'Sign in to Continuum'}
    </div>
      <SigninForm {...props}/>
    </div>
  )
}
