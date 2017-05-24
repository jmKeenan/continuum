import React from 'react'
import ForgotPasswordForm from 'components/SigninForm/ForgotPasswordForm'
import { loginHeader, loginWrapper } from './styles.css'

export default function Signin (props) {
  return (
    <div className = {loginWrapper}>
    <div className = {loginHeader}>
      {'Forgot Password'}
    </div>
      <ForgotPasswordForm {...props}/>
    </div>
  )
}
