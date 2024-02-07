const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
  userid: {
    type: "String",
    require: true,
  },
  title: {
    type: "String",
    require: true,
    minlength: 3,
  },
  content: {
    type: "String",
  },
  timestamp: {
    type: "String",
    require: true,
  },
});

const noteDB = mongoose.connection.useDb("Secure-Notes");

module.exports = noteDB.model("Notes", NotesSchema);
