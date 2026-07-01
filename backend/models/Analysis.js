const mongoose = require("mongoose")

const analysisSchema = new mongoose.Schema({

  candidateName: String,

  analysis: String,

  questions: String,

  atsScore: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }

})

module.exports = mongoose.model(
  "Analysis",
  analysisSchema
)