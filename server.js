const express    = require('express')
const app        = express()
const bodyParser = require('body-parser') //> ability to parse the body of an HTTP request
const Diary      = require('./lib/models/diary')
const Food       = require('./lib/models/food')

app.set('port', process.env.PORT || 3000)
app.locals.title = 'QS'
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/',(request, response) => {
  response.send('It\'s a Calorie Counter!')
})

app.get('/api/v1/diary/:id', (request, response) => {
  let id = request.params.id
  Diary.find(id)
    .then( (data) => {
      if (data.rowCount === 0) { return response.sendStatus(404) }

      response.json(data.rows[0])
    })
})

app.post('/api/v1/diary', (request, response) => {
  let name = request.body.name
  if (!name) {
    return response.status(422).send({ error: "No name property provided!"})
  } else {
    response.status(201).json({name})
  }
})

app.get('/api/v1/foods/:id', (request, response) => {
  let id = request.params.id
  Food.find(id)
  .then( (data) => {
    if (data.rowCount === 0) { return response.sendStatus(404) }

    response.json(data.rows[0])
  })
})

app.get('/api/v1/foods', (request, response) => {
  Food.all()
  .then( (data) => {
    if (data.rowCount === 0) { return response.sendStatus(404) }

    response.json(data.rows)
  })
})

app.post('/api/v1/foods', (request, response) => {
  Food.create(request.body.name, request.body.calories)
  .then(() => {
    Food.last()
    .then(food => {
      response.json(food.rows[0])
    })
  })
})

app.put('/api/v1/foods/:id', (request, response) => {
  const id = request.params.id
  const name = request.body.name
  Food.update(name, id)
  .then( (data) => {
    if (data.rowCount === 0) { return response.sendStatus(404) }

    response.json(data.rows[0])
  })
})

if(!module.parent){
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`)
  })
}

module.exports = app
