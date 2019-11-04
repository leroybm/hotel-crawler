const express = require('express')
const cors = require('cors')
import searchHotels from './hotelSearch'

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors())

app.get('/ping', (req, res) => res.send('pong'))

app.post('/buscar', async (req, res) => {
  try {
    if (!req.body) throw new Error('Empty Body')
    const result: Array<object> = await searchHotels(req.body)
    res.send(result)
  } catch (error) {
    console.log(error)
    res.status(500).send({
      error,
    })
  }
})

app.listen(port, () => console.log(`Server open on ${port}!`))
