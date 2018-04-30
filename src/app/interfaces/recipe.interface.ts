import {Identifiers} from '@angular/compiler/src/identifiers';

export interface RecipeInterface {
  _id: Identifiers;
  display_image: {name: String , contentType: String , data: String};
  title: String;
  rating: Number;
  cooking_time: { hours: String , minutes: String };
  serving_size: Number;
  image_gallery: [{name: String, contentType: String , data: String }];
  ingredients: String;
  directions: String;
  tags: Array<string>;
  notes: String;
}
