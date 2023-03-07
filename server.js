
const express = require('express');
const bodyParser = require('body-parser')
const app = express();

const MongoClient = require('mongodb').MongoClient

const connectionString = 'mongodb+srv://thien:101002@cluster0.uksehcj.mongodb.net/?retryWrites=true&w=majority'

// (0) CONNECT: server -> connect -> MongoDB Atlas 
MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')

        // (1a) CREATE: client -> create -> database -> 'ATN_company'
        // -> create -> collection -> 'customer'
        const db = client.db('ATN_company')
        const usercollection = db.collection('product')

        // To tell Express to EJS as the template engine
        app.set('view engine', 'ejs')

        // Make sure you place body-parser before your CRUD handlers!
        app.use(bodyParser.urlencoded({ extended: true }))

        // To make the 'public' folder accessible to the public
        app.use(express.static('public'))

        // To teach the server to read JSON data 
        app.use(bodyParser.json())

        // (2) READ: client -> browser -> url 
        // -> server -> '/' -> collection -> 'quotes' -> find() 
        // -> results -> index.ejs -> client
        app.get('/', (req, res) => {
            db.collection('product').find().toArray()
                .then(results => {

                    // results -> server -> console
                    console.log(results)

                    // results -> index.ejs -> client -> browser 
                    // The file 'index.ejs' must be placed inside a 'views' folder BY DEFAULT
                    res.render('index.ejs', { quotes: results })
                })
                .catch(/* ... */)
        })

        // (1b) CREATE: client -> index.ejs -> data -> SUBMIT 
        app.post('/quotes', (req, res) => {
            usercollection.insertOne(req.body)
                .then(result => {

                    // results -> server -> console
                    console.log(result)

                    // -> redirect -> '/'
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        // server -> listen -> port -> 3000
        app.listen(3000, function () {
            console.log('listening on 3000')
        })
    })


