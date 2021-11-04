"use strict";
require("dotenv/config");
const fs = require('fs')
const { Client } = require("pg");

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

function query(query) {
  client.query(query, (err, res) => {
    if (err) {
      return err;
    } else {
      return res;
    }
  });
}

function updateErrorLog(query, error){
  var now = new Date()
  let stream = fs.createWriteStream(`./Log(${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}).txt`)
  stream.once('open', function(){
  var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + ":" + now.getMilliseconds();
  stream.write(time + ": Erro!"+ '\n');
  stream.write("Query: "+ query+'\n');
  stream.write("Erro: " + error+'\n');
  stream.end()
  })
}

module.exports = {client, query, updateErrorLog};

