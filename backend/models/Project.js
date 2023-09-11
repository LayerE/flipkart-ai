const {  Model, model, Schema } = require("mongoose");

const projectSchema = new Schema({
  userId: String,
  title: String,
  jobIds: Array,
  previewImage: String,
  canvas: Object,
  canvasHistory: Object,
  asserts: Array,
  project:Array,
  recently:Array
  
},
{
  timestamps: true,
}
);


const Projects = model("Projects", projectSchema);

module.exports = Projects;
