CREATE TABLE pokemon_type (
    type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(20) UNIQUE
);

CREATE TABLE town (
    town_id INT AUTO_INCREMENT PRIMARY KEY,
    town_name VARCHAR(50) UNIQUE
);

CREATE TABLE pokemon (
    pokemon_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20),
    type_id INT,
    height INT,
    weight INT,
    FOREIGN KEY (type_id) REFERENCES pokemon_type(type_id)
);

CREATE TABLE trainer (
    trainer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20),
    town_id INT,
    FOREIGN KEY (town_id) REFERENCES town(town_id)
);

DELETE FROM trainer;
ALTER TABLE trainer AUTO_INCREMENT = 1;

CREATE TABLE pokemon_trainer (
    pokemon_id INT,
    trainer_id INT,
    PRIMARY KEY (pokemon_id, trainer_id),
    FOREIGN KEY (pokemon_id) REFERENCES pokemon(pokemon_id),
    FOREIGN KEY (trainer_id) REFERENCES trainer(trainer_id)
);