import http from 'node:http'

import { json } from './middlewares/json.js'
import { routes } from './routes/index.js'

const server = http.createServer(async (req, res) => {

  await json(req, res)

  const route = routes.validate(req, res, () => res.writeHead(404).end())
  
})

const PORT = 3333

server.listen(PORT, () => console.log(`Server up on port ${PORT}`))