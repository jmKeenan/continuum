import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import Raven from 'raven-js'

import PageWrapper from 'wrappers/PageWrapper/PageWrapper'
import RequireAuthenticationWrapper from 'wrappers/RequireAuthenticationWrapper/RequireAuthenticationWrapper'
import RequireNotAuthenticatedWrapper from 'wrappers/RequireNotAuthenticatedWrapper/RequireNotAuthenticatedWrapper'
import { composeComponents } from 'helpers/utils'

import NewCollateral from 'views/PutCollateral/NewCollateral'
import EditCollateral from 'views/PutCollateral/EditCollateral'
import FindCollateralContainer from 'views/FindCollateral/FindCollateralContainer'
import ViewCollateralContainer from 'views/ViewCollateral/ViewCollateralContainer'
import DashboardContainer from 'views/Dashboard/DashboardContainer'
import FourOFourPage from 'views/404/404'
import AdminContainer from 'views/Admin/AdminContainer'
import SuperAdminContainer from 'views/SuperAdmin/SuperAdminContainer'
import NewCategory from 'views/PutCategory/NewCategory'
import EditCategory from 'views/PutCategory/EditCategory'
import NewTeamMember from 'views/PutTeamMember/NewTeamMember'
import EditTeamMember from 'views/PutTeamMember/EditTeamMember'
import NewTenancy from 'views/PutTenancy/NewTenancy'
import EditTenancy from 'views/PutTenancy/EditTenancy'
import TestObject from 'components/TestObject/TestObject'
import TestError from 'components/TestError/TestError'
import Signin from 'views/Signin/Signin'
import ForgotPassword from 'views/Signin/ForgotPassword'
import Signout from 'views/Signin/Signout'
import ResetPassword from 'views/Signin/ResetPassword'
import AccountActivation from 'views/Signin/AccountActivation'
import App from 'components/App/App'

// configure error logging
console.log(`++ SENTRY_FRONTEND_DSN: ` + process.env.SENTRY_FRONTEND_DSN)
Raven.config(process.env.SENTRY_FRONTEND_DSN || '').install() // this variable is configured with webpack

// configure pages
const appPage = composeComponents(
  App,
  [
    PageWrapper,
  ]
)

const viewCollateralPage = composeComponents(
  ViewCollateralContainer,
  [
    RequireAuthenticationWrapper,
  ]
)

const newCollateralPage = composeComponents(
  NewCollateral,
  [
    RequireAuthenticationWrapper,
  ]
)

const editCollateralPage = composeComponents(
  EditCollateral,
  [
    RequireAuthenticationWrapper,
  ]
)

const findCollateralPage = composeComponents(
  FindCollateralContainer,
  [
    RequireAuthenticationWrapper,
  ]
)

const dashboardPage = composeComponents(
  DashboardContainer,
  [
    RequireAuthenticationWrapper,
  ]
)

const adminPage = composeComponents(
  AdminContainer,
  [
    RequireAuthenticationWrapper,
  ]
)

const superAdminPage = composeComponents(
  SuperAdminContainer,
  [
    RequireAuthenticationWrapper,
  ]
)

const newCategoryPage = composeComponents(
  NewCategory,
  [
    RequireAuthenticationWrapper,
  ]
)

const editCategoryPage = composeComponents(
  EditCategory,
  [
    RequireAuthenticationWrapper,
  ]
)

const newTeamMemberPage = composeComponents(
  NewTeamMember,
  [
    RequireAuthenticationWrapper,
  ]
)

const editTeamMemberPage = composeComponents(
  EditTeamMember,
  [
    RequireAuthenticationWrapper,
  ]
)

const newTenancyPage = composeComponents(
  NewTenancy,
  [
    RequireAuthenticationWrapper,
  ]
)

const editTenancyPage = composeComponents(
  EditTenancy,
  [
    RequireAuthenticationWrapper,
  ]
)

const signinPage = composeComponents(
  Signin,
  [
    RequireNotAuthenticatedWrapper,
  ]
)

const forgotPasswordPage = composeComponents(
  ForgotPassword,
  [
    RequireNotAuthenticatedWrapper,
  ]
)

const signoutPage = composeComponents(
  Signout,
  []
)

const resetPasswordPage = composeComponents(
  ResetPassword,
  []
)

const accountActivationPage = composeComponents(
  AccountActivation,
  []
)

const testObjectPage = composeComponents(
  TestObject,
  []
)

const testErrorPage = composeComponents(
  TestError,
  []
)

export default function RootContainer () {
  return (
    <Router history={browserHistory}>
      <Route path='/' component={appPage}>
        <Route path='signin' component={signinPage} />
        <Route path='signout' component={signoutPage} />
        <Route path='superadmin' component={superAdminPage} />
        <Route path='admin' component={adminPage} />
        <Route path='newCategory' component={newCategoryPage} />
        <Route path='editCategory/:categoryID' component={editCategoryPage} />
        <Route path='newTeamMember' component={newTeamMemberPage} />
        <Route path='editTeamMember/:userID' component={editTeamMemberPage} />
        <Route path='newTenancy' component={newTenancyPage} />
        <Route path='editTenancy/:tenancyID' component={editTenancyPage} />
        <Route path='findCollateral' component={findCollateralPage} />
        <Route path='newCollateral' component={newCollateralPage} />
        <Route path='editCollateral/:collateralId' component={editCollateralPage} />
        <Route path='collateral' component={viewCollateralPage} />
        <Route path='collateral/:collateralId' component={viewCollateralPage} />
        <Route path='reset/:secretLink' component={resetPasswordPage} />
        <Route path='activate/:secretLink' component={accountActivationPage} />
        <Route path='forgotPassword' component={forgotPasswordPage} />
        <Route path='testObject/:testObjectId' component={testObjectPage} />
        <Route path='testError' component={testErrorPage} />
        <Route path='reset' component={resetPasswordPage} />
        <Route path='404' component={FourOFourPage} />
        <Route path='*' component={FourOFourPage} />
        <IndexRoute component={dashboardPage} />
      </Route>
    </Router>
  )
}

ReactDOM.render(
  <RootContainer/>,
  document.getElementById('app'))
