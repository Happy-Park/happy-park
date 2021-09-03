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

function insert(table,query) {
  client.query(`insert into ${table} values(${query})`, (err, res) => {
    if (err) {
      return err;
    } else {
      return res;
    }
  });
}

module.exports = client;
