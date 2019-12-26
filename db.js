const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  // _id: Schema.Types.ObjectId,
  question: {
    type: String,
    required: true
  },
  answers: [String]
});

mongoose.model("Question",QuestionSchema);

mongoose.connect('mongodb://localhost/hw07', { useNewUrlParser: true })
.then((resolved) => console.log('db connected!'));

module.exports = Post = mongoose.model("Questions", QuestionSchema);
