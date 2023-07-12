const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    
    adminname: String,
    email: String,
    password: String,
    location: String,
      

});

 module.exports=mongoose.model('Admin',AdminSchema);

