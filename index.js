const express = require('express')
const app = express()
const port = 3000

var time = new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds();

app.get('/', (req, res) => {
    res.send('OK')
})

app.get('/test', (req, res) => {
    res.json({ "status": 200, "message": "ok" })
})


app.get('/time', (req, res) => {
    res.json({ "status": 200, "message": time })
})


app.get('/hello/:ID', (req, res) => {
    res.json({ "status": 200, "message": "hello " + req.params.ID })
})

app.get('/hello/', (req, res) => {
    res.json({ "status": 200, "message": "hello " })
})



app.get('/search', (req, res) => {
    if (req.query.s) { res.json({ status: 200, message: "Ok", data: req.query.s }) } else { res.status(500).json({ status: 500, error: true, message: "you have to provide a search" }) }
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})