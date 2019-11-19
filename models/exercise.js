var mongoose=require('mongoose');

var ExerciseSchema=mongoose.Schema({
  username: {type: String, required: true},
  description: {type: String,required: true},
  duration: {type: Number,required: true},
  date: {type: Date,required: true}
});

var Exercise=mongoose.model('Exercise',ExerciseSchema);

module.exports=Exercise;