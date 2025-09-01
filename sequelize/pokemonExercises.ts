import { Sequelize, QueryTypes } from "sequelize";
const sequelize = new Sequelize(
    "mysql://root:Yoni535goro789@localhost:3306/sql_intro"
  );
//Ex2
async function getHeavyest() {
    const [heavyestResult] = await sequelize.query(
        `SELECT name FROM pokemon
        WHERE weight = (SELECT MAX(weight) FROM pokemon)`,
        { type: QueryTypes.SELECT }
    )
    const heavyest = (heavyestResult as {name:string});
    console.log(heavyest.name);
    return heavyest.name;
}