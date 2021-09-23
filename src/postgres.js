"use strict";
require("dotenv/config");

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
      updateErrorLog(query, err);
      return err;
    } else {
      return res;
    }
  });
}

function updateErrorLog(query, error){
  var fso = CreateObject("Scripting.FileSystemObject");  
  var a = fso.CreateTextFile("./Log.txt", true);
  var now = new Date
  var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + ":" + now.getMilliseconds();
  a.WriteLine(time + ": Erro!");
  a.WriteLine("Query: "+ query);
  a.WriteLine("Erro: " + error);
  a.WriteLine("");
  a.Close();
}

module.exports = {client, query, updateErrorLog};
