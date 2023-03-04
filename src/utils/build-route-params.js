export function buildRouteParams(path) {
  const routeParamsRegex = /:([a-zA-Z]+)/g

  const pathRegexWithParams = path.replaceAll(routeParamsRegex, '(?<$1>[a-z0-9\-\_]+)')

  const pathRegexWithParamsAndQueries = new RegExp(`^${pathRegexWithParams}(?<query>\\?(.*))?$`)

  return pathRegexWithParamsAndQueries
}