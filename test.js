var pg = require('pg')

// instantiate a new client
// the client will read connection information from
// the same environment variables used by postgres cli tools
var postgresUrl = 'postgres://localhost/twitterdb'
var client = new pg.Client(postgresUrl);

// connect to our database
client.connect(

client.query('select * from users where name = \'Anton\'', function(err, result){
  if (err) throw err;
  console.log(result);
})

);

//module.exports = client;
