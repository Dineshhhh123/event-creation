const Joi = require('@hapi/joi');
const boolean = require('@hapi/joi/lib/types/boolean');
const date = require('@hapi/joi/lib/types/date');
const authSchema = Joi.object({
    EventName:  Joi.string().min(5).max(30).required(),
    EventLocation: Joi.string().max(10).required(),
    EventDate: Joi.date().required(),
    Amount: Joi.number().required(),
    
})

module.exports={
    authSchema
}