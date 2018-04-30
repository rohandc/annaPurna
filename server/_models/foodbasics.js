const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const foodbasicsSchema= new Schema({
  flyer_item_id: Number,
  flyer_id: Number,
  flyer_type_id: Number,
  merchant_id: Number,
  brand: String,
  display_name: String,
  name: String,
  description: String,
  current_price: String,
  pre_price_text: String,
  price_text: String,
  category_ids: { type : Array , "default" : [] },
  category_names: { type : Array , "default" : [] },
  left: String,
  bottom: String,
  right: String,
  top: String,
  run_item_id: Number,
  discount_percent: Number,
  display_type: Number,
  iframe_display_width: String,
  iframe_display_height: String,
  url: String,
  in_store_only: Boolean,
  review: String,
  video: Boolean,
  page_destination: String,
  video_count: String,
  video_url: Boolean,
  recipe: Boolean,
  recipe_title: String,
  text_areas: { type : Array , "default" : [] },
  shopping_cart_urls: { type : Array , "default" : [] },
  large_image_url: String,
  x_large_image_url: String,
  dist_coupon_image_url: String,
  sku: String,
  custom1: String,
  custom2: String,
  custom3: String,
  custom4: String,
  custom5: String,
  custom6: String,
  valid_to: String,
  valid_from: String,
  disclaimer_text:String,
  flyer_type_name_identifier: String,
  flyer_run_id: Number,
  sale_story: String
  },
  {
    timestamps: { createdAt: 'created_date', updatedAt: 'updated_date' }
  });
foodbasicsSchema.index({name: 'text', display_name: 'text'});//.index({'$**': 'text'})
const foodbasics = mongoose.model('foodbasics',foodbasicsSchema);

module.exports=foodbasics;
