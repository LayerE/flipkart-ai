const { Model, model, Schema } = require("mongoose");

const userSchema = new Schema(
  {
    userId: String,
    jobIds: Array,
    jobIds3D: Array,
    jobIdsQuike: Array,

    allJobIs: Array,

    asserts: Array,
  },
  {
    timestamps: true,
  }
);

const Users = model("Users", userSchema);

module.exports = Users;
