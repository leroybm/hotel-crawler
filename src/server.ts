const express = require('express')
const cors = require('cors')
const { handleSearchRequest } = require('./hotelSearch')
const { sendError } = require('./utils/errors')

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors())

app.get('/ping', (req, res) => res.send('pong'))
app.post('/buscar', handleSearchRequest)

app.use(sendError)

app.listen(port, () => console.log(`Server open on ${port}!`))
