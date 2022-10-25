const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const name = process.argv[3]

const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.lslwh0b.mongodb.net/phoneBook?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String,
  time: Date
})

const Person = mongoose.model('Person', personSchema)

mongoose
    .connect(url)
    .then(() => {
        Person.find({}).then(result => {
            result.forEach(person => {
              console.log(person)
            })
            mongoose.connection.close()
        })
    })
    
    .then(() => {
        console.log(`Added ${name} number ${number} to phonebook`)
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))