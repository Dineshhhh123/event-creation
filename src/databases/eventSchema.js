const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
    
    title: String,
    description: String,
    startTime: Date,
    endTime: Date,
    Status:String,
    location: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
      created: {
        type: Date,
        default: Date.now
      },
      updated:{
        type:Date,
        default: Date.now

      },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
    participants: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, status: String }],
      

});
EventSchema.index({ location: '2dsphere' });


 module.exports=mongoose.model('Event',EventSchema);

