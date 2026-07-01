const mongoose = require("mongoose")

const CandidateSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  role: {
    type: String,
    required: true
  },

  experience: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "Applied"
  },

  resume: {
    type: String,
    default: ""
  },

  notes: {
    type: String,
    default: ""
  },

  interviewDate: {
    type: String,
    default: ""
  },

  interviewTime: {
    type: String,
    default: ""
  }

})

module.exports = mongoose.model("Candidate", CandidateSchema)