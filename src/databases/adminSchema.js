const mongoose = require('mongoose');

const AdminSchema = mongoose.Schema({
    
    adminname: String,
    email: String,
    password: String,
    location: String,
    created: {
        type: Date,
        default: Date.now
      },
      updated:{
        type:Date,
        default: Date.now

      },
      

});

 module.exports=mongoose.model('Admin',AdminSchema);

