const JSON_USERNAME_NULL = {
    success: false,
    message: "No Username was found"
};

const JSON_PASSWORD_NULL = {
    success: false,
    message: "No Password was found"
};

const JSON_USERNAME_TAKEN = {
    success: false,
    message: "Username is already taken.Please choose another Username"
};

const JSON_SUCCESS = {
    success: true,
    message: "Action completed Successfully"
};

const connection= (cb)=>{
  return mongoose.connect(DB_connString,
    {useMongoClient: true},
    (err, db)=> {
      if(err) console.log(err.message);
      cb(db);
    })};

module.exports = {
    JSON_USERNAME_NULL: JSON_USERNAME_NULL,
    JSON_PASSWORD_NULL: JSON_PASSWORD_NULL,
    JSON_USERNAME_TAKEN: JSON_USERNAME_TAKEN,
    JSON_SUCCESS: JSON_SUCCESS,
    'secret': 'testappsecret',
    'database': 'mongodb://test:test@ds159013.mlab.com:59013/helloworld',
    connection : connection
};




