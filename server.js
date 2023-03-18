require('dotenv').config()
const express = require('express')
const cors = require('cors')

const pool = require('./src/db/connection.js')
const logger = require('./src/logger/logger.js')

const app = express()

app.use(logger)
app.use(cors())

app.get('/', (req, res) => {
  res.send("hello")
})

// lugares route
app.get('/lugares', async (req, res) => {
  pool.query('SELECT * FROM lugares', (err, results, fields) => {
    if (err) console.log(err)

    res.json({ 'lugares': results })
  })
})

// destinos route
app.get('/destinos', async (req, res) => {
  pool.query('SELECT * FROM destino', (err, results, fields) => {
    if (err) console.log(err)

    res.json({ 'res': results })
  })
})

// categorias route
app.get('/categorias', (req, res) => {
  pool.query('SELECT * FROM categoria', (err, results, fields) => {
    if (err) console.log(err)

    res.json({ 'categorias': results })
  })
})

app.post('/categorias', async (req, res) => {
  // ejemplo
  pool.execute('INSERT', (err, results, fields) => {
    if (err) {
      console.log(err)
      res.status(402).json({ 'error': err.cause })
    }

    res.status(201).json({ 'status': true, 'id': results['id'] })
  })
})

app.patch('/categorias/:id/update', (req, res) => {
  res.json({ 'method': req.params['id'] })
})

app.delete('/categorias/:id/delete', (req, res) => {
  res.json({ 'method': req.params['id'] })
})

app.post('/productos', async (req, res) => {
  const idcategoria = req.body.idcategoria
  const [rows] = pool.query('SELECT * FROM productos WHERE idcategoria= ?', [idcategoria], (err, results, fields) => {
    if ([rows] > 0) {
      res.json({ 'productos': results })
    }
  })
})


app.get('/productos/:id', async (req, res) => {
  //para jalar el url
  //res.send(req.params["id"])
  const id = req.params["id"]
  pool.query('SELECT * FROM productos WHERE idcategoria= ?', [id], (err, results, fields) => {
    res.json({ 'productos': results })
  })
})

app.get('/categoria-dos', (req, res) => {
  pool.query('SELECT * FROM categoriados', (err, results, fields) => {
    if (err) console.log(err)

    res.json({ 'categoriados': results })
  })
})

app.post('/categoria-insert', (req, res) => {
  const nombre = req.body.nombre
  const descripcion = req.body.descripcion
  const marcas = req.body.marcas

  pool.query("INSERT INTO categoriados (nombre,descripcion,marcas) VALUES (?,?,?)",
    [nombre], [descripcion], [marcas], (err, results, fields) => {
      if (err) throw err
      res.send('categoria agregada')
    })

})

app.listen(process.env.PORT, () => {
  console.log("server Start")
})
