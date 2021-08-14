const { Client } = require('pg');

const client = new Client({
    user: '',
    host: '',
    database: '',
    password: '',
    port: 0
});

client.connect();

const query = "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE';";

var test;

client.query(query, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }

    const tables = document.querySelector('#tables');
    for (let row of res.rows) {
        let element = document.createElement('button')
        element.classList.add(row.table_name);
        element.innerText = row.table_name;
        tables.append(element)
        console.log(row);
    }

    tables.addEventListener('click', function (e) {
        test = "select * from " + e.target.innerText;
        client.query(test, (err, res) => {
            console.log(test)
            if (err) {
                console.error(err);
                return;
            }

            for (let row of res.rows) {
                let element = document.createElement('h2')
                element.classList.add(row.table_name);
                let array = [row.row_name, row.example, row.example]
                element.innerText = array
                tables.append(element)
            }
        })
    })
})










