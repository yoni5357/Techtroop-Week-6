import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();

mongoose.connect(process.env.DB_CONNECTION).catch((err)=> console.log(err));
const Schema = mongoose.Schema;

const personSchema = new Schema({
  firstName: String,
  lastName: String,
  age: Number,
  address : {
    city : String,
    street: String,
    apartment : Number
  }
})

const computerSchema = new Schema({
    maker:String,
    price:Number
})

// const Computer = mongoose.model('Computer', computerSchema);

const Person = mongoose.model('Person', personSchema)

let p1 = new Person({ firstName: "David", lastName: "Smith", age: 25 }) //purposefully ignoring the `address` field
// let c1 = new Computer({maker:"HP",price:1500})
// let c2 = new Computer({maker:"Apple",price:2200})
// let c3 = new Computer({maker:"Asus",price:3500})
// p1.save();
// c1.save();
// c2.save();
// c3.save();

Person.find({}).then(function (people) {
    console.log(people)
})
