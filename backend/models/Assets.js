const {  Model, model, Schema } = require("mongoose");

const assetsSchema = new Schema({
  userId: String,
  url: String,
  projectId: String,
  
},
{
  timestamps: true,
}
);


const Assets = model("Assets", assetsSchema);

module.exports = Assets;
