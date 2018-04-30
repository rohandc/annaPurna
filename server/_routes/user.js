const express=require('express'),
      app= express(),
      mongoose=require('mongoose'),
      config=require('../_config/index'),
      userModel=require('../_models/user'),
      DB_connString=config.database,
      jwt=require('jsonwebtoken'),
      recipeRoutes= require('../_routes/recipe');


const connection= (cb)=>{
return mongoose.connect(DB_connString,
    {useMongoClient: true},
  (err, db)=> {
  if(err) console.log(err.message);
  cb(db);
  })};


app.get('/list', (req,res) => {

   userModel.find({}, (err, users) => {
     if (err) res.status(500).json({error:err.message});

      const usernameMap = [];
      users.forEach(function(user) {
        usernameMap.push(user.user_name);
      });
      res.send(usernameMap);
    })
});

app.get('/home',jwtCheck,(req,res) =>{
    res.json({"routes":"/home is protected"});
});

app.post('/register', (req,res) => {

  connection( (db) => {
    const user_mod={first_name:req.body.first_name,
                    last_name:req.body.last_name,
                    contact_no:req.body.contact_no,
                    email:req.body.email,
                    user_name: req.body.user_name,
                    user_password:req.body.passwords.user_password,
                    address:req.body.address,
                    admin:true
                    };
    const user=new userModel(user_mod);

    user.save(function (err, user_instance) {
    if (err) res.status(500).json({error:err.message});
    else res.status(200).send({message:"Success",userInstance:user_instance});
  });

})
});

app.post('/login', (req,res) => {
  userModel.getAuthenticated(req.body.user_name, req.body.user_password, function(err, user, reason) {

    if (err) res.status(500).json({error:err.message});

    if (user) {

      const token =jwt.sign(user,process.env.SECRET_KEY,{
        expiresIn:4000
      });
      req.user=user;
      res.status(200).json({success:true, token: token ,user : user});
    }
    else
    res.status(500).json({success:false,token:"not generated"});
  });

});

app.use('/recipe', recipeRoutes);

function jwtCheck(req,res,next) {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (token) {
      jwt.verify(token, process.env.SECRET_KEY, function(err, decoded) {
      if (err) {
        return res.status(500).json({"error": true,"message":"Authentication error wrong login credentials"});
      }
      req.token  = decoded;
      next();
    });
  } else {

    return res.status(403).send({"error": true,"message":"No JWT found please sign in to get JWT"});
  }
}

function getUserScheme(req) {

  let username;
  let type;
  let userSearch = {};

  // The POST contains a username and not an email
  if(req.body.username) {
    username = req.body.username;
    type = 'username';
    userSearch = { username: username };
  }
  // The POST contains an email and not an username
  else if(req.body.email) {
    username = req.body.email;
    type = 'email';
    userSearch = { email: username };
  }

  return {
    username: username,
    type: type,
    userSearch: userSearch
  }
}
module.exports= app;
