const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const name = process.argv[3]

const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.lslwh0b.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
  time: Date
})

const Person = mongoose.model('Person', personSchema)

if ((!name) || (!number)) {
  console.log('phonebook:')
  Person
    .find({})
    .then(result => {
      result.forEach(n => {
        console.log(n.name, n.number)
      })
      mongoose.connection.close()
    })
}

const person = new Person({
  name: name,
  number: number,
})

if ((name) && (number)) {
  person
    .save()
    .then(result => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
}

