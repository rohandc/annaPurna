import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DataService } from '../services/data.service';
//import { ENTER } from '@angular/material';
import { RecipeInterface} from '../interfaces/recipe.interface';
import { BehaviorSubject} from 'rxjs/BehaviorSubject';
import { DialogTemplateComponent} from '../dialog-template/dialog-template.component';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
/*  encapsulation: ViewEncapsulation.None*/
})
export class HomeComponent implements OnInit {
    @ViewChild('fileinput') fileinput;
    @ViewChild('imageUpload') imageUpload;
    customStyle = {
    selectButton: {
      'background-color': '#894489',
      'border-radius': '10px',
      'color': '#000'
    },
    clearButton: {
      'background-color': '#FF0000',
      'border-radius': '10px',
      'color': '#fff',
      'margin-left': '10px'
    },
    layout: {
      'background-color': '#ffeda9',
      'border-radius': '10px',
      'color': '#000',
      'font-size': '15px',
      'margin': '10px',
      'padding-top': '5px',
      'width': '500px',
      'display': 'inline-block'
    },
    previewPanel: {
      'background-color': '#673AB7',
      'border-radius': '0 0 25px 25px',
    }
  };
    recipeForm: FormGroup;
    disp_img = null;
    disp_rate= 0;
    disp_ratenum= [];
    file_list= [];
    selectedIndex= 0;
    selectable = true;
    removable = true;
    addOnBlur = true;
    separatorKeysCodes = [13, 188];//ENTER
    tags = [];
    isDuplicateTag= false;
    isLoading= false;
    isLoadingRecipe$: BehaviorSubject<boolean> = new BehaviorSubject(false);
    recipeList: Array<RecipeInterface>;
    isEditMode = false;
    edit_file_list = [];
    isRecipeViewed= false;
    recipeIngredients= null;
    recipeDirection= null;
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    @Output() removed: EventEmitter<RecipeInterface> = new EventEmitter<RecipeInterface>();

    constructor(private fb: FormBuilder, private dataService: DataService, public dialog: MatDialog, public snackBar: MatSnackBar) {
    this.recipeForm = fb.group({
      display_image: [],
      title: [null,  Validators.required],
      rating: [null, Validators.required],
      cooking_time: fb.group({
        hours: [null, Validators.required],
        minutes: [null, Validators.required]
      }),
      serving_size: [null, Validators.required],
      ingredients: [null, Validators.required],
      directions: [null, Validators.required],
      notes: [null],
      image_gallery: [],
      tags: [null]
    });
  }


  ngOnInit()  {
    this.galleryOptions = [
      /*{
        width: '700px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },*/
      { 'breakpoint': 500, 'width': '60%', 'height': '300px', 'thumbnailsColumns': 3, imageAnimation: NgxGalleryAnimation.Slide },
      { 'breakpoint': 300, 'width': '100%', 'height': '200px', 'thumbnailsColumns': 2, imageAnimation: NgxGalleryAnimation.Slide }
    ];
    this.getRecipeOnLoad();
  }
  onSubmit() {
    this.recipeForm.controls['image_gallery'].setValue(this.file_list);
    this.recipeForm.controls['tags'].setValue(this.tags);
    this.isLoading = true;
    this.dataService.submitRecipe(this.recipeForm.value).subscribe( (success: any  ) => {
      if (success.status === 200 ) {
        this.recipeForm.reset();
       // this.imageUpload.deleteAll();
        this.disp_img = null;
        this.disp_rate = 0;
        this.isLoading = false;
        this.getRecipeOnLoad();
        this.selectedIndex = 0;
      }
   } ,
      error => console.log(error)
    );
  }
  onDelete() {
    this.disp_img = null;
    console.log(this.recipeForm.value);
  }
  onChange(event) {
    if (event.target.files && event.target.files[0]) {
      const inputFile = event.target.files[0];
      this.dataService.imageResizer(inputFile).subscribe(result => {
          const outputFile = new File([result], result.name , {type: result.type });
          const reader = new FileReader();
          reader.onload = (eventi: any) => {
            this.disp_img = eventi.target.result;
            const data = (eventi.target.result.split('base64,'))[1];
            const img_obj = {
              name: result.name,
              contentType: result.type,
              data: data
            };
            this.recipeForm.controls['display_image'].setValue(img_obj);
          };
          reader.readAsDataURL(outputFile);
         },
        error => {
          console.log('😢 Oh no!', error);
        });

    }
  }
  onRatingChange(value) {
    this.disp_rate = value;
    this.disp_ratenum = this.getNumArray(value);
  }
  onEdit(value) {
    if (value === 'rating') {
      this.disp_rate = 0;
      this.disp_ratenum = [];
    }
  }
  onRemoved(response) {

    this.file_list = this.file_list.filter(function(obj){
      return obj.name !== response.file.name;
    });
  }
  onUploadFinished(response) {
      this.dataService.imageResizer(response.file).subscribe( result => {
          const outputFile = new File([result], result.name , {type: result.type });
          const reader = new FileReader();
          const __this = this;
          reader.onload = (function(f) {
            return (eventi: any) => {
              __this.disp_img = eventi.target.result;
              const data = (eventi.target.result.split('base64,'))[1];
              const img_obj = {
                name: f.name,
                contentType: f.type,
                data: data
              };
              __this.file_list.push(img_obj);
            };
          })(outputFile);
         reader.readAsDataURL(outputFile);
        },
        error => {
          console.log('😢 Oh no!', error);
        });

  }
  add(control: any): void {
    const value = control.value.trim();
    this.isDuplicateTag = this.tags.indexOf(value) !== -1;
    if ((value || '').trim() && this.tags.indexOf(value) === -1) {
      this.tags.push(value);
      this.recipeForm.controls['tags'].setValue('');
    }
  }
  remove(tag: any): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }
  getRecipeOnLoad() {
    this.isLoadingRecipe$.next(true);
      this.dataService.getRecipe().subscribe(
        success => this.recipeList = success ,
        failure => console.log(failure),
        () => this.isLoadingRecipe$.next(false)
      );
  }
  getNumArray(num) {
      num = parseInt(num, 10);
      return new Array(num);
  }
  onRecipeEdit(recipeId) {
    this.dataService.getSingeRecipe(recipeId).subscribe((success ) => {
      this.recipeForm.addControl('ID' , new FormControl(recipeId) );
       this.isEditMode = true;
       this.file_list = [];
        this.recipeForm.controls['display_image'].setValue(success.display_image);
        this.disp_img =  'data:' + success.display_image.contentType + ';base64,' + success.display_image.data;
        this.onRatingChange(success.rating);
        this.recipeForm.controls['title'].setValue(success.title);
        this.recipeForm.controls['rating'].setValue(success.rating);
        this.recipeForm.controls['serving_size'].setValue(success.serving_size);
        this.recipeForm.get(['cooking_time', 'hours']).setValue(success.cooking_time.hours);
        this.recipeForm.get(['cooking_time', 'minutes']).setValue(success.cooking_time.minutes);
        this.recipeForm.controls['ingredients'].setValue(success.ingredients);
        this.recipeForm.controls['directions'].setValue(success.directions);
        this.edit_file_list = success.image_gallery;
        this.recipeForm.controls['notes'].setValue(success.notes);
        this.tags = success.tags;
        this.selectedIndex = 1;
        window.scrollTo(0, 0);
    },
      error => {
      console.log(error);
      });
  }
  onRecipeDelete(recipeId , name) {
    const dialogRef = this.dialog.open(DialogTemplateComponent, {
      width: '600px',
      data : name
    });
    dialogRef.afterClosed().subscribe( result => {
      if (result === true) {
        this.dataService.deleteRecipe(recipeId).subscribe(success => {
          this.getRecipeOnLoad();
          this.snackBar.open('Deleted ' + name, 'Close', {
            duration: 5000,
          });
        });
      }
    });
  }
  onRecipeView(recipeId) {
      this.isRecipeViewed = true;
      this.dataService.getSingeRecipe(recipeId).subscribe((success ) => {
        this.recipeForm.addControl('ID' , new FormControl(recipeId) );
        this.isEditMode = true;
        this.file_list = [];
        this.recipeForm.controls['display_image'].setValue(success.display_image);
        this.disp_img =  'data:' + success.display_image.contentType + ';base64,' + success.display_image.data;
        this.onRatingChange(success.rating);
        this.recipeForm.controls['title'].setValue(success.title);
        this.recipeForm.controls['rating'].setValue(success.rating);
        this.recipeForm.controls['serving_size'].setValue(success.serving_size);
        this.recipeForm.get(['cooking_time', 'hours']).setValue(success.cooking_time.hours);
        this.recipeForm.get(['cooking_time', 'minutes']).setValue(success.cooking_time.minutes);
        success.ingredients = success.ingredients.split('</p>');
        this.recipeIngredients = success.ingredients.reduce(function(x, y){
          if (y !== '') {
            x.push(y.replace('<p>', ''));
          }
          return x;
        }, []);
        success.directions = success.directions.split('</p>');
        this.recipeDirection = success.directions.reduce(function(x, y){
          if (y !== '') {
            x.push(y.replace('<p>', ''));
          }
          return x;
        }, []);
          this.galleryImages = success.image_gallery.map(function(imgObj){
          return  { small : 'data:' + imgObj.contentType + ';base64,' + imgObj.data,
                    medium : 'data:' + imgObj.contentType + ';base64,' + imgObj.data,
                    big: 'data:' + imgObj.contentType + ';base64,' + imgObj.data
          };
        });
       /* this.galleryImages = [
            {
              small: 'assets/1-small.jpg',
              medium: 'assets/1-medium.jpg',
              big: 'assets/1-big.jpg'
            },
            {
              small: 'assets/2-small.jpg',
              medium: 'assets/2-medium.jpg',
              big: 'assets/2-big.jpg'
            },
            {
              small: 'assets/3-small.jpg',
              medium: 'assets/3-medium.jpg',
              big: 'assets/3-big.jpg'
            }
          ];*/
        this.edit_file_list = success.image_gallery;
        this.recipeForm.controls['notes'].setValue(success.notes);
        this.tags = success.tags;
        this.selectedIndex = 2;
        window.scrollTo(0, 0);

          /* this.recipeForm.controls['ingredients'].setValue(success.ingredients);
           this.recipeForm.controls['directions'].setValue(success.directions);*/
      },
      error => {
        console.log(error);
      });
  }
  onImageDelete(imageObj) {
    const index = this.edit_file_list.indexOf(imageObj);
    this.edit_file_list.splice(index, 1);
    this.removed.emit(imageObj);
  }
  onRemovedImage(imgObject) {
    this.edit_file_list = imgObject;
  }
  backgroundImage(image) {
      return 'url(data:' + image.contentType + ';base64,' + image.data + ')';
  }
  editFormSubmit() {
      const recipeID = this.recipeForm.controls['ID'].value;
      this.recipeForm.removeControl('ID');
      this.recipeForm.controls['image_gallery'].setValue(this.file_list.concat(this.edit_file_list));
      const imgObj = this.recipeForm.controls['display_image'].value;
      if (!imgObj.hasOwnProperty('name')) {
        this.recipeForm.controls['display_image'].setValue(this.disp_img);
      }
      this.recipeForm.controls['tags'].setValue(this.tags);
      this.isLoading = true;
      this.dataService.editRecipe(recipeID, this.recipeForm.value).subscribe( () => {
        this.disp_img = null;
        this.disp_rate = 0;
        this.recipeForm.reset();
        this.isLoading = false;
        this.getRecipeOnLoad();
        this.isLoading = false;
        this.selectedIndex = 0;
      } , error => console.log(error));
  }
  onTabClose() {
    console.log('Tab close called');
    this.disp_img = null;
    this.disp_rate = 0;
    this.recipeForm.reset();
    this.isLoading = false;
    this.isRecipeViewed = false;
    this.selectedIndex=0;
  }

}
