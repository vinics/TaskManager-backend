import { extractQueryParams } from "../utils/extract-route-params.js"
import { buildRouteParams } from '../utils/build-route-params.js'


export class Router {
  #routes = []

  add({ method, path, handler }) {
    
    path = buildRouteParams(path)

    const routeAlreadyExists = this.#routes.filter(route => route.method === method && route.path === path)
    if (routeAlreadyExists.length > 0) throw new Error(`Route (${method}: ${path}) already exists`)

    this.#routes.push({ method, path, handler })
  }

  validate(req, res, notFoundCallback) {
    const { method, url } = req

    const targetRoute = this.#routes.find(route => route.method === method && route.path.test(url))

    if (!targetRoute) {
      notFoundCallback()
      return
    }

    const routeParams = url.match(targetRoute.path)
    
    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return targetRoute.handler(req, res)
  }
}