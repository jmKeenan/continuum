import {getSessionToken} from 'helpers/auth'
import {sortTags} from 'helpers/utils'
import Raven from 'raven-js'

const parse = {
  user: function (a) {
    return {
      userId: a.user_id,
      email: a.email,
      firstName: a.first_name,
      lastName: a.last_name,
      tenancy: a.tenancy,
      userType: a.user_type,
    }
  },

  findResults: function (a) {
    return {
      results: a.results.map(parse.collateral),
      startIndex: a.startIndex,
      numRemaining: a.numRemaining,
      numReturned: a.numReturned,
    }
  },

  testObject: function (a) {
    return {
      key: a.key,
      value: a.value,
    }
  },

  tag: function (a) {
    return {
      tagValue: a.tag_value,
      tagId: a.tag_id,
      tagIndex: a.tag_index,
    }
  },

  categories: function (a) {
    return a.map(parse.category)
  },

  category: function (a) {
    const tags = a.tags.map(parse.tag)
    sortTags(tags)
    return {
      categoryName: a.category_name,
      categoryId: a.category_id,
      categoryIndex: a.category_index,
      tags: tags,
    }
  },

  tenancy: function (a) {
    return {
      tenancySlug: a.tenancy_slug,
      numSeats: a.num_seats,
      accountType: a.account_type,
      contactName: a.contact_name,
      contactTitle: a.contact_title,
      accountEmail: a.account_email,
      comments: a.comments,
      tenancyId: a.tenancy_id,
    }
  },

  tenancies: function (a) {
    return a.map(parse.tenancy)
  },

  teamMember: function (a) {
    return {
      email: a.email,
      firstName: a.first_name,
      lastName: a.last_name,
      userType: a.user_type,
      userId: a.user_id,
    }
  },

  teamMembers: function (a) {
    return a.map(parse.teamMember)
  },

  collateral: function (a) {
    return {
      collateralId: a.collateral_id,
      collateralName: a.collateral_title,
      collateralType: a.collateral_type,
      collateralTitle: a.collateral_title,
      collateralAccountName: a.collateral_account_name,
      collateralLink: a.collateral_link,
      collateralContactTitle: a.collateral_contact_title,
      collateralContactName: a.collateral_contact_name,
      collateralCreator: parse.user(a.collateral_creator),
      collateralText: a.collateral_text,
      collateralReferenceability: a.collateral_referenceability,
      collateralConfidentiality: a.collateral_confidentiality,
      createdDate: a.created_date,
      updatedDate: a.updated_date,
      collateralFileLink: a.collateral_file_link,
      categoryTags: a.category_tags.map(parse.tag),
      tagsByCategory: parse.tagsByCategory(a.tags_by_category),
      published: a.published,
      editable: a.editable,
    }
  },

  tagsByCategory: function (a) {
    const parsed = {}
    Object.keys(a).map(function (categoryId, index) {
      parsed[categoryId] = a[categoryId].map(parse.tag)
    })
    return parsed
  },

  forgotPasswordResponse: function (a) {
    return {
      success: a.success,
      message: a.message,

    }
  },

  resetPasswordResponse: function (a) {
    return {
      success: a.success,
      message: a.message,
      token: a.token,
    }
  },

  activateAccountResponse: function (a) {
    return {
      success: a.success,
      message: a.message,
      token: a.token,
    }
  },

}

class API {

  constructor (notifyError) {
    this.notifyError = notifyError
  }

  logExceptionResponse = (response, endpoint, method) => {
    response.text().then((responseMessage) => {
      const extras = {
        status: response.status,
        message: responseMessage,
      }
      Raven.captureException(`API error: ${method} ${endpoint} responded with ${response.status}`, {extra: extras})
    })
  }

  requestHelper = (endpoint, data, method) => {
    const sessionToken = getSessionToken()
    return fetch(endpoint, {
      headers: new window.Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-ACCESS-TOKEN': sessionToken,
      }),
      method: method,
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          // capture exception in sentry
          this.logExceptionResponse(response, endpoint, method)
          // display error banner on frontend
          this.notifyError()
        }
        return response
      })
      .then(response => response.json())
  }

  get = (endpoint) => {
    const sessionToken = getSessionToken()
    return fetch(endpoint,
      {
        headers: new window.Headers({
          'X-ACCESS-TOKEN': sessionToken,
        }),
        method: 'GET',
      })
      .then(response => {
        if (!response.ok) {
          // capture exception in sentry
          this.logExceptionResponse(response, endpoint, 'GET')
          // display error banner on frontend
          this.notifyError()
        }
        return response
      })
      .then(response => response.json())
  }

  del = (endpoint) => {
    const sessionToken = getSessionToken()
    return fetch(endpoint,
      {
        headers: new window.Headers({
          'X-ACCESS-TOKEN': sessionToken,
        }),
        method: 'DELETE',
      })
      .then(response => {
        if (!response.ok) {
           // capture exception in sentry
          this.logExceptionResponse(response, endpoint, 'DELETE')
          // display error banner on frontend
          this.notifyError()
        }
        return response
      })
      .then(response => response.json())
  }

  put = (endpoint, data) => {
    return this.requestHelper(endpoint, data, 'PUT')
  }

  post = (endpoint, data) => {
    return this.requestHelper(endpoint, data, 'POST')
  }

  getCurrentUser = () => {
    /* gets the current user who is logged in */
    return this.get('/api/currentUser/').then(data => {
      return parse.user(data.currentUser)
    })
  }

  getFindResults = (params) => {
    /* gets a list of find results matching the given search params
     *
     * required params:
     * - typeFilters:
     *      a list of strings from these options ('success_story', 'marketing_material', 'delighted_customer')
     *      can be empty (empty means do not filter by this parameter)
     * - referenceFilters:
     *      a list of strings from these options ('yes', 'no', 'ask')
     *      can be empty (empty means do not filter by this parameter)
     * - categoryFilters:
     *      a list of integers which are tagIds
     *      can be empty (empty means do not filter by this parameter)
     *      if tags belong to the same category, they will be filtered as an "or" between the tags
     *      the "ors" between categories will be filtered as an "and" across categories
     *      e.g.
     *      if the categories are color and size
     *          a list of ids for ["red", "blue", "small"] will return results which are ((red or blue) and small)
     *          a list of ids for ["red", "large", "small"] will return results which are (red and (small or large))
     *          a list of ids for ["red"] will return results which are red and of any size
     *  - startIndex:
     *      an integer which is the index in the list of findResults which should be used as the starting point (for pagination)
     *  - numResults:
     *      an integer which specifies how many objects will be returned counting from after the startIndex (for pagination)
     */
    return this.post('/api/find/', params).then(data => {
      return parse.findResults(data)
    })
  }

  getCategories = () => {
    /* gets a list of categories for the Tenancy of the currently logged in user */
    return this.get('/api/categories/').then((data) => {
      return parse.categories(data.categories)
    })
  }

  putCollateral = (params) => {
    /* create or update a piece of collateral
     *
     * required params:
     * - collateralType: string, of one of these options ('success_story', 'marketing_material', 'delighted_customer')
     * - collateralTitle: string
     * - collateralAccountName: string
     * - collateralContactName: string
     * - collateralContactTitle: string
     * - collateralText: string
     * - collateralConfidentiality: string
     * - collateralReferenceability: string, of one of these options ('yes', 'no', 'ask')
     * - collateralLink: string
     * - collateralFileLink: string
     * - collateralTagIds: a list of integers of ids of tags which should be selectred for this collateral
     *
     * optional params:
     * - collateralId:
     *      if this param is included then this request will be treated as an update of the collateral with the given collateralId
     *      if this param is not included, then this request will be treated as a request to create a new piece of collateral
     */
    return this.put('/api/collateral/', params).then(data => {
      return parse.collateral(data.collateral)
    })
  }

  deleteCollateral = (collateralId) => {
    /* deletes the collateral with the given id */
    return this.del(`/api/collateral/${collateralId}/`).then(data => {
      return null
    })
  }

  putCategory = (params) => {
    /* create or update a category
     *
     * required params:
     * - categoryName: string
     * - categoryIndex: integer
     * - putTags: a list of objects {tagId, tagValue, tagIndex}. If a tagId is supplied it will update
     * the tag with the given tagId. If no tagId is supplied it will create a new tag.
     * - deleteTags: a list of integers (tag ids) of tags which should be deleted (they must already exist)
     *
     * optional params:
     * - categoryId:
     *      if this param is included then this request will be treated as an update of the category with the given categoryId
     *      if this param is not included, then this request will be treated as a request to create a new category
     */
    return this.put('/api/category/', params).then(data => {
      return parse.category(data.category)
    })
  }

  deleteCategory = (categoryId) => {
    /* deletes the category with the given id */
    return this.del(`/api/category/${categoryId}/`).then(data => {
      return null
    })
  }

  getCategory = (categoryId) => {
    /* get the category with the given id */
    return this.get(`/api/category/${categoryId}/`).then(data => {
      return parse.category(data.category)
    })
  }

  deleteTenancy = (tenancyId) => {
    /* deletes the tenancy with the given id */
    return this.del(`/api/tenancy/${tenancyId}/`).then(data => {
      return null
    })
  }

  getTenancy = (tenancyId) => {
    /* get the tenancy with the given id */
    return this.get(`/api/tenancy/${tenancyId}/`).then(data => {
      return parse.tenancy(data.tenancy)
    })
  }

  putTenancy = (params) => {
    /* create or update a tenancy
     *
     * required params:
     * - tenancySlug: String
     * - numSeats: integer
     * - accountType: String
     * - contactName: String
     * - contactTitle: String
     * - accountEmail: String
     * - comments: String
     *
     * optional params:
     * - tenancyId:
     *      if this param is included then this request will be treated as an update of the tenancy with the given tenancyId
     *      if this param is not included, then this request will be treated as a request to create a new tenancy
     */
    return this.put('/api/tenancy/', params).then(data => {
      return parse.tenancy(data.tenancy)
    })
  }

  getTenancies = () => {
    /* gets a list of all tenancies */
    return this.get('/api/tenancies/').then(data => {
      return parse.tenancies(data.tenancies)
    })
  }

  deleteTeamMember = (userId) => {
    /* deletes the team member with the given id */
    return this.del(`/api/team_member/${userId}/`).then(data => {
      return null
    })
  }

  getTeamMember = (userId) => {
    /* get the team member with the given id */
    return this.get(`/api/team_member/${userId}/`).then(data => {
      return parse.teamMember(data.team_member)
    })
  }

  putTeamMember = (params) => {
    /* create or update a team member
     *
     * required params:
     * - email: String
     * - firstName: String
     * - lastName: String
     * - userType: String (default, admin or superadmin)
     *
     * optional params:
     * - userId:
     *      if this param is included then this request will be treated as an update of the given id
     *      if this param is not included, then this request will be treated as a request to create
     */
    return this.put('/api/team_member/', params).then(data => {
      return parse.teamMember(data.team_member)
    })
  }

  getTeamMembers = () => {
    /* gets a list of all team members for tenancy of currently logged in user */
    return this.get('/api/team_members/').then(data => {
      return parse.teamMembers(data.team_members)
    })
  }

  publishCollateral = (collateralId) => {
    /* idempotent endpoint which finds a collateral with the given id and sets it to published=True  */
    return this.post(`/api/publish/${collateralId}/`, {}).then(data => {
      return parse.collateral(data.collateral)
    })
  }

  resetPassword = (newPassword, secretString) => {
    /* endpoint which allows a user to reset their password */
    const params = {password: newPassword, secret_link: secretString}
    return this.post('/api/resetPassword/', params).then(data => {
      return parse.resetPasswordResponse(data)
    })
  }

  activateAccount = (email, newPassword, secretString) => {
    /* endpoint which allows a user to activate their account */
    const params = {email: email, password: newPassword, secret_link: secretString}
    return this.post('/api/activateAccount/', params).then(data => {
      return parse.activateAccountResponse(data)
    })
  }

  forgotPassword = (email) => {
    /* endpoint which will send a password reset link to the given email if a user with this email exists */
    const params = {email: email}
    return this.post('/api/forgotPassword/', params).then(data => {
      return parse.forgotPasswordResponse(data)
    })
  }

  getCollateral = (collateralId) => {
    /* gets a piece of collateral with the given id */
    return this.get(`/api/collateral/${collateralId}/`).then(data => {
      return parse.collateral(data.collateral)
    })
  }
}

module.exports = {
  API,
}
