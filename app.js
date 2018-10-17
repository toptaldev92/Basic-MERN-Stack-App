const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const Article = require('./models/articlesModel.js');
const articles = require('./routes/articlesRoute.js');
const users = require('./routes/usersRoute.js');

mongoose.connect('mongodb://localhost:27017/basic-mern-app', { useNewUrlParser: true });
mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (error) => {
    console.log(error);
});

let app = express();

// Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client/build')));

app.use((req, res, next) => {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
     if (req.method === 'OPTIONS') {
         res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET");
         return res.status(200).json({});
     }
     next();
})

app.get('/articles', (req, res) => {
    Article.find({}, (err, articles) => {
        res.json({ articles });
    })
});

app.use('/articles', articles);
app.use('/users', users);

app.use((req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
})

app.listen(5000, () => {
    console.log('Server started on port 5000');
});
