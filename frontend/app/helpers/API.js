import { browserHistory } from 'react-router'
import Raven from 'raven-js'

function redirectToLogin() {
  window.localStorage.removeItem('continuum_session_token')
  browserHistory.push({
    pathname: '/login',
    state: {
      unauthorized: true
    }
  })
}

function get(endpoint, cb = data => data, onErr = Raven.captureException.bind(Raven)) {
  const sessionToken = window.localStorage.getItem('continuum_session_token')

  return fetch(endpoint, {
    headers: new window.Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-ACCESS-TOKEN': sessionToken,
    }),
  })
  .then(resp => {
    if (resp.status === 401) {
      throw new Error('unauthorized')
    }
    return resp
  })
  .then(resp => resp.json())
  .then(cb)
  .catch(err => {
    if (err.message === 'unauthorized') {
      redirectToLogin()
      return
    }
    onErr(err)
  })
}

function post(endpoint, data = {}, cb = data => data, onErr = Raven.captureException.bind(Raven)) {
  const sessionToken = window.localStorage.getItem('continuum_session_token')

  return fetch(endpoint, {
    headers: new window.Headers({
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-ACCESS-TOKEN': sessionToken,
    }),
    method: 'post',
    body: JSON.stringify(data),
  })
  .then(resp => {
    if (resp.status === 401) {
      throw new Error('unauthorized')
    }
    return resp
  })
  .then(resp => resp.json())
  .then(cb)
  .catch(err => {
    if (err.message === 'unauthorized') {
      redirectToLogin()
      return
    }
    onErr(err)
  })
}

export default {

  getCurrentUser: function(cb = response => response) {
    return get('/api/currentUser/').then(data => cb(data.currentUser))
  },

  newNote: function(data) {
    // TODO: implement this
    return {}
  },

  login: function(username, password, cb, onErr) {
    const data = {
      auth_type: 'email',
      email: username,
      password: password
    }
    return post('/api/auth/', data).then((data) => {
      if (data.success) {
        window.localStorage.setItem('continuum_session_token', data.token)
        return cb()
      }
      else {
        return onErr()
      }
    })
    .catch(onErr)
  },

}
