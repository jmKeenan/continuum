import { browserHistory } from 'react-router'
import cookie from 'react-cookie'

import { isLocal } from 'helpers/utils'

function getCookieParams () {
  // if local then don't specify the domain, otherwise make cookie valid across all sub-domains
  let cookieParams
  if (isLocal()) {
    cookieParams = {path: '/'}
  } else {
    cookieParams = {path: '/', domain: '.successkit.io'}
  }
  return cookieParams
}

function storeSessionToken (token) {
  cookie.save('sk_session_token', token, getCookieParams())
}

function getSessionToken () {
  return cookie.load('sk_session_token')
}

function removeSessionToken () {
  cookie.remove('sk_session_token', getCookieParams())
}

function handleSignout () {
  removeSessionToken()
  browserHistory.push('/signin')
}

export {
  storeSessionToken,
  getSessionToken,
  removeSessionToken,
  handleSignout,
}
