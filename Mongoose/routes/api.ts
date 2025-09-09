import express, { Request, Response } from 'express';
import Person from '../models/Person';
const router = express.Router()


router.get('/people', function (req:Request, res:Response) {
    Person.find({}).then( function (people) {
        res.send(people)
    })
})

router.post('/person', (req:Request,res:Response) => {
    const newPerson = new Person(req.body);
    try{
        newPerson.save();
    } catch(err) {
        res.sendStatus(500);
        throw new Error("Failed to create new Person: " + err.message);
    }
    res.status(200);
    res.send(newPerson);
})

router.put('/person/:id', (req:Request, res:Response) => {
    const personId = req.params.id;
    
})

export default router;
