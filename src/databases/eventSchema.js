const mongoose = require('mongoose');

const EventSchema = mongoose.Schema({
    
    title: String,
    description: String,
    startTime: Date,
    endTime: Date,
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
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    participants: [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, status: String }],
      

});
// Add 2dsphere index on the location field in the Event schema
EventSchema.index({ location: '2dsphere' });


 module.exports=mongoose.model('Event',EventSchema);

