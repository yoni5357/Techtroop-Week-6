import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const personSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: String,
    age: Number
})
const Person = mongoose.model("person", personSchema)

export default Person;