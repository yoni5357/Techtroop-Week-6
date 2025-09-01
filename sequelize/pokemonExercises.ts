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

//Ex3
async function findByType(type:string){
    const results = await sequelize.query(
        `SELECT p.name
        FROM pokemon p 
        JOIN pokemon_type pt ON p.type_id = pt.type_id
        WHERE pt.type_name = :type`,
        {
            replacements:{type:type},
            type:QueryTypes.SELECT
        }
    )
    const pokemonNames = results.map((res:any) => res.name);
    console.log(pokemonNames);
    return pokemonNames;
}

//Ex4
async function findOwners(pokemon:string){
    const results = await sequelize.query(
        `SELECT tr.name
        FROM pokemon p
        JOIN pokemon_trainer pt ON p.pokemon_id = pt.pokemon_id
        JOIN trainer tr ON tr.trainer_id = pt.trainer_id
        WHERE p.name = :pokemon`,
        {
            replacements:{pokemon},
            type:QueryTypes.SELECT
        }
    )
    const trainerNames = results.map((res:any) => res.name);
    console.log(trainerNames);
    return trainerNames;
}
