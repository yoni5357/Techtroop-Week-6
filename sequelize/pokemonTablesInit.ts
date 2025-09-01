import { promises as fs } from "fs";
import path from "path";
import { Sequelize, QueryTypes } from "sequelize";

type ownedBy = {
  name: string;
  town: string;
};

type pokemonJson = {
  id: number;
  name: string;
  type: string;
  weight: number;
  height: number;
  ownedBy: ownedBy[];
};

type pokemon = {
  id: number;
  name: string;
  type: string;
  weight: number;
  height: number;
};

async function readPokemonJson() {
  const filePath = path.join(__dirname, "pokemon.json");
  const data = await fs.readFile(filePath, "utf-8");
  const pokemonList = JSON.parse(data);
  return pokemonList;
}

async function insertUniqueTypes(
  sequelize: Sequelize,
  pokemonList: pokemonJson[]
) {
  const types = Array.from(
    new Set(pokemonList.map((p: pokemonJson) => p.type).filter(Boolean))
  );
  for (const type of types) {
    await sequelize.query(
      "INSERT IGNORE INTO pokemon_type (type_name) VALUES (:type)",
      { replacements: { type } }
    );
  }
}

async function insertUniqueTowns(
  sequelize: Sequelize,
  pokemonList: pokemonJson[]
) {
  const towns = Array.from(
    new Set(
      pokemonList.flatMap((p: pokemonJson) => {
        return p.ownedBy.map((o: ownedBy) => o.town).filter(Boolean);
      })
    )
  );
  for (const town of towns) {
    await sequelize.query(
      "INSERT IGNORE INTO town (town_name) VALUES (:town)",
      { replacements: { town } }
    );
  }
}

async function insertPokemon(sequelize: Sequelize, pokemonList: pokemonJson[]) {
  const pokemon = Array.from(
    new Set(
      pokemonList.map((p: pokemonJson) => {
        return {
          id: p.id,
          height: p.height,
          name: p.name,
          type: p.type,
          weight: p.weight,
        } as pokemon;
      })
    )
  );
  for (const p of pokemon) {
    // Get the type_id from the pokemon_type table
    const [typeResult] = await sequelize.query(
      "SELECT type_id FROM pokemon_type WHERE type_name = :type",
      {
        replacements: { type: p.type },
        type: QueryTypes.SELECT,
      }
    );

    const typeId = (typeResult as { type_id: number })?.type_id;

    await sequelize.query(
      `INSERT IGNORE INTO pokemon (pokemon_id,name,type_id,height,weight)
		  VALUES (:id, :name, :type_id, :height, :weight)`,
      {
        replacements: {
          id: p.id,
          name: p.name,
          type_id: typeId,
          height: p.height,
          weight: p.weight,
        },
      }
    );
  }
}

async function insertTrainers(
  sequelize: Sequelize,
  pokemonList: pokemonJson[]
) {
  // Flatten all trainers and deduplicate by name|town
  const allTrainers = pokemonList.flatMap((p: pokemonJson) => p.ownedBy);
  const trainerMap = new Map<string, ownedBy>();
  for (const trainer of allTrainers) {
    if (trainer.name && trainer.town) {
      const key = `${trainer.name}|${trainer.town}`;
      if (!trainerMap.has(key)) {
        trainerMap.set(key, trainer);
      }
    }
  }
  const trainers = Array.from(trainerMap.values());
  for (const trainer of trainers) {
    const [townResult] = await sequelize.query(
      "SELECT town_id from town WHERE town_name = :name",
      {
        replacements: { name: trainer.town },
        type: QueryTypes.SELECT,
      }
    );

    const townId = (townResult as { town_id: number })?.town_id;

    await sequelize.query(
      "INSERT IGNORE INTO trainer (name,town_id) VALUES(:name,:town_id)",
      { replacements: { name: trainer.name, town_id: townId } }
    );
  }
  console.log(trainers);
}

async function insertPokemonTrainers(
  sequelize: Sequelize,
  pokemonList: pokemonJson[]
) {
  const pokemonTrainerPromises = pokemonList.map(async (p: pokemonJson) => {
    const idPairs = [];
    for (const trainer of p.ownedBy) {
      const [trainer_result] = await sequelize.query(
        "SELECT trainer_id FROM trainer WHERE name = :trainer_name",
        {
          replacements: { trainer_name: trainer.name },
          type: QueryTypes.SELECT,
        }
      );
      const trainer_id = (trainer_result as { trainer_id: number })?.trainer_id;
      idPairs.push({ pokemon_id: p.id, trainer_id: trainer_id });
    }
    return idPairs;
  });
  const pokemonTrainersArrays = await Promise.all(pokemonTrainerPromises);
  const pokemonTrainers = pokemonTrainersArrays.flat();
  for (const idPair of pokemonTrainers) {
    await sequelize.query(
      "INSERT IGNORE INTO pokemon_trainer (pokemon_id,trainer_id) VALUES(:pokemon_id,:trainer_id)",
      {
        replacements: {
          pokemon_id: idPair.pokemon_id,
          trainer_id: idPair.trainer_id,
        },
      }
    );
  }
}

async function main() {
  const sequelize = new Sequelize(
    "mysql://root:Yoni535goro789@localhost:3306/sql_intro"
  );
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    const pokemonList = await readPokemonJson();
    await insertUniqueTypes(sequelize, pokemonList);
    await insertUniqueTowns(sequelize, pokemonList);
    await insertPokemon(sequelize, pokemonList);
    await insertTrainers(sequelize, pokemonList);
    await insertPokemonTrainers(sequelize, pokemonList);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sequelize.close();
  }
}

main();
