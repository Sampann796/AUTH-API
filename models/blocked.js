const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema(
    {
        
        token : {
            type : String,
            required: true,
        },
       
    }
)

module.exports = mongoose.model('blocked', blockSchema)