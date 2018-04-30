const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema= new Schema({
  display_image: {name:String , contentType:String , data: String},
  title: String,
  rating: Number,
  cooking_time:{hours:{ type: String ,"default": 0} ,minutes:{ type : String ,"default": 0} },
  serving_size: Number,
  image_gallery: [{name:String, contentType: String ,data: String }],//Array of Object of { name,contentType,data}
  ingredients: String,
  directions: String,
//video: String,//DO LAST
  tags: { type : Array , "default" : [] },
  notes: String
},
  {
    timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' }
  });

const Recipe = mongoose.model('Recipe',RecipeSchema);

module.exports=Recipe;
