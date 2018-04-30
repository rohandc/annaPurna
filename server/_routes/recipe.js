const express=require('express'),
  app=express(),
  recipeModel= require('../_models/recipe');

//URL = user/recipe/create .....
app.post('/create',(req,res) => {
  recipe= new recipeModel(req.body);
  recipe.save(function (err, recipe_instance) {
    if (err) res.status(500).json({error:err.message});
    else res.status(200).json({message:"Success",status:200,recipeInstance:recipe_instance});
  });
});

app.get('/list',(req,res) =>{
  recipeModel.find({}).select('-__v -image_gallery').exec((err, recipes) =>{
    if (err) res.status(500).json({error:err.message});
    res.send(recipes);
  });

});

app.get('/:id',(req,res) =>{
  recipeModel.findOne({_id:req.params.id},(err , recipe) =>{
    if (err) res.status(500).json({error:err.message});
    res.send(recipe);
  });
});

app.delete('/:id',(req,res) =>{
  recipeModel.remove({_id:req.params.id},(err , recipe) =>{
    if (err) res.status(500).json({error:err.message});
    res.json({message : `Successfully Deleted Recipe`});
  });
});

app.delete('/deleteAll',(req,res) =>{
  recipeModel.remove({},(err ) =>{
    if (err) res.status(500).json({error:err.message});

    res.json({message : `Successfully Deleted All`});
  });
});

app.post('/:id',(req,res) =>{
  recipeModel.findOneAndUpdate({_id:req.params.id}, req.body ,(err , recipe) =>{
    if (err) res.status(500).json({error:err.message});
    res.send({message:'Successfully saved ' + recipe});
  });
});






module.exports=app;
