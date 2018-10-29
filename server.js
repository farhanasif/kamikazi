const express = require('express')
const app = express()
const port = 7800

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/webhook', (req, res) => {
    res.send('we are in webhook');
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))