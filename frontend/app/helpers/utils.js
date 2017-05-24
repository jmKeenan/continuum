import moment from 'moment-timezone'

function convertDate (date) {
  return moment.utc(date).format('M / D / YYYY')
}

function composeComponents (component, wrappers = []) {
  return wrappers.reduceRight((c, wrapper) => wrapper(c), component)
}

function formatUrl (url, queryParams) {
  if (Object.keys(queryParams).length > 0) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + formatQueryParams(queryParams)
  }
  return url
}

function formatQueryParams (params) {
  return Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&')
}

function getSubdomain () {
  const domain = window.location.hostname
  const regexMatch = domain.match(/(\S+)\.successkit\.io/)
  if (!regexMatch) {
    return null
  } else {
    return regexMatch[1]
  }
}

function isLocal () {
  const regexMatch = window.location.hostname.match(/successkit\.io/)
  return (regexMatch === null)
}

function sortTags (tags) {
  /* takes in a list of tags, and sorts them based on tagIndex in place */
  function compareTags (a, b) {
    if (a.tagIndex < b.tagIndex) {
      return -1
    }
    if (a.tagIndex > b.tagIndex) {
      return 1
    }
    // a must be equal to b
    return 0
  }
  tags.sort(compareTags)
}

export {
  convertDate,
  composeComponents,
  formatUrl,
  formatQueryParams,
  getSubdomain,
  isLocal,
  sortTags,
}
