let mongoose = require("mongoose");
let ProjectCategorySchema = require("../schemas/project.category");
let ProjectCategory = mongoose.model("ProjectCategory", ProjectCategorySchema);
module.exports = ProjectCategory;

