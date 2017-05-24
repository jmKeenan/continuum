import React from 'react'
import Header from 'components/Header/Header'
import Footer from 'components/Footer/Footer'
import Loading from 'components/Loading/Loading'
import Banner from 'components/Banner/Banner'

import { getSessionToken, removeSessionToken } from 'helpers/auth'
import { getSubdomain, isLocal } from 'helpers/utils'
import { API } from 'helpers/api'
import s from './styles.css'

export default function PageWrapper (WrappedComponent) {
  return class PageWrapperComponent extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        currentUser: null,
        doneCheckingUser: false,
        loggedIn: false,
        bannerMessage: 'default',
        messageType: 'default',
        hideReturnHome: true,
        isBannerOpen: false,
      }
      this.API = new API(this.notifyError)
    }

    static get propTypes () {
      return {
        location: React.PropTypes.object,
      }
    }

    notifyError = () => {
      this.notifyWithBanner('Continuum encountered an error 😞', 'warn')
    }

    notifyWithBanner = (bannerMessage, messageType, hideReturnHome) => {
      var self = this
      self.setState({
        isBannerOpen: true,
        bannerMessage: bannerMessage,
        messageType: messageType,
        hideReturnHome: hideReturnHome,
      })
      if (messageType === 'confirm') {
        setTimeout(() => self.setState({
          isBannerOpen: false,
        }), 4500)
      }
    }

    handleBannerReset = () => {
      this.setState({
        isBannerOpen: false,
      })
    }

    componentWillMount = () => {
      this.provideUser()
    }

    componentDidMount = () => {
      // !this.state.loggedIn ? document.title = 'Sign In' : document.title = 'Continuum'
    }

    handleSignout () {
      removeSessionToken()
      window.location = '/signin'
    }

    handleSignin () {
      window.location = '/'
    }

    provideUser = () => {
      var self = this
      return new Promise(function (resolve, reject) {
        const sessionToken = getSessionToken()
        if (!sessionToken) {
          self.setState({
            currentUser: null,
            doneCheckingUser: true,
          })
        } else {
          self.API.getCurrentUser()
            .then((currentUser) => {
              // check if user is on correct sub-domain for their tenancy and if not then re-direct
              const subDomain = getSubdomain()
              if (subDomain && currentUser.tenancy !== subDomain && currentUser.userType !== 'superadmin') {
                const newLocation = `https://${currentUser.tenancy}.successkit.io${window.location.pathname}`
                window.location = newLocation
              }
              // set state that user is correct
              self.setState({
                currentUser: currentUser,
                loggedIn: true,
                doneCheckingUser: true,
              })
              resolve()
            }).catch((err) => {
              // if getting the user fails, then log the user out and redirect to signin
              // TODO: log this
              if (!isLocal()) {
                removeSessionToken()
                window.location.reload()
              }
            })
        }
      })
    }

    render () {
      let navItems = []
      if (this.state.loggedIn) {
        navItems = [
          {
            title: 'Sign Out',
            type: 'link',
            onClick: this.handleSignout,
          },
          {
            title: 'Logged in as ' + this.state.currentUser.firstName + ' ' + this.state.currentUser.lastName,
            type: 'text',
            onClick: null,
          },
        ]
      } else {
        navItems = [ ]
      }

      const childrenProps = {
        currentUser: this.state.currentUser,
        loggedIn: this.state.loggedIn,
        doneCheckingUser: this.state.doneCheckingUser,
        provideUser: this.provideUser,
        API: this.API,
        notifyWithBanner: this.notifyWithBanner,
      }

      return (
        <div>
          {this.state.doneCheckingUser
            ? <div className={this.state.loggedIn ? s.wrapperLight : s.wrapperDark}>
              <Banner
                hideReturnHome={this.state.hideReturnHome}
                handleBannerReset={this.handleBannerReset}
                isBannerOpen={this.state.isBannerOpen}
                message={this.state.bannerMessage}
                messageType={this.state.messageType} />
              <Header
                headerTitle='Continuum'
                navItems={navItems}
                componentStyle={this.state.loggedIn ? 'light' : ''} />
              <main className={s.mainWrapper}>
                <WrappedComponent {...this.props} {...childrenProps}/>
              </main>
              <Footer
                componentStyle={this.state.loggedIn ? 'light' : ''}
                authType='auth'/>
            </div>
            : <Loading />}
        </div>

      )
    }
  }
}
