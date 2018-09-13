const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');  //body parser is middleware so required
const assert = require('assert');           //for throwing the err
const port = 3000;  //setting the port no 

//init the app
const app = express();


//Setting up the mongo db
const MongoClient = require('mongodb').MongoClient;
//for the object id of the mongodb for sql people its pk kinda
const ObjectID = require('mongodb').ObjectID;
// Connection URL
const url = 'mongodb://localhost:27017/todoapp';    //default url 27017
// Database Name
const dbName = 'todos';


//Body Parser Middlewware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));  //default setups


app.use(express.static(path.join(__dirname,'public'))); //By default it will use the publc dir

//View setup
app.set('views', path.join(__dirname,'views')); //set the path for views
app.set('view engine', 'ejs');                  //Set the engine as EJS


//Connect to the mongodb
MongoClient.connect(url , (err, client) => {
  
    assert.equal(null, err);    //if the assertis null it will throw an error
    console.log("MONGODB connected");

    const db = client.db(dbName);
    Todos = db.collection('todos');
  
    //Always listening on this port number keeping it inside since we dont have to connect again n again
    app.listen(port, () => {
        console.log("Sever running on port: " + port);
    });


});


/* For the default route and rendering the index page */
app.get('/', (req, res, next) => {
    
    Todos.find({}).toArray((err, todos) => {
        assert.equal(err, null);    //if the assertis null it will throw an error

        console.log("Found the following records");
        console.log(todos)

        res.render('index', {    //it will render the index
            todos : todos       //and the todos which we got from the array
        });                
    })
    
});




/* To INSERT THE TODO */
app.post('/todo/add',  (req,res,next) => {
    //console.log("Submitted form");
    /* Create new obj which will store the info*/
    const todo ={
        text: req.body.text,      //value from the form using the body parser
        body: req.body.body,        //value from the form using the body parser
    }

    //now insert the data
    Todos.insert(todo, (err, result) => {
        assert.equal(err, null);    //if the assertis null it will throw an error

        console.log("TODO IS SUCCESSFULLY ADDED");
        res.redirect('/');

    });
})





/* To DELETE THE TODO */
app.delete('/todo/delete/:id', (req,res,next) => {
    const query = {_id :   ObjectID(req.params.id) };   //to get the id mongo stores it as   _id
    
    Todos.deleteOne(query, (err,response) => {
        assert.equal(err, null);    //if the assertis null it will throw an error

        console.log("Todo Removed");
        res.send(200);          //this is for the ok status which is 200
    });

});






/* To GET THE REQUEST FOR EDITING THE TODO */
app.get('/todo/edit/:id', (req, res, next) => {

    const query = { _id: ObjectID(req.params.id) }; //to get the id mongo stores it as   _id

    Todos.find(query).next((err, todo) => {
        assert.equal(err, null);    //if the assertis null it will throw an error

        console.log("Found the following records");
        console.log(todo)
        //callback(docs);

        res.render('edit', {    //it will render the index
            todo: todo       //and the todos which we got from the array
        });
    })

});



/* To UPDATE  THE TODO */
app.post('/todo/edit/:id', (req, res, next) => {

    const query = { _id: ObjectID(req.params.id) };

    /* Create new obj */
    const todo = {
        text: req.body.text,      //value from the form using the body parser
        body: req.body.body,        //value from the form using the body parser
    }

    //now update query 
    Todos.updateOne(query, {$set:todo},  (err, result) => {
        assert.equal(err, null);    //if the assertis null it will throw an error

        console.log("TODO IS SUCCESSFULLY UPDATED");
        res.redirect('/');


    });
})