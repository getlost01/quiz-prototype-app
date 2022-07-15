const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuizSchema = new Schema({
  shortId: {
    type: String,
    required: true
  },
  quizJsonData: {
    type: String,
    default: "",
    required: true
  }
})

const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;