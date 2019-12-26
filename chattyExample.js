// Fix: auto-render, AJAX callback error

// app.js
require('./db');
router.get('/json', function(req, res) {
    res.json({foo: 'bar'}); 
    // sending back a (surprise) json
    // sets header too: Content-Type:application/json
});
// client side (create a new message) -- POST  /messages
// a route that accepts POST
router.post('/api/messages/', function(req, res) {
    var message = new Message({
      text: req.body.message,
      dateSent: Date.now()
    });
    message.save(function(err, saved_message, count) {
        if (err) { 
            return res.send(500, 'Error occurred: database error.'); 
        }
        res.json({id: saved_message._id}); // returning the id of the obj in json form
    });
});
router.get('/api/messages', function(req, res) {
    console.log(req.query.lastRetrievalDate);
    var q = {};
    if (req.query.lastRetrievalDate) {
      // just get recent messages
      q.dateSent = {$gt:new Date(req.query.lastRetrievalDate)};
      console.log(q);
    }
    // sort by dateSent
    Message.find(q).sort('dateSent').exec(function(err, messages, count) {
      console.log('messages:', messages);
      console.log('err:', err);
      res.json(messages.map(function(ele) {
        return {
          'message': ele.text,
          'date': ele.dateSent
        }; 
      }));
    });
});

// index.js


// client side (read & store a new meassage) -- GET  /messages
var lastRetrievalDate, 
    timer, 
    delay = 1000;
document.addEventListener("DOMContentLoaded", getMessages);
document.querySelector('input[type=button]').addEventListener("click", sendMessage);
function getMessages() {
    var req = new XMLHttpRequest(),
    url = 'http://localhost:3000/api/messages';
    console.log(lastRetrievalDate);
    if (lastRetrievalDate) {
        url += '?lastRetrievalDate=' + lastRetrievalDate;
    }
    req.open('GET', url, true);
    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400){
            data = JSON.parse(req.responseText);
            messageList = document.getElementById('message-list');
            // Appending each data as a child to an ele '#messageList'
            data.forEach(function(msg) {
                var div = messageList.appendChild(document.createElement('div'));
                div.textContent = (new Date(msg.date)).toLocaleString() 
                    + ' - ' + msg.message;
            });
        } 
    });
    req.send();
}

function sendMessage() {
	var message = document.getElementById('message').value;
	console.log('sending message', message);
	var req= new XMLHttpRequest();
	req.open('POST', 'http://localhost:3000/api/messages/create', true);
	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	req.send('message=' + message);
	req.addEventListener('load', function(eve) {
    clearTimeout(timer);
		getMessages();
	});
}

// client side (create a mew message) -- post  /messages
var message = document.getElementById('message').value;
var req= new XMLHttpRequest();
req.open('POST', 'http://localhost:3000/api/message', true);
req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
req.send('message=' + message);






// db.js
var mongoose = require('mongoose');
URLSlugs = require('mongoose-url-slugs');

var Message = new mongoose.Schema({
	text: String,
	dateSent: Date
});

mongoose.model('Message', Message);
mongoose.connect('mongodb://localhost/jaxindb/');