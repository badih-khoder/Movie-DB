const express = require('express')
const app = express()
const port = 3000


const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب', year: 1992, rating: 6.2 }
]



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













app.get('/movies/read', (req, res) => {
    res.json({ "status": 200, "message": movies })

})

app.get('/movies/update', (req, res) => {

})

app.get('/movies/delete', (req, res) => {

})

app.get("/movies/read/by-date", (req, res) => {
    res.json({
        status: 200,
        data: movies.sort(function(a, b) {
            return a.year - b.year;
        }),
    });
});


app.get("/movies/read/by-rating", (req, res) => {
    res.json({
        status: 200,
        data: movies.sort(function(a, b) {
            return b.rating - a.rating;
        }),
    });
});



app.get('/movies/read/by-title', (req, res) => {
    res.json({
        status: 200,
        message: movies.sort((a, b) => {
            if (a.title.toLowerCase() < b.title.toLowerCase())
                return -1
            if ((a.title.toLowerCase() > b.title.toLowerCase()))
                return 1
            return 0

        })
    })
})



app.get('/movies/read/id/:id', (req, res) => {
    let id = req.params.id
    if (id) {
        if (id < movies.length) {
            res.json({ status: 200, data: movies[id] })
        } else {
            res.status(404).json({ status: 404, error: true, message: "the movie " + id + " does not exist" })
        }
    }
})




app.get('/movies/create', (req, res) => {
    if (!req.query.rating) {
        req.query.rating = 4;
    }
    let title = req.query.title;
    let year = req.query.year;
    let rating = req.query.rating;

    if (!title || !year || year.length != 4 || isNaN(year)) {
        res.json({ status: 403, error: true, message: 'you cannot create a movie without providing a title and a year' })
    } else {
        year = parseInt(year);
        rating = parseInt(rating);
        movies.push({ title, year, rating });
        res.json({ status: 200, data: movies });
    }
})


app.get('/movies/delete/:ID', (req, res) => {

    let deletedmovie = req.params.ID
    if (movies.length < deletedmovie) {
        res.json({ status: 404, error: true, message: 'the movie <ID> does not exist' })
    } else {
        movies.splice(deletedmovie, 1)
        res.json({ status: 200, data: movies })
    }
})





app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})