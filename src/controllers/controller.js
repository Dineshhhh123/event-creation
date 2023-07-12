const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Event=require('../databases/eventSchema');
const User=require('../databases/userchema');
const Admin=require('../databases/adminSchema');


exports.register= async (req, res) => {
    const { name, email, password, location } = req.body;
  
    try {
      
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }
  
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, location });
      await user.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
exports.adregister= async (req, res) => {
    const { adminname, email, password, location } = req.body;
  
    try {
      
      const existingUser = await Admin.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'Admin already exists' });
      }
  
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = new Admin({ adminname, email, password: hashedPassword, location });
      await admin.save();
  
      res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  exports.login= async (req, res) => {
    const { email, password } = req.body;
  
    try {
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      
      const token = jwt.sign({ userId: user._id }, 'secret_key');
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  exports.adlogin= async (req, res) => {
    const { email, password } = req.body;
  
    try {
      
      
      const admin = await Admin.findOne({ email });
      console.log(admin);
      if (!admin) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      
      const token = jwt.sign({ adminId: admin._id }, 'secret_key');
  
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  exports.create= async (req, res) => {
    const { title, description, startTime, endTime, location, token } = req.body;
    

  try {
    
    const decodedToken = jwt.verify(token, 'secret_key');
    if (!decodedToken) {
      return res.status(401).json({ message: 'Authentication failed' });
    }
    

    
    if(decodedToken.adminId){
      const event = new Event({
        title,
        description,
        startTime,
        endTime,
        location: {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        },
        organizer: decodedToken.adminId,
      });
      
      event.save()
          .then(data => {
              res.send(data);
          }).catch(err => {
              res.status(500).send({
              message: err.message || "Some error occurred while creating the Coupon."
          });
      });
      
      
      
    }else{
      res.send('adin can only create event');
    }
    
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

  
  
  exports.booking= async (req, res) => {
    const { eventId, token } = req.body;
  
    try {
      
      const decodedToken = jwt.verify(token, 'secret_key');
      if (!decodedToken) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      
      const existingEvent = await Event.findOne({
        _id: { $ne: eventId },
        $or: [
          { startTime: { $lte: event.startTime }, endTime: { $gt: event.startTime } },
          { startTime: { $lt: event.endTime }, endTime: { $gte: event.endTime } },
          { startTime: { $gte: event.startTime }, endTime: { $lte: event.endTime } },
        ],
      });
      if (existingEvent) {
        return res.status(409).json({ message: 'Event time overlaps with another event' });
      }
  
      
      event.participants.push({ userId: decodedToken.userId, status: 'going' });
      await event.save();
  
      res.json({ message: 'Event booked successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  exports.cancel= async (req, res) => {
    const { eventId, token } = req.body;
  
    try {
      
      const decodedToken = jwt.verify(token, 'secret_key');
      if (!decodedToken) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      
      const currentDateTime = new Date();
      const eightHoursFromNow = new Date(currentDateTime.getTime() + 8 * 60 * 60 * 1000);
      if (event.startTime < eightHoursFromNow) {
        return res.status(400).json({ message: 'Event cancellation not allowed' });
      }
  
      
      event.participants = event.participants.filter(
        (participant) => participant.userId.toString() !== decodedToken.userId
      );
      await event.save();
  
      res.json({ message: 'Event cancellation successful' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  exports.getAll= async (req, res) => {
    const { token } = req.headers;
  
    try {
      
      const decodedToken = jwt.verify(token, 'secret_key');
      if (!decodedToken) {
        return res.status(401).json({ message: 'Authentication failed' });
      }
  
      
      const events = await Event.find({ 'participants.userId': decodedToken.userId })
        .sort({ startTime: -1 })
        .populate('organizer', 'name');
  
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
  exports.nearby= async (req, res) => {
    const { latitude, longitude } = req.query;

  try {
    
    
    const events = await Event.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)], 
          },
          $maxDistance: 30000, 
        },
      },
    }).populate('organizer', 'name');
    
    if(events){
      res.send(events);

    }else{
      res.status(500).json({ message: 'no near by events' });
    }
    

    
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

  
exports.participants= async (req, res) => {
    const { eventId } = req.body;
  
    try {
      
      const event = await Event.findById(eventId).populate('participants.userId', 'name');
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      res.json(event.participants);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };