const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const phoneNumber = process.argv[4];

const url = `mongodb+srv://hubermanophir:${password}@testcluster.oqqu5.mongodb.net/phone-book?retryWrites=true&w=majority`;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

const phoneSchema = new mongoose.Schema({
  name: String,
  phoneNumber: Number,
});

const Contact = mongoose.model("Note", phoneSchema);
const person = new Contact({
  name: name,
  phoneNumber: phoneNumber,
});

if (process.argv.length < 4) {
  console.log("true");
  Contact.find({}).then((result) => {
    console.log("phonebook");
    result.forEach((contact) => {
      console.log(contact.name, contact.phoneNumber);
    });
    mongoose.connection.close();
  });
} else {
  person.save().then((result) => {
    console.log("contact saved!");
    mongoose.connection.close();
  });
}
