import fs from 'node:fs'

import { parse } from 'csv-parse'

import { Router } from './Router.js'
import { Database } from '../database/Database.js'



export const routes = new Router()

const database = new Database()

routes.add({
  method: 'POST',
  path: '/tasks',
  handler: (req, res) => {
    if (!req.body) return res.writeHead(400).json({ message: 'Task creation requires a title and a description' })

    const { title, description } = req.body

    if (!title || !description) return res.writeHead(400).json({ message: 'A title and a description must be provided in order to add a task' })

    database.insert('tasks', { title, description })

    res.writeHead(201).end()
  }
})

routes.add({
  method: 'GET',
  path: '/tasks',
  handler: (req, res) => {
    const { search, title, description } = req.query

    let filter = null
    if (search) filter = { title: search, description: search }

    if (title) filter = { title }
    if (description) filter = { description }

    const tasks = database.select('tasks', filter)

    return res.json(tasks)
  }
})

routes.add({
  method: 'PUT',
  path: '/tasks/:id',
  handler: (req, res) => {
    const { id } = req.params
    const { title, description } = req.body

    if (!title && !description) return res.writeHead(400).json({ message: 'Nothing to be updated. No title nor description was provided!' })
    const dataToBeUpdated = { updated_at: new Date() }
    
    if (title) dataToBeUpdated.title = title
    if (description) dataToBeUpdated.description = description

    const task = database.selectById('tasks', id)
    if (!task) return res.writeHead(400).json({ message: 'Invalid ID' })

    database.update('tasks', id, dataToBeUpdated)

    return res.writeHead(204).end()
  }
})

routes.add({
  method: 'DELETE',
  path: '/tasks/:id',
  handler: (req, res) => {
    const { id } = req.params

    const databaseStatus = database.delete('tasks', id)

    if (!databaseStatus) return res.writeHead(400).json({ message: 'Invalid ID' })

    return res.writeHead(204).end()
  }
})

routes.add({
  method: 'PATCH',
  path: '/tasks/:id/complete',
  handler: (req, res) => {
    const { id } = req.params

    const task = database.selectById('tasks', id)
    if (!task) return res.writeHead(400).json({ message: 'Invalid ID' })

    const updateDoneStatus = task.completed_at === null ? new Date() : null

    const databaseStatus = database.update('tasks', id, updateDoneStatus)
    if (!databaseStatus) return res.writeHead(400).json({ message: 'Invalid ID' })

    return res.writeHead(204).end()
  }
})

routes.add({
  method: 'POST',
  path: '/tasks/upload',
  handler: async (req, res) => {
    const tempFolderPath = new URL('../temp/test.csv', import.meta.url)

    const parser = fs.createReadStream(tempFolderPath, 'utf8').pipe(parse())

    let isHeader = true
    for await (const record of parser) {
      if (isHeader) {
        isHeader = false
        continue
      }

      const [ title, description ] = record
      database.insert('tasks', { title, description })
    }

    return res.writeHead(201).end()
  }
})