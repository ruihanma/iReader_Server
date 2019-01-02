let mongoose = require("mongoose");
let ProjectSchema = require("../schemas/project");
let Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;

