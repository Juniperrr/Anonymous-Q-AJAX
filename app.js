const express = require("express");
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Question = require('./db');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.post('/questions/', (req, res) => {
  // Create a new question document
  // Send back json (if new document created, send it back in json)
  var newQ = new Question({
    question: req.body.question,
    answers: [] // array
  });
  newQ.save(function(err, saved_question, count) {
    if (err) { 
      return res.send('Error occurred: database error.'); 
    }
    res.json({id: saved_question._id}); // returning the id of the obj in json form
  });
});

app.post('/questions/:id/answers/', (req, res) => {
  // TODO
  // Push the answer to its question (use findByIdAndUpdate)
  Post.findByIdAndUpdate(req.params.id, 
    {"$push": {answers: req.body.answer}}, 
    {"new": true}, (err, docs) => {
      return res.json(docs); // returning the id of the obj in json form
  });
});

app.get('/questions/', (req, res) => {
  // Retrieve all questions and send back as JSON
  const queryObj = {};
  Question.find(queryObj, (err, found) => {
    if (err) {
      // error handling
    }
    console.log('queryObj: ', queryObj);
    res.json(found);
  });
})

app.listen(3000);
console.log('Server started running!');