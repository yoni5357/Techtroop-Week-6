import { Sequelize } from "sequelize";

const sequelize = new Sequelize('mysql://root:Yoni535goro789@localhost/sql_intro');

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    })

sequelize
    .query("SELECT * FROM company")
    .then(function ([results, metadata]) {
        console.log(results)
    })
