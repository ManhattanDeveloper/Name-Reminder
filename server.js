var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('contactlist',['contactlist']);
var bodyParser = require('body-parser');
var cron = require('cron');

// Twilio Credentials 
var accountSid = 'AC3a0f1edd1cea484b5dde987eef124dc3'; 
var authToken = '7c60118184d4b86ac960edbe87227ab6'; 

//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());


/* set the home page route
app.get('/', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('index');
});
*/

//Retrieves all entries from the array.
app.get('/contactlist', function(req, res){
	res.send(array);
});

//Adds an entry to the database
app.post('/contactlist', function(req, res){
	console.log(req.body.name);
	db.contactlist.insert(req.body, function(err, doc){
		res.json(doc);
	});
});

var array = ["David Sobotta", "Devon", "Raymond Torrez", "Ben Gordon",
"Rob Spectre", "Jennie Preis", "Abe Robertson", "Ron Zori", "Natan"];

var sendMsg = function(message){
	
	
	client.messages.create({ 
	to: "+13174183511", 
	from: "+13473219669", 
	body: message,   
}, function(err, message) { 
	console.log(message.sid); 
});
  

};

var sendRandom = function(message){
	message = array[Math.round(Math.random()*array.length)-1];
    sendMsg(message);
    console.log("The follow message was sent "+message);
};

app.post('/sendRandom', function(req, res){
	sendRandom();
});



var cronJob = cron.job("0 0 * * * *", function(){
    sendRandom();
}); 
cronJob.start();

var time = 0;
var ServerTimer = cron.job("0 * * * * *", function(){
    // perform operation e.g. GET request http.get() etc.
    time = time + 1;
    console.log("The server has been up for "+time+" minutes.");
}); 
ServerTimer.start();

/*
function doSomething() {}

(function loop() {
    var rand = Math.round(Math.random() * 6000);
    setTimeout(function() {
            //alert('A');
            sendMsg2(array[Math.round(Math.random()*array.length)-1]);
            loop();  
    }, rand);
}());
*/

//Adds an entry to the array
app.post('/addToArray', function(req, res){
	
	array.push(req.body.name);
	console.log(array);
	res.send(array);
});

app.post('/sendMsg', function(req, res){
	console.log(req.body.name);
	sendMsg(req.body.name);
	res.send(array);
});

var deleteName = function(name){
	for(i=0; i < array.length; i++){
		if (array[i]==name){
			array.splice(i, 1);
		}
	}
};

//Deletes an entry from the database based on the given id.
app.delete('/contactlist/:id', function(req, res){
	var id = req.params.id;
	deleteName(id);
	console.log(id);
});

//Returns information that's related to a given id.
app.get('/contactlist/:id', function(req, res){
	var id = req.params.id;
	db.contactlist.findOne({_id: mongojs.ObjectId(id)}, function(err, doc){
		res.json(doc);
	});
});

//Used to edit an existing entry
app.put('/contactlist/:id', function(req, res){
	var id = req.params.id;
	db.contactlist.findAndModify({query: {_id: mongojs.ObjectId(id)},
		update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}},
		new: true}, function(err, doc){
			res.json(doc);
		
	});
});

sendMsg("Server Started");
app.listen(process.env.PORT || 3000)
console.log("Server running on port 3000");