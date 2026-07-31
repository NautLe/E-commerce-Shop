const mongoose = require('mongoose');
const Schema = mongoose.Schema;

    const TaskSchema = new Schema({
        name: 
        {
            type: String,
            required: 'Kindly enter the name of the task'
        },
        created_date:
        {
            type: Date,
            default: Date.now
        },
        status:
        {
            type:[{
                type: String,
                enum: ['Pending', 'ongoing', 'Completed']
            }],
            default: 'Pending'
        }
    });

    module.exports = mongoose.model('Tasks', TaskSchema);