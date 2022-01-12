const express = require('express')
const app = express()
const port = 3000


const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://user:user@cluster0.arxci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    .then(() => console.log("database connected")).catch(error => console.log(error))



var today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();




const users = [
    { username: 'ouss', password: 'hummus' },
    { username: 'badih', password: 'shawerma' },
]


app.get('users/search', (req, res) => {
    const search = req.query.s;
    if (typeof search != 'undefined') {
        const response = {
            status: 200,
            message: "ok",
            data: search
        };
        res.send(response);
    } else {
        const response = {
            status: 500,
            error: true,
            message: "you have to provide a search"
        };
        res.status(500);
        res.send(response);
    }
});


app.get('/users/read', (req, res) => {
    res.json({ "status": 200, "message": users })
})
pp.get('/users/read/by-username', (req, res) => {
    res.json({
        "status": 200,
        "data": users.sort((a, b) => {
            if (a.username.toLowerCase() < b.username.toLowerCase())
                return -1
            if ((a.username.toLowerCase() > b.username.toLowerCase()))
                return 1
            return 0
        })
    })
})

app.get('/users/read/id/:id', (req, res) => {
    let id = req.params.id
    if (id) {
        if (id < users.length) {
            res.json({ status: 200, data: users[id] })
        } else if (id == null || id === undefined) {
            res.json({ status: 404, error: "You didnt add an id!" })
        } else {
            res.status(404).json({ status: 404, error: true, message: "the uder with " + id + " does not exist!" })
        }
    }
})



app.post('/users/create', (req, res) => {
    if (!req.query.username || !req.query.password) {
        res.json({ status: 403, error: true, message: 'You cant create an account without a username or without a password' })
    } else {
        let username = req.query.username;
        let password = req.query.password;
        users.push({ username, password });
        res.json({ status: 200, data: users });
    }
})


app.delete('/users/delete/:ID', (req, res) => {
    let deleteduser = req.params.ID
    if (users.length < deleteduser) {
        res.json({ status: 404, error: true, message: 'the user with the ' + ID + ' does not exist' })
    } else {
        users.splice(deleteduser, 1)
        res.json({ status: 200, data: users })
    }
})



app.put('/users/update/:ID', (req, res) => {
    var usernamex = req.query.username;
    var passwordx = req.query.password;
    if (!req.query.username) {
        var usernamex = users[req.params.ID].username
    }
    if (!req.query.password) {
        var passwordx = users[req.params.ID].password
    }
    users[req.params.ID] = { username: usernamex, password: passwordx };
    res.json({ status: 200, data: users })
})


const movieshcema = new mongoose.Schema({
    title: { type: String, default: "" },
    year: { type: Number, default: 1900 },
    rating: { type: Number, default: 4 },
}, { versionKey: false });
const movies = mongoose.model("movies", movieshcema);




app.get('/', (req, res) => {
    res.send('ok')
})


app.get('/test', (req, res) => {
    res.json({ "status": 200, "message": "ok" })
})
app.get('/time', (req, res) => {
    res.json({ "status": 200, "message": time })
})

//Step-4
app.get('/hello/:ID', (req, res) => {
    res.json({ "status": 200, "message": "hello " + req.params.ID })
})
app.get('/hello/', (req, res) => {
    res.json({ "status": 200, "message": "hello" })
})

app.get('/search', (req, res) => {
    const search = req.query.s;
    if (typeof search != 'undefined') {
        const response = {
            status: 200,
            message: "ok",
            data: search
        };
        res.send(response);
    } else {
        const response = {
            status: 500,
            error: true,
            message: "you have to provide a search"
        };
        res.status(500);
        res.send(response);
    }
});


app.get("/movies/read", (req, res) => {
    movies
        .find()
        .then((data) => res.json({ status: 200, message: data }))
        .catch((error) => console.log("error no data found"));
});


app.get("/movies/read/by-date", (req, res) => {
    movies
        .find()
        .then((data) =>
            res.json({
                status: 200,
                data: data.sort(function(a, b) {
                    return a.year - b.year;
                }),
            })
        )
        .catch((error) => console.log("error no data found"));
});




app.get("/movies/read/by-rating", (req, res) => {
    movies
        .find()
        .then((data) =>
            res.json({
                status: 200,
                data: data.sort(function(a, b) {
                    return a.rating - b.rating;
                }),
            })
        )
        .catch((error) => console.log("error no data found"));
});


app.get("/movies/read/by-title", (req, res) => {
    movies
        .find()
        .then((data) =>
            res.json({
                status: 200,
                data: data.sort(function(a, b) {
                    (a.title).localeCompare(b.title);
                }),
            })
        )
        .catch((error) => console.log("error no data found"));
});



app.get('/movies/read/id/:id', (req, res) => {
    let id = req.params.id
    movies.findById(id).then(data => {
            res.send({ status: 200, data: data })
        })
        .catch(error => {
            res.status(404).send({ status: 404, error: true, message: "the movie " + id + " does not exist" });
        })
});

app.post('/movies/create', (req, res) => {
    if (!req.query.rating) {
        req.query.rating = 4;
    }
    let titlex = req.query.title;
    let yearx = req.query.year;
    let ratingx = req.query.rating;

    if (!titlex || !yearx || yearx.length != 4 || isNaN(yearx)) {
        res.json({ status: 403, error: true, message: 'you cannot create a movie without providing a title and a year' })
    } else {
        yearx = parseInt(yearx);
        ratingx = parseInt(ratingx);
        movies.create({
            title: titlex,
            year: yearx,
            rating: ratingx,
        }).then(movies => console.log(movies));
        res.json({ status: 200, data: movies });
    }
})



app.delete('/movies/delete/:ID', (req, res) => {
    let deletedmovie = req.params.ID
    movies.findByIdAndDelete(req.params.ID).then(deletedmovie => {
            movies.find().then(data => {
                res.send({ status: 200, data: data });
            }).catch(err => {
                console.log("error, no entry find")
            })
        })
        .catch(err => {
            res.status(404).send({ status: 404, error: true, message: "the movie " + deletedmovie + " does not exist" });
        })
})




app.put("/movies/update/:ID", (req, res) => {
    var titlex = req.query.title;
    var yearx = req.query.year;
    var ratingx = req.query.rating;
    movies
        .findById(req.params.ID)
        .then(async(doc) => {
            if (req.query.title) {
                doc.title = titlex
            }
            if (req.query.rating) {
                doc.rating = ratingx
            }
            if (req.query.year) {
                doc.year = yearx
            }
            await doc.save();
            movies.find().then(movies => res.json({ status: 200, data: movies })).catch(error => console.log("error no data found"));
        })
        .catch((err) => {
            res.status(500)
                .json({
                    status: 404,
                    error: true,
                    message: `the movie ${req.params.ID} does not exist`,
                });
        });
});



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})