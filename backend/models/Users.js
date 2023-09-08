const {  Model, model, Schema } = require("mongoose");

const userSchema = new Schema({
  userId: String,
  jobIds: Array,
  asserts: Array,

  
},
{
  timestamps: true,
}
);


const Users = model("Users", userSchema);

module.exports = Users;
