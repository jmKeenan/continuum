import React from 'react'
import AccountActivationForm from 'components/AccountActivationForm/AccountActivationForm'
import { loginHeader, loginWrapper } from './styles.css'

export default function AccountActivation (props) {
  return (
    <div className = {loginWrapper}>
    <div className = {loginHeader}>
      {'Activate Your Account'}
    </div>
      <AccountActivationForm {...props}/>
    </div>
  )
}
