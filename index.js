const express = require('express')
const app = express()
const port = 3000


const mongoose = require('mongoose')
mongoose.connect(
        "mongodb+srv://user:user@cluster0.ztjie.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
    .then(() => console.log("database connected")).catch(error => console.log(error))





var today = new Date();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

//const movies = [
//    { title: 'Jaws', year: 1975, rating: 8 },
//    { title: 'Avatar', year: 2009, rating: 7.8 },
//    { title: 'Brazil', year: 1985, rating: 8 },
//    { title: 'الإرهاب والكباب', year: 1992, rating: 6.2 }
//]


const movieshcema = new mongoose.Schema({
    title: { type: String, default: "" },
    year: { type: Number, default: 1900 },
    rating: { type: Number, default: 4 },
}, { versionKey: false });
const movies = mongoose.model("movies", movieshcema);
//movies.create({ title: 'Jaws', year: 1975, rating: 8 }, { title: 'Avatar', year: 2009, rating: 7.8 }, { title: 'Brazil', year: 1985, rating: 8 }, { title: 'الإرهاب والكباب', year: 1992, rating: 6.2 })




//Step-2
app.get('/', (req, res) => {
    res.send('ok')
})

//Step-3
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

//Step-5
//app.get('/movies/read', (req, res) => {
//    res.json({ "status": 200, "message": movies })
//})

app.get("/movies/read", (req, res) => {
    movies
        .find()
        .then((data) => res.json({ status: 200, message: data }))
        .catch((error) => console.log("error no data found"));
});


//Step-6
//app.get('/movies/read/by-date',(req,res)=>{
//    res.json({"status":200,"data":movies.sort(function(a, b){return a.year - b.year})})
//})

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




//app.get('/movies/read/by-rating',(req,res)=>{
//    res.json({"status":200,"data":movies.sort(function(a, b){return b.rating - a.rating})})
//})

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


//app.get('/movies/read/by-title', (req, res) => {
//    res.json({
//        "status": 200, "data": movies.sort((a, b) => {
//            if (a.title.toLowerCase() < b.title.toLowerCase())
//                return -1
//            if ((a.title.toLowerCase() > b.title.toLowerCase()))
//                return 1
//            return 0
//        })
//    })
//})

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



//Step-7
//app.get('/movies/read/id/:id', (req, res) => {
//    let id = req.params.id
//    if (id) {
//        if (id < movies.length) {
//            res.json({status:200,data:movies[id]})
//        }
//        else if(id == null || id=== undefined) {
//            res.json({status:404,error:"You didnt add an id!"})
//        }
//        else{
//            res.status(404).json({status:404,error:true, message:"the movie " +id+ " does not exist"} )
//        }
//    }
//})

app.get('/movies/read/id/:id', (req, res) => {
    let id = req.params.id
    movies.findById(id).then(data => {
            res.send({ status: 200, data: data })
        })
        .catch(error => {
            res.status(404).send({ status: 404, error: true, message: "the movie " + id + " does not exist" });
        })
});




//step-8
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



//step-9
//app.delete('/movies/delete/:ID', (req, res)=> {
//let deletedmovie=req.params.ID
//if (movies.length<deletedmovie){
//res.json({status:404, error:true, message:'the movie <ID> does not exist'})
//}
//else{
//movies.splice(deletedmovie, 1)
//res.json ({status:200, data:movies})}
//})


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


//Step-10
//app.put('/movies/update/:ID', (req, res) => {
//    var titlex = req.query.title;
//    var yearx = req.query.year;
//    var ratingx = req.query.rating;
//if(!req.query.title){
//    var titlex=movies[req.params.ID].title
//}
//if(!req.query.rating){
//    var ratingx=movies[req.params.ID].rating
//}
//if(!req.query.year){
//    var yearx=movies[req.params.ID].year
//}
//    movies[req.params.ID] = { title: titlex, year: yearx, rating: ratingx };
//    res.json({ status: 200, data: movies })
//
//})



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