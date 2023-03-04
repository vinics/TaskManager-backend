# Task Manager (backend)
This project was a result of the knowledge and guidance of [Rocketseat Ignite](https://github.com/vinics/TaskManager-backend-.git) course.

## Dependencies
- NodeJs
- [csv-parse](https://csv.js.org/)

## Features
- Task creation
- Tasks list
- Task update
- Task remove
- Task status change (*not done <-> done*)
- Csv file import

> Note:
On csv import feature, this project assumes that the file was already uploaded to a local folder.

## Project structure
[Server](src\server.js) uses the node:http to instantiate and init a HTTP server. When the connection is established, a middleware [json](src\middlewares\json.js) is used to handle json objects on the requests and responses.

After the middleware, a instance of the [Router](src\routes\Router.js) validate each request (*method and url*) against the existing [routes](src\routes\index.js) of the application.


<br>

![](https://www.rocketseat.com.br/assets/logos/rocketseat.svg)

![](https://www.rocketseat.com.br/assets/logos/ignite-reduced.svg)
