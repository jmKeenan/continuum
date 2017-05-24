import React from 'react'
import ResetPasswordForm from 'components/ResetPasswordForm/ResetPasswordForm'
import { loginHeader, loginWrapper } from './styles.css'

export default function Signin (props) {
  return (
    <div className = {loginWrapper}>
    <div className = {loginHeader}>
      {'Reset Your Password'}
    </div>
      <ResetPasswordForm {...props}/>
    </div>
  )
}
