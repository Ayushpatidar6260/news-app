import mongoose, { mongo } from "mongoose";

const NewzModel = new mongoose.Schema({
  Name: { type: String, required: true },
  Username: { type: String, required: true },
  Email: { type: String, required: true },
  Password: { type: String, required: true },
  Contact: { type: Number, required: true },
});

const newsExport = mongoose.model("/AndroidApp", NewzModel);
export default newsExport;
