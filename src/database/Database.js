import { randomUUID } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'

const databasePath = new URL('tasks.json', import.meta.url)

export class Database {
  #database = {}

  #persist() {
    writeFile(databasePath, JSON.stringify(this.#database))
  }

  constructor() {
    readFile(databasePath, 'utf8')
      .then(data => this.#database = JSON.parse(data))
      .catch(() => this.#persist())
  }

  insert(table, { title, description }) {
    const newTask = {
      id: randomUUID(),
      title,
      description,
      completed_at: null,
      created_at: new Date(),
      updated_at: null
    }

    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(newTask)
    } else {
      this.#database[table] = [newTask]
    }

    this.#persist()

    return newTask;
  }

  delete(table, id) {
    const taskIndex = this.#database[table].findIndex(row => row.id === id)

    if (taskIndex < 0) return false

    this.#database[table].splice(taskIndex, 1)
    this.#persist()
    return true
  }

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter(task => {
        return Object.entries(search).some(([key, value]) => {
          return task[key].toLowerCase().includes(value.toLowerCase())
        })
      })
    }
    
    return data
  }

  selectById(table, id) {
    return this.#database[table].find(task => task.id === id)
  }

  
  update(table, id, data) {
    const taskIndex = this.#database[table].findIndex(row => row.id === id)

    if (taskIndex > -1) {
      const targetTask = this.#database[table][taskIndex]

      this.#database[table][taskIndex] = Object.assign(targetTask, { completed_at: data })
      this.#persist()

      return true
    }

    return false
  }

}