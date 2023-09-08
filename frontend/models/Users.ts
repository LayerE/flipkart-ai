import mongoose from 'mongoose';
var Schema = mongoose.Schema;
var userSchema = new Schema({
  userId: String,
  jobIds: Array,
  canvas: Object,
  canvasHistory: Object,
  asserts: Array,
  
},
{
  timestamps: true,
}
);

// Check if the model already exists before defining it
var Users =  mongoose.model.Users  ??  mongoose.model("Users", userSchema)

export default Users
