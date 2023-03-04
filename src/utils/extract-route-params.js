export function extractQueryParams(query) {
  // Detailed Steps:
  
  // const removedQuestionMark = query.substr(1)
  // const splitConcatedQueries = removedQuestionMark.split('&')
  // const keyValuePairsQueries = splitConcatedQueries.reduce((queryParams, param) => {
  //   const [key, value] = param.split('=')
  //   queryParams[key] = value

  //   return queryParams
  // }, {})

  return query.substr(1).split('&').reduce((queryParams, param) => {
      const [key, value] = param.split('=')
      queryParams[key] = value
  
      return queryParams
  }, {})
}