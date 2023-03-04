export async function json(req, res) {
  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch {
    req.body = null
  }

  res.json = (data) => {
    if (typeof data !== 'object') throw new Error('Request json method must receive an object')

    return res.end(JSON.stringify(data))
  }

  res.setHeader('Content-type', 'application/json')
}