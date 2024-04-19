import mongoose from "mongoose";
const Schema = mongoose.Schema;

const User = new Schema({
    Firstname: String,
    Middlename: String,
    Lastname: String,
    PhoneNumber: String,
    Email: String,
});

module.exports = mongoose.model('checklist', User);
